'use client';
import { useRef, useState, useCallback, CSSProperties } from 'react';

interface TiltOptions {
  max?: number;
  perspective?: number;
}

export function useTilt<T extends HTMLElement = HTMLDivElement>(opts: TiltOptions = {}) {
  const { max = 8, perspective = 800 } = opts;
  const ref = useRef<T>(null);
  const [style, setStyle] = useState<CSSProperties>({});
  const animRef = useRef<number | null>(null);

  const onMouseMove = useCallback((e: React.MouseEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotY = x * max * 2;
    const rotX = -y * max * 2;

    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(() => {
      setStyle({
        transform: `perspective(${perspective}px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`,
        transition: 'transform 80ms linear',
      });
    });
  }, [max, perspective]);

  const onMouseLeave = useCallback(() => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setStyle({
      transform: 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)',
      transition: 'transform 400ms cubic-bezier(0.16,1,0.3,1)',
    });
  }, []);

  return { ref, style, onMouseMove, onMouseLeave };
}
