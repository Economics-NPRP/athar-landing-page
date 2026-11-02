/* One procedural recipe per scale model. Units are metres-ish in each model's local plan. */
import * as THREE from 'three';
import { Builder, mat } from './builder';

const QATAR_OUTLINE: [number, number][] = [[51.21, 26.15], [51.33, 26.11], [51.43, 26.02], [51.57, 25.92], [51.60, 25.82], [51.53, 25.68], [51.51, 25.55], [51.53, 25.42], [51.60, 25.36], [51.55, 25.30], [51.61, 25.25], [51.62, 25.16], [51.58, 25.02], [51.50, 24.88], [51.42, 24.72], [51.37, 24.62], [51.22, 24.58], [51.10, 24.50], [50.98, 24.58], [50.85, 24.75], [50.82, 24.95], [50.87, 25.08], [50.80, 25.22], [50.76, 25.42], [50.80, 25.58], [50.87, 25.70], [50.95, 25.85], [51.02, 25.98], [51.10, 26.10]];
const CITIES: Record<string, [number, number]> = { doha: [51.53, 25.29], khor: [51.50, 25.68], laffan: [51.54, 25.89], mesaieed: [51.55, 24.99], dukhan: [50.80, 25.42], wakrah: [51.59, 25.17], shamal: [51.21, 26.09], sheehaniya: [51.21, 25.37] };
const lonX = (lon: number) => (lon - 50.62) * 50.5;
const latY = (lat: number) => (26.24 - lat) * 55.5;

export type ModelKey = 'villa' | 'building' | 'industrial' | 'educational' | 'commercial' | 'campus' | 'city' | 'datacenter' | 'country';

/** Footprint [w, d, h] of each model, used for camera framing. */
export const MODEL_SIZE: Record<ModelKey, [number, number, number]> = {
  villa: [40, 32, 15], building: [36, 36, 72], industrial: [60, 44, 36], educational: [52, 40, 14], commercial: [56, 44, 46],
  campus: [50, 50, 17], city: [72, 36, 66], datacenter: [64, 44, 12], country: [56, 99, 8],
};

export const RECIPES: Record<ModelKey, (b: Builder) => void> = {
  villa(b) {
    b.flat(0, 0, 0, 40, 32, 'pave'); b.flat(2, 2, 0.12, 17, 28, 'grass'); b.flat(5, 14, 0.24, 9, 6, 'pool');
    b.box(0, 0, 0, 40, 0.8, 4, 'stone'); b.box(0, 0.8, 0, 0.8, 31.2, 4, 'stone');
    b.crenLine(0, 0.4, 40, 0.4, 4, 'stone'); b.crenLine(0.4, 1.2, 0.4, 32, 4, 'stone');
    b.palm(4.5, 5, 0, 1); b.palm(3.5, 23, 0, 1.05); b.palm(15, 27, 0, 0.9);
    b.box(21, 3, 0, 16, 14, 9, 'stone', { f: ['win', 5, 2] }); b.cren(21, 3, 9, 16, 14, 'stone');
    b.box(21.8, 3.8, 9, 3, 3, 6, 'stone'); b.cren(21.8, 3.8, 15, 3, 3, 'stone');
    b.box(22.2, 6.75, 12, 0.7, 0.12, 2.4, 'dark'); b.box(23.5, 6.75, 12, 0.7, 0.12, 2.4, 'dark');
    b.box(24.75, 4.2, 12, 0.12, 0.7, 2.4, 'dark'); b.box(24.75, 5.5, 12, 0.12, 0.7, 2.4, 'dark');
    b.solar(27, 5, 9, 8.5, 9, 4); b.box(23.5, 12.5, 9, 2, 1.5, 1.2, 'metal');
    b.box(28, 21, 0, 9, 8, 4.5, 'white', { f: ['win', 3, 1] }); b.cren(28, 21, 4.5, 9, 8, 'white');
    b.box(30.5, 23, 4.5, 2, 1.4, 1, 'metal'); b.box(33.5, 23, 4.5, 2, 1.4, 1, 'metal');
    b.box(0, 31.2, 0, 21, 0.8, 2.2, 'stone'); b.box(39.2, 0, 0, 0.8, 19, 2.2, 'stone');
    b.node('villa', 29, 10, 16);
  },
  building(b) {
    b.flat(1, 1, 0, 34, 34, 'pave'); b.box(5, 5, 0, 26, 26, 4.5, 'white', { f: ['win', 9, 1] });
    b.box(7, 7, 4.5, 3, 2, 1.2, 'metal'); b.box(7, 10.5, 4.5, 3, 2, 1.2, 'metal');
    b.cyl(18, 18, 4.5, 8, 54, 'glass', { lattice: true }); b.dome(18, 18, 58.5, 8, 4, 'metal'); b.spire(18, 18, 61, 9);
    [[33, 9], [33, 18], [33, 27], [9, 33], [18, 33], [27, 33]].forEach(([x, y]) => b.palm(x, y, 0, 0.85));
    b.node('building', 18, 18, 71);
  },
  industrial(b) {
    b.flat(2, 2, 0, 56, 40, 'pave');
    b.tank(12, 12, 0, 8, 12); b.tank(30, 10, 0, 8, 12); b.stack(52, 6, 0, 0.9, 34);
    b.cyl(42, 17, 0, 1.6, 22, 'metal'); b.cyl(46.5, 19, 0, 1.2, 17, 'metal'); b.cyl(40, 22.5, 0, 1, 14, 'metal');
    for (let i = 6; i <= 46; i += 5) b.box(i, 25, 0, 0.5, 2.4, 4, 'metal');
    b.box(6, 25, 4, 40.5, 2.4, 0.8, 'metal'); b.cyl(26, 26.2, 4.8, 0.45, 0.1, 'metal'); b.box(6, 25.8, 4.8, 40.5, 0.7, 0.7, 'maroon');
    b.flat(4, 31, 0.12, 22, 10, 'sand2');
    b.box(6, 32, 0, 7, 3, 3, 'maroon'); b.box(6, 35.6, 0, 7, 3, 3, 'solar'); b.box(14.5, 33, 0, 7, 3, 3, 'metal');
    b.box(31, 31, 0, 18, 9, 6, 'white', { f: ['win', 6, 1] }); b.box(34, 33, 6, 3, 2, 1.1, 'metal');
    b.node('industrial', 30, 10, 18); b.node('yard', 15, 38, 3.5);
  },
  educational(b) {
    b.flat(2, 2, 0, 48, 36, 'pave'); b.flat(4, 20, 0.12, 28, 16, 'grass');
    b.box(4, 4, 0, 9, 12, 12, 'stone', { f: ['fins', 6, 1] }); b.box(13, 4, 7, 10, 12, 5, 'stone', { f: ['fins', 7, 1] }); b.box(23, 4, 0, 9, 12, 12, 'stone', { f: ['fins', 6, 1] });
    b.solar(5, 5.5, 12, 7, 9, 3); b.solar(24, 5.5, 12, 7, 9, 3);
    b.palm(6, 22, 0, 0.9); b.palm(22, 23, 0, 0.9); b.palm(13, 33, 0, 0.9); b.palm(29, 33, 0, 0.9);
    b.flat(35, 5, 0.1, 15, 30, 'track'); b.flat(36.6, 6.6, 0.2, 11.8, 26.8, 'grass');
    b.box(37.4, 7.4, 0.32, 10.2, 0.3, 0.02, 'white'); b.box(37.4, 32.3, 0.32, 10.2, 0.3, 0.02, 'white'); b.box(37.4, 19.85, 0.32, 10.2, 0.3, 0.02, 'white');
    b.box(37.4, 7.4, 0.32, 0.3, 25.2, 0.02, 'white'); b.box(47.3, 7.4, 0.32, 0.3, 25.2, 0.02, 'white');
    b.node('educational', 18, 10, 14);
  },
  commercial(b) {
    b.flat(2, 2, 0, 52, 40, 'pave');
    b.box(4, 4, 0, 32, 20, 8, 'stone', { f: ['win', 10, 1] }); b.cren(4, 4, 8, 32, 20, 'stone');
    b.cyl(9, 9, 8, 2.2, 1.4, 'stone'); b.dome(9, 9, 9.4, 2.2, 1.8, 'white');
    b.cyl(20, 14, 8, 5.5, 2.4, 'stone'); b.dome(20, 14, 10.4, 5.5, 4.2, 'white');
    b.cyl(31, 9, 8, 2.2, 1.4, 'stone'); b.dome(31, 9, 9.4, 2.2, 1.8, 'white');
    b.box(40, 4, 0, 11, 11, 42, 'glassD', { f: ['floors', 3, 14] }); b.box(40.5, 4.5, 42, 10, 10, 2.5, 'metal');
    for (let i = 0; i < 3; i++) {
      b.box(7, 29 + i * 4.6, 0, 0.4, 0.4, 3, 'metal'); b.box(32.6, 29 + i * 4.6, 0, 0.4, 0.4, 3, 'metal');
      b.box(6, 28 + i * 4.6, 3, 28, 3, 0.3, 'solar');
    }
    b.palm(39, 30, 0, 0.9); b.palm(39, 39, 0, 0.9); b.palm(51, 22, 0, 0.9); b.palm(51, 33, 0, 0.9);
    b.node('commercial', 20, 14, 16);
  },
  campus(b) {
    b.flat(1, 1, 0, 48, 48, 'pave'); b.flat(16, 16, 0.12, 18, 18, 'grass');
    [[3, 3], [19, 3], [35, 3], [3, 19], [35, 19], [3, 35], [19, 35], [35, 35]].forEach(([x, y]) => {
      b.box(x, y, 0, 11, 11, 6, 'stone', { f: ['win', 3, 1] }); b.cren(x, y, 6, 11, 11, 'stone'); b.solar(x + 2, y + 2, 6, 7, 7, 3);
    });
    b.box(20, 20, 0, 10, 10, 5, 'white'); b.cren(20, 20, 5, 10, 10, 'white');
    b.cyl(25, 25, 5, 3.4, 1.2, 'white'); b.dome(25, 25, 6.2, 3.4, 3.4, 'white'); b.spire(25, 25, 9.6, 2.4);
    b.cyl(31.5, 19, 0, 0.9, 14, 'white'); b.cyl(31.5, 19, 11, 1.3, 0.6, 'white'); b.cone(31.5, 19, 14, 0.9, 2.6, 'white');
    b.node('campus', 25, 25, 13);
  },
  city(b) {
    b.flat(0, 0, 0, 72, 36, 'pave');
    b.box(4, 4, 0, 8, 8, 30, 'glass', { f: ['floors', 2, 10] });
    b.hyper(21, 9, 0, 5, 46);
    b.cyl(37, 10, 0, 6, 54, 'glass', { lattice: true }); b.dome(37, 10, 54, 6, 3.4, 'metal'); b.spire(37, 10, 57, 8);
    b.box(50, 3, 0, 7, 7, 40, 'glassD', { f: ['floors', 2, 14] }); b.box(50.5, 3.5, 40, 6, 6, 2, 'metal');
    b.box(60, 4, 0, 7, 7, 44, 'glassD', { f: ['floors', 2, 15] }); b.box(60.5, 4.5, 44, 6, 6, 2, 'metal');
    b.box(6, 18, 0, 9, 9, 20, 'white', { f: ['win', 4, 7] }); b.box(24, 22, 0, 8, 8, 32, 'glass', { f: ['floors', 2, 11] });
    b.box(44, 20, 0, 10, 8, 24, 'white', { f: ['win', 4, 8] }); b.box(58, 20, 0, 9, 9, 28, 'glass', { f: ['floors', 2, 9] });
    b.box(4, 29, 0, 12, 5, 7, 'stone', { f: ['win', 5, 2] }); b.box(30, 29, 0, 14, 5, 6, 'stone', { f: ['win', 6, 2] }); b.box(52, 29, 0, 14, 5, 8, 'stone', { f: ['win', 6, 2] });
    b.node('city', 37, 10, 67);
  },
  datacenter(b) {
    b.flat(0, 0, 0, 64, 44, 'sand2');
    for (let i = 0; i < 8; i++) b.box(3, 4 + i * 4.6, 1.2, 26, 2.6, 0.25, 'solar').rotation.x = -0.35;
    b.box(35, 7, 0, 24, 16, 9, 'white', { f: ['fins', 12, 1] });
    b.box(37, 22.95, 2, 20, 0.15, 3.2, 'dark'); b.box(58.95, 9, 2, 0.15, 12, 3.2, 'dark');
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        const x = 36.5 + c * 5.6;
        const y = 8.5 + r * 7;
        b.box(x, y, 9, 4.6, 5, 1.6, 'metal'); b.fan(x + 2.3, y + 1.4, 10.6, 0.9); b.fan(x + 2.3, y + 3.6, 10.6, 0.9);
      }
    }
    b.box(37, 27, 0, 6, 4, 3.6, 'metal'); b.box(45, 27, 0, 6, 4, 3.6, 'metal'); b.box(53, 27, 0, 4, 4, 5, 'metal');
    b.node('datacenter', 47, 15, 12);
  },
  country(b) {
    b.box(0, 0, 0, 56, 99, 1.2, 'sea');
    const shape = new THREE.Shape();
    QATAR_OUTLINE.forEach(([lon, lat], i) => (i ? shape.lineTo(lonX(lon), -latY(lat)) : shape.moveTo(lonX(lon), -latY(lat))));
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: 1.8, bevelEnabled: false });
    geo.rotateX(-Math.PI / 2);
    const land = new THREE.Mesh(geo, mat(b.W, 'sand'));
    land.position.y = 1.2;
    b.add(land);
    const dx = lonX(51.53), dy = latY(25.29);
    b.box(dx - 1.2, dy - 2, 3, 1.4, 1.4, 6, 'glass'); b.box(dx + 0.6, dy - 1.4, 3, 1.4, 1.4, 4, 'glassD'); b.box(dx - 0.6, dy + 0.4, 3, 1.6, 1.6, 3, 'white');
    const lx = lonX(51.54), ly = latY(25.89);
    b.cyl(lx - 1, ly - 1, 3, 1, 1.4, 'metal'); b.cyl(lx + 1.4, ly, 3, 1, 1.4, 'metal');
    Object.entries(CITIES).forEach(([k, [lon, lat]]) => {
      b.node(`c_${k}`, lonX(lon), latY(lat), 3.4);
      b.W.local.push([`c_${k}`, 'country']);
    });
    b.node('country', lonX(51.36), latY(25.27), 3.6);
  },
};
