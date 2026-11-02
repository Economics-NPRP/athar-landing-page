import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { carbon, MONTHS_LONG, SEGS, type SegId } from '../../content/platform';
import { CarbonChart, slotX } from '../../components/charts/CarbonChart';
import { EASE_OUT } from '../../components/motion/presets';
import styles from './Platform.module.css';

const LEGEND = [
  ['var(--s-elec)', 'Electricity · Scope 2'],
  ['var(--s-chw)', 'Chilled water · Scope 2'],
  ['var(--s-scope1)', 'Fuel and refrigerant · Scope 1'],
];

/** Monthly footprint chart with hover tooltip, benchmarks and an accessible table view. */
export function CarbonFigure({ seg }: { seg: SegId }) {
  const cfg = SEGS[seg];
  const data = useMemo(() => carbon(seg), [seg]);
  const [hi, setHi] = useState(-1);
  const [table, setTable] = useState(false);
  const row = hi >= 0 ? data.rows[hi] : null;

  return (
    <figure className={`figure-card ${styles.figure}`}>
      <p className={styles.figTitle} style={{ marginBottom: 12 }}>
        EcoDesign carbon layer · monthly footprint
      </p>
      <div className={styles.carbonHead}>
        <p className={styles.carbonNow}>
          <b>{data.fmt(data.now.tot)}</b>
          <span>{data.unitLabel}</span>
        </p>
        <p className={styles.figSub}>{cfg.scope}</p>
      </div>
      <div className={styles.chartWrap}>
        <CarbonChart key={seg} data={data} hi={hi} onHover={setHi} />
        <AnimatePresence>
          {row && (
            <motion.div
              className={styles.tip}
              style={{ left: `${Math.max(18, Math.min(82, slotX(hi)))}%` }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
            >
              <div>
                {MONTHS_LONG[hi]}
                {row.fc && ' (forecast)'}
              </div>
              <div className={styles.tipTotal}>
                {data.fmt(row.tot)} {data.unit}
              </div>
              <TipRow color="var(--s-elec)" label="Electricity" value={data.fmt(row.elec)} />
              <TipRow color="var(--s-chw)" label="Chilled water" value={data.fmt(row.chw)} />
              <TipRow color="var(--s-scope1)" label="Fuel and refrigerant" value={data.fmt(row.s1)} />
              <TipRow label="Baseline" value={data.fmt(row.base)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <ul className={styles.legend} style={{ marginTop: 10 }}>
        {LEGEND.map(([c, t]) => (
          <li key={t}>
            <span className={styles.swatch} style={{ background: c }} />
            {t}
          </li>
        ))}
        <li>
          <span style={{ width: 16, borderTop: '2px dashed var(--ink-2)' }} />
          Weather-normalised baseline
        </li>
        <li>
          <span className={styles.swatch} style={{ background: 'var(--line)' }} />
          Forecast
        </li>
      </ul>
      <div className={styles.bench}>
        {cfg.bm.map(([k, v, i]) => (
          <div key={k}>
            <span>{k}</span>
            <b>{v}</b>
            <span>{i}</span>
          </div>
        ))}
      </div>
      <div className={styles.carbonFoot}>
        <span className={styles.figSub}>{data.note}</span>
        <button className="link-btn" onClick={() => setTable(t => !t)} aria-expanded={table}>
          {table ? 'Hide table' : 'View as table'}
        </button>
      </div>
      <AnimatePresence initial={false}>
        {table && (
          <motion.div className={styles.tableWrap} initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.45, ease: EASE_OUT }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Electricity</th>
                  <th>Chilled water</th>
                  <th>Fuel and refrigerant</th>
                  <th>Total</th>
                  <th>Baseline</th>
                </tr>
              </thead>
              <tbody>
                {data.rows.map(r => (
                  <tr key={r.m}>
                    <td>
                      {r.m}
                      {r.fc && ' (forecast)'}
                    </td>
                    <td>{data.fmt(r.elec)}</td>
                    <td>{data.fmt(r.chw)}</td>
                    <td>{data.fmt(r.s1)}</td>
                    <td className={styles.total}>{data.fmt(r.tot)}</td>
                    <td>{data.fmt(r.base)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </figure>
  );
}

function TipRow({ color, label, value }: { color?: string; label: string; value: string }) {
  return (
    <div className={styles.tipRow}>
      <span>
        {color && <i style={{ background: color }} />}
        {label}
      </span>
      <b>{value}</b>
    </div>
  );
}
