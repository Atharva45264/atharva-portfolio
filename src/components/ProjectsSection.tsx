import React from 'react';
import { motion } from 'framer-motion';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

interface Project {
  number: string;
  title: string;
  category: string;
  description: string;
  githubUrl?: string;
  linkLabel?: string;
  tech: string[];
  metrics: { label: string; value: string }[];
}

const projects: Project[] = [
  {
    number: '01',
    title: 'FlowForge',
    category: 'PRODUCTIVITY / AI SAAS PLATFORM',
    description:
      'An all-in-one productivity platform combining task management, notes, calendar, pages, whiteboard, and collaborative workspaces in a single full-stack application. Integrated Gemini-powered AI capabilities, Google Calendar sync, real-time collaboration, and an AI workflow builder for automating repetitive work.',
    githubUrl: 'https://github.com/Atharva45264/FlowForge',
    tech: [
      'Next.js',
      'TypeScript',
      'React',
      'MongoDB',
      'Clerk',
      'Gemini AI',
      'Google Calendar API',
      'Real-Time Sync',
    ],
    metrics: [
      { label: 'MODULES', value: 'Tasks, Notes, Whiteboard' },
      { label: 'AI ENGINE', value: 'Gemini Workflow Builder' },
      { label: 'SYNC', value: 'Real-Time Collaboration' },
    ],
  },
  {
    number: '02',
    title: 'NewsNaut',
    category: 'AI / CONTENT AGGREGATION PLATFORM',
    description:
      'An AI-powered news aggregation platform that collects, categorizes, and summarizes content from multiple sources. Integrated Groq API with Llama 3.1 for fast summarization, live YouTube tracking, automated email digests, and GitHub Actions for scheduled content processing.',
    githubUrl: 'https://github.com/Atharva45264/NewsNaut',
    tech: [
      'FastAPI',
      'Python',
      'MongoDB Atlas',
      'Next.js',
      'TypeScript',
      'Groq API',
      'Llama 3.1',
      'GitHub Actions',
    ],
    metrics: [
      { label: 'AI MODEL', value: 'Llama 3.1 via Groq' },
      { label: 'TRACKING', value: 'YouTube + Multi-Source' },
      { label: 'AUTOMATION', value: 'Scheduled Email Digests' },
    ],
  },
  {
    number: '03',
    title: 'Quotation & Order System',
    category: 'BUSINESS AUTOMATION / INTERNSHIP',
    description:
      'Built during my internship at Interext Technologies — a Quotation and Order Management System using Google Apps Script and Google Sheets to streamline business operations. Paired with automated reporting workflows and interactive Looker Studio dashboards, cutting manual data-entry effort and improving visibility for decision-making.',
    linkLabel: 'PRIVATE / COMPANY PROJECT',
    tech: [
      'Google Apps Script',
      'Google Sheets',
      'Looker Studio',
      'Workflow Automation',
    ],
    metrics: [
      { label: 'ROLE', value: 'Software Intern' },
      { label: 'IMPACT', value: 'Reduced Manual Effort' },
      { label: 'OUTPUT', value: 'Live Dashboards' },
    ],
  },
  {
    number: '04',
    title: 'This Portfolio',
    category: 'PERSONAL SITE / INTERACTIVE UI',
    description:
      'The cinematic, scroll-driven portfolio you\'re looking at right now. A fully custom React and TypeScript build with scroll-stacking project cards, an animated timeline, a tech bento grid, and a built-in AI assistant that can answer questions about my background, skills, and resume.',
    linkLabel: 'YOU ARE HERE',
    tech: [
      'React',
      'TypeScript',
      'Vite',
      'Tailwind CSS',
      'Framer Motion',
      'Lenis Scroll',
    ],
    metrics: [
      { label: 'DESIGN', value: 'Cinematic Scroll UI' },
      { label: 'ASSISTANT', value: 'Built-In AI Chatbot' },
      { label: 'STACK', value: 'React + Tailwind' },
    ],
  },
];

export const ProjectsSection: React.FC = () => {
  return (
    <section
      id="work"
      className="relative w-full bg-[#EAE6DB] text-[#1C231D] font-sans selection:bg-[#2F6C4F] selection:text-white pt-20 pb-32 px-6 sm:px-12 lg:px-20"
    >
      {/* Studio Ambient Glows */}
      <div className="absolute top-1/4 left-1/3 w-[36rem] h-[36rem] bg-[#2F6C4F]/8 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-[#4F7A63]/8 rounded-full blur-[170px] pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* Eyebrow Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex items-center space-x-4 mb-5"
        >
          <span
            className="text-[12.5px] font-medium tracking-[0.35em] uppercase text-[#2F6C4F]"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            02 / FEATURED WORK
          </span>
          <div className="w-20 h-[1px] bg-gradient-to-r from-[#2F6C4F]/80 via-[#4F7A63]/40 to-transparent" />
        </motion.div>

        {/* Section Headline */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16"
        >
          <h2
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight uppercase leading-[0.85] select-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#1C231D] via-[#3A342C] to-[#5A4E3E] drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
              SELECTED WORKS.
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#6FAE8B] via-[#2F6C4F] to-[#1F4A34] drop-shadow-[0_6px_18px_rgba(176,121,60,0.22)]">
              BUILT TO SOLVE.
            </span>
          </h2>

          <p
            className="text-sm sm:text-base font-normal text-[#34372F] max-w-sm mt-4 md:mt-0 leading-relaxed"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Scroll down to unfold the project cards. Each platform was built end-to-end, from architecture to AI integration.
          </p>
        </motion.div>

        {/* Scroll Stacking Deck */}
        <ScrollStack
          itemDistance={20}
          itemScale={0.035}
          itemStackDistance={28}
          stackPosition="15%"
          scaleEndPosition="6%"
          baseScale={0.88}
          useWindowScroll={true}
        >
          {projects.map((project) => (
            <ScrollStackItem key={project.title}>
              <div className="relative w-full rounded-2xl border border-[#4F7A63]/30 bg-white p-8 sm:p-12 shadow-[0_25px_70px_rgba(90,78,62,0.18)] group overflow-hidden transition-colors duration-500 hover:border-[#2F6C4F]">

                {/* Top Border Light Flare */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2F6C4F]/70 to-transparent" />

                {/* Corner Minimal L-Brackets */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#2F6C4F]/50 group-hover:border-[#2F6C4F] transition-colors" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#2F6C4F]/50 group-hover:border-[#2F6C4F] transition-colors" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#2F6C4F]/50 group-hover:border-[#2F6C4F] transition-colors" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#2F6C4F]/50 group-hover:border-[#2F6C4F] transition-colors" />

                {/* Big Background Watermark Number */}
                <span
                  className="absolute -bottom-6 -right-3 text-8xl sm:text-9xl font-bold text-[#4F7A63]/8 select-none pointer-events-none leading-none"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {project.number}
                </span>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">

                  {/* Left Column (7 Cols) */}
                  <div className="lg:col-span-7 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center space-x-3 mb-4">
                        <span className="text-sm font-mono font-bold text-[#2F6C4F]">
                          {project.number} //
                        </span>
                        <span className="text-[12px] font-mono tracking-[0.25em] uppercase text-[#34372F]">
                          {project.category}
                        </span>
                      </div>

                      <h3
                        className="text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1C231D] mb-4 group-hover:text-[#3F7A5A] transition-colors uppercase leading-[0.9]"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {project.title}
                      </h3>

                      <p
                        className="text-sm sm:text-base md:text-[15.5px] font-normal text-[#5A5147] leading-[1.85] tracking-wide mb-8 max-w-2xl"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {project.description}
                      </p>
                    </div>

                    {/* Tech Stack Pills */}
                    <div className="flex flex-wrap gap-2 pt-6 border-t border-[#4F7A63]/20">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 text-[11.5px] font-medium tracking-[0.16em] uppercase rounded-sm border border-[#4F7A63]/25 bg-[#EAE6DB] text-[#4A4239] group-hover:border-[#2F6C4F]/50 transition-all duration-300"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column (5 Cols) */}
                  <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6 lg:pl-6 lg:border-l lg:border-[#4F7A63]/20">
                    <div className="space-y-3">
                      <span className="text-[11px] font-mono tracking-[0.25em] uppercase text-[#4F7A63] block mb-2">
                        // PROJECT HIGHLIGHTS
                      </span>
                      {project.metrics.map((m) => (
                        <div
                          key={m.label}
                          className="p-3.5 rounded-sm border border-[#4F7A63]/20 bg-[#EAE6DB] flex items-center justify-between"
                        >
                          <span className="text-[11.5px] font-mono text-[#34372F]">
                            {m.label}
                          </span>
                          <span className="text-[12.5px] font-mono font-medium text-[#3A342C]">
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    {project.githubUrl ? (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center space-x-3 px-6 py-3.5 border border-[#4F7A63] bg-[#EAE6DB] hover:border-[#2F6C4F] hover:bg-[#2F6C4F] text-[#1C231D] hover:text-white text-[12.5px] font-semibold tracking-[0.2em] uppercase transition-all duration-300 shadow-[0_0_20px_rgba(47,108,79,0.1)]"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <span>VIEW ON GITHUB</span>
                        <span className="text-sm">↗</span>
                      </a>
                    ) : (
                      <div
                        className="inline-flex items-center justify-center space-x-3 px-6 py-3.5 border border-[#4F7A63]/40 bg-[#EAE6DB]/60 text-[#34372F] text-[12.5px] font-semibold tracking-[0.2em] uppercase"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        <span>{project.linkLabel}</span>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </ScrollStackItem>
          ))}
        </ScrollStack>

      </div>
    </section>
  );
};

export default ProjectsSection;
