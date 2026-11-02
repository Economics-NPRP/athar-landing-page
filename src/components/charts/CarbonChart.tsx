import { motion } from 'motion/react';
import { NOW_MONTH, nf, type carbon } from '../../content/platform';
import { EASE_OUT, VIEWPORT } from '../motion/presets';

type Carbon = ReturnType<typeof carbon>;

const G = { W: 360, H: 178, t: 14, r: 4, b: 22, l: 34, bw: 16 };
const PW = G.W - G.l - G.r;
const PH = G.H - G.t - G.b;
const SLOT = PW / 12;
const SERIES = [
  ['elec', 'var(--s-elec)'],
  ['chw', 'var(--s-chw)'],
  ['s1', 'var(--s-scope1)'],
] as const;

/** Horizontal centre of a month slot, as a % of the chart width (for the tooltip). */
export const slotX = (i: number) => ((G.l + SLOT * i + SLOT / 2) / G.W) * 100;

type CarbonChartProps = { data: Carbon; hi: number; onHover: (i: number) => void };

/** Stacked monthly bars (forecast months faded) with a dashed weather-normalised baseline. Bars grow on view. */
export function CarbonChart({ data, hi, onHover }: CarbonChartProps) {
  const cy = (v: number) => G.t + PH - (v / data.max) * PH;
  const baseline = data.rows.map((d, i) => `${(G.l + SLOT * i + SLOT / 2).toFixed(1)},${cy(d.base).toFixed(1)}`).join(' ');
  const nowX = G.l + SLOT * NOW_MONTH + SLOT / 2;

  return (
    <motion.svg
      viewBox={`0 0 ${G.W} ${G.H}`}
      style={{ width: '100%', height: 'auto', display: 'block', overflow: 'visible', fontFamily: 'var(--font-body)' }}
      onMouseLeave={() => onHover(-1)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {data.ticks.map(v => (
        <g key={v}>
          <line x1={G.l} x2={G.W - G.r} y1={cy(v)} y2={cy(v)} stroke={v === 0 ? 'var(--line-strong)' : 'var(--line-soft)'} />
          <text x={G.l - 6} y={cy(v) + 3} textAnchor="end" fontSize={9} fill="var(--ink-3)">
            {v % 1 ? v : nf.format(v)}
          </text>
        </g>
      ))}
      {data.rows.map((d, i) => {
        const x0 = G.l + SLOT * i;
        const x = x0 + (SLOT - G.bw) / 2;
        let cum = 0;
        return (
          <g key={d.m}>
            {i === hi && <rect x={x0} y={G.t} width={SLOT} height={PH} fill="var(--line-soft)" />}
            <motion.g
              opacity={d.fc ? 0.4 : 1}
              style={{ transformBox: 'fill-box', originY: 1 }}
              variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 0.9, ease: EASE_OUT, delay: i * 0.05 } } }}
            >
              {SERIES.map(([key, fill]) => {
                const v = d[key];
                const bottom = cy(cum) - (cum > 0 ? 1.5 : 0);
                const top = cy(cum + v);
                cum += v;
                return bottom - top > 0.4 ? <rect key={key} x={x} y={top} width={G.bw} height={bottom - top} fill={fill} /> : null;
              })}
            </motion.g>
            <rect x={x0} y={G.t} width={SLOT} height={PH + G.b} fill="transparent" style={{ cursor: 'pointer' }} onMouseEnter={() => onHover(i)} />
            <text
              x={x + G.bw / 2}
              y={G.H - 6}
              textAnchor="middle"
              fontSize={9}
              fontWeight={i === NOW_MONTH ? 700 : 400}
              fill={i === NOW_MONTH ? 'var(--pine)' : 'var(--ink-3)'}
              pointerEvents="none"
            >
              {d.m}
            </text>
          </g>
        );
      })}
      <motion.polyline
        points={baseline}
        fill="none"
        stroke="var(--ink-2)"
        strokeWidth={1.5}
        strokeDasharray="4 3"
        pointerEvents="none"
        variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { delay: 0.8, duration: 0.6 } } }}
      />
      <text
        x={nowX}
        y={Math.min(cy(data.now.tot), cy(data.now.base)) - 5}
        textAnchor="middle"
        fontSize={10}
        fontWeight={700}
        fill="var(--pine)"
        pointerEvents="none"
      >
        {data.fmt(data.now.tot)}
      </text>
    </motion.svg>
  );
}
