'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useCallback } from 'react';
import { skills } from '@/lib/data';
import styles from './Skills.module.css';

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const categoryColors: Record<string, string> = {
  'Salesforce Platform': 'var(--accent)',
  'Languages':           'var(--teal)',
  'Frontend':            'var(--amber)',
  'Backend & APIs':      'var(--accent-light)',
  'Testing & DevOps':    'var(--teal)',
  'Databases':           'var(--amber)',
};

export default function Skills() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section className={styles.section} id="skills" ref={ref}>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          variants={{ show: { transition: { staggerChildren: 0.1 } } }}
        >
          <motion.p className="section-label" variants={fadeUp}>Toolkit</motion.p>
          <motion.h2 className={styles.heading} variants={fadeUp}>
            Technologies I work with
          </motion.h2>
          <motion.p className={styles.subheading} variants={fadeUp}>
            Organized by domain — not just an icon wall.
          </motion.p>
        </motion.div>

        <div className={styles.grid}>
          {skills.map((category, i) => {
            const color = categoryColors[category.category] ?? 'var(--accent)';
            return (
              <SkillCard
                key={category.category}
                category={category}
                color={color}
                index={i}
                parentInView={inView}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

interface SkillCategory {
  category: string;
  items: string[];
}

function SkillCard({
  category,
  color,
  index,
  parentInView,
}: {
  category: SkillCategory;
  color: string;
  index: number;
  parentInView: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5%' });
  const visible = parentInView || inView;
  const isPrimary = index === 0;

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty('--mouse-x', `${x}%`);
    el.style.setProperty('--mouse-y', `${y}%`);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`${styles.card} ${isPrimary ? styles.primary : ''}`}
      style={{ '--card-color': color } as React.CSSProperties}
      initial={{ opacity: 0, y: 32 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: (index % 3) * 0.1 }}
      onMouseMove={onMouseMove}
    >
      <div className={styles.cardHeader}>
        <span className={styles.dot} style={{ background: color }} />
        <h3 className={styles.categoryName}>{category.category}</h3>
      </div>
      <div className={styles.items}>
        {category.items.map((item) => (
          <span key={item} className={styles.item}>{item}</span>
        ))}
      </div>
    </motion.div>
  );
}
