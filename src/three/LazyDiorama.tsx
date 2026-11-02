import { lazy, Suspense, type ComponentProps } from 'react';

// three.js is the bulk of the bundle; load it in its own chunk after first paint.
const Diorama = lazy(() => import('./Diorama').then(m => ({ default: m.Diorama })));

export function LazyDiorama(props: ComponentProps<typeof Diorama>) {
  return (
    <Suspense fallback={null}>
      <Diorama {...props} />
    </Suspense>
  );
}
