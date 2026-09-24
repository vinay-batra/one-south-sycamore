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
 * which scatters and reassembles as the next photograph when you click it.
 *
 * Every point takes its colour from a pixel of a real photo, so the thing on
 * the front page is always his actual stock rather than a modelled flower.
 *
 * Density is the whole game. An earlier pass ran 9,408 points and read as a
 * coarse halftone: you could not tell what it was, which defeats the point
 * of using a photograph at all. At rest this should look like the
 * photograph, with only a fine grain to say it is alive; the particles are
 * meant to be discovered on the click, not endured before it. Points are
 * drawn a little wider than the grid spacing so no page background shows
 * through between them.
 */

const PLANE_W = 1.5;
const PLANE_H = 2.0;
/** Luminance relief: bright petals stand proud of the dark leaves. */
const DEPTH = 0.3;
/** Gentle barrel so the surface is obviously a surface when it turns. */
const CURVE = 0.1;
const FOV = 40;
/**
 * Close enough that the plane overfills the frame by a few percent. The
 * figure is a photograph, so it should run to the edges of its box the way
 * every other photograph on the site does, and the overfill keeps the
 * corners covered while the cloud tilts with the pointer.
 */
const CAM_Z = 2.6;

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
  attribute vec3 aColor;
  varying vec3 vColor;

  void main() {
    vColor = aColor;

    // Idle drift lives here rather than in the simulation: it is per point
    // and every frame, which is exactly what the GPU is for. The phase comes
    // from the point's own position, so neighbours move together and the
    // surface undulates like cloth instead of boiling like noise. Amplitude
    // is a fraction of the grid spacing, or the photograph would smear.
    vec3 drifted = position;
    float phase = position.x * 6.0 + position.y * 4.0;
    float wave = sin(uTime * 0.7 + phase);
    drifted.x += cos(uTime * 0.5 + phase) * 0.0015;
    drifted.y += wave * 0.0015;
    drifted.z += wave * 0.01;

    vec4 mv = modelViewMatrix * vec4(drifted, 1.0);
    gl_PointSize = max(1.0, uSize * uScale / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  varying vec3 vColor;

  void main() {
    vec2 offset = gl_PointCoord - vec2(0.5);
    if (dot(offset, offset) > 0.25) discard;
    gl_FragColor = vec4(vColor, 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * Mean per-component energy below which the cloud is close enough to its
 * target to stop simulating it. Roughly a sixth of the grid spacing, well
 * under one pixel on screen.
 */
const SLEEP_ENERGY = 1e-6;

class PointCloud {
  readonly geometry: BufferGeometry;
  readonly material: ShaderMaterial;

  private readonly count: number;
  private readonly live: Float32Array;
  private readonly colors: Float32Array;
  private readonly velocity: Float32Array;

  private target: Float32Array;
  private colorFrom: Float32Array;
  private colorTo: Float32Array;
  private colorMix = 1;
  private sinceScatter = -1;
  /** Settled: the per-frame loop and the buffer upload are both skipped. */
  private asleep = false;

  constructor(first: Frame, columns: number) {
    this.count = first.position.length / 3;
    this.live = new Float32Array(first.position);
    this.colors = new Float32Array(first.color);
    this.velocity = new Float32Array(this.count * 3);
    this.target = first.position;
    this.colorFrom = new Float32Array(first.color);
    this.colorTo = first.color;

    // Start scattered, so the cloud is seen settling into the photograph.
    for (let i = 0; i < this.count * 3; i += 1) this.live[i] += (Math.random() - 0.5) * 0.9;

    const position = new BufferAttribute(this.live, 3);
    position.setUsage(DynamicDrawUsage);
    const color = new BufferAttribute(this.colors, 3);
    color.setUsage(DynamicDrawUsage);

    this.geometry = new BufferGeometry();
    this.geometry.setAttribute("position", position);
    this.geometry.setAttribute("aColor", color);

    this.material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        // 1.45x the grid pitch. Circles on a square grid need about 1.41x
        // before the diamond-shaped gaps at the four-way junctions close;
        // below that the photograph reads as halftone rather than as itself.
        uSize: { value: (PLANE_W / (columns - 1)) * 1.45 },
        uScale: { value: 600 },
        uTime: { value: 0 },
      },
    });
  }

  retarget(frame: Frame) {
    if (this.colorTo === frame.color) return;
    this.colorFrom.set(this.colors);
    this.colorMix = 0;
    this.target = frame.position;
    this.colorTo = frame.color;
    this.asleep = false;
  }

  scatter() {
    for (let i = 0; i < this.count; i += 1) {
      const i3 = i * 3;
      const x = this.live[i3];
      const y = this.live[i3 + 1];
      const radius = Math.hypot(x, y) || 1;
      const speed = 3 + Math.random() * 4.5;
      // Outward, plus a shared swirl so it reads as a throw rather than a
      // uniform expansion, plus noise so no two points travel together.
      // Sized against the spring below: these put the peak of the throw at
      // roughly the edge of the frame, so it clips a little and comes back.
      this.velocity[i3] += (x / radius) * speed - y * 3.6 + (Math.random() - 0.5) * 4.2;
      this.velocity[i3 + 1] += (y / radius) * speed + x * 3.6 + (Math.random() - 0.5) * 4.2;
      this.velocity[i3 + 2] += (Math.random() - 0.25) * 6.5;
    }
    this.sinceScatter = 0;
    this.asleep = false;
  }

  step(dt: number, time: number, heightPx: number) {
    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uScale.value = heightPx / (2 * Math.tan((FOV * Math.PI) / 360));
    if (this.asleep) return;

    // Underdamped on purpose (zeta is about 0.67): the cloud overshoots
    // slightly on the way back, which is what makes it feel thrown rather
    // than faded. Settles in a shade under two seconds.
    const stiffness = 14;
    const damping = Math.exp(-5 * dt);
    const total = this.count * 3;
    let energy = 0;

    for (let i = 0; i < total; i += 1) {
      const offset = this.target[i] - this.live[i];
      const v = (this.velocity[i] + offset * stiffness * dt) * damping;
      this.velocity[i] = v;
      this.live[i] += v * dt;
      energy += v * v + offset * offset;
    }
    this.geometry.attributes.position.needsUpdate = true;

    if (this.colorMix < 1) {
      if (this.sinceScatter >= 0) this.sinceScatter += dt;
      // Hold the old colours through the first beat of the throw, so the
      // photograph changes while the cloud is loose rather than on the click.
      const holding = this.sinceScatter >= 0 && this.sinceScatter < 0.22;
      this.colorMix = Math.min(1, this.colorMix + (holding ? 0 : dt / 0.9));

      const t = this.colorMix;
      const eased = t * t * (3 - 2 * t);
      for (let i = 0; i < total; i += 1) {
        this.colors[i] = this.colorFrom[i] + (this.colorTo[i] - this.colorFrom[i]) * eased;
      }
      this.geometry.attributes.aColor.needsUpdate = true;
    } else if (energy / total < SLEEP_ENERGY) {
      // Land exactly on the photograph and stop: at rest this figure should
      // cost nothing, which is what pays for the point count.
      this.live.set(this.target);
      this.velocity.fill(0);
      this.asleep = true;
    }
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
    cloud.step(Math.min(delta, 0.05), state.clock.elapsedTime, state.gl.domElement.height);
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
