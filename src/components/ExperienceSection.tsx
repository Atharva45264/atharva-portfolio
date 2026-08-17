// src/components/ExperienceSection.tsx
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface RouteStop {
  id: string;
  year: string;
  title: string;
  organization: string;
  description: string;
}

const journey: RouteStop[] = [
  {
    id: '01',
    year: 'MAR - APR 2025',
    title: 'SOFTWARE INTERN',
    organization: 'INTEREXT TECHNOLOGIES PVT. LTD, MUMBAI',
    description: 'Developed a Quotation and Order Management System using Google Apps Script and Google Sheets. Automated reporting workflows and built interactive dashboards in Looker Studio, improving data visibility and reducing manual effort.',
  },
  {
    id: '02',
    year: '2023 - 2025',
    title: 'ASSISTANT PUBLICITY HEAD',
    organization: 'CSI COMMITTEE',
    description: 'Helped organize and manage college technical events including CSI Bootcamp and CodeCraft as part of the Web Team, contributing to event coordination, technical promotions, and student engagement.',
  },
  {
    id: '03',
    year: '2022 - 2026',
    title: 'B.E. IN INFORMATION TECHNOLOGY',
    organization: 'ATHARVA COLLEGE OF ENGINEERING',
    description: 'Bachelor of Engineering Graduate in Information Technology with a CGPA of 8.35, building a strong foundation in software development, data structures, and modern web technologies.',
  },
];

export const ExperienceSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 70%', 'end 90%'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section
      id="experience"
      ref={containerRef}
      className="relative w-full bg-[#EAE6DB] text-[#1C231D] font-sans selection:bg-[#2F6C4F] selection:text-white pt-4 pb-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-[#2F6C4F]/[0.05] rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto w-full relative z-10">

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
            04 / EXPERIENCE
          </span>
          <div className="w-20 h-[1px] bg-gradient-to-r from-[#2F6C4F]/80 via-[#4F7A63]/40 to-transparent" />
        </motion.div>

        {/* Section Headline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight uppercase leading-[0.85] select-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#1C231D] via-[#3A342C] to-[#5A4E3E] drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
              EXPERIENCE &amp;
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#6FAE8B] via-[#2F6C4F] to-[#1F4A34] drop-shadow-[0_6px_18px_rgba(176,121,60,0.22)]">
              MILESTONES.
            </span>
          </h2>
        </motion.div>

        {/* Minimalist Route Map */}
        <div className="relative w-full">

          {/* Background Track */}
          <div className="absolute left-[19px] md:left-[140px] top-4 bottom-8 w-[1px] bg-[#4F7A63]/20" />

          {/* Animated Gold Track */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-[19px] md:left-[140px] top-4 w-[2px] bg-gradient-to-b from-[#2F6C4F] via-[#6FAE8B] to-[#4F7A63]/10 shadow-[0_0_10px_rgba(176,121,60,0.4)] origin-top"
          />

          <div className="space-y-12">
            {journey.map((stop, idx) => (
              <motion.div
                key={stop.id}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.7, delay: idx * 0.08 }}
                className="relative flex flex-col md:flex-row items-start group"
              >
                {/* Desktop Year (Left side of track) */}
                <div className="hidden md:block w-[140px] shrink-0 pr-8 pt-0.5 text-right">
                  <span className="text-[11.5px] font-mono tracking-[0.2em] text-[#4F7A63] group-hover:text-[#2F6C4F] transition-colors">
                    {stop.year}
                  </span>
                </div>

                {/* Route Node */}
                <div className="absolute left-[19px] md:left-[140px] top-1.5 -translate-x-1/2 flex items-center justify-center">
                  <div className="absolute w-6 h-6 rounded-full border border-[#2F6C4F]/0 group-hover:border-[#2F6C4F]/40 group-hover:scale-150 transition-all duration-700 ease-out" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#EAE6DB] border border-[#4F7A63] group-hover:bg-[#2F6C4F] group-hover:border-[#2F6C4F] group-hover:shadow-[0_0_12px_rgba(176,121,60,0.6)] transition-colors duration-300" />
                </div>

                {/* Content (Right side of track) */}
                <div className="ml-14 md:ml-12 pl-2">
                  {/* Mobile Year */}
                  <div className="md:hidden mb-1.5">
                    <span className="text-[11.5px] font-mono tracking-[0.2em] text-[#2F6C4F]">
                      {stop.year}
                    </span>
                  </div>

                  <h3
                    className="text-3xl sm:text-4xl tracking-wide text-[#1C231D] group-hover:text-[#3F7A5A] transition-colors mb-1 leading-none"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {stop.title}
                  </h3>

                  <span
                    className="block text-[11.5px] font-medium tracking-[0.2em] uppercase text-[#4F7A63] mb-2"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {stop.organization}
                  </span>

                  <p
                    className="text-sm sm:text-[14.5px] font-normal text-[#34372F] leading-[1.7] max-w-lg group-hover:text-[#4A4239] transition-colors"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {stop.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
