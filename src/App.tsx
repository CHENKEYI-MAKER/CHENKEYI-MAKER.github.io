import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform
} from 'framer-motion';

const remoteVideos = {
  hero: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4',
  cinematic: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4',
  metrics: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4',
  tech: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4',
  footer: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4'
};

const media = {
  photos: [
    new URL('../微信图片_20260511210751_21_120.jpg', import.meta.url).href,
    new URL('../微信图片_20260511210756_22_120.jpg', import.meta.url).href,
    new URL('../微信图片_20260511210800_23_120.jpg', import.meta.url).href,
    new URL('../微信图片_20260511210804_24_120.jpg', import.meta.url).href,
    new URL('../微信图片_20260511210819_25_120.jpg', import.meta.url).href,
    new URL('../微信图片_20260511210823_26_120.jpg', import.meta.url).href
  ],
  videos: [
    new URL('../微信视频2026-05-11_210205_450.mp4', import.meta.url).href,
    new URL('../微信视频2026-05-11_210900_854.mp4', import.meta.url).href,
    new URL('../微信视频2026-05-11_210911_497.mp4', import.meta.url).href,
    new URL('../微信视频2026-05-11_210951_974.mp4', import.meta.url).href
  ],
  qr: new URL('../二维码.png', import.meta.url).href
};

const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><';
const easeOut = [0.215, 0.61, 0.355, 1] as const;
const sectionIds = ['about', 'experience', 'skills', 'works', 'contact'];

function randomChar() {
  return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
  const mid = mobile ? 4.5 : 5.25;
  const bottom = mobile ? 9 : 10.5;

  return (
    <span className="relative block" style={{ width, height }}>
      <motion.span
        className="absolute left-0 top-0 block w-full bg-white"
        style={{ height: barHeight }}
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

function NavBar({ entranceComplete }: { entranceComplete: boolean }) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [contactHover, setContactHover] = useState(false);
  const navItems = [
    ['about', 'About'],
    ['experience', 'Experience'],
    ['skills', 'Skills'],
    ['works', 'Works']
  ];

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
            onClick={() => scrollToSection('top')}
            whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.22)' }}
            whileTap={{ scale: 0.98 }}
            className={`${open ? 'sm:hidden lg:flex' : 'flex'} h-12 items-center gap-2 rounded-[14px] bg-white/15 px-5 text-white backdrop-blur-md`}
          >
            <SynapseXLogo className="h-[18px] w-[18px]" />
            <span className="text-[16px] font-normal tracking-tight">CHENKEYI.X</span>
          </motion.button>

          <motion.div
            animate={{ width: open ? 455 : 48 }}
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
                  className="ml-5 flex items-center gap-5 whitespace-nowrap text-[15px] text-white/85"
                >
                  {navItems.map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => scrollToSection(id)}
                      onMouseEnter={() => setHovered(id)}
                      onMouseLeave={() => setHovered(null)}
                      className="hover:text-white"
                    >
                      <ScrambleText text={label} isHovered={hovered === id} />
                    </button>
                  ))}
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
            {open && (
              <div className="flex gap-4 text-[12px] text-white/85">
                {navItems.slice(0, 3).map(([id, label]) => <button key={id} onClick={() => scrollToSection(id)}>{label}</button>)}
              </div>
            )}
          </motion.div>
        </div>

        <motion.a
          href="#contact"
          onMouseEnter={() => setContactHover(true)}
          onMouseLeave={() => setContactHover(false)}
          whileHover={{ scale: 1.03, backgroundColor: '#e2e2e6' }}
          whileTap={{ scale: 0.97 }}
          className="hidden h-12 items-center gap-2 rounded-full bg-white px-6 text-[15px] text-black sm:flex"
        >
          <i className="bi bi-apple text-[16px]" />
          <ScrambleText text="Connect" isHovered={contactHover} />
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
    targetTime.current = Math.max(0, Math.min(video.duration, targetTime.current + (delta / window.innerWidth) * video.duration * 0.8));
    if (!seeking.current) {
      seeking.current = true;
      video.currentTime = targetTime.current;
    }
  };

  return (
    <section id="top" onMouseMove={onMouseMove} className="video-scrim relative flex h-screen h-[100dvh] min-h-[100dvh] overflow-hidden px-4 pb-8 pt-20 sm:px-6 sm:pb-12 sm:pt-24 md:px-8">
      <video ref={videoRef} src={remoteVideos.hero} className="absolute inset-0 h-full w-full object-cover" playsInline preload="auto" muted />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05]" />
      <div className="watermark-text pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 translate-y-[50px] select-none whitespace-nowrap text-center text-[clamp(120px,30vw,521px)] uppercase leading-none tracking-[-4px] opacity-10">
        PORTFOLIO
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
              电商运营与 AI 应用从业者。把选品、拍摄、推广和内容生产映射成一套可执行的智能工作流。
            </motion.p>
          </div>
          <h1 className="text-left text-[clamp(40px,10vw,100px)] font-light leading-[0.95] tracking-[-0.03em] text-white md:text-right">
            <ScrambleIn text="Commerce" delay={700} triggered={entranceComplete} />
            <br />
            <ScrambleIn text="Network" delay={1000} triggered={entranceComplete} />
          </h1>
        </motion.div>
      </div>
    </section>
  );
}

function CinematicAbout() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 15, damping: 32, mass: 1.8 });
  const y = useTransform(smooth, [0, 1], [60, -120]);
  const opacity = useTransform(smooth, [0.3, 0.5], [0, 1]);
  const transform = useMotionTemplate`rotateX(24deg) translateY(${y}px) translateZ(15px)`;

  return (
    <section id="about" ref={ref} className="relative flex min-h-screen items-center justify-center overflow-hidden py-32">
      <video src={remoteVideos.cinematic} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute left-0 right-0 top-0 z-10 h-[180px] bg-gradient-to-b from-[#010103] to-transparent" />
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-20 grid w-full max-w-6xl gap-12 px-6 md:grid-cols-[1.2fr_.8fr] md:px-12">
        <div className="[perspective:400px]">
          <motion.p
            style={{ transform, opacity }}
            className="select-none text-[22px] font-normal leading-[1.35] tracking-[-0.02em] text-white sm:text-[30px] md:text-[36px] lg:text-[42px]"
          >
            我从电商运营现场出发，把国内平台经验、跨境推广方法和 AI 内容工具整理成一套自己的工作系统。好工具加好策略，才会产生好结果。
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.9 }}
          className="self-end rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur-md md:p-8"
        >
          <p className="mb-6 text-[13px] uppercase tracking-[0.2em] text-white/35">Profile Matrix</p>
          <div className="space-y-5 text-[14px] text-white/70 sm:text-[15px]">
            <InfoRow label="Name" value="陈可以" />
            <InfoRow label="Location" value="温州" />
            <InfoRow label="Focus" value="电商运营 / AI运营" />
            <InfoRow label="Email" value="605286836@qq.com" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-white/10 pb-3 last:border-none last:pb-0">
      <span className="text-white/35">{label}</span>
      <span className="max-w-[220px] text-right text-white">{value}</span>
    </div>
  );
}

function Metrics() {
  const metrics = useMemo(
    () => [
      ['10+', 'Years Commerce Ops'],
      ['6', 'Major Platforms'],
      ['AI', 'Content Workflow']
    ],
    []
  );

  return (
    <section className="relative min-h-screen overflow-hidden px-6 py-32">
      <video src={remoteVideos.metrics} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/68" />
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center justify-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2 }}
          className="mb-20 text-center text-[13px] uppercase tracking-[0.2em] text-white/40 sm:text-[14px]"
        >
          Operating Signals
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

function ExperienceEducation() {
  const experiences = [
    ['2014-2018', '新媒体运营', '深圳市欧雷亚时机珠宝有限公司', '负责店铺运营管理、产品选品上架、库存控制、数据分析报告与产品拍摄，提升商品视觉和转化效率。'],
    ['2018-2024', '电商运营', '温州可以网络科技有限公司', '独立负责巨量引擎与电商全流程，从选品、拍摄、上架、推广、进货、发货到售后闭环。'],
    ['2025-Now', 'AI运营', '温州金贝生物科技有限公司', '使用 ComfyUI、Lovart、即梦、OpenClaw、Claude Code、Hermes、Codex 等工具进行 AI 编导和视频内容制作。']
  ];

  return (
    <section id="experience" className="relative overflow-hidden bg-black px-6 py-32 md:px-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,.08),transparent_30%),radial-gradient(circle_at_10%_70%,rgba(255,255,255,.05),transparent_26%)]" />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-16 lg:grid-cols-[.7fr_1.3fr]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
        >
          <p className="mb-8 text-[13px] uppercase tracking-[0.2em] text-white/35">Experience</p>
          <h2 className="text-[clamp(34px,7vw,72px)] font-light leading-[1] tracking-[-0.04em]">Operating history, encoded.</h2>
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[13px] uppercase tracking-[0.18em] text-white/30">Education</p>
            <h3 className="mt-5 text-[24px] text-white">景德镇陶瓷大学</h3>
            <p className="mt-2 text-[15px] text-white/50">2010-2014 / 本科 / 工业设计</p>
          </div>
        </motion.div>
        <div className="space-y-5">
          {experiences.map(([period, title, company, desc], index) => (
            <motion.article
              key={period}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8, delay: index * 0.12 }}
              className="group rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-md transition hover:border-white/25 hover:bg-white/[0.07] md:p-8"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-[13px] uppercase tracking-[0.18em] text-white/35">{period}</p>
                  <h3 className="mt-4 text-[26px] font-normal text-white">{title}</h3>
                  <p className="mt-2 text-[14px] text-white/45">{company}</p>
                </div>
                <span className="text-[28px] text-white/15 transition group-hover:text-white/40">0{index + 1}</span>
              </div>
              <p className="mt-6 max-w-2xl text-[14px] leading-relaxed text-white/55 sm:text-[15px]">{desc}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillMatrix() {
  const groups = [
    ['Design Tools', ['UI/UX Design', 'Lovart', '3D Max', 'Adobe PR', 'Photoshop', 'ComfyUI', '即梦']],
    ['Development', ['OpenClaw', 'Hermes', 'Claude Code', 'Codex', 'Kimi Code']],
    ['Language', ['中文', 'English', '温州话']],
    ['Operations', ['项目管理', '团队协作', '创意思维', '内容复盘']]
  ];

  return (
    <section id="skills" className="relative flex min-h-screen flex-col overflow-hidden px-8 py-12 sm:px-12 sm:py-16 md:px-16">
      <video src={remoteVideos.tech} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-black/68" />
      <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="text-[clamp(36px,8vw,72px)] font-light leading-[0.95] tracking-[-0.03em] text-white"
        >
          Skill
          <br />
          Matrix
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="max-w-xs text-[13px] leading-relaxed text-white/50 sm:text-[15px] md:pt-2 md:text-right"
        >
          不是单独陈列工具，而是把设计、开发、语言和运营能力组合成内容生产系统。
        </motion.p>
      </div>
      <div className="flex-1" />
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-4 md:gap-6"
      >
        {groups.map(([title, skills], index) => (
          <motion.div
            key={title as string}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, delay: index * 0.1 }}
            className="rounded-2xl border border-white/10 bg-white/[0.055] p-5 backdrop-blur-md"
          >
            <h3 className="mb-5 text-[15px] font-normal text-white sm:text-[16px]">{title}</h3>
            <div className="flex flex-wrap gap-2">
              {(skills as string[]).map((skill) => (
                <span key={skill} className="rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-white/48">{skill}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function Works() {
  const photos = media.photos;
  const videos = media.videos;

  return (
    <section id="works" className="bg-black px-6 py-32 md:px-12">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1 }}
          className="mb-16 max-w-3xl"
        >
          <p className="mb-8 text-[13px] uppercase tracking-[0.2em] text-white/35">Selected Works</p>
          <h2 className="text-[clamp(34px,7vw,72px)] font-light leading-[1] tracking-[-0.04em]">Video signals and image fragments.</h2>
          <p className="mt-6 text-[15px] leading-relaxed text-white/45 sm:text-[17px]">原站的视频作品和摄影作品被保留下来，作为个人内容审美和 AI 视频方向的视觉证据。</p>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7"
          >
            <video src={videos[0]} autoPlay muted loop playsInline className="h-[360px] w-full rounded-3xl border border-white/10 object-cover md:h-[520px]" />
          </motion.div>
          <div className="grid gap-4 md:col-span-5">
            {videos.slice(1, 4).map((src, index) => (
              <motion.video
                key={src}
                src={src}
                autoPlay
                muted
                loop
                playsInline
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: index * 0.08 }}
                className="h-[160px] w-full rounded-2xl border border-white/10 object-cover"
              />
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-6">
          {photos.map((src, index) => (
            <motion.img
              key={src}
              src={src}
              alt={`摄影作品 ${index + 1}`}
              loading="lazy"
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: index * 0.05 }}
              className={`${index === 4 || index === 5 ? 'md:col-span-2' : 'md:col-span-1'} h-[220px] w-full rounded-2xl border border-white/10 object-cover grayscale-[20%] transition duration-500 hover:grayscale-0`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactArchitecture() {
  const layers = [
    ['Layer 1', 'Profile', '姓名、地点、定位和联系方式'],
    ['Layer 2', 'Experience', '运营经历、教育背景和平台经验'],
    ['Layer 3', 'Works', '视频、摄影和 AI 内容表达']
  ];

  return (
    <section id="contact" className="bg-black px-6 py-32 text-center">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1 }}
        >
          <p className="mb-8 text-[13px] uppercase tracking-[0.2em] text-white/40 sm:text-[14px]">Architecture</p>
          <h2 className="mb-10 text-[clamp(28px,6vw,56px)] font-light leading-[1.15] tracking-[-0.02em] text-white">A personal interface, fully mapped.</h2>
          <p className="mx-auto max-w-xl text-[15px] leading-relaxed text-white/45 sm:text-[17px]">
            你的原始个人信息、经历、教育、技能和作品都被整理进同一套黑色神经界面中，访问者可以快速理解你是谁、会什么、做过什么。
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="mt-20 flex flex-col items-center gap-4"
        >
          {layers.map(([layer, name, desc]) => (
            <div key={layer} className="flex min-h-[82px] w-full max-w-xl items-center justify-between gap-6 rounded-lg border border-white/10 px-6 text-left">
              <span className="text-[12px] uppercase tracking-[0.15em] text-white/30">{layer}</span>
              <div className="text-right">
                <span className="block text-[16px] font-light text-white sm:text-[18px]">{name}</span>
                <span className="mt-1 block text-[12px] text-white/35">{desc}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-20 grid gap-4 text-left md:grid-cols-[1fr_auto]"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-[13px] uppercase tracking-[0.2em] text-white/35">Contact</p>
            <a href="mailto:605286836@qq.com" className="mt-5 block text-[22px] text-white hover:text-white/70">605286836@qq.com</a>
            <p className="mt-3 text-[15px] text-white/45">Phone / +86 18368735352</p>
            <p className="mt-2 text-[15px] text-white/45">WeChat / chenky827</p>
            <a href="https://github.com/CHENKEYI-MAKER" target="_blank" rel="noreferrer" className="mt-2 block text-[15px] text-white/45 hover:text-white">GitHub / CHENKEYI-MAKER</a>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white p-4">
            <img src={media.qr} alt="微信二维码" className="h-36 w-36 rounded-xl object-cover" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="overflow-hidden bg-black">
      <div className="flex min-h-[400px] flex-col md:flex-row">
        <div className="relative h-[300px] md:h-auto md:w-1/2">
          <video src={remoteVideos.footer} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/35" />
        </div>
        <div className="flex flex-col justify-between p-10 sm:p-16 md:w-1/2">
          <div>
            <div className="mb-8 flex items-center gap-2 text-white/70">
              <SynapseXLogo className="h-[18px] w-[18px]" />
              <span className="text-[15px] font-medium tracking-tight">CHENKEYI.X</span>
            </div>
            <p className="max-w-sm text-[14px] leading-relaxed text-white/40 sm:text-[15px]">
              电商运营、AI 编导、视频内容制作和个人作品展示。把旧站的简历信息与 SynapseX 式神经界面融合成新的个人入口。
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
      <CinematicAbout />
      <Metrics />
      <ExperienceEducation />
      <SkillMatrix />
      <Works />
      <ContactArchitecture />
      <Footer />
    </div>
  );
}
