'use client';
import { useRef, useCallback } from 'react';
import { useSpring, useMotionValue, MotionStyle } from 'framer-motion';

interface MagnetOptions {
  range?: number;
  strength?: number;
}

export function useMagnet<T extends HTMLElement = HTMLButtonElement>(opts: MagnetOptions = {}) {
  const { range = 80, strength = 0.35 } = opts;
  const ref = useRef<T>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 300, damping: 24, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 24, mass: 0.5 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < range) {
      x.set(dx * strength);
      y.set(dy * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  }, [range, strength, x, y]);

  const onMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const style: MotionStyle = { x: springX, y: springY };

  return { ref, style, onMouseMove, onMouseLeave };
}
