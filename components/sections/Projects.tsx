'use client';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { projects } from '@/lib/data';
import { useTilt } from '@/hooks/useTilt';
import styles from './Projects.module.css';

interface Project {
  title: string;
  summary: string;
  description: string;
  tags: string[];
  links: { label: string; href: string }[];
  featured: boolean;
  award?: string;
  impact?: string[];
}

export default function Projects() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const featured = projects.filter((p) => p.featured);
  const others   = projects.filter((p) => !p.featured);

  return (
    <section className={styles.section} id="projects" ref={ref}>
      <div className={styles.bg} aria-hidden>
        <div className={styles.bgBand} />
      </div>
      <div className={styles.inner}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">Work</p>
          <h2 className={styles.heading}>Things I&apos;ve shipped</h2>
          <p className={styles.subheading}>
            Enterprise integrations, automation frameworks, and full-stack products.
          </p>
        </motion.div>

        {/* Featured — editorial numbered cards */}
        <div className={styles.featuredList} style={others.length === 0 ? { marginBottom: 0 } : undefined}>
          {featured.map((project, i) => (
            <FeaturedCard key={project.title} project={project} index={i} inView={inView} />
          ))}
        </div>

        {/* Side projects — bento with tilt */}
        {others.length > 0 && (
          <>
            <motion.p
              className={styles.othersLabel}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Other projects
            </motion.p>
            <div className={styles.othersGrid}>
              {others.map((project, i) => (
                <SideCard key={project.title} project={project} index={i} inView={inView} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ project, index, inView }: { project: Project; index: number; inView: boolean }) {
  const ref = useRef(null);
  const cardInView = useInView(ref, { once: true, margin: '-5%' });
  const visible = inView || cardInView;

  return (
    <motion.article
      ref={ref}
      className={styles.featuredCard}
      initial={{ opacity: 0, x: 60 }}
      animate={visible ? { opacity: 1, x: 0 } : {}}
      transition={{ type: 'spring', stiffness: 180, damping: 22, delay: index * 0.15 }}
    >
      {/* Decorative number */}
      <span className={styles.featuredNum} aria-hidden>
        0{index + 1}
      </span>

      <div className={styles.featuredBody}>
        {project.award && (
          <span className={styles.awardBadge}>
            <TrophyIcon />
            {project.award}
          </span>
        )}
        <h3 className={styles.featuredTitle}>{project.title}</h3>
        <p className={styles.featuredSummary}>{project.summary}</p>
        <p className={styles.featuredDesc}>{project.description}</p>

        {project.impact && project.impact.length > 0 && (
          <ul className={styles.impact}>
            {project.impact.map((item) => (
              <li key={item} className={styles.impactItem}>
                <CheckIcon />
                {item}
              </li>
            ))}
          </ul>
        )}

        <div className={styles.cardBottom}>
          <div className={styles.tags}>
            {project.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardLink}
            >
              {link.label} <ArrowIcon />
            </a>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

const SIDE_COLORS = ['#4f7dff', '#ff6b6b', '#ffd166', '#819fff'];

function SideCard({ project, index, inView }: { project: Project; index: number; inView: boolean }) {
  const ref = useRef(null);
  const cardInView = useInView(ref, { once: true, margin: '-5%' });
  const visible = inView || cardInView;
  const { ref: tiltRef, style: tiltStyle, onMouseMove, onMouseLeave } = useTilt({ max: 6 });
  const color = SIDE_COLORS[index % SIDE_COLORS.length];

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 + index * 0.08 }}
    >
      <div
        ref={tiltRef as React.RefObject<HTMLDivElement>}
        className={styles.sideCard}
        style={{ ...tiltStyle, '--card-accent': color } as React.CSSProperties}
        onMouseMove={onMouseMove as unknown as React.MouseEventHandler<HTMLDivElement>}
        onMouseLeave={onMouseLeave}
      >
        <h3 className={styles.sideTitle}>{project.title}</h3>
        <p className={styles.sideDesc}>{project.summary}</p>
        <div className={styles.sideTags}>
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className={styles.sideTag}>{tag}</span>
          ))}
        </div>
        {project.links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.sideLink}
            aria-label={`${project.title} on ${l.label}`}
          >
            <ArrowIcon />
          </a>
        ))}
      </div>
    </motion.article>
  );
}

function TrophyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
      <path d="M2.5.5A.5.5 0 013 0h10a.5.5 0 01.5.5c0 1.73-.794 3.306-2 4.393V7a.5.5 0 01-.277.445L8 8.882l-3.223-2.437A.5.5 0 014.5 6V4.893C3.294 3.806 2.5 2.23 2.5.5zm5 6.526l2.5 1.89V4.5h-5v4.415l2.5-1.89zM5.5 14.5v-1h5v1h2a.5.5 0 010 1h-9a.5.5 0 010-1h2z"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="2,9 6,13 14,3"/>
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 13L13 3M7 3h6v6"/>
    </svg>
  );
}
