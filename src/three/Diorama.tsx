import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useInView, useReducedMotion } from 'motion/react';
import { createWorld, type DioramaMode } from './world/createWorld';
import type { World } from './world/builder';
import { CameraRig, type DioramaLabels } from './CameraRig';

type DioramaProps = {
  mode: DioramaMode;
  /** Scale id to frame in `explore` mode, or 'all'. */
  focus?: string;
  time?: 'dusk' | 'day';
  autoRotate?: boolean;
  labels?: DioramaLabels;
  className?: string;
};

const DUSK_SUN = new THREE.Vector3(-0.55, 0.62, 0.55).normalize().multiplyScalar(500);
const DAY_SUN = new THREE.Vector3(-0.45, 0.78, 0.45).normalize().multiplyScalar(500);

/** Interactive Qatar diorama. Renders only while on screen. */
export function Diorama({ mode, focus, time = 'dusk', autoRotate = true, labels, className }: DioramaProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const visible = useInView(wrap, { margin: '120px' });
  const reduce = !!useReducedMotion();

  return (
    <div ref={wrap} className={className} style={{ position: 'absolute', inset: 0 }} data-cursor="drag">
      <Canvas
        flat
        shadows="percentage"
        dpr={[1, 2]}
        frameloop={visible ? 'always' : 'never'}
        camera={{ fov: 30, near: 1, far: 4000 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Scene mode={mode} focus={focus ?? (mode === 'dc' ? 'dc' : 'all')} dusk={time === 'dusk'} autoRotate={autoRotate} reduce={reduce} labels={labels} />
      </Canvas>
    </div>
  );
}

type SceneProps = { mode: DioramaMode; focus: string; dusk: boolean; autoRotate: boolean; reduce: boolean; labels?: DioramaLabels };

function Scene({ mode, focus, dusk, autoRotate, reduce, labels }: SceneProps) {
  const world = useMemo(() => createWorld(mode), [mode]);
  const shadowSpan = mode === 'dc' ? 80 : 215;

  useEffect(() => () => disposeWorld(world), [world]);

  // Windows glow and the flare brightens at dusk.
  useEffect(() => {
    world.emissive.forEach(m => (m.emissiveIntensity = dusk ? m.userData.emk * 0.95 : 0));
    world.flameBase = dusk ? 650 : 160;
  }, [world, dusk]);

  useWorldAnimation(world, reduce);

  return (
    <>
      <hemisphereLight args={[dusk ? '#dfe4f0' : '#ffffff', dusk ? '#b7a68c' : '#d8c8a8', dusk ? 1.9 : 2.1]} />
      <directionalLight
        castShadow
        color={dusk ? '#ffe2bf' : '#fffaf0'}
        intensity={dusk ? 1.7 : 1.9}
        position={dusk ? DUSK_SUN : DAY_SUN}
        shadow-mapSize={[4096, 4096]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.25}
        shadow-camera-left={-shadowSpan}
        shadow-camera-right={shadowSpan}
        shadow-camera-top={shadowSpan}
        shadow-camera-bottom={-shadowSpan}
        shadow-camera-near={10}
        shadow-camera-far={1200}
      />
      <primitive object={world.root} />
      <CameraRig world={world} mode={mode} focus={focus} autoRotate={autoRotate} reduce={reduce} labels={labels} />
    </>
  );
}

/** Data packets travel the arcs, node halos pulse, dhows bob and the flare flickers. */
function useWorldAnimation(world: World, reduce: boolean) {
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    world.packets.forEach(p => {
      if (!reduce) p.t = (p.t + 0.0035) % 1;
      p.p.position.copy(p.curve.getPoint(p.t));
    });
    world.halos.forEach((h, i) => {
      const f = reduce ? 0.5 : (t * 0.8 + i * 0.17) % 1;
      h.scale.setScalar(h.userData.base * (1 + f * 1.8));
      (h.material as THREE.MeshBasicMaterial).opacity = 0.55 * (1 - f);
    });
    if (!reduce) {
      world.boats.forEach((g, i) => {
        g.position.y = -0.9 + Math.sin(t * 1.3 + i * 2) * 0.18;
        g.rotation.z = Math.sin(t * 1.1 + i) * 0.04;
      });
    }
    world.flames.forEach((F, i) => {
      F.f.scale.set(1, reduce ? 1 : 0.85 + 0.3 * Math.abs(Math.sin(t * 9 + i)), 1);
      F.L.intensity = world.flameBase * (0.85 + 0.3 * Math.abs(Math.sin(t * 13 + i)));
    });
  });
}

function disposeWorld(world: World) {
  world.root.traverse(obj => {
    if (!(obj instanceof THREE.Mesh)) return;
    obj.geometry.dispose();
    (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach((m: THREE.Material & { map?: THREE.Texture | null; emissiveMap?: THREE.Texture | null }) => {
      m.map?.dispose();
      m.emissiveMap?.dispose();
      m.dispose();
    });
  });
}
