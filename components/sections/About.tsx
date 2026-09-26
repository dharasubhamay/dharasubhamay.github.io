'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { person, achievements } from '@/lib/data';
import { useTilt } from '@/hooks/useTilt';
import styles from './About.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-15%' });
  const { ref: tiltRef, style: tiltStyle, onMouseMove, onMouseLeave } = useTilt<HTMLDivElement>({ max: 6 });

  return (
    <section className={styles.section} id="about" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.left}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={{ show: { transition: { staggerChildren: 0.12 } } }}
        >
          <motion.p className="section-label" variants={fadeUp}>About me</motion.p>
          <motion.h2 className={styles.heading} variants={fadeUp}>
            Engineer by trade,<br />
            <em className={styles.headingItalic}>curious by nature</em>
          </motion.h2>
          <motion.p className={styles.body} variants={fadeUp}>{person.bio}</motion.p>
          <motion.p className={styles.body} variants={fadeUp}>{person.bioExtended}</motion.p>

          <motion.div className={styles.meta} variants={fadeUp}>
            <div className={styles.metaItem}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M8 1.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zM.5 8a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" fill="currentColor"/>
              </svg>
              {person.location}
            </div>
            <div className={styles.metaItem}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M2 2.5A1.5 1.5 0 013.5 1h9A1.5 1.5 0 0114 2.5v11a.5.5 0 01-.8.4L8 10.13l-5.2 3.77A.5.5 0 012 13.5v-11z" fill="currentColor"/>
              </svg>
              Open to opportunities
            </div>
          </motion.div>

          <motion.div className={styles.links} variants={fadeUp}>
            <a href={person.github} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <GithubIcon /> GitHub
            </a>
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
              <LinkedinIcon /> LinkedIn
            </a>
            <a href={`mailto:${person.email}`} className={styles.socialLink}>
              <MailIcon /> Email
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.right}
          initial={{ opacity: 0, x: 40 }}
          animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <div
            ref={tiltRef}
            className={styles.card}
            style={tiltStyle}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
          >
            <p className={styles.cardLabel}>
              <span className={styles.cardDot} />
              Highlights
            </p>
            <ul className={styles.highlightList}>
              {achievements.map((a) => (
                <li key={`${a.year}-${a.title}`} className={styles.highlight}>
                  <span className={styles.highlightYear}>{a.year}</span>
                  <div className={styles.highlightContent}>
                    <span className={styles.highlightTitle}>{a.title}</span>
                    <span className={styles.highlightOrg}>{a.org}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.languageCard}>
            <p className={styles.cardLabel}>
              <span className={styles.cardDot} style={{ background: 'var(--coral)' }} />
              Languages I speak
            </p>
            <div className={styles.languages}>
              {['English', 'Hindi', 'Bengali'].map((lang) => (
                <span key={lang} className={styles.langTag}>{lang}</span>
              ))}
            </div>
          </div>

          <div className={styles.decorBlock} aria-hidden>
            <span className={styles.decorNum}>9.52</span>
            <span className={styles.decorLabel}>CGPA · B.Tech CSE</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GithubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38v-1.37c-2.23.48-2.7-1.07-2.7-1.07-.36-.92-.88-1.17-.88-1.17-.72-.49.06-.48.06-.48.8.06 1.22.82 1.22.82.71 1.22 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.22 2.2.82a7.6 7.6 0 012-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.19c0 .21.15.46.55.38A8.01 8.01 0 0016 8c0-4.42-3.58-8-8-8z"/>
    </svg>
  );
}
function LinkedinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M0 1.15C0 .516.53 0 1.182 0h13.636C15.47 0 16 .516 16 1.15v13.7c0 .635-.53 1.15-1.182 1.15H1.182C.53 16 0 15.485 0 14.85V1.15zM4.943 13.394V6.169H2.542v7.225h2.401zm-1.2-8.21c.836 0 1.358-.554 1.358-1.247-.015-.708-.522-1.247-1.341-1.247-.82 0-1.358.54-1.358 1.247 0 .693.522 1.247 1.326 1.247h.015zM8.651 13.394V9.378c0-.216.015-.432.079-.586.173-.432.567-.88 1.228-.88.866 0 1.213.66 1.213 1.628v3.854h2.401V9.254c0-2.22-1.185-3.252-2.764-3.252-1.295 0-1.864.717-2.182 1.207h.016v-1.04H6.24c.031.678 0 7.225 0 7.225h2.41z"/>
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <rect x="1" y="3" width="14" height="10" rx="2"/>
      <path d="M1 5l7 5 7-5" strokeLinecap="round"/>
    </svg>
  );
}
