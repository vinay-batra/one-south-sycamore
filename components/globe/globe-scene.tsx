"use client";

import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { DESTINATION, ORIGINS, toVector } from "@/lib/globe/origins";

const CHALK = "#eef1ea";
const ROUTE = "#cfdcd0";
const BLUSH = "#f0cfc0";
const RIM = "#9db9a3";

/**
 * A great-circle arc lifted just off the surface.
 *
 * The lift is kept very low on purpose. These routes are long — New
 * Zealand is 129° of arc — so most of each one is on the far side of the
 * globe at any given moment. An arc sitting well above the surface clears
 * the silhouette and peeks around the limb instead of being hidden, which
 * reads as loose lines floating in space. Hugging the surface lets the
 * sphere occlude the half that faces away, the way a route on a globe
 * should behave. Japan's great circle also peaks at 69°N — a real polar
 * route — and altitude there turns it into a ring over the Arctic.
 */
function arcPoints(
  from: [number, number, number],
  to: [number, number, number],
  segments = 96,
) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const angle = start.angleTo(end);
  const lift = 0.012 + angle * 0.016;
  const points: THREE.Vector3[] = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Slerp, so the path follows the great circle instead of cutting the chord.
    const point = new THREE.Vector3().copy(start).lerp(end, t).normalize();
    point.multiplyScalar(1 + Math.sin(Math.PI * t) * lift);
    points.push(point);
  }
  return points;
}

/** The land map — true coastlines, drawn from Natural Earth 50m data. */
function Earth() {
  const base = useLoader(THREE.TextureLoader, "/globe/land.png");

  // Configure a clone: the loader caches and shares the original, so
  // settings applied to it would leak to every other user of the file.
  const texture = useMemo(() => {
    const map = base.clone();
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
    // SphereGeometry's UVs run the opposite way from a standard
    // equirectangular map, so the texture is mirrored back into place.
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.x = -1;
    map.offset.x = 1;
    map.needsUpdate = true;
    return map;
  }, [base]);

  return (
    <mesh>
      <sphereGeometry args={[1, 128, 128]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

/** Rim light: a back-faced shell that only shows at the edges. */
function Atmosphere() {
  return (
    <mesh scale={1.04}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={{ uColor: { value: new THREE.Color(RIM) } }}
        vertexShader={`
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColor;
          varying vec3 vNormal;
          void main() {
            float rim = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.5);
            gl_FragColor = vec4(uColor, rim * 0.45);
          }
        `}
      />
    </mesh>
  );
}

function Marker({
  position,
  active,
  destination = false,
  onSelect,
}: {
  position: [number, number, number];
  active: boolean;
  destination?: boolean;
  onSelect?: () => void;
}) {
  const dot = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (dot.current) {
      const target = active && !destination ? 1.4 : 1;
      dot.current.scale.lerp(new THREE.Vector3(target, target, target), 0.15);
    }
    if (halo.current) {
      // Newtown breathes so the eye knows where everything is heading.
      const s = 1 + Math.sin(t * 1.5) * 0.35;
      halo.current.scale.setScalar(s);
      (halo.current.material as THREE.MeshBasicMaterial).opacity =
        0.45 - Math.sin(t * 1.5) * 0.2;
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={dot}
        onPointerDown={onSelect ? (e) => (e.stopPropagation(), onSelect()) : undefined}
        onPointerOver={onSelect ? () => (document.body.style.cursor = "pointer") : undefined}
        onPointerOut={onSelect ? () => (document.body.style.cursor = "") : undefined}
      >
        <sphereGeometry args={[destination ? 0.019 : 0.016, 16, 16]} />
        <meshBasicMaterial color={destination ? BLUSH : active ? CHALK : ROUTE} />
      </mesh>

      {destination && (
        <mesh ref={halo}>
          <sphereGeometry args={[0.032, 16, 16]} />
          <meshBasicMaterial color={BLUSH} transparent opacity={0.35} />
        </mesh>
      )}
    </group>
  );
}

function Route({
  from,
  active,
  reduced,
  delay,
}: {
  from: [number, number, number];
  active: boolean;
  reduced: boolean;
  delay: number;
}) {
  const to = useMemo(
    () => toVector(DESTINATION.lat, DESTINATION.lng) as [number, number, number],
    [],
  );
  const points = useMemo(() => arcPoints(from, to), [from, to]);
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const pulse = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!pulse.current || reduced) return;
    // Each shipment runs on its own offset so they don't fly in lockstep.
    const t = (((clock.getElapsedTime() * 0.12 + delay) % 1) + 1) % 1;
    pulse.current.position.copy(curve.getPoint(t));
    (pulse.current.material as THREE.MeshBasicMaterial).opacity =
      Math.sin(Math.PI * t);
  });

  return (
    <group>
      <Line
        points={points}
        color={active ? CHALK : ROUTE}
        lineWidth={active ? 2.4 : 1.6}
        transparent
        opacity={active ? 1 : 0.68}
      />
      {!reduced && (
        <mesh ref={pulse}>
          <sphereGeometry args={[0.011, 12, 12]} />
          <meshBasicMaterial color={BLUSH} transparent />
        </mesh>
      )}
    </group>
  );
}

export function GlobeScene({
  activeId,
  onSelect,
  reduced,
}: {
  activeId: string | null;
  onSelect: (id: string) => void;
  reduced: boolean;
}) {
  const group = useRef<THREE.Group>(null);

  /**
   * Picking a region turns the globe until that region faces the camera,
   * then holds it there. With nothing selected it drifts on its own.
   */
  const target = useMemo(() => {
    const origin = ORIGINS.find((o) => o.id === activeId);
    if (!origin) return null;
    return Math.PI / 2 - (origin.lng * Math.PI) / 180;
  }, [activeId]);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;

    if (target === null) {
      if (!reduced) node.rotation.y += delta * 0.04;
      return;
    }

    // Take the short way around rather than unwinding a full turn.
    const diff =
      ((((target - node.rotation.y + Math.PI) % (Math.PI * 2)) + Math.PI * 2) %
        (Math.PI * 2)) -
      Math.PI;
    node.rotation.y += diff * Math.min(1, delta * (reduced ? 12 : 2.6));
  });

  const destination = useMemo(
    () => toVector(DESTINATION.lat, DESTINATION.lng) as [number, number, number],
    [],
  );

  return (
    <>
      {/* A shallow tilt: equirectangular textures smear badly at the poles,
          so the less of the Arctic that faces the camera, the better. */}
      <group rotation={[0.16, 0, 0.08]}>
        <Atmosphere />
        <group ref={group} rotation={[0, 2.88, 0]}>
          <Earth />

          {ORIGINS.map((origin, index) => {
            const position = toVector(origin.lat, origin.lng) as [number, number, number];
            const active = activeId === origin.id;
            return (
              <group key={origin.id}>
                <Route
                  from={position}
                  active={active}
                  reduced={reduced}
                  delay={index * 0.25}
                />
                <Marker
                  position={position}
                  active={active}
                  onSelect={() => onSelect(origin.id)}
                />
              </group>
            );
          })}

          <Marker position={destination} active destination />
        </group>
      </group>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </>
  );
}
