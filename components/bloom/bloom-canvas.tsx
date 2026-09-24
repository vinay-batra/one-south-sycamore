"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  Points,
  ShaderMaterial,
} from "three";
import { BLOOM_FRAMES } from "@/lib/bloom";

/**
 * The hero figure: one of Vince's photographs rebuilt as a cloud of points,
 * which is thrown across the page and gathers back as the next photograph
 * when you click it.
 *
 * Every point takes its colour from a pixel of a real photo, so the thing on
 * the front page is always his actual stock rather than a modelled flower.
 *
 * Density is the whole game. An earlier pass ran 9,408 points and read as a
 * coarse halftone: you could not tell what it was, which defeats the point
 * of using a photograph at all. At rest this should look like the
 * photograph, with only a fine drift to say it is alive; the particles are
 * meant to be discovered on the click, not endured before it.
 */

const PLANE_W = 1.5;
const PLANE_H = 2.0;
/** Luminance relief: bright petals stand proud of the dark leaves. */
const DEPTH = 0.3;
/** Gentle barrel so the surface is obviously a surface when it turns. */
const CURVE = 0.1;
const FOV = 40;

/**
 * The canvas is deliberately larger than the photograph it draws, so a throw
 * can leave the frame and cross the page instead of piling up against an
 * edge. These two must match the negative insets on the canvas wrapper in
 * hero-bloom.tsx, and the camera pulls back by the height factor so the
 * photograph still lands at the same size on screen.
 */
export const FRAME_SCALE_X = 2.1;
export const FRAME_SCALE_Y = 1.6;
/**
 * Exactly far enough that the plane's height fills 1/FRAME_SCALE_Y of the
 * canvas, which is the photograph's own box. Nothing clips the canvas any
 * more, so an approximate distance shows as the picture bleeding over its
 * own caption.
 */
const CAM_Z = (PLANE_H / 2 / Math.tan((FOV * Math.PI) / 360)) * FRAME_SCALE_Y;

/**
 * The throw, in three parts.
 *
 * A spring alone cannot do this: one constant sets both how far the points
 * go and how long they take, so far always means fast. Instead they are
 * thrown into pure drag, which carries them a long way and lets them slow
 * to a hang, and only then are they walked home on an eased tween whose
 * length is set independently.
 */
const FLIGHT = 0.85;
const HOMEWARD = 2.7;
const ENTRANCE = 1.8;
/** Per second. With the speeds below this lands the hang around 1.4 units. */
const DRAG = 5;
/** Points near the middle set off home first, so the picture grows outward. */
const MAX_DELAY = 0.55;

type Frame = { position: Float32Array; color: Float32Array };

/**
 * Byte-indexed sRGB to linear. The attribute is read as working space, so
 * the samples have to be converted or the output transform brightens the
 * whole photograph. Three images at this density is a quarter of a million
 * conversions, which is worth a table rather than a pow() each.
 */
const TO_LINEAR = new Float32Array(256);
for (let i = 0; i < 256; i += 1) {
  const c = i / 255;
  TO_LINEAR[i] = c < 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load ${src}`));
    image.src = src;
  });
}

function sample(image: HTMLImageElement, gw: number, gh: number): Frame {
  const canvas = document.createElement("canvas");
  canvas.width = gw;
  canvas.height = gh;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2D context for sampling");
  ctx.drawImage(image, 0, 0, gw, gh);
  const { data } = ctx.getImageData(0, 0, gw, gh);

  const count = gw * gh;
  const position = new Float32Array(count * 3);
  const color = new Float32Array(count * 3);

  for (let y = 0; y < gh; y += 1) {
    for (let x = 0; x < gw; x += 1) {
      const i = y * gw + x;
      const p = i * 4;
      const r = data[p];
      const g = data[p + 1];
      const b = data[p + 2];
      // Perceptual, not linear: what should stand proud of the arrangement
      // is what looks bright, which is the pale petals.
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

      const i3 = i * 3;
      const px = (x / (gw - 1) - 0.5) * PLANE_W;
      position[i3] = px;
      position[i3 + 1] = -(y / (gh - 1) - 0.5) * PLANE_H;
      position[i3 + 2] =
        (luminance - 0.5) * DEPTH - (px / (PLANE_W / 2)) ** 2 * CURVE;

      color[i3] = TO_LINEAR[r];
      color[i3 + 1] = TO_LINEAR[g];
      color[i3 + 2] = TO_LINEAR[b];
    }
  }

  return { position, color };
}

const VERTEX = /* glsl */ `
  uniform float uSize;
  uniform float uScale;
  uniform float uTime;
  uniform float uDisperse;
  attribute vec3 aColor;
  attribute vec3 aHome;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vColor = aColor;
    vec3 p = position;

    // Idle drift lives here rather than in the simulation: it is per point
    // and every frame, which is exactly what the GPU is for. The phase comes
    // from the point's own position, so neighbours move together and the
    // surface undulates like cloth instead of boiling like noise. Two rates,
    // so it never settles into a visible beat. Amplitude stays a fraction of
    // the grid spacing, or the photograph smears.
    float phase = p.x * 6.0 + p.y * 4.0;
    float slow = sin(uTime * 0.7 + phase);
    float fast = sin(uTime * 1.13 + phase * 1.7);
    p.x += cos(uTime * 0.5 + phase) * 0.0016 + fast * 0.0009;
    p.y += slow * 0.0016 + cos(uTime * 0.91 + phase * 1.7) * 0.0009;
    p.z += slow * 0.012 + fast * 0.006;

    // Scrolling past blows the picture apart rather than sliding it away.
    if (uDisperse > 0.0) {
      vec3 drift = normalize(vec3(
        sin(aHome.x * 91.7 + aHome.y * 47.3),
        cos(aHome.x * 53.1 - aHome.y * 88.2),
        sin(aHome.x * 31.9 + aHome.y * 61.4) * 0.7
      ) + vec3(0.001, 0.002, 0.003));
      p += drift * uDisperse * 1.2;
    }

    // Points dissolve the further they are from where they belong, so the
    // throw thins out into the page instead of stopping at a canvas edge.
    float strayed = length(p - aHome);
    vAlpha = (1.0 - smoothstep(0.7, 1.55, strayed)) * (1.0 - uDisperse);

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = max(1.0, uSize * uScale / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec2 offset = gl_PointCoord - vec2(0.5);
    if (dot(offset, offset) > 0.25 || vAlpha < 0.01) discard;
    gl_FragColor = vec4(vColor, vAlpha);
    #include <colorspace_fragment>
  }
`;

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

type Mode = "flight" | "homeward" | "rest";

class PointCloud {
  readonly geometry: BufferGeometry;
  readonly material: ShaderMaterial;

  private readonly count: number;
  private readonly live: Float32Array;
  private readonly colors: Float32Array;
  private readonly velocity: Float32Array;
  /** Where each point set off from on the way home. */
  private readonly from: Float32Array;
  /** Stagger, so the picture gathers from the middle outward. */
  private readonly delay: Float32Array;
  /** Half the plane's diagonal: the yardstick for "how far out is this". */
  private readonly reach: number;

  private target: Float32Array;
  private colorFrom: Float32Array;
  private colorTo: Float32Array;
  private colorMix = 1;

  private mode: Mode = "homeward";
  private clock = 0;
  private age = -1;
  private span = ENTRANCE - MAX_DELAY;

  constructor(first: Frame, columns: number) {
    this.count = first.position.length / 3;
    this.live = new Float32Array(first.position);
    this.colors = new Float32Array(first.color);
    this.velocity = new Float32Array(this.count * 3);
    this.target = first.position;
    this.colorFrom = new Float32Array(first.color);
    this.colorTo = first.color;

    const home = new Float32Array(this.count * 3);
    this.delay = new Float32Array(this.count);
    const reach = Math.hypot(PLANE_W, PLANE_H) / 2;
    this.reach = reach;

    for (let i = 0; i < this.count; i += 1) {
      const i3 = i * 3;
      const x = first.position[i3];
      const y = first.position[i3 + 1];
      // Flat grid, no relief: this is what "where it belongs" means to the
      // shader, and keeping it static means it never needs re-uploading.
      home[i3] = x;
      home[i3 + 1] = y;
      this.delay[i] = (Math.hypot(x, y) / reach) * 0.4 + Math.random() * 0.15;
    }

    // Start slightly loose, so the photograph is seen pulling itself
    // together out of the points. Deliberately small: the shader dissolves
    // a point the further it is from home, and a wide entrance would open
    // on a pale haze rather than on a picture.
    for (let i = 0; i < this.count * 3; i += 1) this.live[i] += (Math.random() - 0.5) * 0.5;
    this.from = new Float32Array(this.live);

    const position = new BufferAttribute(this.live, 3);
    position.setUsage(DynamicDrawUsage);
    const color = new BufferAttribute(this.colors, 3);
    color.setUsage(DynamicDrawUsage);

    this.geometry = new BufferGeometry();
    this.geometry.setAttribute("position", position);
    this.geometry.setAttribute("aColor", color);
    this.geometry.setAttribute("aHome", new BufferAttribute(home, 3));

    this.material = new ShaderMaterial({
      transparent: true,
      uniforms: {
        // 1.45x the grid pitch. Circles on a square grid need about 1.41x
        // before the diamond-shaped gaps at the four-way junctions close;
        // below that the photograph reads as halftone rather than as itself.
        uSize: { value: (PLANE_W / (columns - 1)) * 1.45 },
        uScale: { value: 600 },
        uTime: { value: 0 },
        uDisperse: { value: 0 },
      },
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
    });
  }

  retarget(frame: Frame) {
    if (this.colorTo === frame.color) return;
    this.colorFrom.set(this.colors);
    this.colorMix = 0;
    this.target = frame.position;
    this.colorTo = frame.color;
    if (this.mode === "rest") this.beginHomeward(HOMEWARD);
  }

  scatter() {
    const { reach } = this;
    for (let i = 0; i < this.count; i += 1) {
      const i3 = i * 3;
      const x = this.live[i3];
      const y = this.live[i3 + 1];
      const radius = Math.hypot(x, y) || 1;
      // Outward, but scaled by how far out the point already sits. A flat
      // outward push moves every point the same distance and blows a hole
      // through the middle, which reads as a smoke ring; letting the edges
      // travel furthest keeps the picture filled while it comes apart.
      // Plus a shared swirl so it reads as a throw rather than an
      // expansion, and noise so no two points travel together. Under the
      // drag above this carries the cloud out past the edge of the frame,
      // with the strays reaching far enough to dissolve entirely.
      const speed = 1 + (radius / reach) * 3.4 + Math.random() * 2.4;
      this.velocity[i3] = (x / radius) * speed - y * 2.2 + (Math.random() - 0.5) * 3.6;
      this.velocity[i3 + 1] = (y / radius) * speed + x * 2.2 + (Math.random() - 0.5) * 3.6;
      this.velocity[i3 + 2] = (Math.random() - 0.3) * 4.4;
    }
    this.mode = "flight";
    this.clock = 0;
    this.age = 0;
  }

  private beginHomeward(duration: number) {
    this.from.set(this.live);
    this.mode = "homeward";
    this.clock = 0;
    this.span = duration - MAX_DELAY;
  }

  step(dt: number, time: number, heightPx: number, disperse: number) {
    const { uniforms } = this.material;
    uniforms.uTime.value = time;
    uniforms.uDisperse.value = disperse;
    uniforms.uScale.value = heightPx / (2 * Math.tan((FOV * Math.PI) / 360));

    if (this.age >= 0) this.age += dt;
    this.stepColor(dt);
    if (this.mode === "rest") return;

    this.clock += dt;
    const total = this.count * 3;

    if (this.mode === "flight") {
      // Pure drag, no spring. They carry a long way and slow to a hang.
      const damping = Math.exp(-DRAG * dt);
      for (let i = 0; i < total; i += 1) {
        this.velocity[i] *= damping;
        this.live[i] += this.velocity[i] * dt;
      }
      if (this.clock >= FLIGHT) this.beginHomeward(HOMEWARD);
    } else {
      const { live, from, target, delay, span, clock } = this;
      let done = true;
      for (let i = 0; i < this.count; i += 1) {
        const t = (clock - delay[i]) / span;
        if (t <= 0) {
          done = false;
          continue;
        }
        if (t >= 1) {
          const i3 = i * 3;
          live[i3] = target[i3];
          live[i3 + 1] = target[i3 + 1];
          live[i3 + 2] = target[i3 + 2];
          continue;
        }
        done = false;
        const e = easeInOut(t);
        const i3 = i * 3;
        live[i3] = from[i3] + (target[i3] - from[i3]) * e;
        live[i3 + 1] = from[i3 + 1] + (target[i3 + 1] - from[i3 + 1]) * e;
        live[i3 + 2] = from[i3 + 2] + (target[i3 + 2] - from[i3 + 2]) * e;
      }
      if (done) {
        // Land exactly on the photograph and stop: at rest this figure
        // should cost nothing, which is what pays for the point count.
        this.live.set(this.target);
        this.velocity.fill(0);
        this.mode = "rest";
        this.age = -1;
      }
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  private stepColor(dt: number) {
    if (this.colorMix >= 1) return;
    // Hold the old colours through the first beat of the throw, so the
    // photograph changes while the cloud is loose rather than on the click.
    const holding = this.age >= 0 && this.age < 0.3;
    this.colorMix = Math.min(1, this.colorMix + (holding ? 0 : dt / 1.1));

    const t = this.colorMix;
    const eased = t * t * (3 - 2 * t);
    const { colors, colorFrom, colorTo } = this;
    for (let i = 0; i < this.count * 3; i += 1) {
      colors[i] = colorFrom[i] + (colorTo[i] - colorFrom[i]) * eased;
    }
    this.geometry.attributes.aColor.needsUpdate = true;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}

function Cloud({
  cloud,
  frame,
  scatterCount,
}: {
  cloud: PointCloud;
  frame: Frame;
  scatterCount: number;
}) {
  const points = useRef<Points>(null);

  useEffect(() => {
    cloud.retarget(frame);
  }, [cloud, frame]);

  useEffect(() => {
    if (scatterCount > 0) cloud.scatter();
  }, [cloud, scatterCount]);

  useFrame((state, delta) => {
    const canvas = state.gl.domElement;
    // Scroll dispersal, measured off the canvas itself so it needs no ref
    // into the DOM above it. One rect read a frame on a leaf element.
    //
    // Gated on the bottom edge of the photograph rather than the canvas,
    // which is a good deal taller than it: nothing happens until the
    // picture is halfway out of the viewport, and it is fully scattered
    // exactly as the last of it leaves the top. An earlier version started
    // dispersing 80px into the page and had the figure gone while a third
    // of it was still on screen.
    const rect = canvas.getBoundingClientRect();
    const pictureHeight = rect.height / FRAME_SCALE_Y;
    const bottom = rect.top + rect.height / 2 + pictureHeight / 2;
    const gate = window.innerHeight * 0.5;
    const disperse = Math.min(1, Math.max(0, (gate - bottom) / gate));

    cloud.step(Math.min(delta, 0.05), state.clock.elapsedTime, canvas.height, disperse);

    const mesh = points.current;
    if (!mesh) return;
    mesh.rotation.y += (state.pointer.x * 0.24 - mesh.rotation.y) * 0.05;
    mesh.rotation.x += (-state.pointer.y * 0.15 - mesh.rotation.x) * 0.05;
  });

  return <points ref={points} geometry={cloud.geometry} material={cloud.material} />;
}

type Loaded = { frames: Frame[]; cloud: PointCloud };

export function BloomCanvas({
  index,
  burst,
  onReady,
}: {
  index: number;
  burst: number;
  onReady: () => void;
}) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Fewer points on a phone, where the figure is a third of the size and
    // the GPU is doing the same buffer upload over a narrower bus.
    const wide = window.matchMedia("(min-width: 640px)").matches;
    const columns = wide ? 240 : 120;
    const rows = wide ? 320 : 160;

    Promise.all(BLOOM_FRAMES.map((entry) => loadImage(entry.sample)))
      .then((images) => {
        if (cancelled) return;
        const frames = images.map((image) => sample(image, columns, rows));
        setLoaded({ frames, cloud: new PointCloud(frames[0], columns) });
      })
      .catch(() => {
        /* The poster photograph underneath stays, which is the whole point. */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    onReady();
    return () => loaded.cloud.dispose();
  }, [loaded, onReady]);

  if (!loaded) return null;

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, CAM_Z], fov: FOV }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <Cloud
        cloud={loaded.cloud}
        frame={loaded.frames[index % loaded.frames.length]}
        scatterCount={burst}
      />
    </Canvas>
  );
}
