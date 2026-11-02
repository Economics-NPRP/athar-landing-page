import { useState } from 'react';
import { useInterval } from './useInterval';

const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Qatar' });

/** Current HH:MM in Doha, refreshed every 20 s. */
export function useDohaClock() {
  const [clock, setClock] = useState(() => fmt.format(new Date()));
  useInterval(() => setClock(fmt.format(new Date())), 20000);
  return clock;
}
