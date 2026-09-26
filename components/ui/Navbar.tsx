'use client';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useScrolled } from '@/hooks/useScrolled';
import { useMagnet } from '@/hooks/useMagnet';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

const links = [
  { label: 'About', href: '#about' },
  { label: 'Perspective', href: '#perspective' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

function MagneticCta() {
  const { ref, style, onMouseMove, onMouseLeave } = useMagnet<HTMLAnchorElement>({ range: 70, strength: 0.35 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [ref, onMouseMove, onMouseLeave]);

  return (
    <motion.a
      ref={ref}
      href="mailto:subhamaydhara86@gmail.com"
      className={styles.cta}
      style={style}
    >
      Hire me
    </motion.a>
  );
}

export default function Navbar() {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    links.forEach(({ href }) => {
      const el = document.querySelector(href);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <motion.header
        className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className={styles.inner}>
          <a href="#" className={styles.logo} aria-label="Subhamay Dhara — Home">
            <Image src="/intro.png" alt="" width={40} height={40} className={styles.logoImg} aria-hidden priority loading="eager" />
          </a>

          <nav className={styles.nav} aria-label="Primary navigation">
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className={`${styles.link} ${active === href.slice(1) ? styles.linkActive : ''}`}
              >
                {label}
                <span className={styles.linkUnderline} aria-hidden />
              </a>
            ))}
          </nav>

          <MagneticCta />

          <ThemeToggle />

          <button
            className={styles.menuBtn}
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span className={`${styles.bar} ${open ? styles.barTopOpen : ''}`} />
            <span className={`${styles.bar} ${open ? styles.barMidOpen : ''}`} />
            <span className={`${styles.bar} ${open ? styles.barBotOpen : ''}`} />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className={styles.drawer}
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav className={styles.drawerNav} aria-label="Mobile navigation">
              {links.map(({ label, href }, i) => (
                <motion.a
                  key={href}
                  href={href}
                  className={styles.drawerLink}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className={styles.drawerIndex}>0{i + 1}</span>
                  {label}
                </motion.a>
              ))}
              <motion.a
                href="mailto:subhamaydhara86@gmail.com"
                className={styles.drawerCta}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Hire me →
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
