/* Smart Sustainability Solutions: page copy and section content (EN). */
import type { IconName } from './icons';

export const DASHBOARD_URL = 'https://sustainability.ets-gcc.org/spa';
export const CONTACT_EMAIL = 'admin@ecodesign.global';

export const NAV_ITEMS = [
  { href: '#scales', label: 'Every scale' },
  { href: '#walkthrough', label: 'Walkthrough' },
  { href: '#how', label: 'How it works' },
  { href: '#platform', label: 'Platform' },
  { href: '#aidc', label: 'AI data center' },
  { href: '#roadmap', label: 'Roadmap' },
  { href: '#contact', label: 'Contact' },
];

export const HERO_STATS = [
  { v: '9', l: 'scales on one platform, from a villa to the country' },
  { v: '1', l: 'data model, dashboard and report format for all of them' },
  { v: '<2 min', l: 'from sensor to screen' },
  { v: '100%', l: 'of the data stored and processed in Qatar', accent: true },
];

export const STATS = [
  { v: '42', u: 'MtCO₂e', l: 'of greenhouse-gas reductions Qatar targets by 2040', src: 'Qatar NDC 3.0 · UNFCCC, November 2025', href: 'https://unfccc.int/sites/default/files/2025-11/Qatar%20NDC%203.0.pdf' },
  { v: '25%', u: '', l: 'national target for cutting greenhouse-gas emissions', src: 'Third National Development Strategy · 2024–2030' },
  { v: '37%', u: '', l: 'of global operational energy and process-related CO₂ emissions came from buildings in 2022', src: 'UNEP Global Status Report for Buildings and Construction', href: 'https://www.unep.org/resources/report/global-status-report-buildings-and-construction' },
  { v: '32.1', u: '°C WBGT', l: 'heat-stress level at which outdoor work must stop in Qatar', src: 'Ministerial Decision No. 17 of 2021' },
];

export type ScaleId = 'villa' | 'building' | 'industrial' | 'educational' | 'commercial' | 'campus' | 'city' | 'country' | 'datacenter';

export type Scale = { id: ScaleId; n: string; t: string; p: string; m: string; g: string; place: string; ai?: boolean };

export const SCALES: Scale[] = [
  { id: 'villa', n: '01', t: 'Villa', p: 'Room-by-room comfort, air-conditioning load, rooftop solar and water for one family.', m: 'CO₂, temperature and humidity, electricity and solar, water', g: 'Comfort alerts, air-conditioning savings, a monthly carbon statement', place: 'Courtyard villa · Al Waab' },
  { id: 'building', n: '02', t: 'Administration building', p: 'Floor-by-floor air and ventilation, chiller-plant energy and rooftop heat for a ministry or a head office.', m: 'CO₂ and particulates, chiller energy, rooftop WBGT', g: 'Ventilation alerts, energy baselines, a quarterly building report', place: 'Lattice tower · West Bay' },
  { id: 'industrial', n: '03', t: 'Industrial institution', p: 'Heat stress where people work outdoors, gas and dust where processes run, and metered emissions for every site.', m: 'WBGT, methane and PM10, process energy', g: 'Work-stop alerts, leak flags, Scope 1 and 2 for each site', place: 'LNG train · Ras Laffan' },
  { id: 'educational', n: '04', t: 'Educational institution', p: 'Classrooms, lecture halls, labs and libraries that breathe better, from schools to universities.', m: 'CO₂, PM2.5, VOC, temperature and humidity', g: 'Ventilation alerts, lobby displays, open data for teaching', place: 'University quarter · Al Rayyan' },
  { id: 'commercial', n: '05', t: 'Commercial institution', p: 'Malls, hotels and offices, measured tenant by tenant and floor by floor.', m: 'PM2.5, car-park CO, chiller energy, solar', g: 'Tenant carbon reports, car-park alerts, energy savings', place: 'Domed mall and hotel · Lusail' },
  { id: 'campus', n: '06', t: 'Campus and compounds', p: 'Many buildings on one data model, from a university campus to a residential compound.', m: 'Indoor air, outdoor heat, energy and water', g: 'A building league table, a digital twin, a roll-up report', place: 'Residential compound and mosque' },
  { id: 'city', n: '07', t: 'Whole city', p: 'Districts, public buildings and campuses joined into one city network.', m: 'Street-level air, heat, energy', g: 'District dashboards, heat-risk maps, a city carbon account', place: 'Doha · West Bay and the Corniche' },
  { id: 'country', n: '08', t: 'Full country', p: 'Municipal networks and industrial cities reporting to one national standard.', m: 'Municipal networks, industrial cities, utilities', g: 'A measured national inventory, NDC tracking, heat-health alerts', place: 'Qatar · eight municipalities' },
  { id: 'datacenter', n: '09', t: 'Sovereign AI data center', p: 'Every reading from every scale, stored, modelled and verified in Qatar.', m: 'Calibration, fault detection, heat nowcasts, baselines, MRV and scenarios', g: 'Hosted in Qatar, owned by the data owners, no personal data', place: 'Solar-fed data hall · inland desert', ai: true },
];

const CHAPTER_ROWS: [number, string, string, string][] = [
  [0, 'Context', 'Smart Sustainability Solutions', 'One platform for every villa, building, institution, campus, city and the whole country, run from a sovereign AI data center.'],
  [7.82, 'Context', 'Why now', "Buildings run 24/7 but their audits don't: 37% of energy-related CO₂, a 42 MtCO₂e national target and a 32.1 °C heat-stress limit."],
  [19.7, 'Context', 'One platform, every scale', 'The same sensors, data model and reports, from a single villa to the whole country.'],
  [29.2, 'Scale', 'Villa', 'Room-by-room comfort, air-conditioning load, rooftop solar and a monthly carbon statement for one family.'],
  [38.71, 'Scale', 'Administration building', 'Floor-by-floor air quality, chiller-plant energy, rooftop heat stress and a quarterly building report.'],
  [48.21, 'Scale', 'Industrial institution', 'Heat-stress alerts in the yard, gas and dust screening, and metered Scope 1 and 2 for every site.'],
  [57.72, 'Scale', 'Educational institution', 'Lecture halls, study spaces and labs stream CO₂, particulates, VOC, temperature and humidity every minute.'],
  [67.22, 'Scale', 'Commercial institution', 'Food-court air, car-park CO, chiller energy and solar canopies, with carbon allocated to every tenant.'],
  [76.73, 'Scale', 'Campus and compounds', 'Many buildings on one data model, compared side by side, with a report for every building.'],
  [86.23, 'Scale', 'Whole city', 'Districts, public buildings and campuses join one city network through open interfaces.'],
  [95.74, 'Scale', 'Full country', 'Municipal networks and industrial cities report to one national standard.'],
  [105.24, 'Sovereign AI', 'Sovereign AI data center', 'Every reading is stored, modelled and verified in Qatar, on infrastructure the data owners control.'],
  [119.5, 'Platform', 'How it works', 'Sense, connect, validate, account and report, in one evidence chain at every scale.'],
  [129, 'Platform', 'A carbon footprint every month', 'Metered energy and documented emission factors become a monthly Scope 1 and 2 footprint, with continuous MRV.'],
];

const pad2 = (i: number) => String(i).padStart(2, '0');

export const CHAPTERS = CHAPTER_ROWS.map(([t, grp, title, sum], i) => ({
  t,
  grp,
  title,
  sum,
  n: pad2(i + 1),
  /** Extensionless: rendered through <Picture> as AVIF with a JPEG fallback. */
  img: `/media/chapters/ch${pad2(i + 1)}`,
}));

export const VIDEO = { src: '/media/sss-walkthrough.mp4', poster: '/media/walkthrough-poster', length: '2:28' };

type Card = { icon: IconName; t: string; p: string };

export const HOW: (Card & { n: string })[] = [
  { n: '01', icon: 'sense', t: 'Sense', p: 'Calibrated nodes inside, outside and around each site measure air, gases and heat every minute. The sensors are designed, built and operated by our sensing partner, Agrobotic.' },
  { n: '02', icon: 'connect', t: 'Connect', p: "Indoor nodes use the site's Wi-Fi. Outdoor nodes reach LoRaWAN gateways wired to the local network, so most sites need no SIM cards and no telecom fees." },
  { n: '03', icon: 'validate', t: 'Validate', p: 'Every reading is checked against reference instruments, quality-flagged and hash-chained before it is stored.' },
  { n: '04', icon: 'account', t: 'Account', p: 'The EcoDesign platform joins sensor streams with building-management, meter and utility data, then applies documented emission factors to calculate Scope 1 and 2.' },
  { n: '05', icon: 'report', t: 'Report', p: 'Dashboards, lobby displays, quarterly and annual reports, and roll-ups for a campus, a city or the country, all owned by the data owner.' },
];

type Chip = { icon: IconName; t: string };

export const HOW_CHIPS: Chip[] = [
  { icon: 'pin', t: 'Hosted in Qatar' },
  { icon: 'api', t: 'Open MQTT, REST and NGSI-LD interfaces' },
  { icon: 'eyeoff', t: 'No personal data collected' },
  { icon: 'connect', t: 'Ready for the National Digital Twin and TASMU' },
];

export const AI: Card[] = [
  { icon: 'gauge', t: 'Calibration and drift', p: 'Every sensor is checked against reference instruments and its neighbours, and drift is corrected before a reading reaches a report.' },
  { icon: 'flask', t: 'Leak and fault detection', p: 'Gas, water and equipment anomalies are flagged within minutes, with the evidence attached.' },
  { icon: 'heat', t: 'Heat-stress nowcasts', p: 'WBGT forecasts for the next hours, street by street, so outdoor work and events can be planned safely.' },
  { icon: 'account', t: 'Energy and carbon baselines', p: 'Weather-normalised baselines for every site show whether a saving is real.' },
  { icon: 'report', t: 'MRV-ready reports', p: 'Measurement, reporting and verification packs traceable to every reading, ready for third-party review.' },
  { icon: 'globe', t: 'Policy scenarios', p: 'What-if analysis for cities and the nation: retrofits, cooling, solar and heat-health measures.' },
];

export const AI_CHIPS: Chip[] = [
  { icon: 'pin', t: 'Hosted in Qatar' },
  { icon: 'lock', t: 'Owned by the data owners' },
  { icon: 'eyeoff', t: 'No personal data' },
  { icon: 'api', t: 'Open MQTT, REST and NGSI-LD interfaces' },
  { icon: 'hash', t: 'Audit-ready, hash-chained records' },
];

export const STANDARDS = ['GHG Protocol', 'ISO 14064-1', 'ISO 7243 (WBGT)', 'WHO 2021 air quality guidelines', 'GSAS evidence', 'IPMVP', 'GRI and IFRS S1/S2 disclosure'];

export const PRINCIPLES: Card[] = [
  { icon: 'pin', t: 'Hosted in Qatar', p: 'Data is stored and processed only in Qatar, in the sovereign AI data center for sustainability.' },
  { icon: 'lock', t: 'Owned by the data owner', p: 'Sensor data, footprints and reports belong to the household, institution or authority that generates them. EcoDesign hosts and processes them only on its behalf.' },
  { icon: 'consent', t: 'Nothing shared without consent', p: "No data is shared, sold or reused without the owner's written consent." },
  { icon: 'api', t: 'Open interfaces, full export', p: 'MQTT, REST and NGSI-LD interfaces let every owner export everything at any time and connect to the National Digital Twin or TASMU.' },
  { icon: 'eyeoff', t: 'No personal data', p: 'No cameras, microphones or device tracking. Occupancy is inferred from CO₂ at room level only.' },
  { icon: 'hash', t: 'Audit-ready', p: 'Calibrated readings, hash-chained records and versioned emission factors let anyone recompute and verify every figure.' },
];

export const LEVELS: { n: string; t: string; p: string; u: string; icon: IconName; ai?: boolean }[] = [
  { n: 'Level 1', t: 'Villas and buildings', p: 'Live air, gas and heat in every room or zone, a monthly footprint and a report.', u: 'one site · one report', icon: 'home' },
  { n: 'Level 2', t: 'Institutions', p: 'Industrial, educational and commercial institutions, every building rolled up for leadership and disclosure.', u: 'every building · one view', icon: 'building' },
  { n: 'Level 3', t: 'Campuses and compounds', p: 'Many buildings on one data model and one digital twin, compared side by side.', u: 'shared reports · benchmarks', icon: 'building' },
  { n: 'Level 4', t: 'Whole city', p: 'Districts, public buildings and campuses report as one city network.', u: 'district dashboards · heat maps', icon: 'skyline' },
  { n: 'Level 5', t: 'Full country', p: "A continuous national evidence base for Qatar's climate commitments.", u: 'one national standard', icon: 'map' },
  { n: 'Level 6', t: 'Sovereign AI data center', p: 'Models that calibrate, forecast and verify across every scale, hosted and owned in Qatar.', u: 'owned and operated in Qatar', icon: 'server', ai: true },
];

export const FAQ: [string, string][] = [
  ['Is it only for large institutions?', 'No. A single villa needs a handful of nodes and a meter connection. An institution, a city or the country uses the same kit at a larger scale, on the same platform and with the same reports.'],
  ['Who owns the data?', "Whoever hosts the sensors: a household, an institution, a city or a national authority. EcoDesign hosts and processes the data in Qatar on the owner's behalf and hands over a complete copy whenever asked."],
  ['What does the sovereign AI data center do?', 'It stores every reading in Qatar and runs the AI services on top of it: sensor calibration and drift correction, leak and fault detection, heat-stress nowcasts, weather-normalised baselines, MRV-ready reports and policy scenarios.'],
  ['Does the system collect personal data?', 'No. There are no cameras, microphones or device tracking. Dashboards and reports show rooms, zones, buildings and districts, never people.'],
  ['Does it replace GSAS or LEED certification?', 'No. It adds continuous, measured operating evidence that complements existing certificates and supports GSAS operations submissions.'],
  ['Are the gas channels safety detectors?', 'No. The methane and formaldehyde channels are research instruments. They complement certified gas-safety detectors and never replace them.'],
  ['Can it connect to our existing systems?', 'Yes. The platform reads building-management, meter and utility data and offers open MQTT, REST and NGSI-LD interfaces, so you can export everything or connect other platforms, including the National Digital Twin and TASMU.'],
];

export const AUDIENCE_WORDS = ['villa', 'ministry', 'industrial site', 'university', 'school', 'mall', 'hotel', 'office tower', 'campus', 'compound', 'municipality', 'city'];

export const SITE_TYPES = ['Villa', 'Administration building', 'Industrial institution', 'Educational institution', 'Commercial institution', 'Campus or compound', 'City or district', 'National programme', 'Sovereign AI data center'];

export const INTERESTS = ['Hosting a pilot', 'A leadership or policy briefing', 'Research collaboration', 'A platform demo'];
