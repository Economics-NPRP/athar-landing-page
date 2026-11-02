/* Low-level primitives for the procedural Qatar diorama: materials, facade textures and a shape builder. */
import * as THREE from 'three';

/** Base colours of the model. `maroon` is re-tinted gold to match the green theme. */
export const COL = {
  sand: '#e9dcc0', sand2: '#eee3cc', seabed: '#5b8f9f', pave: '#f3eee4', stone: '#efe3cc', white: '#f4f5f7',
  glass: '#8db0c6', glassD: '#5d86a3', maroon: '#c7983a', solar: '#123f5e', grass: '#a7cc93', pool: '#79c4d6',
  metal: '#dfe3e7', sea: '#7fb6c6', track: '#dd7877', palm: '#129b82', trunk: '#8f6e4a', wood: '#9a7650', dark: '#25262b',
} as const;

export type MatKey = keyof typeof COL;
export const LINE_COLOR = '#2bc97f';

type Packet = { curve: THREE.Curve<THREE.Vector3>; p: THREE.Mesh; t: number };
type Flame = { f: THREE.Mesh; L: THREE.PointLight };
type Model = { cx: number; cz: number; w: number; d: number; h: number };
type Instance = [x: number, y: number, z: number, sx: number, sy: number, sz: number];

/** Everything the scene builder produces and the animation loop drives. */
export type World = {
  root: THREE.Group;
  mats: Record<string, THREE.MeshLambertMaterial>;
  facades: Record<string, THREE.MeshLambertMaterial>;
  /** Facade materials whose windows glow at dusk. */
  emissive: THREE.MeshLambertMaterial[];
  inst: Partial<Record<MatKey, Instance[]>>;
  nodes: Record<string, THREE.Vector3>;
  models: Record<string, Model>;
  flames: Flame[];
  boats: THREE.Group[];
  packets: Packet[];
  halos: THREE.Mesh[];
  /** City → country links drawn as small arcs. */
  local: [string, string][];
  flameBase: number;
  arcMat: THREE.MeshBasicMaterial;
  nodeMat: THREE.MeshBasicMaterial;
  pktGeo: THREE.SphereGeometry;
  pktMat: THREE.MeshBasicMaterial;
  palmGeo?: { trunk: THREE.BufferGeometry; leaf: THREE.BufferGeometry };
  sailMat?: THREE.MeshLambertMaterial;
};

export function createWorldState(): World {
  return {
    root: new THREE.Group(),
    mats: {}, facades: {}, emissive: [], inst: {}, nodes: {}, models: {},
    flames: [], boats: [], packets: [], halos: [], local: [], flameBase: 0,
    arcMat: new THREE.MeshBasicMaterial({ color: LINE_COLOR }),
    nodeMat: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    pktGeo: new THREE.SphereGeometry(0.85, 24, 16),
    pktMat: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
  };
}

/* ---------- Materials ---------- */

export function mat(W: World, k: MatKey) {
  if (!W.mats[k]) {
    W.mats[k] = new THREE.MeshLambertMaterial({
      color: COL[k],
      flatShading: true,
      ...(k === 'sea' ? { transparent: true, opacity: 0.92 } : {}),
    });
  }
  return W.mats[k];
}

function smoothMat(W: World, k: MatKey) {
  const id = `${k}:smooth`;
  if (!W.mats[id]) {
    W.mats[id] = mat(W, k).clone();
    W.mats[id].flatShading = false;
  }
  return W.mats[id];
}

/* ---------- Facade textures (drawn once on canvases) ---------- */

type FacadeKind = 'win' | 'floors' | 'fins' | 'lattice';
let TEXTURES: Record<FacadeKind, { map: THREE.CanvasTexture; em: THREE.CanvasTexture }> | null = null;

function canvasTexture(w: number, h: number, draw: (c: CanvasRenderingContext2D) => void) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

function textures() {
  if (TEXTURES) return TEXTURES;
  const win = (bg: string, fg: string) => canvasTexture(64, 64, c => { c.fillStyle = bg; c.fillRect(0, 0, 64, 64); c.fillStyle = fg; c.fillRect(16, 20, 32, 26); });
  const floors = (bg: string, fg: string) => canvasTexture(64, 32, c => { c.fillStyle = bg; c.fillRect(0, 0, 64, 32); c.fillStyle = fg; c.fillRect(0, 0, 64, 3); c.fillRect(0, 0, 2, 32); });
  const fins = (bg: string, fg: string) => canvasTexture(32, 64, c => { c.fillStyle = bg; c.fillRect(0, 0, 32, 64); c.fillStyle = fg; c.fillRect(0, 0, 7, 64); });
  const lattice = (bg: string, fg: string) => canvasTexture(128, 128, c => {
    c.fillStyle = bg; c.fillRect(0, 0, 128, 128); c.strokeStyle = fg; c.lineWidth = 8;
    c.beginPath(); c.moveTo(64, 0); c.lineTo(128, 64); c.lineTo(64, 128); c.lineTo(0, 64); c.closePath(); c.stroke();
  });
  TEXTURES = {
    win: { map: win('#ffffff', '#7d98ab'), em: win('#000000', '#ffffff') },
    floors: { map: floors('#ffffff', '#e8eff4'), em: floors('#b0b0b0', '#000000') },
    fins: { map: fins('#ffffff', '#d5d9de'), em: fins('#000000', '#000000') },
    lattice: { map: lattice('#7fa3bb', '#eef3f6'), em: lattice('#808080', '#000000') },
  };
  return TEXTURES;
}

function facade(W: World, color: string, kind: FacadeKind, rx: number, ry: number) {
  const key = `${color}${kind}${rx}_${ry}`;
  if (W.facades[key]) return W.facades[key];
  const T = textures()[kind];
  const map = T.map.clone();
  const em = T.em.clone();
  map.repeat.set(rx, ry);
  map.needsUpdate = true;
  em.repeat.set(rx, ry);
  em.needsUpdate = true;
  const m = new THREE.MeshLambertMaterial({
    color: kind === 'lattice' ? '#ffffff' : color,
    map,
    emissive: new THREE.Color('#ffcf8a'),
    emissiveMap: em,
    emissiveIntensity: 0,
    flatShading: true,
  });
  m.userData.emk = kind === 'win' ? 1 : 0.45;
  W.emissive.push(m);
  W.facades[key] = m;
  return m;
}

/* ---------- Builder: positions are in a model's local plan (x, y) with z up ---------- */

export class Builder {
  constructor(public W: World, public g: THREE.Group) {}

  add<T extends THREE.Object3D>(me: T, cast = true) {
    me.castShadow = cast;
    me.receiveShadow = true;
    this.g.add(me);
    return me;
  }

  box(x: number, y: number, z: number, w: number, d: number, h: number, m: MatKey, o?: { f: [FacadeKind, number, number] }) {
    let mt: THREE.Material | THREE.Material[] = mat(this.W, m);
    if (o?.f) {
      const [kind, cols, rows] = o.f;
      const crossCols = Math.max(1, Math.round((cols * d) / w));
      const sx = facade(this.W, COL[m], kind, crossCols, rows);
      const sz = facade(this.W, COL[m], kind, cols, rows);
      mt = [sx, sx, mt as THREE.Material, mt as THREE.Material, sz, sz];
    }
    const me = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mt);
    me.position.set(x + w / 2, z + h / 2, y + d / 2);
    return this.add(me, h > 0.5);
  }

  flat(x: number, y: number, z: number, w: number, d: number, m: MatKey) {
    return this.box(x, y, z, w, d, 0.12, m);
  }

  cyl(cx: number, cy: number, z: number, r: number, h: number, m: MatKey, o?: { lattice: boolean }) {
    let mt: THREE.Material | THREE.Material[] = mat(this.W, m);
    if (o?.lattice) {
      const side = facade(this.W, '#fff', 'lattice', Math.max(4, Math.round((2 * Math.PI * r) / 5)), Math.max(2, Math.round(h / 6)));
      mt = [side, mt as THREE.Material, mt as THREE.Material];
    }
    const me = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 40), mt);
    me.position.set(cx, z + h / 2, cy);
    return this.add(me);
  }

  dome(cx: number, cy: number, z: number, r: number, dh: number, m: MatKey) {
    const me = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 18, 0, Math.PI * 2, 0, Math.PI / 2), smoothMat(this.W, m));
    me.scale.y = dh / r;
    me.position.set(cx, z, cy);
    return this.add(me);
  }

  cone(cx: number, cy: number, z: number, r: number, ch: number, m: MatKey) {
    const me = new THREE.Mesh(new THREE.ConeGeometry(r, ch, 24), mat(this.W, m));
    me.position.set(cx, z + ch / 2, cy);
    return this.add(me);
  }

  /** Hyperboloid tower with a lattice skin. */
  hyper(cx: number, cy: number, z: number, r: number, h: number) {
    const pts: THREE.Vector2[] = [];
    for (let i = 0; i <= 20; i++) pts.push(new THREE.Vector2(r * (1 - 0.2 * Math.sin((Math.PI * i) / 20)), (h * i) / 20));
    const me = new THREE.Mesh(new THREE.LatheGeometry(pts, 40), facade(this.W, '#fff', 'lattice', 7, Math.round(h / 6)));
    me.position.set(cx, z, cy);
    this.add(me);
    this.cyl(cx, cy, z + h - 0.2, r, 0.3, 'glassD');
  }

  spire(cx: number, cy: number, z: number, h: number) {
    this.cyl(cx, cy, z, 0.22, h, 'metal');
  }

  palm(x: number, y: number, z: number, s = 1) {
    const W = this.W;
    W.palmGeo ??= {
      trunk: new THREE.CylinderGeometry(0.2, 0.34, 9, 6).translate(0, 4.5, 0),
      leaf: new THREE.BoxGeometry(0.9, 0.12, 5.2).translate(0, 0, 2.6),
    };
    const grp = new THREE.Group();
    grp.position.set(x, z, y);
    grp.scale.setScalar(s);
    const trunk = new THREE.Mesh(W.palmGeo.trunk, mat(W, 'trunk'));
    trunk.castShadow = true;
    grp.add(trunk);
    for (let i = 0; i < 8; i++) {
      const pivot = new THREE.Group();
      pivot.position.set(0, 8.9, 0);
      pivot.rotation.y = (i * Math.PI) / 4 + 0.2;
      const leaf = new THREE.Mesh(W.palmGeo.leaf, mat(W, 'palm'));
      leaf.rotation.x = 0.45 + (i % 2) * 0.3;
      leaf.castShadow = true;
      pivot.add(leaf);
      grp.add(pivot);
    }
    this.g.add(grp);
  }

  /** Crenellations are batched into one InstancedMesh per material (see flushInstances). */
  crenLine(x0: number, y0: number, x1: number, y1: number, z: number, m: MatKey) {
    const len = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.floor((len - 0.9) / 2.2) + 1;
    const ax = (x1 - x0) / len;
    const ay = (y1 - y0) / len;
    const alongX = Math.abs(ax) > 0.5;
    const list = (this.W.inst[m] ??= []);
    for (let i = 0; i < n; i++) {
      const t = i * 2.2 + 0.45;
      list.push([this.g.position.x + x0 + ax * t, z + 0.45, this.g.position.z + y0 + ay * t, alongX ? 0.9 : 0.7, 0.9, alongX ? 0.7 : 0.9]);
    }
  }

  cren(x: number, y: number, z: number, w: number, d: number, m: MatKey) {
    const i = 0.35;
    this.crenLine(x, y + i, x + w, y + i, z, m);
    this.crenLine(x, y + d - i, x + w, y + d - i, z, m);
    this.crenLine(x + i, y + 1.2, x + i, y + d - 1.2, z, m);
    this.crenLine(x + w - i, y + 1.2, x + w - i, y + d - 1.2, z, m);
  }

  solar(x: number, y: number, z: number, w: number, d: number, rows: number) {
    const rd = d / rows;
    for (let i = 0; i < rows; i++) this.box(x, y + i * rd + rd * 0.15, z, w, rd * 0.7, 0.3, 'solar');
  }

  tank(cx: number, cy: number, z: number, r: number, h: number) {
    this.cyl(cx, cy, z, r, h, 'metal');
    this.dome(cx, cy, z + h, r, 2.2, 'metal');
  }

  /** Flare stack with a flickering flame and point light. */
  stack(cx: number, cy: number, z: number, r: number, h: number) {
    this.cyl(cx, cy, z, r, h, 'white');
    for (let i = 1; i < 6; i += 2) this.cyl(cx, cy, z + (h * i) / 6, r + 0.04, h / 6, 'maroon');
    const f = new THREE.Mesh(new THREE.ConeGeometry(1.1, 4, 12), new THREE.MeshBasicMaterial({ color: '#fab005' }));
    f.position.set(cx, z + h + 2, cy);
    this.g.add(f);
    const f2 = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.4, 10), new THREE.MeshBasicMaterial({ color: '#fd7e14' }));
    f2.position.set(cx, z + h + 1.3, cy);
    this.g.add(f2);
    const L = new THREE.PointLight('#ffa040', 0, 90, 1.2);
    L.position.set(cx, z + h + 4, cy);
    this.g.add(L);
    this.W.flames.push({ f, L });
  }

  fan(cx: number, cy: number, z: number, r: number) {
    const me = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.2, 16), mat(this.W, 'dark'));
    me.position.set(cx, z + 0.1, cy);
    this.add(me, false);
  }

  dhow(x: number, y: number, s = 1) {
    const W = this.W;
    const grp = new THREE.Group();
    grp.position.set(x, -0.9, y);
    grp.rotation.y = 0.3 + Math.random() * 0.4;
    grp.scale.setScalar(s);
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-5, 1); hullShape.lineTo(6.5, 2); hullShape.lineTo(4, 0); hullShape.lineTo(-3.6, 0); hullShape.closePath();
    const hull = new THREE.Mesh(new THREE.ExtrudeGeometry(hullShape, { depth: 2.6, bevelEnabled: false }).translate(0, 0, -1.3), mat(W, 'wood'));
    hull.castShadow = true;
    grp.add(hull);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 12, 6), mat(W, 'trunk'));
    mast.position.set(0, 7, 0);
    grp.add(mast);
    const sailShape = new THREE.Shape();
    sailShape.moveTo(-4.5, 3); sailShape.lineTo(1.5, 13); sailShape.lineTo(4.5, 3.8); sailShape.closePath();
    W.sailMat ??= new THREE.MeshLambertMaterial({ color: '#fbf7ef', side: THREE.DoubleSide });
    const sail = new THREE.Mesh(new THREE.ShapeGeometry(sailShape), W.sailMat);
    sail.position.z = 0.2;
    sail.castShadow = true;
    grp.add(sail);
    W.root.add(grp);
    W.boats.push(grp);
  }

  /** Named anchor point (world space) for arcs, markers and HTML labels. */
  node(k: string, x: number, y: number, z: number) {
    this.W.nodes[k] = new THREE.Vector3(this.g.position.x + x, z, this.g.position.z + y);
  }
}
