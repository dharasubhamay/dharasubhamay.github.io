'use client';
import { useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { person } from '@/lib/data';
import { useMagnet } from '@/hooks/useMagnet';
import styles from './Footer.module.css';

function MagneticSocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  const { ref, style, onMouseMove, onMouseLeave } = useMagnet<HTMLAnchorElement>({ range: 50, strength: 0.4 });

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
      href={href}
      target={href.startsWith('mailto') ? undefined : '_blank'}
      rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
      className={styles.socialLink}
      aria-label={label}
      style={style}
    >
      {children}
    </motion.a>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className={styles.footer}>
      {/* Layered organic cloud/mountain cutout at the top of footer */}
      <div className={styles.wavesContainer} aria-hidden>
        {/* Back layer — footer wave 3 (slightly lighter footer tint) fills below its peaks */}
        <svg className={`${styles.wave} ${styles.wave3}`} viewBox="0 0 1440 260" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,60 C120,30 200,0 320,20 C400,34 480,15 600,0 C700,0 800,20 920,10 C1020,2 1140,40 1260,55 C1360,68 1410,72 1440,70 L1440,260 L0,260 Z" />
        </svg>
        {/* Mid layer */}
        <svg className={`${styles.wave} ${styles.wave2}`} viewBox="0 0 1440 260" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,100 C80,75 180,45 300,62 C400,76 500,52 640,38 C740,28 840,50 960,40 C1060,32 1160,58 1280,72 C1360,82 1410,88 1440,85 L1440,260 L0,260 Z" />
        </svg>
        {/* Front layer — same color as page background, creating the mountain silhouette effect */}
        <svg className={`${styles.wave} ${styles.wave1}`} viewBox="0 0 1440 260" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,0 L0,130 C100,108 220,82 360,98 C460,110 540,90 680,75 C780,64 880,86 1000,73 C1100,62 1200,86 1320,100 C1390,108 1420,114 1440,112 L1440,0 Z" />
        </svg>
      </div>
      <div className={styles.inner}>
        <div className={styles.left}>
          <a href="#" className={styles.logo} aria-label="Back to top">
            <Image src="/intro.png" alt="" width={40} height={40} className={styles.logoImg} aria-hidden />
          </a>
          <p className={styles.copy}>
            &copy; {year} {person.name}. Designed &amp; built with care.
          </p>
        </div>

        <nav className={styles.links} aria-label="Footer navigation">
          <a href="#about" className={styles.link}>About</a>
          <a href="#perspective" className={styles.link}>Perspective</a>
          <a href="#experience" className={styles.link}>Experience</a>
          <a href="#projects" className={styles.link}>Projects</a>
          <a href="#skills" className={styles.link}>Skills</a>
          <a href="#contact" className={styles.link}>Contact</a>
        </nav>

        <div className={styles.social}>
          <MagneticSocialLink href={person.github} label="GitHub">
            <GithubIcon />
          </MagneticSocialLink>
          <MagneticSocialLink href={person.linkedin} label="LinkedIn">
            <LinkedinIcon />
          </MagneticSocialLink>
          <MagneticSocialLink href={`mailto:${person.email}`} label="Email">
            <MailIcon />
          </MagneticSocialLink>
        </div>
      </div>
    </footer>
  );
}

function GithubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.37c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.88-1.17-.88-1.17-.72-.49.06-.48.06-.48.8.06 1.22.82 1.22.82.71 1.22 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82a7.6 7.6 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M0 1.15C0 .516.53 0 1.182 0h13.636C15.47 0 16 .516 16 1.15v13.7c0 .635-.53 1.15-1.182 1.15H1.182C.53 16 0 15.485 0 14.85V1.15zM4.943 13.394V6.169H2.542v7.225h2.401zm-1.2-8.21c.836 0 1.358-.554 1.358-1.247-.015-.708-.522-1.247-1.341-1.247-.82 0-1.358.54-1.358 1.247 0 .693.522 1.247 1.326 1.247h.015zM8.651 13.394V9.378c0-.216.015-.432.079-.586.173-.432.567-.88 1.228-.88.866 0 1.213.66 1.213 1.628v3.854h2.401V9.254c0-2.22-1.185-3.252-2.764-3.252-1.295 0-1.864.717-2.182 1.207h.016v-1.04H6.24c.031.678 0 7.225 0 7.225h2.41z"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="1" y="3" width="14" height="10" rx="2"/>
      <path d="M1 5l7 5 7-5" strokeLinecap="round"/>
    </svg>
  );
}
