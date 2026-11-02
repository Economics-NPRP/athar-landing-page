import { motion } from 'motion/react';
import { SPARK_CO2, SPARK_PM, STATUS_COLOR, isPm, status, type SegId } from '../../content/platform';
import { EASE_OUT, VIEWPORT } from '../motion/presets';

const W = 240;
const H = 38;

/** Today's curve for one zone, rescaled so it ends at the live value. Draws itself on view. */
export function Sparkline({ seg, current }: { seg: SegId; current: number }) {
  const pm = isPm(seg);
  const base = pm ? SPARK_PM : SPARK_CO2;
  const last = base[base.length - 1];
  const data = base.map((v, i) => {
    const k = i / (base.length - 1);
    return v * (1 - k) + v * (current / last) * k;
  });
  data[data.length - 1] = current;

  const [lo, hi, limit] = pm ? [5, 50, 35] : [380, 1180, 1000];
  const n = data.length;
  const X = (i: number) => (i / (n - 1)) * (W - 6);
  const Y = (v: number) => H - 3 - ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * (H - 6);
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(v).toFixed(1)}`).join(' ');
  const area = `${line} L${X(n - 1).toFixed(1)} ${H - 1} L0 ${H - 1} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: 38, display: 'block', overflow: 'visible' }}>
      <line x1={0} x2={W - 6} y1={Y(limit)} y2={Y(limit)} stroke="var(--crit)" strokeDasharray="3 3" opacity={0.6} vectorEffect="non-scaling-stroke" />
      <path d={area} fill="var(--accent)" opacity={0.08} />
      <motion.path
        d={line}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={2}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.6, ease: EASE_OUT }}
      />
      <rect x={X(n - 1) - 4} y={Y(current) - 4} width={8} height={8} fill={STATUS_COLOR[status(seg, current)]} stroke="#fff" strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
