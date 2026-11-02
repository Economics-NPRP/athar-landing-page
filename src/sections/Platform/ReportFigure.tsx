import { AnimatePresence, motion } from 'motion/react';
import { FLAGS, KPI_LABELS, SEGS, type SegId } from '../../content/platform';
import { Icon } from '../../components/ui/Icon';
import { EASE_OUT } from '../../components/motion/presets';
import styles from './Platform.module.css';

/** Report cover card; KPIs cross-fade when the scale changes. */
export function ReportFigure({ seg }: { seg: SegId }) {
  const cfg = SEGS[seg];
  return (
    <figure className="figure-card">
      <div className={styles.reportHead}>
        <div>
          <p className={styles.figTitle} style={{ color: '#fff' }}>
            {cfg.report}
          </p>
          <p className={styles.figSub} style={{ color: 'var(--on-pine-2)' }}>
            Q3 2027 (illustrative) · prepared by EcoDesign · hosted in Qatar
          </p>
        </div>
        <Icon name="report" size={22} color="var(--mint)" />
      </div>
      <div className={styles.reportBody}>
        <AnimatePresence mode="wait">
          <motion.div
            key={seg}
            className={styles.kpis}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            {cfg.kpis.map(([v, note, flag], i) => {
              const f = FLAGS[flag];
              return (
                <div key={KPI_LABELS[i]} className={styles.kpi}>
                  <div className={styles.kpiHead}>
                    <span>{KPI_LABELS[i]}</span>
                    <span className={styles.flag} style={{ color: f.good ? 'var(--flag-good)' : 'var(--flag-warn)' }}>
                      <Icon name={f.good ? 'st-good' : 'st-warn'} solid size={8} />
                      {f.label}
                    </span>
                  </div>
                  <span className={styles.kpiValue}>{v}</span>
                  <span className={styles.kpiNote}>{note}</span>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
        <ul className={styles.reportList}>
          <li>Energy and carbon from metered electricity, chilled water and fuel, Scope 1 and 2</li>
          <li>Air quality by zone, ventilation effectiveness and heat stress outdoors</li>
          <li>GSAS evidence, ranked actions and data assurance</li>
        </ul>
        <p className={styles.assurance}>
          <b>Data assurance</b>
          <span>completeness 97%</span>
          <span>calibration current</span>
          <span>audit log verified</span>
        </p>
      </div>
    </figure>
  );
}
