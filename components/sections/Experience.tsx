'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { experience } from '@/lib/data';
import styles from './Experience.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

export default function Experience() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section className={styles.section} id="experience" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p className="section-label" variants={fadeUp}>Career</motion.p>
          <motion.h2 className={styles.heading} variants={fadeUp}>
            Where I&apos;ve worked
          </motion.h2>
          <motion.p className={styles.subheading} variants={fadeUp}>
            Building production systems and solving real engineering problems.
          </motion.p>
        </motion.div>

        <div className={styles.timeline}>
          {experience.map((role, i) => (
            <ExperienceCard key={role.company + role.from} role={role} index={i} parentInView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Role {
  company: string;
  role: string;
  type: string;
  from: string;
  to: string;
  location: string;
  summary: string;
  bullets: string[];
  tags: string[];
}

function ExperienceCard({ role, index, parentInView }: { role: Role; index: number; parentInView: boolean }) {
  const ref = useRef(null);
  const lineRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });
  const lineInView = useInView(lineRef, { once: true, margin: '-5%' });
  const visible = parentInView || inView;

  const xDir = index % 2 === 0 ? -40 : 40;

  return (
    <motion.article
      ref={ref}
      className={styles.card}
      initial={{ opacity: 0, x: xDir }}
      animate={visible ? { opacity: 1, x: 0 } : { opacity: 0, x: xDir }}
      transition={{ type: 'spring', stiffness: 200, damping: 20, delay: index * 0.12 }}
    >
      <div className={styles.timelineDot} aria-hidden>
        <span className={styles.dot} />
        {index < experience.length - 1 && (
          <motion.span
            ref={lineRef}
            className={styles.line}
            initial={{ scaleY: 0 }}
            animate={lineInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          />
        )}
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardTop}>
          <div className={styles.roleInfo}>
            <span className={styles.roleType}>{role.type}</span>
            <h3 className={styles.roleName}>{role.role}</h3>
            <p className={styles.company}>
              {role.company}
              <span className={styles.location}> · {role.location}</span>
            </p>
          </div>
          <div className={styles.period}>
            <span className={styles.periodBadge}>
              {role.from} — {role.to}
            </span>
          </div>
        </div>

        <p className={styles.summary}>{role.summary}</p>

        <ul className={styles.bullets}>
          {role.bullets.map((b) => (
            <li key={b} className={styles.bullet}>
              <span className={styles.bulletDot} aria-hidden />
              {b}
            </li>
          ))}
        </ul>

        <div className={styles.tags}>
          {role.tags.map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
