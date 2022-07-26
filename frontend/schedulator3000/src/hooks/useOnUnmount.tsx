import { useEffect } from 'react';

export default function useOnUnmount(onUnmount: Function) {
  return useEffect(() => () => onUnmount && onUnmount(), []);
}
