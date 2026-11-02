import { Icon } from '../../components/ui/Icon';
import type { IconName } from '../../content/icons';
import { STATUS_COLOR, STATUS_ICON, type Status } from '../../content/platform';
import styles from './Platform.module.css';

type Reading = [Status, string, string];

const HEAT: Reading[] = [['good', 'Shaded garden', '30.0 °C'], ['warn', 'Sun-exposed paving', '31.6 °C'], ['crit', 'Industrial yard · alert', '32.4 °C']];
const GAS: Reading[] = [['good', 'Chemistry lab · CH₄', '2.10 ppm'], ['good', 'Chemistry lab · HCHO', '16 µg/m³'], ['warn', 'Compressor room · CH₄', '4.80 ppm']];
const DUST: Reading[] = [['warn', 'Reference anchor · PM2.5', '26 µg/m³'], ['warn', 'Street node · PM2.5', '22 µg/m³']];
const POLLUTANTS = ['PM2.5', 'PM10', 'NO₂', 'O₃', 'CO', 'CO₂'];

/** Heat, gas and dust sensor families with sample readings. */
export function SensorCards() {
  return (
    <div className={styles.sensors}>
      <Card icon="heat" title="Heat stress where people work and walk" readings={HEAT}>
        <p>
          HeatSense nodes compute the wet-bulb globe temperature on the device. Pairs contrast sun-exposed paving with shaded areas, and alerts
          fire as the 32.1 °C outdoor-work limit is reached.
        </p>
        <div>
          <div className={styles.heatScale}>
            <span />
          </div>
          <div className={styles.heatTicks}>
            <span>27</span>
            <span>29</span>
            <span>31</span>
            <span>33 °C</span>
          </div>
          <p className={styles.heatNote}>Dark line: the 32.1 °C outdoor-work limit</p>
        </div>
      </Card>
      <Card icon="flask" title="Gas screening in labs, kitchens and plants" readings={GAS}>
        <p>
          Dual-tier methane sensing (NDIR plus metal oxide) screens laboratories, kitchens, plant rooms and process areas for leaks, and
          laboratories add formaldehyde. These are research instruments that complement certified gas-safety detectors.
        </p>
      </Card>
      <Card icon="wind" title="Dust and outdoor air" readings={DUST}>
        <p>Outdoor nodes map particulates and gases across a site or a district. Reference anchors sit beside reference instruments and carry their calibration to every node.</p>
        <div className={styles.pollutants}>
          {POLLUTANTS.map(p => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Card({ icon, title, readings, children }: { icon: IconName; title: string; readings: Reading[]; children: React.ReactNode }) {
  return (
    <div className={`card ${styles.sensor}`}>
      <span className={styles.sensorIcon}>
        <Icon name={icon} size={22} />
      </span>
      <h3>{title}</h3>
      {children}
      <ul className={styles.readings}>
        {readings.map(([st, label, value]) => (
          <li key={label}>
            <span style={st === 'crit' ? { color: 'var(--crit-ink)' } : undefined}>
              <Icon name={STATUS_ICON[st]} solid={st !== 'crit'} size={10} color={st === 'crit' ? undefined : STATUS_COLOR[st]} />
              {label}
            </span>
            <b>{value}</b>
          </li>
        ))}
      </ul>
    </div>
  );
}
