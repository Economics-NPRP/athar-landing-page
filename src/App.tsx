import { useCallback, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { Preloader } from './components/layout/Preloader';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { Cursor } from './components/layout/Cursor';
import { Nav } from './components/layout/Nav';
import { Hero } from './sections/Hero/Hero';

export function App() {
  const [ready, setReady] = useState(false);
  const onLoaded = useCallback(() => setReady(true), []);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>{!ready && <Preloader key="preloader" onDone={onLoaded} />}</AnimatePresence>
      <SmoothScroll paused={!ready} />
      <ScrollProgress />
      <Cursor />
      <Nav show={ready} />
      <Hero ready={ready} />
      <main />
    </MotionConfig>
  );
}
