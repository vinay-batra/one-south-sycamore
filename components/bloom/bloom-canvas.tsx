"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
  SRGBColorSpace,
} from "three";
import { BLOOM_FRAMES } from "@/lib/bloom";

/**
 * The hero figure: one of Vince's photographs rebuilt as a cloud of points,
 * which scatters and reassembles as the next photograph when you click it.
 *
 * Every point takes its colour from a pixel of a real photo, so the thing on
 * the front page is always his actual stock rather than a modelled flower.
 * Depth comes from luminance, which gives the brighter petals real relief to
 * parallax against when the cloud turns.
 *
 * The simulation lives in a class rather than in refs and memos on purpose:
 * nine thousand points are rewritten in place every frame, and React should
 * not be able to see any of it.
 */

const PLANE_W = 1.5;
const PLANE_H = 2.0;
const DEPTH = 0.3;
const FOV = 40;
const CAM_Z = 3.2;

type Frame = { position: Float32Array; color: Float32Array };

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
  const scratch = new Color();

  for (let y = 0; y < gh; y += 1) {
    for (let x = 0; x < gw; x += 1) {
      const i = y * gw + x;
      const p = i * 4;
      const r = data[p] / 255;
      const g = data[p + 1] / 255;
      const b = data[p + 2] / 255;
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

      const i3 = i * 3;
      position[i3] = (x / (gw - 1) - 0.5) * PLANE_W;
      position[i3 + 1] = -(y / (gh - 1) - 0.5) * PLANE_H;
      position[i3 + 2] = (luminance - 0.5) * DEPTH;

      // The samples are sRGB and the attribute is read as working space,
      // so convert rather than letting the output transform brighten them.
      scratch.setRGB(r, g, b, SRGBColorSpace);
      color[i3] = scratch.r;
      color[i3 + 1] = scratch.g;
      color[i3 + 2] = scratch.b;
    }
  }

  return { position, color };
}

const VERTEX = /* glsl */ `
  uniform float uSize;
  uniform float uScale;
  uniform float uTime;
  attribute vec3 aColor;
  attribute float aPhase;
  varying vec3 vColor;

  void main() {
    vColor = aColor;

    // Idle drift lives here rather than in the simulation: it is per point
    // and every frame, which is exactly what the GPU is for.
    vec3 drifted = position;
    float wave = sin(uTime * 0.8 + aPhase);
    drifted.x += cos(uTime * 0.55 + aPhase) * 0.005;
    drifted.y += wave * 0.005;
    drifted.z += wave * 0.014;

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

  constructor(first: Frame, columns: number) {
    this.count = first.position.length / 3;
    this.live = new Float32Array(first.position);
    this.colors = new Float32Array(first.color);
    this.velocity = new Float32Array(this.count * 3);
    this.target = first.position;
    this.colorFrom = new Float32Array(first.color);
    this.colorTo = first.color;

    const phase = new Float32Array(this.count);
    for (let i = 0; i < this.count; i += 1) phase[i] = Math.random() * Math.PI * 2;
    // Start scattered, so the cloud is seen settling into the photograph.
    for (let i = 0; i < this.count * 3; i += 1) this.live[i] += (Math.random() - 0.5) * 1.2;

    this.geometry = new BufferGeometry();
    this.geometry.setAttribute("position", new BufferAttribute(this.live, 3));
    this.geometry.setAttribute("aColor", new BufferAttribute(this.colors, 3));
    this.geometry.setAttribute("aPhase", new BufferAttribute(phase, 1));

    this.material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uSize: { value: (PLANE_W / (columns - 1)) * 0.95 },
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
  }

  step(dt: number, time: number, heightPx: number) {
    // Underdamped on purpose (zeta is about 0.67): the cloud overshoots
    // slightly on the way back, which is what makes it feel thrown rather
    // than faded. Settles in a shade under two seconds.
    const stiffness = 14;
    const damping = Math.exp(-5 * dt);
    const total = this.count * 3;

    for (let i = 0; i < total; i += 1) {
      this.velocity[i] =
        (this.velocity[i] + (this.target[i] - this.live[i]) * stiffness * dt) * damping;
      this.live[i] += this.velocity[i] * dt;
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
    }

    this.material.uniforms.uTime.value = time;
    this.material.uniforms.uScale.value = heightPx / (2 * Math.tan((FOV * Math.PI) / 360));
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
    // Fewer points on a phone: the figure is smaller there and this loop is
    // the only thing on the page running per point per frame.
    const wide = window.matchMedia("(min-width: 640px)").matches;
    const columns = wide ? 84 : 58;
    const rows = wide ? 112 : 78;

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
