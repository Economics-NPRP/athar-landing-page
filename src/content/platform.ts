/* Simulated per-scale demo data for the platform dashboards. */

export type SegId = 'villa' | 'building' | 'industrial' | 'educational' | 'commercial' | 'campus' | 'city' | 'country';
export type Status = 'good' | 'warn' | 'crit';
type Flag = 'track' | 'improving' | 'good' | 'watch';

type Seg = {
  name: string;
  metric: 'co2' | 'pm';
  iaq: string;
  zones: [string, number][];
  /** Index of the zone plotted in the sparkline. */
  spark: number;
  /** This month's total footprint, in `unit`. */
  now: number;
  unit: 't' | 'kt';
  dec: number;
  /** Share of chilled water in the footprint (0 = none). */
  chw: number;
  scope: string;
  bm: [string, string, string][];
  report: string;
  kpis: [string, string, Flag][];
};

export const SEGS: Record<SegId, Seg> = {
  villa: { name: 'Villa', metric: 'co2', iaq: 'Villa · live indoor air quality',
    zones: [['Majlis', 640], ['Living room', 598], ['Master bedroom', 712], ['Bedroom 2', 688], ['Kitchen', 842], ['Dining room', 615], ['Home office', 1036], ['Guest suite', 572], ['Outdoor reference', 428]],
    spark: 6, now: 2.1, unit: 't', dec: 1, chw: 0, scope: 'One villa · Scope 1 and 2',
    bm: [['Cooling', '1.3 t', '61%'], ['Lighting and appliances', '0.4 t', '19%'], ['Water heating', '0.2 t', '10%'], ['Pool and garden', '0.2 t', '10%']],
    report: 'Villa carbon statement',
    kpis: [['9.8 MWh', 'air conditioning 61% of use', 'track'], ['6.3 tCO₂e', '8% below the weather-normalised baseline', 'improving'], ['94%', 'of night hours with CO₂ below 1,000 ppm in bedrooms', 'good'], ['21 h', 'with WBGT above 32.1 °C in the garden', 'watch']] },
  building: { name: 'Administration building', metric: 'co2', iaq: 'Administration building · live indoor air quality',
    zones: [['Floor 2 · open office', 742], ['Floor 4 · meeting rooms', 905], ['Floor 7 · open office', 1040], ['Floor 9 · executive suite', 688], ['Lobby', 560], ['Prayer room', 820], ['Café', 870], ['Server room', 512], ['AHU intake', 426]],
    spark: 2, now: 85, unit: 't', dec: 0, chw: 1, scope: 'One administration building · Scope 1 and 2',
    bm: [['Floors 1–4', '24 t', '7.9 kg/m²'], ['Floors 5–8', '27 t', '8.8 kg/m²'], ['Floors 9–11', '19 t', '8.3 kg/m²'], ['Podium and lobby', '15 t', '6.1 kg/m²']],
    report: 'Building Sustainability Report · administration building',
    kpis: [['412 MWh', 'cooling 71% · energy use intensity on track', 'track'], ['255 tCO₂e', '6% below the weather-normalised baseline', 'improving'], ['91%', 'of occupied hours with CO₂ below 1,000 ppm', 'good'], ['38 h', 'with WBGT above 32.1 °C at the entrances', 'watch']] },
  industrial: { name: 'Industrial institution', metric: 'co2', iaq: 'Industrial site · live indoor air quality',
    zones: [['Workshop · bay A', 812], ['Workshop · bay B', 945], ['Paint shop', 1060], ['Control room', 690], ['Quality lab', 735], ['Canteen', 880], ['Offices', 640], ['Warehouse', 520], ['Outdoor reference', 431]],
    spark: 2, now: 1840, unit: 't', dec: 0, chw: 0.35, scope: 'One industrial site · Scope 1 and 2',
    bm: [['Process lines', '1,180 t', '64%'], ['Compressed air', '290 t', '16%'], ['Cooling and offices', '240 t', '13%'], ['Fleet and yard', '130 t', '7%']],
    report: 'Site Sustainability Report · industrial site',
    kpis: [['3,720 MWh', 'process lines 64% of use', 'track'], ['5,520 tCO₂e', '4% below the weather-normalised baseline', 'improving'], ['87%', 'of shift hours with CO₂ below 1,000 ppm', 'good'], ['126 h', 'with WBGT above 32.1 °C in the loading yard', 'watch']] },
  educational: { name: 'Educational institution', metric: 'co2', iaq: 'University library · live indoor air quality',
    zones: [['Lecture 1', 724], ['Lecture 2', 875], ['Lecture 3', 1076], ['Study hall', 956], ['Study rooms', 782], ['Lab', 689], ['Café', 900], ['Atrium', 613], ['Reference', 647]],
    spark: 2, now: 101, unit: 't', dec: 0, chw: 1, scope: 'University library · Scope 1 and 2',
    bm: [['Lecture halls', '31 t', '8.9 kg/m²'], ['Reading rooms', '28 t', '7.6 kg/m²'], ['Labs', '24 t', '11.2 kg/m²'], ['Café and atrium', '18 t', '6.8 kg/m²']],
    report: 'Building Sustainability Report · university library',
    kpis: [['296 MWh', 'cooling 69% · energy use intensity on track', 'track'], ['187 tCO₂e', '5% below the weather-normalised baseline', 'improving'], ['89%', 'of teaching hours with CO₂ below 1,000 ppm', 'good'], ['44 h', 'with WBGT above 32.1 °C at the entrances', 'watch']] },
  commercial: { name: 'Commercial institution', metric: 'co2', iaq: 'Mall and hotel · live indoor air quality',
    zones: [['Mall · ground floor', 745], ['Mall · first floor', 812], ['Food court', 1052], ['Cinema', 968], ['Hotel lobby', 590], ['Hotel rooms', 655], ['Ballroom', 880], ['Offices', 702], ['Car-park entrance', 455]],
    spark: 2, now: 640, unit: 't', dec: 0, chw: 1, scope: 'Mall, hotel and offices · Scope 1 and 2',
    bm: [['Mall', '298 t', '9.4 kg/m²'], ['Hotel', '214 t', '11.8 kg/m²'], ['Offices', '86 t', '7.2 kg/m²'], ['Car park', '42 t', '2.1 kg/m²']],
    report: 'Tenant Carbon Report · mall and hotel',
    kpis: [['2,140 MWh', 'chillers 68% of use', 'track'], ['1,920 tCO₂e', 'allocated to 146 tenants by floor area', 'improving'], ['93%', 'of opening hours with CO₂ below 1,000 ppm', 'good'], ['57 h', 'with WBGT above 32.1 °C on the car-park ramps', 'watch']] },
  campus: { name: 'Campus and compounds', metric: 'co2', iaq: 'Campus · live indoor air quality by building',
    zones: [['B1 · GSAS building', 690], ['B2 · Laboratory', 905], ['B3 · Library', 1018], ['B4 · Student services', 845], ['Sports hall', 760], ['Mosque', 640], ['Clinic', 598], ['Housing', 712], ['Outdoor reference', 429]],
    spark: 2, now: 429, unit: 't', dec: 0, chw: 1, scope: 'Four-building campus · Scope 1 and 2',
    bm: [['B1 · GSAS building', '89 t', '6.4 kg/m²'], ['B2 · Laboratory', '147 t', '9.2 kg/m²'], ['B3 · Library', '101 t', '8.4 kg/m²'], ['B4 · Student services', '92 t', '10.2 kg/m²']],
    report: 'Campus Roll-up Report · four buildings',
    kpis: [['1,240 MWh', 'cooling 70% across four buildings', 'track'], ['1,287 tCO₂e', '6% below the weather-normalised baseline', 'improving'], ['90%', 'of occupied hours with CO₂ below 1,000 ppm', 'good'], ['52 h', 'with WBGT above 32.1 °C at the entrances', 'watch']] },
  city: { name: 'Whole city', metric: 'pm', iaq: 'Doha · live outdoor air quality by district',
    zones: [['West Bay', 18], ['Msheireb and Souq Waqif', 21], ['Corniche', 13], ['Al Dafna and Katara', 16], ['Al Hilal and Nuaija', 19], ['Industrial Area', 41], ['Education City', 12], ['Old Doha Port', 27], ['Hamad International Airport', 24]],
    spark: 5, now: 182, unit: 'kt', dec: 0, chw: 0.8, scope: 'Connected city sites · Scope 1 and 2',
    bm: [['Public buildings', '48 kt', '26%'], ['Commercial', '61 kt', '34%'], ['Residential', '52 kt', '29%'], ['Street lighting and utilities', '21 kt', '11%']],
    report: 'City Air, Heat and Carbon Report',
    kpis: [['1,050 GWh', 'buildings 82% of metered use', 'track'], ['546 ktCO₂e', 'connected sites, 3% below the baseline', 'improving'], ['78%', 'of hours with PM2.5 below 35 µg/m³', 'watch'], ['312 h', 'with WBGT above 32.1 °C at street level', 'watch']] },
  country: { name: 'Full country', metric: 'pm', iaq: 'Qatar national network · live outdoor air quality',
    zones: [['Doha', 22], ['Al Rayyan', 25], ['Al Wakrah', 19], ['Al Khor and Al Thakhira', 15], ['Dukhan', 21], ['Al Sheehaniya farms', 27], ['Ras Laffan Industrial City', 38], ['Mesaieed Industrial City', 33], ['Al Shamal coast', 12]],
    spark: 6, now: 1240, unit: 'kt', dec: 0, chw: 0.8, scope: 'Connected public sites nationwide · Scope 1 and 2',
    bm: [['Municipal buildings', '310 kt', '25%'], ['Education and health', '372 kt', '30%'], ['Commercial and hotels', '403 kt', '33%'], ['Utilities', '155 kt', '12%']],
    report: 'National Evidence Report · connected sites',
    kpis: [['7.1 TWh', 'connected sites, quarter to date', 'track'], ['3.7 MtCO₂e', 'connected sites, measured rather than modelled', 'improving'], ['74%', 'of hours with PM2.5 below 35 µg/m³', 'watch'], ['9,800 h', 'site-hours with WBGT above 32.1 °C', 'watch']] },
};

export const SEG_ORDER: SegId[] = ['villa', 'building', 'industrial', 'educational', 'commercial', 'campus', 'city', 'country'];
export const SEG_SHORT: Record<SegId, string> = { villa: 'Villa', building: 'Administration building', industrial: 'Industrial', educational: 'Educational', commercial: 'Commercial', campus: 'Campus and compounds', city: 'Whole city', country: 'Full country' };
export const KPI_LABELS = ['Energy', 'Carbon · Scope 1 and 2', 'Air quality', 'Outdoor heat'];
export const FLAGS: Record<Flag, { label: string; good: boolean }> = {
  track: { label: 'On track', good: true },
  improving: { label: 'Improving', good: true },
  good: { label: 'Good', good: true },
  watch: { label: 'Watch', good: false },
};
export const STATUS_COLOR: Record<Status, string> = { good: '#0ca30c', warn: '#fab219', crit: '#d03b3b' };
export const STATUS_ICON = { good: 'st-good', warn: 'st-warn', crit: 'st-crit' } as const;

export const nf = new Intl.NumberFormat('en-US');

export const isPm = (seg: SegId) => SEGS[seg].metric === 'pm';
export const thresholds = (seg: SegId): [number, number] => (isPm(seg) ? [15, 35] : [800, 1000]);

export function status(seg: SegId, v: number): Status {
  const [lo, hi] = thresholds(seg);
  return v < lo ? 'good' : v <= hi ? 'warn' : 'crit';
}

export const unitText = (seg: SegId) => (isPm(seg) ? 'µg/m³ PM2.5' : 'ppm CO₂');

export const legend = (seg: SegId) =>
  isPm(seg)
    ? ['Good · under 15 µg/m³', 'Moderate · 15 to 35', 'Poor · over 35']
    : ['Good · under 800 ppm', 'Moderate · 800 to 1,000', 'Poor · over 1,000'];

/** Small random walk around each zone's baseline to make the "live" screen breathe. */
export function jitter(seg: SegId): number[] {
  const j = isPm(seg) ? 1 : 8;
  return SEGS[seg].zones.map(([, v]) => Math.max(1, Math.round(v + (Math.random() * 2 - 1) * j)));
}

export const SPARK_CO2 = [430, 448, 476, 522, 590, 668, 746, 820, 884, 942, 996, 1040, 1072, 1058, 1004, 936, 884, 862, 892, 944, 992, 1028, 1050, 1062, 1070, 1074, 1078, 1076];
export const SPARK_PM = [11, 12, 13, 15, 18, 22, 26, 30, 33, 36, 38, 37, 35, 34, 36, 38, 40, 41, 39, 38, 39, 40, 41, 41, 40, 41, 41, 41];

/* ---------- Monthly carbon footprint ---------- */

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHAPE = [262, 268, 318, 372, 418, 446, 452, 455, 438, 429, 352, 296];
const CHW_SHARE = [0.3, 0.3, 0.32, 0.34, 0.35, 0.36, 0.37, 0.37, 0.36, 0.35, 0.33, 0.31];
/** Index of the current month; later months are forecasts. */
export const NOW_MONTH = 9;

const rnd = (v: number, d: number) => Math.round(v * 10 ** d) / 10 ** d;

function niceStep(x: number) {
  const p = 10 ** Math.floor(Math.log10(x));
  return ([1, 2, 2.5, 5, 10].find(m => m * p >= x) ?? 10) * p;
}

export type CarbonRow = { m: string; tot: number; elec: number; chw: number; s1: number; base: number; fc: boolean };

export function carbon(seg: SegId) {
  const cfg = SEGS[seg];
  const k = cfg.now / SHAPE[NOW_MONTH];
  const d = cfg.dec;
  const rows: CarbonRow[] = SHAPE.map((s, i) => {
    const tot = rnd(s * k, d);
    const s1 = rnd(tot * 0.08, d);
    const chw = rnd(tot * CHW_SHARE[i] * cfg.chw, d);
    return { m: MONTHS[i], tot, elec: rnd(tot - s1 - chw, d), chw, s1, base: rnd(tot / 0.94, d), fc: i > NOW_MONTH };
  });
  const mx = Math.max(...rows.map(r => Math.max(r.tot, r.base)));
  const step = niceStep(mx / 2.4);
  const max = Math.ceil((mx * 1.03) / (step / 2)) * (step / 2);
  const ticks: number[] = [];
  for (let v = 0; v <= max + 1e-9; v += step) ticks.push(rnd(v, 3));
  const fmt = (x: number) => (d ? x.toFixed(d) : nf.format(Math.round(x)));
  const kt = cfg.unit === 'kt';
  return {
    rows,
    max,
    ticks,
    fmt,
    now: rows[NOW_MONTH],
    unit: kt ? 'ktCO₂e' : 'tCO₂e',
    unitLabel: kt ? 'ktCO₂e this month' : 'tCO₂e this month',
    note: kt ? 'Illustrative values · kilotonnes of CO₂e' : 'Illustrative values · tonnes of CO₂e',
  };
}
