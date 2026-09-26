'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { person, yearsOfExperience } from '@/lib/data';
import styles from './Hero.module.css';

/* ── canvas node physics ─────────────────────────────────────────────── */
interface Node { x: number; y: number; vx: number; vy: number; label: string; color: string; r: number; }

// Darker equivalents for each category color used in light theme
const LIGHT_COLORS: Record<string, string> = {
  '#4f7dff': '#2a5bd7',
  '#819fff': '#3a6bef',
  '#ff6b6b': '#b82b2b',
  '#e91e8c': '#a01460',
  '#ffd166': '#8a5500',
  '#a78bfa': '#5c30c9',
  '#34d399': '#0a7a5a',
  '#fb923c': '#c45a00',
};

const NODE_DEFS: { label: string; color: string; r: number }[] = [
  // Salesforce Platform — core specialty, largest nodes
  { label: 'Salesforce',    color: '#4f7dff', r: 28 },
  { label: 'LWC',           color: '#4f7dff', r: 21 },
  { label: 'Apex',          color: '#819fff', r: 20 },
  { label: 'CPQ',           color: '#4f7dff', r: 17 },
  { label: 'Revenue Cloud', color: '#819fff', r: 16 },
  { label: 'SOQL',          color: '#4f7dff', r: 14 },
  { label: 'SOSL',          color: '#819fff', r: 12 },
  { label: 'Platform Events',color:'#4f7dff', r: 13 },
  // Backend & APIs
  { label: 'Node.js',       color: '#ff6b6b', r: 20 },
  { label: 'REST APIs',     color: '#ff6b6b', r: 22 },
  { label: 'ASP.NET Core',  color: '#ff6b6b', r: 15 },
  { label: 'Express',       color: '#ff6b6b', r: 13 },
  { label: 'Microservices', color: '#ff6b6b', r: 13 },
  // Frontend
  { label: 'React',         color: '#e91e8c', r: 18 },
  { label: 'Angular',       color: '#e91e8c', r: 17 },
  { label: 'TypeScript',    color: '#e91e8c', r: 16 },
  { label: 'HTML/CSS',      color: '#e91e8c', r: 13 },
  { label: 'Tailwind CSS',  color: '#e91e8c', r: 13 },
  { label: 'Bootstrap',     color: '#e91e8c', r: 11 },
  // Testing & DevOps
  { label: 'Puppeteer',     color: '#ffd166', r: 18 },
  { label: 'Jest',          color: '#ffd166', r: 16 },
  { label: 'GitLab CI/CD',  color: '#ffd166', r: 16 },
  { label: 'Git',           color: '#ffd166', r: 15 },
  { label: 'Postman',       color: '#ffd166', r: 12 },
  // Languages
  { label: 'JavaScript',    color: '#a78bfa', r: 17 },
  { label: 'TypeScript',    color: '#a78bfa', r: 15 },
  { label: 'Python',        color: '#a78bfa', r: 14 },
  { label: 'C#',            color: '#a78bfa', r: 14 },
  { label: 'Java',          color: '#a78bfa', r: 13 },
  { label: 'SQL',           color: '#a78bfa', r: 14 },
  { label: 'C++',           color: '#a78bfa', r: 11 },
  { label: 'C',             color: '#a78bfa', r: 10 },
  { label: 'PHP',           color: '#a78bfa', r: 10 },
  // Databases
  { label: 'SQL Server',    color: '#34d399', r: 14 },
  { label: 'MongoDB',       color: '#34d399', r: 14 },
  { label: 'MySQL',         color: '#34d399', r: 13 },
  { label: 'SQLite',        color: '#34d399', r: 11 },
  // Enterprise
  { label: 'Teamcenter',    color: '#fb923c', r: 18 },
];

function initNodes(w: number, h: number): Node[] {
  return NODE_DEFS.map((d, i) => {
    const angle = (i / NODE_DEFS.length) * Math.PI * 2;
    const rx = w * 0.36;
    const ry = h * 0.38;
    const jitter = 0.6 + (i % 3) * 0.15;
    return {
      x: w / 2 + Math.cos(angle) * rx * jitter,
      y: h / 2 + Math.sin(angle) * ry * jitter,
      vx: Math.cos(angle + Math.PI / 2) * 0.25,
      vy: Math.sin(angle + Math.PI / 2) * 0.25,
      ...d,
    };
  });
}

function SystemCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const nodesRef  = useRef<Node[]>([]);
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let w = 0, h = 0;

    function resize() {
      w = canvas!.offsetWidth;
      h = canvas!.offsetHeight;
      canvas!.width  = w * window.devicePixelRatio;
      canvas!.height = h * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      nodesRef.current = initNodes(w, h);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const onMove = (e: MouseEvent | TouchEvent) => {
      const rect = canvas!.getBoundingClientRect();
      const point = 'touches' in e ? e.touches[0] : e;
      mouseRef.current = { x: point.clientX - rect.left, y: point.clientY - rect.top };
    };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('touchmove', onMove, { passive: true });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const nodes = nodesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        const dx = n.x - mx, dy = n.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.8;
          n.vx += (dx / dist) * force;
          n.vy += (dy / dist) * force;
        }
        // soft centering
        n.vx += (w / 2 - n.x) * 0.0005;
        n.vy += (h / 2 - n.y) * 0.0005;
        // node-node repulsion to prevent overlap
        nodes.forEach((other) => {
          if (other === n) return;
          const rx = n.x - other.x, ry = n.y - other.y;
          const rd = Math.sqrt(rx * rx + ry * ry) || 1;
          const minDist = n.r + other.r + 48;
          if (rd < minDist) {
            const force = (minDist - rd) / minDist * 0.15;
            n.vx += (rx / rd) * force;
            n.vy += (ry / rd) * force;
          }
        });
        n.vx *= 0.96;
        n.vy *= 0.96;
        const pad = n.r + 8;
        if (n.x < pad) n.vx += 0.5;
        if (n.x > w - pad) n.vx -= 0.5;
        if (n.y < pad + 16) n.vy += 0.5;
        if (n.y > h - pad - 16) n.vy -= 0.5;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 180) {
            const alpha = (1 - d / 180) * (isLight ? 0.40 : 0.25);
            const aColor = isLight ? (LIGHT_COLORS[a.color] ?? a.color) : a.color;
            const bColor = isLight ? (LIGHT_COLORS[b.color] ?? b.color) : b.color;
            const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
            grad.addColorStop(0, aColor + Math.round(alpha * 255).toString(16).padStart(2,'0'));
            grad.addColorStop(1, bColor + Math.round(alpha * 255).toString(16).padStart(2,'0'));
            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((n) => {
        const drawColor = isLight ? (LIGHT_COLORS[n.color] ?? n.color) : n.color;

        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
        grd.addColorStop(0, drawColor + (isLight ? '28' : '20'));
        grd.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.fillStyle = grd;
        ctx.arc(n.x, n.y, n.r * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = drawColor + (isLight ? '22' : '15');
        ctx.fill();
        ctx.strokeStyle = drawColor + (isLight ? 'cc' : '99');
        ctx.lineWidth = 1.5;
        ctx.stroke();

        const fontSize = Math.max(9, n.r * 0.52);
        ctx.font = `500 ${fontSize}px Inter, sans-serif`;
        ctx.fillStyle = drawColor + (isLight ? 'ee' : 'cc');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, n.x, n.y + n.r + 12);
      });

      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('touchmove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden />;
}

/* ── Count-up stat ───────────────────────────────────────────────────── */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });

  useEffect(() => {
    if (!inView) return;
    const duration = 1200;
    const start = performance.now();
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(eased * target));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [inView, target]);

  return <span ref={ref}>{value}{suffix}</span>;
}

/* ── Headline words — spring stagger ─────────────────────────────────── */
const HEADLINE = ['Software', 'that', 'ships.'];

const wordVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 400,
      damping: 30,
      delay: i * 0.08 + 0.2,
    },
  }),
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 + 0.5 },
  }),
};

export default function Hero() {
  return (
    <section className={styles.section} id="home">
      <div className={styles.bg} aria-hidden>
        <div className={styles.bgGlow1} />
        <div className={styles.bgGlow2} />
        <div className={styles.bgGlow3} />
        <div className={styles.bgGrid} />
      </div>

      <div className={styles.inner}>
        <div className={styles.content}>
          {/* Byline above headline */}
          <motion.p
            className={styles.byline}
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <span className={styles.bylineDot} />
            {person.location} — Software Engineer
          </motion.p>

          {/* Main headline — word by word spring */}
          <h1 className={styles.headline}>
            {HEADLINE.map((word, i) => (
              <motion.span
                key={word}
                className={i === 2 ? styles.headlineAccent : styles.headlineWord}
                custom={i}
                variants={wordVariants}
                initial="hidden"
                animate="show"
              >
                {word}{' '}
              </motion.span>
            ))}
          </h1>

          {/* Name as editorial byline */}
          <motion.p
            className={styles.nameByline}
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <span className={styles.nameText}>{person.name}</span>
            <span className={styles.nameRule} aria-hidden />
            <span className={styles.nameRole}>Salesforce · Integration · Full-Stack</span>
          </motion.p>

          <motion.p
            className={styles.bio}
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            {person.bio}
          </motion.p>

          <motion.div
            className={styles.ctas}
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <a href="#projects" className={styles.ctaPrimary}>
              See my work
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            <a href="#contact" className={styles.ctaSecondary}>
              Get in touch
            </a>
            <a href="mailto:subhamaydhara86@gmail.com" className={styles.ctaHire}>
              Hire me
            </a>
          </motion.div>

          <motion.div
            className={styles.stats}
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
          >
            <div className={styles.stat}>
              <span className={styles.statNum}><CountUp target={yearsOfExperience} suffix="+" /></span>
              <span className={styles.statLabel}>Years at global MNC</span>
            </div>
            <div className={styles.statDivider} aria-hidden />
            <div className={styles.stat}>
              <span className={styles.statNum}><CountUp target={20} suffix="+" /></span>
              <span className={styles.statLabel}>Production releases</span>
            </div>
            <div className={styles.statDivider} aria-hidden />
            <div className={styles.stat}>
              <span className={styles.statNum}><CountUp target={95} suffix="%" /></span>
              <span className={styles.statLabel}>Test coverage built</span>
            </div>
          </motion.div>
        </div>

        <motion.div
          className={styles.visual}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          aria-label="Interactive tech ecosystem visualization"
        >
          <SystemCanvas />
          <div className={styles.visualLabel}>
            <span>Tech ecosystem</span>
          </div>
        </motion.div>
      </div>

      {/* Organic mountain silhouette layers — the Josh Comeau signature element */}
      <div className={styles.mountains} aria-hidden>
        {/* Furthest mountains — darkest */}
        <svg className={styles.mountain3} viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,260 C80,230 160,190 280,210 C360,224 420,200 520,180 C620,160 680,140 800,160 C880,172 960,200 1060,185 C1160,170 1280,210 1380,230 L1440,240 L1440,320 L0,320 Z" />
        </svg>
        {/* Mid mountains */}
        <svg className={styles.mountain2} viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,290 C100,260 200,220 340,240 C440,256 520,230 640,210 C720,196 820,220 940,200 C1040,184 1160,230 1280,250 C1360,264 1400,270 1440,265 L1440,320 L0,320 Z" />
        </svg>
        {/* Closest mountains — lightest dark layer */}
        <svg className={styles.mountain1} viewBox="0 0 1440 320" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,310 C120,285 260,255 400,270 C500,280 580,258 700,248 C780,240 880,265 1000,255 C1100,246 1200,268 1320,280 C1380,286 1420,295 1440,300 L1440,320 L0,320 Z" />
        </svg>
      </div>

      <motion.div
        className={styles.scrollHint}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        aria-hidden
      >
        <span className={styles.scrollLine} />
        <span className={styles.scrollText}>scroll</span>
      </motion.div>
    </section>
  );
}
