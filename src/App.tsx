import { useCallback, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'motion/react';
import { Preloader } from './components/layout/Preloader';
import { SmoothScroll } from './components/layout/SmoothScroll';
import { ScrollProgress } from './components/layout/ScrollProgress';
import { Cursor } from './components/layout/Cursor';
import { Nav } from './components/layout/Nav';
import { Footer } from './components/layout/Footer';
import { Hero } from './sections/Hero/Hero';
import { Ticker } from './sections/Ticker/Ticker';
import { Why } from './sections/Why/Why';
import { Scales } from './sections/Scales/Scales';
import { Walkthrough } from './sections/Walkthrough/Walkthrough';
import { How } from './sections/How/How';
import { Platform } from './sections/Platform/Platform';
import { AiDataCenter } from './sections/AiDataCenter/AiDataCenter';
import { Trust } from './sections/Trust/Trust';
import { Roadmap } from './sections/Roadmap/Roadmap';
import { Faq } from './sections/Faq/Faq';
import { Contact } from './sections/Contact/Contact';

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
      <Ticker />
      <main>
        <Why />
        <Scales />
        <Walkthrough />
        <How />
        <Platform />
        <AiDataCenter />
        <Trust />
        <Roadmap />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </MotionConfig>
  );
}
