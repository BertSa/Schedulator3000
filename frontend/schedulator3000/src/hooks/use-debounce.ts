import { useEffect } from 'react';
import useTimeout from './use-timeout';

export default function useDebounce(callback: any, delay: number = 1000, dependencies: any[] = []) {
    const {reset, clear} = useTimeout(callback, delay);
    useEffect(reset, [...dependencies, reset]);
    useEffect(clear, [clear]);
}





