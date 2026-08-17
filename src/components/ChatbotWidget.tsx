// src/components/ChatbotWidget.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

// ---- Knowledge base pulled directly from Atharva's resume / portfolio content ----
const KB: { keywords: string[]; answer: string }[] = [
  {
    keywords: ['who are you', 'about you', 'about atharva', 'who is atharva', 'introduce', 'yourself'],
    answer:
      "I'm Atharva Phanse, an Information Technology student and Software Developer with hands-on experience in full-stack web development, AI integration, data analysis, and workflow automation. I work with Python, JavaScript, TypeScript, React, and modern frameworks to build AI-powered applications, REST APIs, and database-driven systems.",
  },
  {
    keywords: ['skill', 'tech stack', 'technology', 'language', 'framework', 'tools'],
    answer:
      "My core skills: Programming — Python, JavaScript, TypeScript, SQL, HTML, CSS. Web Dev — React.js, Next.js, Node.js, Express.js, FastAPI, Tailwind CSS, REST APIs. Databases — MongoDB, PostgreSQL, MySQL, Oracle. Tools — Git, GitHub, GitHub Actions, Google Colab, VS Code, Google Apps Script, Looker Studio.",
  },
  {
    keywords: ['project', 'flowforge', 'newsnaut', 'built', 'portfolio site', 'work on'],
    answer:
      "My key projects: (1) FlowForge — a full-stack productivity platform (Next.js, TypeScript, MongoDB, Clerk) with Gemini AI workflow builder and Google Calendar sync. (2) NewsNaut — an AI news aggregator (FastAPI, MongoDB Atlas) using Groq + Llama 3.1 for summarization and YouTube tracking. (3) A Quotation & Order Management System built during my internship. (4) This portfolio site itself! Scroll up to see them in detail, or check my GitHub.",
  },
  {
    keywords: ['experience', 'internship', 'intern', 'interext', 'job', 'work history'],
    answer:
      "I interned as a Software Intern at Interext Technologies Pvt. Ltd (Mar–Apr 2025, Mumbai). I built a Quotation and Order Management System using Google Apps Script and Google Sheets, and automated reporting workflows with interactive Looker Studio dashboards.",
  },
  {
    keywords: ['education', 'college', 'degree', 'cgpa', 'university', 'study'],
    answer:
      "I'm pursuing a B.E. in Information Technology at Atharva College of Engineering (2022–2026), with a current CGPA of 8.35.",
  },
  {
    keywords: ['volunteer', 'csi', 'bootcamp', 'codecraft', 'committee', 'extracurricular'],
    answer:
      "I'm an Assistant Publicity Head & Web Team Member for the CSI Committee (2023–2025), where I've helped organize technical events like CSI Bootcamp and CodeCraft, and contributed to event coordination and student engagement.",
  },
  {
    keywords: ['resume', 'cv', 'download'],
    answer:
      "You can download my full resume using the \"Download Resume\" button in the hero section at the top of this page, or I can summarize any part of it right here — just ask about my skills, projects, experience, or education.",
  },
  {
    keywords: ['contact', 'email', 'phone', 'reach', 'hire', 'linkedin', 'github', 'connect'],
    answer:
      "You can reach me at atharvaphanse403@gmail.com or +91-7387089622. I'm also on LinkedIn (atharva-phanse) and GitHub (Atharva45264) — links are in the Contact section below, or use the form there to send me a message directly.",
  },
  {
    keywords: ['available', 'open to work', 'hiring', 'job opportunity', 'looking for'],
    answer:
      "Yes — I'm currently open to work! I'm looking for software development, full-stack, or AI/ML roles and internships. Feel free to reach out via the contact form or email.",
  },
  {
    keywords: ['hi', 'hello', 'hey', 'yo'],
    answer: "Hey! 👋 I'm Atharva's portfolio assistant. Ask me about his skills, projects, experience, education, or how to get in touch.",
  },
];

const FALLBACK =
  "I'm not totally sure about that one — but I can tell you about Atharva's skills, projects, experience, education, or how to contact him. Try asking one of those!";

function getAnswer(input: string): string {
  const lower = input.toLowerCase();
  let best: { answer: string; score: number } | null = null;
  for (const entry of KB) {
    const score = entry.keywords.reduce((acc, kw) => (lower.includes(kw) ? acc + 1 : acc), 0);
    if (score > 0 && (!best || score > best.score)) {
      best = { answer: entry.answer, score };
    }
  }
  return best ? best.answer : FALLBACK;
}

const SUGGESTIONS = ['What are your skills?', 'Tell me about your projects', 'What is your experience?', 'How can I contact you?'];

export const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'bot',
      text: "Hi! I'm Atharva's portfolio assistant. Ask me anything about his skills, projects, experience, or resume.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now(), role: 'user', text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate a brief "thinking" delay for a natural chat feel
    setTimeout(() => {
      const answer = getAnswer(trimmed);
      setMessages((prev) => [...prev, { id: Date.now() + 1, role: 'bot', text: answer }]);
      setIsTyping(false);
    }, 500 + Math.random() * 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#2F6C4F] hover:bg-[#1F4A34] text-white shadow-[0_10px_35px_rgba(47,108,79,0.45)] flex items-center justify-center transition-colors duration-300"
        aria-label="Open chat assistant"
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl leading-none"
            >
              ×
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="text-2xl leading-none"
            >
              💬
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-[60] w-[90vw] max-w-sm h-[70vh] max-h-[520px] bg-[#FDFCF8] border border-[#4F7A63]/30 rounded-2xl shadow-[0_25px_70px_rgba(28,35,29,0.35)] flex flex-col overflow-hidden"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[#1C231D] flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-full bg-[#2F6C4F] flex items-center justify-center text-white text-sm font-bold" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                AP
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">Atharva's Assistant</p>
                <p className="text-[11px] text-[#8FD4B0] leading-tight">Ask about skills, projects, resume</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-[13.5px] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#2F6C4F] text-white rounded-br-sm'
                        : 'bg-[#EAE6DB] text-[#1C231D] rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#EAE6DB] text-[#1C231D] px-4 py-3 rounded-xl rounded-bl-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F7A63] animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F7A63] animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4F7A63] animate-bounce" />
                  </div>
                </div>
              )}

              {/* Suggestion chips — only show before the conversation gets going */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-[11.5px] px-3 py-1.5 rounded-full border border-[#4F7A63]/40 text-[#34372F] hover:bg-[#2F6C4F] hover:text-white hover:border-[#2F6C4F] transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-[#4F7A63]/20 flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about my resume..."
                className="flex-1 bg-[#EAE6DB] border border-[#4F7A63]/25 focus:border-[#2F6C4F] text-[13.5px] text-[#1C231D] placeholder-[#4F7A63]/70 px-3.5 py-2.5 rounded-full outline-none transition-colors"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#2F6C4F] hover:bg-[#1F4A34] text-white flex items-center justify-center shrink-0 transition-colors"
                aria-label="Send message"
              >
                ↑
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
