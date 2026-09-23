"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { DESTINATION, ORIGINS, toVector } from "@/lib/globe/origins";

const CHALK = "#eef1ea";
const ROUTE = "#cfdcd0";
const BLUSH = "#f0cfc0";

/**
 * A great-circle arc lifted just off the surface.
 *
 * The lift is tiny on purpose, barely off the surface.
 *
 * These routes are long (New Zealand is 129 degrees of arc) so most of any
 * one of them is on the far side of the globe at any moment. An arc with
 * real altitude clears the silhouette instead of being hidden behind it,
 * and the far half comes swinging back around the limb as loose rings in
 * space. Japan's great circle compounds it by peaking at 69N, a genuine
 * polar route, so its altitude lands right on top of the Arctic. Pinned to
 * the surface the sphere occludes the far half cleanly, which is how a
 * route drawn on a globe should behave.
 */
function arcPoints(
  from: [number, number, number],
  to: [number, number, number],
  segments = 96,
) {
  const start = new THREE.Vector3(...from);
  const end = new THREE.Vector3(...to);
  const angle = start.angleTo(end);
  const lift = 0.004 + angle * 0.004;
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

/** The land map: true coastlines, drawn from Natural Earth 50m data. */
function Earth() {
  const base = useLoader(THREE.TextureLoader, "/globe/land.png");

  // Configure a clone: the loader caches and shares the original, so
  // settings applied to it would leak to every other user of the file.
  const texture = useMemo(() => {
    const map = base.clone();
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 16;
    /**
     * SphereGeometry puts UV 0 at phi 0, which with toVector's mapping is
     * longitude -90. A standard equirectangular map starts at -180, so the
     * texture is shifted a quarter turn. No mirroring: doing that here is
     * what hid the flipped world before.
     */
    map.wrapS = THREE.RepeatWrapping;
    map.repeat.x = 1;
    map.offset.x = 0.25;
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

  const activeOrigin = useMemo(
    () => ORIGINS.find((o) => o.id === activeId) ?? null,
    [activeId],
  );

  /**
   * Picking a region turns the globe until that region sits dead centre,
   * facing the camera. With nothing selected it drifts on its own.
   *
   * Done as a quaternion that maps the region's direction onto the
   * direction of the camera, rather than as a longitude-only spin. A spin
   * about Y can only ever solve longitude, so anything far from the equator
   * ended up centred sideways but low; it also assumed the camera had never
   * moved, which stops being true the moment anyone drags the globe.
   */
  const scratch = useMemo(
    () => ({
      target: new THREE.Quaternion(),
      yawIn: new THREE.Quaternion(),
      pitch: new THREE.Quaternion(),
      yawOut: new THREE.Quaternion(),
      parentQuat: new THREE.Quaternion(),
      camDir: new THREE.Vector3(),
      up: new THREE.Vector3(0, 1, 0),
      right: new THREE.Vector3(1, 0, 0),
    }),
    [],
  );

  /**
   * True only while a selection is being flown to.
   *
   * Once the region is centred this goes false and the globe is handed back
   * to the viewer. Driving the rotation for as long as a region stayed
   * selected meant every drag was immediately undone on the next frame, so
   * picking a region felt like it locked the globe.
   */
  const flying = useRef(false);

  useEffect(() => {
    flying.current = activeOrigin !== null;
  }, [activeOrigin]);

  useFrame(({ camera }, delta) => {
    const node = group.current;
    if (!node) return;

    if (!activeOrigin) {
      // World axis, so the drift works from whatever orientation a previous
      // selection left behind.
      if (!reduced) node.rotateOnWorldAxis(scratch.up, delta * 0.04);
      return;
    }

    // Arrived, or the viewer took over. Either way, stop steering.
    if (!flying.current) return;

    const parent = node.parent;
    if (!parent) return;

    parent.getWorldQuaternion(scratch.parentQuat);
    scratch.camDir
      .copy(camera.position)
      .normalize()
      .applyQuaternion(scratch.parentQuat.invert());

    const lat = (activeOrigin.lat * Math.PI) / 180;
    const lng = (activeOrigin.lng * Math.PI) / 180;
    const camLat = Math.asin(THREE.MathUtils.clamp(scratch.camDir.y, -1, 1));
    const camLng = Math.atan2(scratch.camDir.x, scratch.camDir.z);

    /**
     * Yaw the region onto the prime meridian, pitch it to the camera's
     * latitude, then yaw it out to the camera's longitude. A single
     * setFromUnitVectors takes the shortest path and rolls the globe on the
     * way, which swung Antarctica to the top of the frame.
     */
    scratch.yawIn.setFromAxisAngle(scratch.up, -lng);
    scratch.pitch.setFromAxisAngle(scratch.right, lat - camLat);
    scratch.yawOut.setFromAxisAngle(scratch.up, camLng);
    scratch.target
      .copy(scratch.yawOut)
      .multiply(scratch.pitch)
      .multiply(scratch.yawIn);

    const step = reduced ? 1 : 1 - Math.pow(0.0015, delta);
    node.quaternion.slerp(scratch.target, step);

    if (node.quaternion.angleTo(scratch.target) < 0.01) {
      node.quaternion.copy(scratch.target);
      flying.current = false;
    }
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
        <group ref={group} rotation={[0, -(DESTINATION.lng * Math.PI) / 180, 0]}>
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
        onStart={() => {
          // The viewer is driving now; abandon any fly-to in progress.
          flying.current = false;
        }}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </>
  );
}
