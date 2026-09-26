'use client';
import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { person } from '@/lib/data';
import { useMagnet } from '@/hooks/useMagnet';
import styles from './Contact.module.css';

function LiveTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    function update() {
      const t = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(new Date());
      setTime(t);
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time}</span>;
}

function CopyEmailButton({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const { ref, style, onMouseMove, onMouseLeave } = useMagnet<HTMLButtonElement>({ range: 100, strength: 0.4 });

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [ref, onMouseMove, onMouseLeave]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: open mailto
      window.location.href = `mailto:${email}`;
    }
  }, [email]);

  return (
    <motion.button
      ref={ref}
      style={style}
      onClick={copy}
      className={styles.emailBtn}
      aria-label="Copy email address"
    >
      <span className={styles.emailText}>{email}</span>
      <motion.span
        key={copied ? 'check' : 'copy'}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 22 }}
        className={styles.emailIcon}
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </motion.span>
      {copied && (
        <motion.span
          className={styles.copiedLabel}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          Copied!
        </motion.span>
      )}
    </motion.button>
  );
}

export default function Contact() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section className={styles.section} id="contact" ref={ref}>
      <div className={styles.bg} aria-hidden>
        <div className={styles.bgBand} />
      </div>
      <div className={styles.inner}>
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, x: -32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="section-label">Contact</p>
          <h2 className={styles.heading}>
            Let&apos;s build<br />
            <em className={styles.headingAccent}>something.</em>
          </h2>
          <p className={styles.body}>
            Open to senior roles, consulting, and interesting engineering conversations.
            Whether it&apos;s enterprise Salesforce, integration architecture, or full-stack — reach out.
          </p>

          <div className={styles.timezone}>
            <span className={styles.tzDot} aria-hidden />
            <span className={styles.tzText}>Maharashtra, India · IST</span>
            <span className={styles.tzTime}><LiveTime /></span>
          </div>

          <div className={styles.socialLinks}>
            <a href={person.github} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
              <GithubIcon />
              <span>GitHub</span>
              <ArrowIcon />
            </a>
            <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
              <LinkedinIcon />
              <span>LinkedIn</span>
              <ArrowIcon />
            </a>
          </div>
        </motion.div>

        <motion.div
          className={styles.right}
          initial={{ opacity: 0, x: 32 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        >
          <p className={styles.emailLabel}>
            <span>Drop me a line</span>
            <span className={styles.emailHint}>click to copy</span>
          </p>
          <CopyEmailButton email={person.email} />
          <p className={styles.emailAlt}>
            Or <a href={`mailto:${person.email}`} className={styles.mailtoLink}>open in your mail client</a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

function CopyIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="4" y="4" width="9" height="9" rx="1.5"/>
      <path d="M3 11H2a1 1 0 01-1-1V2a1 1 0 011-1h8a1 1 0 011 1v1"/>
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="2,9 6,13 14,3"/>
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 13L13 3M7 3h6v6"/>
    </svg>
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
