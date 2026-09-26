'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { yearsOfExperience } from '@/lib/data';
import styles from './Sdlc.module.css';

const phases = [
  {
    id: '01',
    label: 'Leadership & Business',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    note: 'Business deals, requirements & strategic direction',
    highlight: false,
  },
  {
    id: '02',
    label: 'Product Ownership',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    note: 'MMF translation, backlog & customer-value alignment',
    highlight: false,
  },
  {
    id: '03',
    label: 'Agile Planning',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="4" width="18" height="18" rx="2"/>
        <path d="M16 2v4M8 2v4M3 10h18"/>
      </svg>
    ),
    note: 'Sprint planning, prioritization & on-time delivery',
    highlight: false,
  },
  {
    id: '04',
    label: 'Architecture & Design',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5"/>
        <line x1="12" y1="2" x2="12" y2="22"/>
        <line x1="2" y1="8.5" x2="22" y2="8.5"/>
        <line x1="2" y1="15.5" x2="22" y2="15.5"/>
      </svg>
    ),
    note: 'Scalable system design for performance & UX',
    highlight: false,
  },
  {
    id: '05',
    label: 'Development',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    ),
    note: 'Feature building, integrations & automation framework',
    highlight: true,
  },
  {
    id: '06',
    label: 'Testing & QA',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2h-4"/>
        <path d="M9 3a3 3 0 006 0M9 3h6"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    note: '~95% integration coverage via Puppeteer–Jest framework',
    highlight: true,
  },
  {
    id: '07',
    label: 'CI/CD & Deployment',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    note: '20+ production releases via GitLab CI/CD pipelines',
    highlight: true,
  },
  {
    id: '08',
    label: 'Customer Demo & Handover',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.15a16 16 0 006.29 6.29l1.42-1.42a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 15.17v1.75z"/>
      </svg>
    ),
    note: 'Live demos and formal product handovers to customers',
    highlight: false,
  },
  {
    id: '09',
    label: 'Customer Support',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    note: 'Resolved 9 production issues; closed the feedback loop',
    highlight: false,
  },
  {
    id: '10',
    label: 'Collaboration & Growth',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    note: '25+ cross-functional stakeholders; shared knowledge',
    highlight: false,
  },
];

export default function Sdlc() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  const row1 = phases.slice(0, 5);
  const row2 = phases.slice(5);

  return (
    <section className={styles.section} id="perspective" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">Perspective</p>
          <h2 className={styles.heading}>
            Beyond the code —{' '}
            <em className={styles.headingItalic}>the full picture</em>
          </h2>
          <p className={styles.subheading}>
            Software development is not just about writing code. Over {yearsOfExperience}+ years I actively engaged with every phase of the Software Development Life Cycle (SDLC) — learning from each role how technology, business, and people come together to ship value.
          </p>
        </motion.div>

        <div className={styles.pipeline}>
          {/* Row 1 */}
          <div className={styles.row}>
            {row1.map((phase, i) => (
              <PhaseCard key={phase.id} phase={phase} index={i} inView={inView} />
            ))}
          </div>

          {/* Connector between rows */}
          <motion.div
            className={styles.rowConnector}
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.rowConnectorArrow}>↓</span>
          </motion.div>

          {/* Row 2 — reversed to show the flow loops back left-to-right visually */}
          <div className={styles.row}>
            {row2.map((phase, i) => (
              <PhaseCard key={phase.id} phase={phase} index={i + 5} inView={inView} />
            ))}
          </div>
        </div>

        <motion.p
          className={styles.footer}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          Highlighted phases mark where I contributed directly. All others shaped how I think about building software.
        </motion.p>
      </div>
    </section>
  );
}

function PhaseCard({
  phase,
  index,
  inView,
}: {
  phase: (typeof phases)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.div
      className={`${styles.card} ${phase.highlight ? styles.cardHighlight : ''}`}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 22,
        delay: 0.1 + index * 0.08,
      }}
    >
      <div className={styles.cardTop}>
        <span className={styles.id}>{phase.id}</span>
        <span className={`${styles.iconWrap} ${phase.highlight ? styles.iconWrapHighlight : ''}`}>
          {phase.icon}
        </span>
      </div>
      <p className={styles.label}>{phase.label}</p>
      <p className={styles.note}>{phase.note}</p>
      {phase.highlight && <span className={styles.badge}>Primary</span>}
    </motion.div>
  );
}
