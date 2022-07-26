import { useEffect } from 'react';

export default function useOnMount(onMount: Function) {
  return useEffect(() => {
    onMount();
  }, []);
}
