import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion';

const videos = {
  hero: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4',
  cinematic: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4',
  metrics: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4',
  tech: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4',
  footer: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4'
};

const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';
const easeOut = [0.215, 0.61, 0.355, 1] as const;

function randomChar() {
  return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
}

function ScrambleIn({ text, delay, triggered }: { text: string; delay: number; triggered: boolean }) {
  const [display, setDisplay] = useState('\u00a0');

  useEffect(() => {
    if (!triggered) {
      setDisplay('\u00a0');
      return;
    }

    let frame = 0;
    let interval: number | undefined;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        const cursor = frame * 0.5;
        const next = text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index <= cursor) return char;
            if (index <= cursor + 3) return randomChar();
            return '';
          })
          .join('');
        setDisplay(next || '\u00a0');
        frame += 1;
        if (cursor >= text.length) {
          window.clearInterval(interval);
          setDisplay(text);
        }
      }, 25);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, [delay, text, triggered]);

  return <span>{display}</span>;
}

function ScrambleText({ text, isHovered, className }: { text: string; isHovered: boolean; className?: string }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!isHovered) {
      setDisplay(text);
      return;
    }

    let frame = 0;
    const interval = window.setInterval(() => {
      const next = text
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          return index <= Math.floor(frame / 4) ? char : randomChar();
        })
        .join('');
      setDisplay(next);
      frame += 1;
      if (Math.floor(frame / 4) >= text.length) {
        window.clearInterval(interval);
        setDisplay(text);
      }
    }, 25);

    return () => window.clearInterval(interval);
  }, [isHovered, text]);

  return <span className={className}>{display}</span>;
}

function SynapseXLogo({ className = 'h-5 w-5' }: { className?: string }) {
  const path = 'M 1.5,23 L 1.5,33 C 1.5,38.5 6,43 11.5,43 L 16.5,43 C 22,43 26.5,38.5 26.5,33 Q 28,28 33,26.5 C 38.5,26.5 43,22 43,16.5 L 43,11.5 C 43,6 38.5,1.5 33,1.5 L 23,1.5 Q 12,12 1.5,23 Z';
  return (
    <svg viewBox="-50 -50 100 100" className={className} fill="currentColor" aria-hidden="true">
      {[0, 90, 180, 270].map((rotation) => (
        <path key={rotation} d={path} transform={`rotate(${rotation})`} />
      ))}
    </svg>
  );
}

function SquashHamburger({ open, mobile = false }: { open: boolean; mobile?: boolean }) {
  const barHeight = mobile ? 1.2 : 1.5;
  const width = mobile ? 15 : 18;
  const height = mobile ? 10 : 12;
  const top = mobile ? 0 : 0;
  const mid = mobile ? 4.5 : 5.25;
  const bottom = mobile ? 9 : 10.5;

  return (
    <span className="relative block" style={{ width, height }}>
      <motion.span
        className="absolute left-0 block w-full bg-white"
        style={{ height: barHeight, top }}
        animate={open ? { rotate: 45, y: mobile ? 4.5 : 5.25 } : { rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      <motion.span
        className="absolute left-0 block w-full bg-white"
        style={{ height: barHeight, top: mid }}
        animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
      <motion.span
        className="absolute left-0 block w-full bg-white"
        style={{ height: barHeight, top: bottom }}
        animate={open ? { rotate: -45, y: mobile ? -4.5 : -5.25 } : { rotate: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      />
    </span>
  );
}

function HoverScrambleButton({ children, className, onClick }: { children: string; className?: string; onClick?: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
    >
      <ScrambleText text={children} isHovered={hovered} />
    </button>
  );
}

function NavBar({ entranceComplete }: { entranceComplete: boolean }) {
  const [open, setOpen] = useState(false);
  const [aboutHover, setAboutHover] = useState(false);
  const [metricsHover, setMetricsHover] = useState(false);
  const [downloadHover, setDownloadHover] = useState(false);

  const scrollTo = (multiplier: number) => {
    window.scrollTo({ top: window.innerHeight * multiplier, behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: entranceComplete ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      className="fixed left-0 top-0 z-50 h-20 w-full px-4 sm:px-6 md:px-8"
    >
      <div className="flex h-full items-center justify-between">
        <div className="hidden items-center gap-2 sm:flex">
          <motion.button
            type="button"
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.22)' }}
            whileTap={{ scale: 0.98 }}
            className={`${open ? 'sm:hidden md:flex' : 'flex'} h-12 items-center gap-2 rounded-[14px] bg-white/15 px-5 text-white backdrop-blur-md`}
          >
            <SynapseXLogo className="h-[18px] w-[18px]" />
            <span className="text-[16px] font-normal tracking-tight">CHENKEYI.X</span>
          </motion.button>

          <motion.div
            animate={{ width: open ? 290 : 48 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="flex h-12 items-center overflow-hidden rounded-[14px] bg-white/15 backdrop-blur-md"
          >
            <motion.button
              type="button"
              onClick={() => setOpen((value) => !value)}
              animate={open ? { width: 36, height: 36, marginLeft: 6 } : { width: 48, height: 48, marginLeft: 0 }}
              className="flex shrink-0 items-center justify-center rounded-[14px] hover:bg-white/20"
            >
              <SquashHamburger open={open} />
            </motion.button>
            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="ml-5 flex items-center gap-7 whitespace-nowrap text-[16px] text-white/85"
                >
                  <button
                    type="button"
                    onClick={() => scrollTo(1)}
                    onMouseEnter={() => setAboutHover(true)}
                    onMouseLeave={() => setAboutHover(false)}
                    className="hover:text-white"
                  >
                    <ScrambleText text="About" isHovered={aboutHover} />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollTo(2)}
                    onMouseEnter={() => setMetricsHover(true)}
                    onMouseLeave={() => setMetricsHover(false)}
                    className="hover:text-white"
                  >
                    <ScrambleText text="Metrics" isHovered={metricsHover} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        <div className="flex w-full items-center gap-1.5 sm:hidden">
          <motion.button
            type="button"
            animate={{ width: open ? 0 : 132, opacity: open ? 0 : 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="flex h-9 shrink-0 items-center gap-1.5 overflow-hidden rounded-[10px] bg-white/15 px-3 text-[13px] text-white backdrop-blur-md"
          >
            <SynapseXLogo className="h-[15px] w-[15px]" />
            <span>CHENKEYI.X</span>
          </motion.button>
          <motion.div
            animate={{ width: open ? '100%' : 38 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="flex h-9 items-center overflow-hidden rounded-[10px] bg-white/15 backdrop-blur-md"
          >
            <button type="button" onClick={() => setOpen((value) => !value)} className="flex h-9 w-9 shrink-0 items-center justify-center">
              <SquashHamburger open={open} mobile />
            </button>
            {open && <div className="flex gap-5 text-[13px] text-white/85"><button onClick={() => scrollTo(1)}>About</button><button onClick={() => scrollTo(2)}>Metrics</button></div>}
          </motion.div>
        </div>

        <motion.a
          href="#contact"
          onMouseEnter={() => setDownloadHover(true)}
          onMouseLeave={() => setDownloadHover(false)}
          whileHover={{ scale: 1.03, backgroundColor: '#e2e2e6' }}
          whileTap={{ scale: 0.97 }}
          className="hidden h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] text-black sm:flex"
        >
          <i className="bi bi-apple text-[16px]" />
          <ScrambleText text="Connect" isHovered={downloadHover} />
        </motion.a>
      </div>
    </motion.nav>
  );
}

function Hero({ entranceComplete }: { entranceComplete: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTime = useRef(0);
  const seeking = useRef(false);
  const lastX = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;

    const seekNext = () => {
      seeking.current = false;
      if (Math.abs(video.currentTime - targetTime.current) > 0.04) {
        seeking.current = true;
        video.currentTime = targetTime.current;
      }
    };
    video.addEventListener('seeked', seekNext);
    return () => video.removeEventListener('seeked', seekNext);
  }, []);

  const onMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    if (lastX.current === null) {
      lastX.current = event.clientX;
      return;
    }
    const delta = event.clientX - lastX.current;
    lastX.current = event.clientX;
    const sensitivity = 0.8;
    targetTime.current = Math.max(0, Math.min(video.duration, targetTime.current + (delta / window.innerWidth) * video.duration * sensitivity));
    if (!seeking.current) {
      seeking.current = true;
      video.currentTime = targetTime.current;
    }
  };

  return (
    <section onMouseMove={onMouseMove} className="video-scrim relative flex h-screen h-[100dvh] min-h-[100dvh] overflow-hidden px-4 pb-8 pt-20 sm:px-6 sm:pb-12 sm:pt-24 md:px-8">
      <video ref={videoRef} src={videos.hero} className="absolute inset-0 h-full w-full object-cover" playsInline preload="auto" muted />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05]" />
      <div className="watermark-text pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 translate-y-[50px] select-none whitespace-nowrap text-center text-[clamp(120px,30vw,521px)] uppercase leading-none tracking-[-4px] opacity-10">
        TRANSCENDENCE
      </div>
      <div className="relative z-10 flex min-h-0 w-full flex-col">
        <div className="flex-1" />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: entranceComplete ? 1 : 0 }}
          transition={{ duration: 1 }}
          className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
          <div className="flex flex-col gap-4">
            <h1 className="text-[clamp(40px,10vw,100px)] font-light leading-[0.95] tracking-[-0.03em] text-white">
              <ScrambleIn text="Chen Keyi" delay={200} triggered={entranceComplete} />
              <br />
              <ScrambleIn text="AI Operator" delay={500} triggered={entranceComplete} />
            </h1>
            <motion.p
              initial={{ y: 25, opacity: 0 }}
              animate={{ y: entranceComplete ? 0 : 25, opacity: entranceComplete ? 1 : 0 }}
              transition={{ duration: 0.9, ease: easeOut, delay: 0.2 }}
              className="max-w-sm text-[13px] leading-relaxed text-white/60 sm:text-[15px]"
            >
              跨境电商运营与 AI 应用从业者。把选品、拍摄、推广和内容生产映射成一套可执行的智能工作流。
            </motion.p>
          </div>
          <h1 className="text-left text-[clamp(40px,10vw,100px)] font-light leading-[0.95] tracking-[-0.03em] text-white md:text-right">
            <ScrambleIn text="One" delay={700} triggered={entranceComplete} />
            <br />
            <ScrambleIn text="Network" delay={1000} triggered={entranceComplete} />
          </h1>
        </motion.div>
      </div>
    </section>
  );
}

function CinematicText() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 15, damping: 32, mass: 1.8 });
  const y = useTransform(smooth, [0, 1], [60, -120]);
  const opacity = useTransform(smooth, [0.3, 0.5], [0, 1]);
  const transform = useMotionTemplate`rotateX(24deg) translateY(${y}px) translateZ(15px)`;

  return (
    <section ref={ref} className="relative flex h-screen h-[100dvh] min-h-[100dvh] items-center justify-center overflow-hidden">
      <video src={videos.cinematic} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute left-0 right-0 top-0 z-10 h-[180px] bg-gradient-to-b from-[#010103] to-transparent" />
      <div className="absolute inset-0 bg-black/45" />
      <div className="relative z-20 max-w-5xl px-6 text-center [perspective:400px] sm:px-12">
        <motion.p
          style={{ transform, opacity }}
          className="select-none text-[22px] font-normal leading-[1.35] tracking-[-0.02em] text-white sm:text-[30px] md:text-[36px] lg:text-[42px]"
        >
          一套以个人经验为核心的神经式工作界面。CHENKEYI.X 将电商信号、内容判断、平台反馈和 AI 工具流汇入同一个自适应层。每一次选品、拍摄、投放和复盘都会变成可观察、可整理、可优化的行动地图。
        </motion.p>
      </div>
    </section>
  );
}

function Metrics() {
  const metrics = useMemo(
    () => [
      ['10+', 'Years Commerce Ops'],
      ['6', 'Major Platforms'],
      ['24h', 'AI Content Loop']
    ],
    []
  );

  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-32">
      <video src={videos.metrics} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/65" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2 }}
          className="mb-20 text-center text-[13px] uppercase tracking-[0.2em] text-white/40 sm:text-[14px]"
        >
          Performance Metrics
        </motion.p>
        <div className="grid w-full grid-cols-1 gap-16 md:grid-cols-3 md:gap-8">
          {metrics.map(([value, label], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, delay: index * 0.15 }}
              className="text-center"
            >
              <div className="text-[clamp(48px,10vw,96px)] font-light leading-none tracking-[-0.04em] text-white">{value}</div>
              <div className="mt-4 text-[13px] tracking-wide text-white/40 sm:text-[15px]">{label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Technology() {
  const items = [
    ['Commerce Mapping', '从选品、拍摄、上架到推广，重构完整运营链路。'],
    ['Signal Isolation', '把平台反馈、内容数据和销售表现拆解为清晰信号。'],
    ['State Prediction', '提前判断内容方向、转化机会和投放节奏。'],
    ['Loop Feedback', '用 AI 工具持续修正素材、脚本、视频和策略。']
  ];

  return (
    <section className="relative flex h-screen h-[100dvh] min-h-[100dvh] flex-col overflow-hidden px-8 py-12 sm:px-12 sm:py-16 md:px-16">
      <video src={videos.tech} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/58" />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="text-[clamp(36px,8vw,72px)] font-light leading-[0.95] tracking-[-0.03em] text-white"
        >
          Adaptive
          <br />
          Intelligence
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-xs text-[13px] leading-relaxed text-white/50 sm:text-[15px] md:pt-2 md:text-right"
        >
          系统以你的运营经验作为 baseline。每个内容状态、平台动作和 AI 输出都会被重新映射、预测和优化。
        </motion.p>
      </div>
      <div className="flex-1" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6"
      >
        {items.map(([title, desc], index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
          >
            <h3 className="mb-2 text-[14px] font-normal text-white sm:text-[16px]">{title}</h3>
            <p className="text-[12px] leading-relaxed text-white/40 sm:text-[14px]">{desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function Architecture() {
  const layers = [
    ['Layer 1', 'Capture'],
    ['Layer 2', 'Process'],
    ['Layer 3', 'Interface']
  ];

  return (
    <section className="bg-black px-6 py-32 text-center">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1 }}
        >
          <p className="mb-8 text-[13px] uppercase tracking-[0.2em] text-white/40 sm:text-[14px]">Architecture</p>
          <h2 className="mb-10 text-[clamp(28px,6vw,56px)] font-light leading-[1.15] tracking-[-0.02em] text-white">Three layers. Zero friction.</h2>
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-white/45 sm:text-[17px]">
            经验层捕获真实运营判断。处理层隔离关键意图。界面层把作品、技能和联系入口输出给每一个访问者。
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          {layers.map(([layer, name]) => (
            <div key={layer} className="flex h-[72px] w-full max-w-md items-center justify-between rounded-lg border border-white/10 px-6">
              <span className="text-[12px] uppercase tracking-[0.15em] text-white/30">{layer}</span>
              <span className="text-[16px] font-light text-white sm:text-[18px]">{name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="contact" className="overflow-hidden bg-black">
      <div className="flex min-h-[400px] flex-col md:flex-row">
        <div className="relative h-[300px] md:h-auto md:w-1/2">
          <video src={videos.footer} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/35" />
        </div>
        <div className="flex flex-col justify-between p-10 sm:p-16 md:w-1/2">
          <div>
            <div className="mb-8 flex items-center gap-2 text-white/70">
              <SynapseXLogo className="h-[18px] w-[18px]" />
              <span className="text-[15px] font-medium tracking-tight">CHENKEYI.X</span>
            </div>
            <p className="max-w-sm text-[14px] leading-relaxed text-white/40 sm:text-[15px]">
              电商运营、AI 编导、视频内容制作和个人作品展示。联系邮箱 605286836@qq.com，微信 chenky827。
            </p>
          </div>
          <p className="mt-12 text-[12px] text-white/25">(c) 2026 CHENKEYI Neural Interface. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [entranceComplete, setEntranceComplete] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setEntranceComplete(true), 800);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div style={{ fontFamily: '"Space Mono", monospace' }} className="min-h-screen bg-black text-white">
      <NavBar entranceComplete={entranceComplete} />
      <Hero entranceComplete={entranceComplete} />
      <CinematicText />
      <Metrics />
      <Technology />
      <Architecture />
      <Footer />
    </div>
  );
}
