import React from 'react';
import { motion } from 'framer-motion';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

const projects = [
  {
    num: '01',
    title: 'FlowForge',
    category: 'FULL-STACK / PRODUCTIVITY',
    description:
      'A full-stack productivity platform combining workspace management, AI assistance, planning, collaboration, and visual workflows into one modern application.',
    github: 'https://github.com/Atharva45264/FlowForge',
    image: '/projects/flowforge.png',
    imageAlt: 'FlowForge productivity platform',
    tech: ['Next.js', 'TypeScript', 'MongoDB', 'Gemini', 'Liveblocks', 'Clerk'],
    highlights: [
      { value: 'AI', label: 'ASSISTANT' },
      { value: 'REAL-TIME', label: 'COLLABORATION' },
      { value: 'FULL', label: 'STACK' },
    ],
  },

  {
    num: '02',
    title: 'NewsNaut',
    category: 'FULL-STACK / AUTOMATION',
    description:
      'An automated news platform that aggregates content from multiple sources, generates AI-powered summaries, tracks YouTube content, and delivers daily email digests.',
    github: 'https://github.com/Atharva45264/NewsNaut',
    image: '/projects/newsnaut.png',
    imageAlt: 'NewsNaut news platform',
    tech: ['FastAPI', 'Python', 'MongoDB', 'Groq', 'Llama 3.1', 'GitHub Actions'],
    highlights: [
      { value: 'AI', label: 'SUMMARIZATION' },
      { value: 'RSS', label: 'AGGREGATION' },
      { value: 'AUTO', label: 'EMAIL DIGEST' },
    ],
  },

  {
    num: '03',
    title: 'VisionMeet',
    category: 'AI / MEETING PLATFORM',
    description:
      'A real-time AI-powered meeting assistant combining video conferencing, live transcription, chat, and contextual AI assistance using Stream Video, Vision Agents, and Gemini.',
    github: 'https://github.com/Atharva45264/VisionMeet',
    image: '/projects/visionmeet.png',
    imageAlt: 'VisionMeet AI meeting assistant',
    tech: ['Next.js', 'Python', 'Gemini', 'Stream Video', 'Stream Chat', 'Vision Agents'],
    highlights: [
      { value: 'LIVE', label: 'TRANSCRIPTION' },
      { value: 'AI', label: 'ASSISTANT' },
      { value: 'REAL-TIME', label: 'VIDEO' },
    ],
  },

  {
    num: '04',
    title: 'Sentinel AI',
    category: 'AI / NETWORK SECURITY',
    description:
      'An AI-powered Network Intrusion Detection System that captures network traffic, extracts and preprocesses features, and uses a deep-learning model to identify potential anomalies and malicious activity.',
    github: 'https://github.com/Atharva45264/Sentinel-AI-Network-IDS',
    image: '/projects/sentinel-ai.png',
    imageAlt: 'Sentinel AI network security system',
    tech: ['Python', 'TensorFlow', 'Keras', 'Pandas', 'NumPy', 'Scikit-learn'],
    highlights: [
      { value: 'AI', label: 'INTRUSION DETECTION' },
      { value: 'LIVE', label: 'NETWORK TRAFFIC' },
      { value: 'DEEP', label: 'LEARNING' },
    ],
  },

  {
    num: '05',
    title: 'Atharva Portfolio',
    category: 'FRONTEND / PERSONAL BRAND',
    description:
      'A modern interactive developer portfolio built to showcase my skills, experience, projects, and work through smooth animations, immersive visuals, and an integrated AI assistant.',
    github: 'https://github.com/Atharva45264/atharva-portfolio',
    image: '/projects/portfolio.png',
    imageAlt: 'Atharva Phanse portfolio',
    tech: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Framer Motion', 'Lenis'],
    highlights: [
      { value: 'SMOOTH', label: 'INTERACTIONS' },
      { value: 'AI', label: 'ASSISTANT' },
      { value: 'MODERN', label: 'UI' },
    ],
  },
];

export const ProjectsSection: React.FC = () => {
  return (
    <section
      id="work"
      className="relative w-screen bg-[#EAE6DB] text-[#1C231D] font-sans py-28 lg:py-36 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* ================= BACKGROUND GLOWS ================= */}

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.06, 0.12, 0.06],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 -right-40 w-[32rem] h-[32rem] bg-[#2F6C4F] rounded-full blur-[170px] pointer-events-none"
      />

      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/4 -left-40 w-[28rem] h-[28rem] bg-[#4F7A63] rounded-full blur-[170px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto relative z-10">

        {/* ================= HEADER ================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-16 lg:mb-20"
        >
          <div className="flex items-center space-x-4 mb-6">
            <span
              className="text-[12.5px] font-medium tracking-[0.35em] uppercase text-[#2F6C4F]"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              02 / SELECTED WORK
            </span>

            <div className="w-20 h-[1px] bg-gradient-to-r from-[#2F6C4F]/80 via-[#4F7A63]/40 to-transparent" />
          </div>

          <h2
            className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] uppercase leading-[0.82] tracking-tight"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#1C231D] via-[#3A342C] to-[#5A4E3E]">
              THINGS I'VE
            </span>

            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#6FAE8B] via-[#2F6C4F] to-[#1F4A34]">
              BUILT.
            </span>
          </h2>

          <p
            className="mt-6 max-w-2xl text-sm sm:text-base text-[#34372F] leading-[1.8] tracking-wide"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            A selection of software, AI, full-stack, and data-driven projects
            built while exploring modern technologies and solving practical
            problems.
          </p>
        </motion.div>

        {/* ================= PROJECT STACK ================= */}

        <ScrollStack
  useWindowScroll={true}
  itemDistance={70}
  itemStackDistance={28}
  stackPosition="16%"
  scaleEndPosition="8%"
  baseScale={0.94}
  itemScale={0.015}
  rotationAmount={1}
  blurAmount={0}
>
          {projects.map((project) => (
            <ScrollStackItem key={project.num}>

              <div className="relative h-full w-full overflow-hidden rounded-2xl border border-[#2F6C4F]/20 bg-[#F7F5EF]/95 backdrop-blur-xl shadow-[0_25px_70px_rgba(90,78,62,0.16)]">

                {/* Decorative Glow */}

                <div className="absolute -top-32 -right-32 w-72 h-72 rounded-full bg-[#2F6C4F]/10 blur-[80px] pointer-events-none" />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 h-full p-7 sm:p-9 lg:p-11">

                  {/* ================= LEFT CONTENT ================= */}

                  <div className="flex flex-col justify-between min-w-0">

                    <div>

                      {/* Top */}

                      <div className="flex items-center justify-between gap-4 mb-8">

                        <span
                          className="text-xs tracking-[0.28em] font-medium text-[#2F6C4F]"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          {project.num}
                        </span>

                        <span
                          className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#5A4E3E] text-right"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          {project.category}
                        </span>

                      </div>

                      {/* Title */}

                      <h3
                        className="text-5xl sm:text-6xl lg:text-7xl uppercase leading-[0.85] tracking-tight text-[#1C231D]"
                        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                      >
                        {project.title}
                      </h3>

                      {/* Description */}

                      <p
                        className="mt-7 max-w-xl text-sm sm:text-[15px] leading-[1.8] text-[#34372F] tracking-wide"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        {project.description}
                      </p>

                      {/* Tech */}

                      <div className="flex flex-wrap gap-2 mt-7">

                        {project.tech.map((technology) => (
                          <span
                            key={technology}
                            className="rounded-full border border-[#2F6C4F]/20 bg-[#EAE6DB]/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.14em] text-[#3A342C]"
                            style={{ fontFamily: "'Montserrat', sans-serif" }}
                          >
                            {technology}
                          </span>
                        ))}

                      </div>

                    </div>

                    {/* Bottom */}

                    <div className="mt-10">

                      <div className="grid grid-cols-3 gap-3 mb-7">

                        {project.highlights.map((highlight) => (
                          <div
                            key={highlight.label}
                            className="border-t border-[#2F6C4F]/20 pt-3"
                          >

                            <div
                              className="text-lg sm:text-xl uppercase text-[#2F6C4F]"
                              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                            >
                              {highlight.value}
                            </div>

                            <div
                              className="text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-[#5A4E3E] mt-1"
                              style={{ fontFamily: "'Montserrat', sans-serif" }}
                            >
                              {highlight.label}
                            </div>

                          </div>
                        ))}

                      </div>

                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 rounded-full border border-[#2F6C4F]/30 bg-[#2F6C4F] px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white transition-all duration-300 hover:bg-[#1F4A34] hover:border-[#1F4A34] hover:shadow-[0_10px_30px_rgba(47,108,79,0.25)]"
                        style={{ fontFamily: "'Montserrat', sans-serif" }}
                      >
                        View on GitHub
                        <span className="text-sm">↗</span>
                      </a>

                    </div>

                  </div>

                  {/* ================= RIGHT PROJECT VISUAL ================= */}

                  <div className="relative flex items-center justify-center min-h-[260px] lg:min-h-[360px]">

                    {/* Glow behind image */}

                    <motion.div
                      animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.12, 0.2, 0.12],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="absolute w-64 h-64 rounded-full bg-[#2F6C4F]/20 blur-[80px]"
                    />

                    {/* Browser / Glass Frame */}

                    <motion.div
                      whileHover={{
                        y: -8,
                        rotateY: -3,
                        rotateX: 2,
                      }}
                      transition={{
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="relative w-full max-w-[520px] overflow-hidden rounded-xl border border-[#2F6C4F]/25 bg-white/50 backdrop-blur-md shadow-[0_25px_60px_rgba(47,108,79,0.15)]"
                    >

                      {/* Browser top bar */}

                      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#2F6C4F]/15 bg-white/40">

                        <span className="w-2 h-2 rounded-full bg-[#2F6C4F]/40" />
                        <span className="w-2 h-2 rounded-full bg-[#2F6C4F]/25" />
                        <span className="w-2 h-2 rounded-full bg-[#2F6C4F]/15" />

                        <div className="ml-3 h-4 flex-1 rounded-full bg-[#2F6C4F]/5" />

                      </div>

                      {/* Project Image */}

                      <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE6DB]">

                        <img
                          src={project.image}
                          alt={project.imageAlt}
                          className="w-full h-full object-cover object-top transition-transform duration-700 ease-out hover:scale-[1.035]"
                        />

                        {/* Glass Overlay */}

                        <div className="absolute inset-0 bg-gradient-to-tr from-[#2F6C4F]/10 via-transparent to-white/15 pointer-events-none" />

                      </div>

                      {/* Project label */}

                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between rounded-lg border border-white/30 bg-white/50 backdrop-blur-md px-3 py-2">

                        <span
                          className="text-[9px] uppercase tracking-[0.18em] text-[#1C231D]"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          {project.title}
                        </span>

                        <span
                          className="text-[8px] uppercase tracking-[0.14em] text-[#2F6C4F]"
                          style={{ fontFamily: "'Montserrat', sans-serif" }}
                        >
                          PROJECT PREVIEW
                        </span>

                      </div>

                    </motion.div>

                  </div>

                </div>

                {/* Project Number Watermark */}

                <span
                  className="absolute bottom-[-1.5rem] right-4 text-[8rem] sm:text-[10rem] lg:text-[12rem] leading-none font-normal text-[#2F6C4F]/[0.035] select-none pointer-events-none"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {project.num}
                </span>

              </div>

            </ScrollStackItem>
          ))}
        </ScrollStack>

      </div>
    </section>
  );
};

export default ProjectsSection;