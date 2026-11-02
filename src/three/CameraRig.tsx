import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { cameraPreset, type CameraPose, type DioramaMode } from './world/createWorld';
import type { World } from './world/builder';

/** HTML tags pinned to named scene nodes, hidden when off-frame, overlapping or under `minX()`. */
export type DioramaLabels = {
  refs: Record<string, RefObject<HTMLElement | null>>;
  minX: () => number;
};

type CameraRigProps = {
  world: World;
  mode: DioramaMode;
  focus: string;
  autoRotate: boolean;
  reduce: boolean;
  labels?: DioramaLabels;
};

const EASE = 0.06;
const IDLE_BEFORE_SPIN = 4000;
const v3 = new THREE.Vector3();

/** Orbit camera: drag to rotate, idles into a slow spin, eases to each focus preset. */
export function CameraRig({ world, mode, focus, autoRotate, reduce, labels }: CameraRigProps) {
  const camera = useThree(s => s.camera) as THREE.PerspectiveCamera;
  const size = useThree(s => s.size);
  const gl = useThree(s => s.gl);

  const rig = useRef<{ cur: CameraPose; goal: CameraPose; drag: { x: number; y: number } | null; lastUser: number } | null>(null);
  if (!rig.current) {
    const p = cameraPreset(world, focus, 1.6);
    // Intro: start high and far, then the easing loop swoops down to the preset.
    const cur = reduce ? { ...p, t: p.t.clone() } : { t: p.t.clone(), r: p.r * 2.2, th: p.th - 0.9, ph: p.ph * 0.45 };
    rig.current = { cur, goal: { ...p, t: p.t.clone() }, drag: null, lastUser: -1e9 };
  }

  // Focus changes ease towards the new preset along the shortest azimuth.
  useEffect(() => {
    const r = rig.current!;
    const p = cameraPreset(world, focus, size.width / size.height);
    r.goal.t.copy(p.t);
    r.goal.r = p.r;
    r.goal.ph = p.ph;
    const d = ((((p.th - r.goal.th) % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
    r.goal.th += d;
    r.lastUser = performance.now();
    // Size is read but deliberately not a dependency: resizes only reframe the radius (below).
  }, [focus, world]);

  // Frame the scene for the canvas aspect; the hero shifts the model right of the headline.
  useEffect(() => {
    const { width: w, height: h } = size;
    if (mode === 'hero' && w / h > 1.25) camera.setViewOffset(w, h, -w * 0.16, -h * 0.03, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    rig.current!.goal.r = cameraPreset(world, focus, w / h).r;
  }, [size, mode, camera, world, focus]);

  // Pointer drag on the canvas.
  useEffect(() => {
    const el = gl.domElement;
    const r = rig.current!;
    const down = (e: PointerEvent) => {
      r.drag = { x: e.clientX, y: e.clientY };
      el.setPointerCapture?.(e.pointerId);
      el.style.cursor = 'grabbing';
    };
    const move = (e: PointerEvent) => {
      if (!r.drag) return;
      const dx = e.clientX - r.drag.x;
      const dy = e.clientY - r.drag.y;
      r.drag = { x: e.clientX, y: e.clientY };
      r.goal.th -= dx * 0.006;
      r.cur.th -= dx * 0.006;
      r.goal.ph = THREE.MathUtils.clamp(r.goal.ph - dy * 0.004, 0.4, 1.28);
      r.lastUser = performance.now();
    };
    const up = () => {
      r.drag = null;
      el.style.cursor = 'grab';
      r.lastUser = performance.now();
    };
    el.style.cursor = 'grab';
    el.style.touchAction = 'pan-y';
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
    };
  }, [gl]);

  useFrame(() => {
    const r = rig.current!;
    const { cur, goal } = r;
    const now = performance.now();
    if (autoRotate && !reduce && !r.drag && now - r.lastUser > IDLE_BEFORE_SPIN) goal.th += mode === 'hero' ? 0.0009 : 0.0007;
    cur.r += (goal.r - cur.r) * EASE;
    cur.th += (goal.th - cur.th) * EASE;
    cur.ph += (goal.ph - cur.ph) * EASE;
    cur.t.lerp(goal.t, EASE);
    const sp = Math.sin(cur.ph);
    camera.position.set(cur.t.x + cur.r * sp * Math.sin(cur.th), cur.t.y + cur.r * Math.cos(cur.ph), cur.t.z + cur.r * sp * Math.cos(cur.th));
    camera.lookAt(cur.t);
    if (labels) placeLabels(labels, world, camera, size.width, size.height, gl.domElement);
  });

  return null;
}

function placeLabels(labels: DioramaLabels, world: World, camera: THREE.Camera, w: number, h: number, canvas: HTMLElement) {
  camera.updateMatrixWorld();
  const minX = labels.minX();
  const host = canvas.getBoundingClientRect();
  const taken: [number, number, number, number][] = [];
  Object.entries(labels.refs).forEach(([name, ref]) => {
    const el = ref.current;
    const p = world.nodes[name];
    if (!el || !p) return;
    v3.copy(p).project(camera);
    const x = ((v3.x + 1) / 2) * w;
    const y = ((1 - v3.y) / 2) * h;
    el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
    const box = el.firstElementChild?.getBoundingClientRect();
    let ok = v3.z < 1 && y > 70 && y < h - 140;
    if (ok && box?.width) {
      const l = box.left - host.left;
      const rt = l + box.width;
      const tp = box.top - host.top;
      const bt = tp + box.height;
      ok = l > minX + 12 && rt < w - 8 && tp > 64 && bt < h - 120 && !taken.some(b => l < b[2] && rt > b[0] && tp < b[3] && bt > b[1]);
      if (ok) taken.push([l - 6, tp - 6, rt + 6, bt + 6]);
    }
    el.style.opacity = ok ? '1' : '0';
    el.style.visibility = ok ? 'visible' : 'hidden';
  });
}
