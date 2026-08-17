import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.16,
      delayChildren: 0.2,
    },
  },
};

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const navItems = [
  { name: 'ABOUT', href: '#about' },
  { name: 'PROJECTS', href: '#work' },
  { name: 'SKILLS', href: '#skills' },
  { name: 'EXPERIENCE', href: '#experience' },
  { name: 'CONTACT', href: '#contact' },
];

export const HeroSection: React.FC = () => {
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative w-screen h-screen overflow-hidden bg-[#EAE6DB] text-[#1C231D] font-sans selection:bg-[#2F6C4F] selection:text-white cursor-none">
      {/* ================= 1. MINIMAL CUSTOM CURSOR ================= */}
      {cursorPos.x >= 0 && (
        <motion.div
          className="fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-[#2F6C4F]/40 flex items-center justify-center backdrop-blur-[1px]"
          animate={{
            x: cursorPos.x - (isHovered ? 24 : 5),
            y: cursorPos.y - (isHovered ? 24 : 5),
            width: isHovered ? 48 : 10,
            height: isHovered ? 48 : 10,
            backgroundColor: isHovered ? 'rgba(176, 121, 60, 0.12)' : 'rgba(38, 35, 31, 0.8)',
          }}
          transition={{ type: 'spring', damping: 30, stiffness: 350, mass: 0.5 }}
        />
      )}

      {/* ================= 2. FIXED VIDEO LAYER ================= */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#EAE6DB] flex items-center justify-end">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="h-screen w-auto max-w-none object-contain origin-right scale-95 md:scale-[0.98] lg:scale-100"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>

        {/* Seamless Soft Left Edge Blend */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#EAE6DB] via-[#EAE6DB]/85 to-transparent pointer-events-none" />

        {/* ================= 3. ANIMATED MONOGRAM EMBLEM ================= */}
        <div className="absolute bottom-6 right-6 lg:bottom-10 lg:right-12 pointer-events-none flex items-center justify-center z-10">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-36 h-36 bg-[#EAE6DB]/85 rounded-full blur-xl" />

            <motion.div
              animate={{
                y: [-3, 3, -3],
                scale: [1, 1.03, 1],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative flex items-center justify-center w-28 h-28 lg:w-32 lg:h-32 rounded-full border border-[#2F6C4F]/50 bg-[#F0E9DB]/70 backdrop-blur-sm drop-shadow-[0_0_15px_rgba(176,121,60,0.2)]"
            >
              <span
                className="text-3xl lg:text-4xl text-[#3F7A5A]"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.05em' }}
              >
                AP
              </span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= 4. CONTENT LAYER ================= */}
      <div className="relative z-10 flex flex-col justify-between h-full w-full px-6 sm:px-12 lg:px-16 pt-6 pb-8 pointer-events-none">

        {/* Dark backdrop bar so nav text stays legible over any part of the video */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/30 to-transparent backdrop-blur-[3px] pointer-events-none" />

        {/* Navigation Bar */}
        <header className="relative flex items-center justify-between w-full pointer-events-auto">
          <a
            href="#"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="text-base sm:text-lg font-bold tracking-[0.3em] uppercase text-[#F5F2E9] hover:text-[#6FAE8B] transition-colors drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            ATHARVA.
          </a>

          {/* Navigation Links */}
          <nav
            className="hidden md:flex items-center space-x-8 lg:space-x-10 text-sm tracking-[0.22em] font-semibold uppercase text-[#EDEAE0] absolute left-1/2 -translate-x-1/2"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative group py-1 drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)] transition-colors duration-300 hover:text-[#8FD4B0]"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#6FAE8B] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action */}
          <a
            href="#contact"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group flex items-center space-x-2 text-sm font-semibold tracking-[0.2em] uppercase py-2.5 px-5 border-2 border-[#EDEAE0]/70 hover:border-[#6FAE8B] bg-black/25 hover:bg-[#2F6C4F] text-[#F5F2E9] transition-all duration-300 backdrop-blur-sm ml-auto md:ml-0"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            <span>LET&apos;S TALK</span>
            <span className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-sm">
              ↗
            </span>
          </a>
        </header>

        {/* Main Hero Row */}
        <div className="relative flex flex-col md:flex-row items-center justify-between w-full pt-4 pb-2 my-auto">

          {/* LEFT: Headline & Actions */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-sm sm:max-w-md md:max-w-lg lg:max-w-[37rem] xl:max-w-[40rem] pointer-events-auto z-20"
          >
            {/* Massive Condensed Headline */}
            <motion.div variants={fadeUpVariants} className="relative mb-3.5 select-none">
              <h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-[7.2rem] xl:text-[7.8rem] tracking-tight uppercase leading-[0.83]"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {/* Line 1 */}
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#1C231D] via-[#3A342C] to-[#5A4E3E] drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                  I BUILD
                </span>

                {/* Line 2 */}
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#6FAE8B] via-[#2F6C4F] to-[#1F4A34] drop-shadow-[0_6px_18px_rgba(176,121,60,0.22)]">
                  INTELLIGENT
                </span>

                {/* Line 3 */}
                <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#3A342C] via-[#5A4E3E] to-[#1C231D] drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                  SOFTWARE.
                </span>
              </h1>
            </motion.div>

            {/* Subtitle Roles */}
            <motion.div variants={fadeUpVariants} className="mb-4">
              <p
  className="whitespace-nowrap text-xs sm:text-sm md:text-[15px] font-semibold tracking-[0.24em] uppercase text-[#1C231D]"
  style={{ fontFamily: "'Montserrat', sans-serif" }}
>
  SOFTWARE DEVELOPER
  <span className="text-[#2F6C4F] mx-1">•</span>
  FULL-STACK DEVELOPER
  <span className="text-[#2F6C4F] mx-1">•</span>
  AI / ML
</p>
            </motion.div>

            {/* Description */}
            <motion.div
              variants={fadeUpVariants}
              className="text-sm sm:text-base md:text-[15.5px] font-normal text-[#2E312B] leading-[1.8] tracking-wide max-w-lg mb-6 space-y-1"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <p>
                B.E. Information Technology graduate building full-stack applications, AI-powered solutions, and automated workflows.
                <br />
                I turn ideas into working products — from backend APIs to polished interfaces.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUpVariants}
              className="flex flex-row items-center gap-4 sm:gap-6"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {/* Explore My Work CTA */}
              <motion.a
                href="#work"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                className="relative inline-flex items-center space-x-3 px-6 sm:px-7 py-3.5 border-2 border-[#2F6C4F] bg-[#F0E9DB]/60 hover:bg-[#F0E9DB] text-[#1C231D] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_25px_rgba(47,108,79,0.15)]"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2F6C4F]/40 to-transparent pointer-events-none" />
                <span>EXPLORE MY WORK</span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-xs">
                  ↗
                </span>
              </motion.a>

              {/* Download Resume Button */}
              <motion.a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ scale: 1.02 }}
                className="relative inline-flex items-center space-x-2 px-6 sm:px-7 py-3.5 border-2 border-[#2F6C4F]/50 hover:border-[#2F6C4F] text-[#2E312B] hover:text-[#1C231D] text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300"
              >
                <span>DOWNLOAD RESUME</span>
                <span className="transform transition-transform duration-300 group-hover:translate-y-0.5 text-xs">
                  ↓
                </span>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* RIGHT: Floating Quote & Signature Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col items-start pointer-events-auto pr-24 xl:pr-36 mr-4 z-20 select-none"
          >
            {/* Quote Mark */}
            <span className="text-xl text-[#2F6C4F] leading-none font-serif mb-2">
              "
            </span>

            {/* Two-Line Statement */}
            <div
              className="text-[11px] font-semibold tracking-[0.22em] uppercase text-[#1C231D] space-y-1 mb-3"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <p>CURIOUS BY DEFAULT.</p>
              <p>METHODICAL BY DESIGN.</p>
            </div>

            {/* Accent Line */}
            <div className="w-28 h-[1px] bg-gradient-to-r from-[#2F6C4F] via-[#6FAE8B]/70 to-transparent shadow-[0_0_8px_rgba(47,108,79,0.3)] mb-2" />

            {/* Signature */}
            <div
              className="text-[4.2rem] text-[#2F6C4F] font-normal leading-none -ml-0.5"
              style={{
                fontFamily: "'Great Vibes', cursive",
                letterSpacing: '0.02em',
              }}
            >
              Atharva
            </div>
          </motion.div>
        </div>

        {/* Bottom Spacer */}
        <div className="h-2" />
      </div>
    </section>
  );
};

export default HeroSection;
