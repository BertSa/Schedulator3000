import { useEffect, useRef } from 'react';

export default function useUpdateEffectOnlyOnce(callback:any, dependencies:any[]) {
  const firstRenderRef = useRef(true);
  const alreadyUpdatedRef = useRef(false);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (alreadyUpdatedRef.current) {
      return;
    }
    alreadyUpdatedRef.current = true;
    callback();
  }, dependencies);
}
