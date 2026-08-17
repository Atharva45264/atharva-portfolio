import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const bentoCategories = [
  {
    title: 'WEB DEVELOPMENT',
    badge: 'CORE PILLAR',
    items: ['React.js', 'Next.js', 'Node.js', 'Express.js', 'FastAPI', 'Tailwind CSS', 'REST APIs'],
    description: 'Building full-stack web applications end-to-end — from responsive React/Next.js frontends to Node.js and FastAPI backends serving REST APIs.',
    stat: 'FULL-STACK',
    colSpan: 'lg:col-span-7',
  },
  {
    title: 'PROGRAMMING LANGUAGES',
    badge: 'FOUNDATION',
    items: ['Python', 'JavaScript', 'TypeScript', 'SQL', 'HTML', 'CSS'],
    description: 'Core languages I write daily across application logic, data workflows, and interface development.',
    stat: '6 LANGUAGES',
    colSpan: 'lg:col-span-5',
  },
  {
    title: 'DATABASES',
    badge: 'PERSISTENCE',
    items: ['MongoDB', 'PostgreSQL', 'MySQL', 'Oracle'],
    description: 'Designing relational and document schemas for reliable, well-indexed, transaction-safe data storage.',
    stat: 'SQL & NOSQL',
    colSpan: 'lg:col-span-5',
  },
  {
    title: 'TOOLS & AUTOMATION',
    badge: 'WORKFLOW',
    items: ['Git', 'GitHub', 'GitHub Actions', 'Google Colab', 'VS Code', 'Google Apps Script', 'Looker Studio'],
    description: 'Automating reporting pipelines, CI workflows, and interactive dashboards to cut manual effort and improve visibility.',
    stat: 'AUTOMATED',
    colSpan: 'lg:col-span-7',
  },
];

// Cycling accent palette so each individual tech chip lights up in a different shade on hover
const CHIP_COLORS = ['#2F6C4F', '#3F7A5A', '#1F4A34', '#4F7A63', '#3B6E52', '#265C42'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const SkillsSection: React.FC = () => {
  const [, setHoveredIdx] = useState<number | null>(null);

  return (
    <section
      id="skills"
      className="relative w-screen bg-[#EAE6DB] text-[#1C231D] font-sans selection:bg-[#2F6C4F] selection:text-white pt-8 pb-24 px-6 sm:px-12 lg:px-20 overflow-hidden flex flex-col justify-center"
    >
      {/* Ambient Glows */}
      <div className="absolute top-1/3 left-1/4 w-[34rem] h-[34rem] bg-[#2F6C4F]/8 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[28rem] h-[28rem] bg-[#4F7A63]/8 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* Eyebrow Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center space-x-4 mb-7"
        >
          <span
            className="text-[12.5px] font-medium tracking-[0.35em] uppercase text-[#2F6C4F]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            03 / TECH MATRIX
          </span>
          <div className="w-20 h-[1px] bg-gradient-to-r from-[#2F6C4F]/80 via-[#4F7A63]/40 to-transparent" />
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight uppercase leading-[0.85] select-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#1C231D] via-[#3A342C] to-[#5A4E3E] drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
              WORKING TOOLKIT.
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#6FAE8B] via-[#2F6C4F] to-[#1F4A34] drop-shadow-[0_6px_18px_rgba(176,121,60,0.22)]">
              APPLIED IN PRACTICE.
            </span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {bentoCategories.map((block, idx) => (
            <motion.div
              key={block.title}
              variants={cardVariants}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              whileHover={{ y: -5, transition: { duration: 0.25 } }}
              className={`${block.colSpan} relative p-8 sm:p-9 rounded-sm border border-[#4F7A63]/25 bg-white/85 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-[#2F6C4F]/70 hover:shadow-[0_16px_45px_rgba(176,121,60,0.12)] cursor-pointer group`}
            >
              {/* Top Subtle Border Highlight */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2F6C4F]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Corner Minimal Pins */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#2F6C4F]/40 group-hover:border-[#2F6C4F] transition-colors duration-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#2F6C4F]/40 group-hover:border-[#2F6C4F] transition-colors duration-300" />

              {/* Card Meta Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11.5px] font-mono tracking-[0.25em] uppercase text-[#2F6C4F] group-hover:text-[#3F7A5A] transition-colors">
                  {block.badge}
                </span>
                <span className="text-[11.5px] font-mono px-2.5 py-0.5 border border-[#4F7A63]/30 text-[#34372F] bg-[#EAE6DB] group-hover:border-[#2F6C4F]/50 group-hover:text-[#1C231D] transition-all">
                  {block.stat}
                </span>
              </div>

              {/* Title */}
              <h3
                className="text-3xl sm:text-4xl font-normal tracking-wide text-[#1C231D] mb-3 group-hover:text-[#3F7A5A] transition-colors"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {block.title}
              </h3>

              {/* Description */}
              <p
                className="text-sm sm:text-base text-[#34372F] font-normal leading-relaxed mb-7 max-w-xl group-hover:text-[#4A4239] transition-colors"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                {block.description}
              </p>

              {/* Interactive Tag Chips — each gets its own hover color */}
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[#4F7A63]/15">
                {block.items.map((tech, tIdx) => {
                  const chipColor = CHIP_COLORS[tIdx % CHIP_COLORS.length];
                  return (
                    <motion.span
                      key={tech}
                      whileHover={{
                        scale: 1.08,
                        y: -3,
                        backgroundColor: chipColor,
                        borderColor: chipColor,
                        color: '#FDFCF8',
                      }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="px-3.5 py-1.5 text-[12.5px] font-semibold tracking-[0.16em] uppercase rounded-sm border border-[#4F7A63]/30 bg-[#EAE6DB] text-[#2E312B] cursor-pointer shadow-sm"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      {tech}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default SkillsSection;
