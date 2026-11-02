/* Assembles the full diorama (every scale linked to the data center) or the data-center close-up. */
import * as THREE from 'three';
import { Builder, createWorldState, mat, type World } from './builder';
import { MODEL_SIZE, RECIPES, type ModelKey } from './recipes';

export type DioramaMode = 'hero' | 'explore' | 'dc';

function place(W: World, k: ModelKey, x0: number, z0: number) {
  const g = new THREE.Group();
  g.position.set(x0, 0, z0);
  W.root.add(g);
  RECIPES[k](new Builder(W, g));
  const [w, d, h] = MODEL_SIZE[k];
  W.models[k] = { cx: x0 + w / 2, cz: z0 + d / 2, w, d, h };
}

/** Data link: a tube along a bezier with two packets travelling on it. */
function arc(W: World, a: THREE.Vector3, b: THREE.Vector3, lift: number, r: number) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  mid.y += lift;
  const curve = new THREE.QuadraticBezierCurve3(a.clone(), mid, b.clone());
  W.root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 48, r, 6, false), W.arcMat));
  for (let i = 0; i < 2; i++) {
    const p = new THREE.Mesh(W.pktGeo, W.pktMat);
    p.scale.setScalar(r / 0.3);
    W.root.add(p);
    W.packets.push({ curve, p, t: i * 0.5 + Math.random() * 0.2 });
  }
}

function markers(W: World, hub: string) {
  const geo = new THREE.SphereGeometry(1.1, 32, 24);
  Object.entries(W.nodes).forEach(([k, p]) => {
    if (k === 'yard') return;
    const small = k.startsWith('c_');
    const m = k === hub ? new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), W.arcMat) : new THREE.Mesh(geo, W.nodeMat);
    m.position.copy(p);
    if (k !== hub) m.scale.setScalar(small ? 0.5 : 1);
    W.root.add(m);
    const halo = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: W.arcMat.color, transparent: true, opacity: 0.5, depthWrite: false }));
    halo.position.copy(p);
    halo.userData.base = small ? 0.5 : k === hub ? 1.6 : 1;
    W.root.add(halo);
    W.halos.push(halo);
  });
}

function flushInstances(W: World) {
  const geo = new THREE.BoxGeometry(1, 1, 1);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const p = new THREE.Vector3();
  const s = new THREE.Vector3();
  (Object.keys(W.inst) as (keyof typeof W.inst)[]).forEach(k => {
    const list = W.inst[k]!;
    const im = new THREE.InstancedMesh(geo, mat(W, k), list.length);
    list.forEach((a, i) => {
      p.set(a[0], a[1], a[2]);
      s.set(a[3], a[4], a[5]);
      m4.compose(p, q, s);
      im.setMatrixAt(i, m4);
    });
    im.castShadow = true;
    im.receiveShadow = true;
    W.root.add(im);
  });
}

function water(W: World, x: number, z: number, w: number, d: number) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d).rotateX(-Math.PI / 2), mat(W, 'sea'));
  m.position.set(x + w / 2, -1, z + d / 2);
  m.receiveShadow = true;
  W.root.add(m);
}

function buildFullWorld(W: World) {
  const R = new Builder(W, W.root);
  R.box(-185, -140, -4, 395, 120, 4, 'sand');
  R.box(-185, 18, -4, 395, 80, 4, 'sand');
  R.box(-185, -20, -4, 395, 38, 2, 'seabed');
  water(W, -185, -20, 395, 38);
  R.flat(-185, -24, 0, 395, 4, 'pave');
  R.flat(-185, 18, 0, 395, 4, 'pave');
  for (let x = -176; x < 205; x += 15) R.palm(x, 20, 0, 0.75);

  place(W, 'industrial', -118, -68); place(W, 'city', -44, -60); place(W, 'datacenter', 42, -68); place(W, 'country', 126, -123);
  place(W, 'villa', -145, 25); place(W, 'building', -91, 25); place(W, 'educational', -41, 25); place(W, 'commercial', 25, 25); place(W, 'campus', 95, 25);
  [[-120, -4], [-30, 4], [70, -6], [160, 3]].forEach(([x, y], i) => R.dhow(x, y, i % 2 ? 1.1 : 0.9));

  const hub = W.nodes.datacenter;
  (['villa', 'building', 'industrial', 'educational', 'commercial', 'campus', 'city', 'country'] as const).forEach(k => {
    const a = W.nodes[k];
    arc(W, a, hub, 26 + a.distanceTo(hub) * 0.16, 0.32);
  });
  W.local.forEach(([a, b]) => arc(W, W.nodes[a], W.nodes[b], 5, 0.14));
  markers(W, 'datacenter');
}

/** Data-center close-up with nine streams flowing in from off-screen. */
function buildDataCenter(W: World) {
  const R = new Builder(W, W.root);
  R.box(-80, -50, -4, 160, 100, 4, 'sand');
  place(W, 'datacenter', -32, -22);
  const hub = W.nodes.datacenter;
  for (let i = 0; i < 9; i++) {
    const s = new THREE.Vector3(-230, 10 + (i % 3) * 8, -70 + i * 17.5);
    const curve = new THREE.CubicBezierCurve3(
      s,
      new THREE.Vector3(-110, s.y + 6, s.z),
      new THREE.Vector3(hub.x - 50, hub.y + 14, hub.z + (s.z - hub.z) * 0.25),
      hub.clone(),
    );
    W.root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 60, 0.3, 6, false), W.arcMat));
    for (let k = 0; k < 3; k++) {
      const p = new THREE.Mesh(W.pktGeo, W.pktMat);
      W.root.add(p);
      W.packets.push({ curve, p, t: k / 3 + Math.random() * 0.1 });
    }
  }
  markers(W, 'datacenter');
}

export function createWorld(mode: DioramaMode): World {
  const W = createWorldState();
  if (mode === 'dc') buildDataCenter(W);
  else buildFullWorld(W);
  flushInstances(W);
  return W;
}

/** Spherical camera pose: target, radius, azimuth (th) and polar angle (ph). */
export type CameraPose = { t: THREE.Vector3; r: number; th: number; ph: number };

export function cameraPreset(W: World, key: string, aspect: number): CameraPose {
  let p: CameraPose;
  const m = W.models[key];
  if (key === 'dc') p = { t: new THREE.Vector3(-22, 4, 2), r: 140, th: 0.22, ph: 1.08 };
  else if (key === 'all' || !m) p = { t: new THREE.Vector3(8, 0, -14), r: 470, th: 0.62, ph: 0.98 };
  else {
    const span = Math.max(m.w, m.d);
    const country = key === 'country';
    p = { t: new THREE.Vector3(m.cx, m.h * 0.34, m.cz), r: span * 1.45 + m.h + 22, th: country ? 0.2 : 0.3, ph: country ? 0.62 : 0.86 };
  }
  p.r *= aspect < 1 ? 1.7 : aspect < 1.3 ? 1.25 : 1;
  return p;
}
