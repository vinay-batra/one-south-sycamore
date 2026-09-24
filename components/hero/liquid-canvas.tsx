"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import {
  ClampToEdgeWrapping,
  LinearFilter,
  Mesh,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
} from "three";
import { HERO_FRAMES } from "@/lib/hero-frames";

/**
 * The hero figure: one of Vince's photographs at full quality, which melts
 * into the next one through a warped front, the way ink spreads in water.
 *
 * The rule this is built around, learned the hard way from a particle
 * version that came before it: never make the photograph look worse than
 * it already does. His pictures are the best thing on this site. At rest
 * this is the photograph, pixel for pixel, with a drift of a pixel or two
 * so it is not dead. Everything interesting happens in the transition.
 */

/** Seconds each photograph holds before the next one washes over it. */
export const DWELL = 6.5;
export const MELT = 1.7;
/**
 * The plane overfills the frame by a few percent, so tilting it with the
 * pointer never opens a gap at the edge.
 */
const OVERFILL = 1.07;
const FOV = 40;
const PLANE_H = 2;
const PLANE_W = 1.5;
const CAM_Z = PLANE_H / 2 / OVERFILL / Math.tan((FOV * Math.PI) / 360);

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform sampler2D uFrom;
  uniform sampler2D uTo;
  uniform float uProgress;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uHover;
  uniform float uAspect;

  varying vec2 vUv;

  /* Two crossed sine pairs at different rates. Cheaper than real noise and,
     for a field this smooth and this slow, indistinguishable from it. */
  float wave(vec2 p, float t) {
    return sin(p.x * 3.1 + t) * sin(p.y * 2.3 - t * 0.77)
         + 0.5 * sin(p.x * 6.3 - t * 1.31) * sin(p.y * 5.1 + t * 0.62);
  }

  vec2 flow(vec2 uv, float t) {
    return vec2(wave(uv * 2.0, t), wave(uv * 2.0 + vec2(4.7, 2.3), t + 1.7));
  }

  void main() {
    vec2 uv = vUv;

    // Always on: a warp of a pixel or two, slow enough to read as the
    // picture breathing rather than as an effect.
    vec2 disp = flow(uv, uTime * 0.18) * 0.0022;

    // A soft lens under the pointer, pulling the image gently toward it.
    vec2 toPointer = (uv - uPointer) * vec2(uAspect, 1.0);
    float lens = smoothstep(0.34, 0.0, length(toPointer));
    disp -= (uv - uPointer) * lens * 0.085 * uHover;

    // The melt. A diagonal front, bent by the flow field, carries the new
    // picture across the old one, and along that front the two are pushed
    // apart. Progress is stretched past both ends so the front has fully
    // left the frame at 0 and at 1, and the photograph is clean at rest.
    float turbulence = wave(uv * 3.4, uTime * 0.25) * 0.5 + 0.5;
    float front = (uv.x * 0.42 + (1.0 - uv.y) * 0.58) * 0.62 + turbulence * 0.38;
    float p = uProgress * 1.34 - 0.17;
    float mask = smoothstep(front - 0.17, front + 0.17, p);
    float seam = 1.0 - abs(mask * 2.0 - 1.0);
    vec2 melt = flow(uv, uTime * 0.5 + 3.0) * 0.05 * seam;

    vec4 a = texture2D(uFrom, uv + disp + melt);
    vec4 b = texture2D(uTo, uv + disp - melt);
    gl_FragColor = mix(a, b, mask);
    #include <colorspace_fragment>
  }
`;

/**
 * Material plus the transition state, kept in a class on purpose.
 *
 * All of this is written every frame and none of it should be visible to
 * React; the compiler's immutability rules reject the memo-and-refs
 * version, correctly.
 */
class LiquidSurface {
  readonly material: ShaderMaterial;
  private readonly textures: Texture[];
  private shown: number;
  private target: number;
  private progress = 0;

  constructor(textures: Texture[], index: number) {
    this.textures = textures;
    this.shown = index;
    this.target = index;
    this.material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uFrom: { value: textures[index] },
        uTo: { value: textures[index] },
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uPointer: { value: [0.5, 0.5] },
        uHover: { value: 0 },
        uAspect: { value: PLANE_W / PLANE_H },
      },
    });
  }

  show(index: number) {
    if (index === this.target) return;
    // Mid-melt: whatever is on screen right now becomes the outgoing
    // picture, so a second click never snaps back to the one before.
    this.material.uniforms.uFrom.value = this.textures[this.shown];
    this.material.uniforms.uTo.value = this.textures[index];
    this.target = index;
    this.progress = 0;
  }

  step(dt: number, time: number, pointerX: number, pointerY: number, hover: number) {
    const { uniforms } = this.material;
    uniforms.uTime.value = time;

    if (this.target !== this.shown) {
      this.progress = Math.min(1, this.progress + dt / MELT);
      const t = this.progress;
      // Ease both ends: the front creeps in, sweeps, and settles.
      uniforms.uProgress.value = t * t * (3 - 2 * t);
      if (t >= 1) {
        this.shown = this.target;
        uniforms.uFrom.value = this.textures[this.shown];
        uniforms.uProgress.value = 0;
      }
    }

    uniforms.uHover.value += (hover - uniforms.uHover.value) * Math.min(1, dt * 6);
    const pointer = uniforms.uPointer.value as number[];
    pointer[0] += (pointerX - pointer[0]) * Math.min(1, dt * 8);
    pointer[1] += (pointerY - pointer[1]) * Math.min(1, dt * 8);
  }

  dispose() {
    this.material.dispose();
  }
}

type Loaded = { textures: Texture[]; surface: LiquidSurface };

function useSurface() {
  const [loaded, setLoaded] = useState<Loaded | null>(null);

  useEffect(() => {
    let cancelled = false;
    const loader = new TextureLoader();

    const load = (src: string) =>
      new Promise<Texture>((resolve, reject) => {
        loader.load(
          src,
          (texture) => {
            texture.colorSpace = SRGBColorSpace;
            texture.minFilter = LinearFilter;
            texture.magFilter = LinearFilter;
            texture.generateMipmaps = false;
            // The melt samples a little outside the edges; clamping smears
            // the edge pixel rather than wrapping the far side in.
            texture.wrapS = ClampToEdgeWrapping;
            texture.wrapT = ClampToEdgeWrapping;
            resolve(texture);
          },
          undefined,
          reject,
        );
      });

    Promise.all(HERO_FRAMES.map((frame) => load(frame.src)))
      .then((textures) => {
        if (cancelled) {
          textures.forEach((texture) => texture.dispose());
          return;
        }
        setLoaded({ textures, surface: new LiquidSurface(textures, 0) });
      })
      .catch(() => {
        /* The photograph underneath stays, which is the whole point. */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    return () => {
      loaded.surface.dispose();
      loaded.textures.forEach((texture) => texture.dispose());
    };
  }, [loaded]);

  return loaded;
}

function Plane({
  surface,
  index,
  hover,
}: {
  surface: LiquidSurface;
  index: number;
  hover: boolean;
}) {
  const mesh = useRef<Mesh>(null);

  useEffect(() => {
    surface.show(index);
  }, [surface, index]);

  useFrame((state, delta) => {
    surface.step(
      Math.min(delta, 0.05),
      state.clock.elapsedTime,
      (state.pointer.x + 1) / 2,
      (state.pointer.y + 1) / 2,
      hover ? 1 : 0,
    );

    const node = mesh.current;
    if (!node) return;
    node.rotation.y += (state.pointer.x * 0.09 - node.rotation.y) * 0.05;
    node.rotation.x += (-state.pointer.y * 0.06 - node.rotation.x) * 0.05;
  });

  return (
    <mesh ref={mesh} material={surface.material}>
      <planeGeometry args={[PLANE_W * OVERFILL, PLANE_H * OVERFILL]} />
    </mesh>
  );
}

export function LiquidCanvas({
  index,
  hover,
  onReady,
}: {
  index: number;
  hover: boolean;
  onReady: () => void;
}) {
  const loaded = useSurface();

  useEffect(() => {
    if (loaded) onReady();
  }, [loaded, onReady]);

  if (!loaded) return null;

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, CAM_Z], fov: FOV }}
      dpr={[1, 2]}
      gl={{ antialias: false, alpha: true }}
    >
      <Plane surface={loaded.surface} index={index % loaded.textures.length} hover={hover} />
    </Canvas>
  );
}
