import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
}

interface ChatResponse {
  success: boolean;
  answer: string;
  conversation_id: string;
  conversation_token: string;
  sources?: {
    title?: string;
    category?: string;
    source?: string;
    url?: string;
  }[];
}

const API_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const SUGGESTIONS = [
  'What are Atharva\'s skills?',
  'Tell me about your projects',
  'What is your experience?',
  'How can I contact you?',
];

const INITIAL_MESSAGE: Message = {
  id: 0,
  role: 'bot',
  text: "Hi! I'm Atharva's portfolio assistant. Ask me anything about his skills, projects, experience, or resume.",
};

export const ChatbotWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    INITIAL_MESSAGE,
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(
    null
  );
  const [conversationToken, setConversationToken] = useState<string | null>(
    null
  );

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedConversationId = sessionStorage.getItem(
      'atharva_conversation_id'
    );

    const storedConversationToken = sessionStorage.getItem(
      'atharva_conversation_token'
    );

    if (storedConversationId && storedConversationToken) {
      setConversationId(storedConversationId);
      setConversationToken(storedConversationToken);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  useEffect(() => {
    if (conversationId) {
      sessionStorage.setItem(
        'atharva_conversation_id',
        conversationId
      );
    }

    if (conversationToken) {
      sessionStorage.setItem(
        'atharva_conversation_token',
        conversationToken
      );
    }
  }, [conversationId, conversationToken]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();

    if (!trimmed || isTyping) {
      return;
    }

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: trimmed,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(
        `${API_URL}/api/chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: trimmed,
            conversation_id: conversationId,
            conversation_token: conversationToken,
            limit: 5,
          }),
        }
      );

      if (!response.ok) {
        let errorMessage =
          'Something went wrong. Please try again.';

        try {
          const errorData = await response.json();

          if (errorData?.detail) {
            errorMessage = errorData.detail;
          }
        } catch {
          // Ignore JSON parsing errors.
        }

        throw new Error(errorMessage);
      }

      const data: ChatResponse = await response.json();

      if (data.conversation_id) {
        setConversationId(data.conversation_id);
      }

      if (data.conversation_token) {
        setConversationToken(data.conversation_token);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text:
            data.answer ||
            "I couldn't generate an answer right now.",
        },
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'bot',
          text:
            error instanceof Error
              ? error.message
              : 'Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* =========================================================
          AI ASSISTANT LAUNCHER
          Large opaque surface intentionally covers the AP
          circle from the background video.
      ========================================================== */}

      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{
          scale: 1.025,
        }}
        whileTap={{
          scale: 0.985,
        }}
        className="
          fixed
          bottom-[25px]
          right-[40px]
          sm:bottom-[25px]
          sm:right-[40px]
          z-[70]

          w-[180px]
          h-[180px]

          max-sm:w-[118px]
          max-sm:h-[118px]
          max-sm:bottom-[24px]
          max-sm:right-[24px]

          rounded-full

          overflow-hidden

          bg-[#1C231D]

          border
          border-[#8FD4B0]/30

          shadow-[0_20px_70px_rgba(28,35,29,0.55)]

          flex
          items-center
          justify-center

          cursor-pointer

          outline-none
        "
        aria-label={
          open
            ? 'Close chat assistant'
            : 'Open AI portfolio assistant'
        }
      >
        {/* Ambient glow */}
        <motion.div
          className="
            absolute
            inset-[-35%]
            rounded-full
            bg-[#2F6C4F]/35
            blur-3xl
          "
          animate={{
            scale: [0.85, 1.12, 0.85],
            opacity: [0.35, 0.65, 0.35],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Outer orbital ring */}
        <motion.div
          className="
            absolute
            w-[132px]
            h-[132px]

            max-sm:w-[88px]
            max-sm:h-[88px]

            rounded-full
            border
            border-[#8FD4B0]/25
          "
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <span
            className="
              absolute
              -top-[3px]
              left-1/2
              -translate-x-1/2

              w-[6px]
              h-[6px]

              max-sm:w-[4px]
              max-sm:h-[4px]

              rounded-full
              bg-[#8FD4B0]
              shadow-[0_0_12px_rgba(143,212,176,0.9)]
            "
          />
        </motion.div>

        {/* Second orbital ring */}
        <motion.div
          className="
            absolute

            w-[108px]
            h-[72px]

            max-sm:w-[72px]
            max-sm:h-[48px]

            rounded-full

            border
            border-[#4F7A63]/45
          "
          animate={{
            rotate: -360,
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* AI core */}
        <motion.div
          className="
            relative
            z-10

            w-[68px]
            h-[68px]

            max-sm:w-[48px]
            max-sm:h-[48px]

            rounded-full

            bg-gradient-to-br
            from-[#8FD4B0]
            via-[#4F7A63]
            to-[#2F6C4F]

            shadow-[0_0_35px_rgba(143,212,176,0.35)]

            flex
            items-center
            justify-center
          "
          animate={{
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Core inner light */}
          <motion.div
            className="
              w-[24px]
              h-[24px]

              max-sm:w-[17px]
              max-sm:h-[17px]

              rounded-full

              bg-[#FDFCF8]

              shadow-[0_0_20px_rgba(253,252,248,0.8)]
            "
            animate={{
              scale: [0.8, 1.15, 0.8],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Small neural points */}
          <motion.span
            className="
              absolute
              w-[5px]
              h-[5px]
              rounded-full
              bg-white
              top-[10px]
              right-[12px]
            "
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.7, 1.3, 0.7],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
            }}
          />

          <motion.span
            className="
              absolute
              w-[4px]
              h-[4px]
              rounded-full
              bg-white
              bottom-[11px]
              left-[13px]
            "
            animate={{
              opacity: [1, 0.2, 1],
              scale: [1.2, 0.7, 1.2],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
            }}
          />
        </motion.div>

        {/* AI label */}
        <div
          className="
            absolute
            bottom-[25px]

            max-sm:bottom-[16px]

            left-0
            right-0

            flex
            justify-center
          "
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close-label"
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -5,
                }}
                className="
                  text-[9px]
                  max-sm:text-[7px]

                  tracking-[0.28em]

                  text-[#8FD4B0]
                  font-medium
                "
              >
                CLOSE
              </motion.span>
            ) : (
              <motion.span
                key="ai-label"
                initial={{
                  opacity: 0,
                  y: 5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -5,
                }}
                className="
                  text-[9px]
                  max-sm:text-[7px]

                  tracking-[0.28em]

                  text-[#8FD4B0]
                  font-medium
                "
              >
                AI ASSISTANT
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Open / close control */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.5,
                rotate: -90,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.5,
                rotate: 90,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                absolute
                top-[20px]
                right-[20px]

                max-sm:top-[12px]
                max-sm:right-[12px]

                w-[26px]
                h-[26px]

                max-sm:w-[20px]
                max-sm:h-[20px]

                rounded-full

                bg-[#FDFCF8]/10
                backdrop-blur-md

                border
                border-white/10

                flex
                items-center
                justify-center

                text-[#FDFCF8]
                text-lg
                max-sm:text-sm

                z-20
              "
            >
              ×
            </motion.div>
          )}
        </AnimatePresence>

        {/* Decorative particles */}
        <motion.span
          className="
            absolute
            w-[3px]
            h-[3px]
            rounded-full
            bg-[#8FD4B0]
            left-[35px]
            top-[52px]
            max-sm:left-[23px]
            max-sm:top-[34px]
          "
          animate={{
            y: [-4, 5, -4],
            opacity: [0.2, 1, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />

        <motion.span
          className="
            absolute
            w-[3px]
            h-[3px]
            rounded-full
            bg-[#8FD4B0]
            right-[35px]
            bottom-[55px]
            max-sm:right-[23px]
            max-sm:bottom-[36px]
          "
          animate={{
            y: [5, -5, 5],
            opacity: [1, 0.2, 1],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
          }}
        />
      </motion.button>

      {/* =========================================================
          CHAT PANEL
      ========================================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.94,
            }}
            transition={{
              duration: 0.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              fixed

              bottom-[200px]
              right-6

              max-sm:bottom-[125px]
              max-sm:right-4

              z-[65]

              w-[90vw]
              max-w-sm

              h-[70vh]
              max-h-[520px]

              bg-[#FDFCF8]/95
              backdrop-blur-xl

              border
              border-[#4F7A63]/25

              rounded-2xl

              shadow-[0_30px_90px_rgba(28,35,29,0.38)]

              flex
              flex-col

              overflow-hidden
            "
            style={{
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {/* Header */}
            <div
              className="
                px-5
                py-4

                bg-[#1C231D]

                flex
                items-center
                gap-3

                shrink-0
              "
            >
              {/* Mini AI indicator instead of AP */}
              <div
                className="
                  relative
                  w-9
                  h-9
                  rounded-full
                  bg-[#2F6C4F]

                  flex
                  items-center
                  justify-center

                  shadow-[0_0_18px_rgba(47,108,79,0.45)]
                "
              >
                <motion.span
                  className="
                    w-2.5
                    h-2.5
                    rounded-full
                    bg-[#8FD4B0]
                    shadow-[0_0_12px_rgba(143,212,176,0.9)]
                  "
                  animate={{
                    scale: [0.8, 1.25, 0.8],
                    opacity: [0.6, 1, 0.6],
                  }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">
                  Atharva's Assistant
                </p>

                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8FD4B0]" />

                  <p className="text-[11px] text-[#8FD4B0] leading-tight">
                    AI portfolio assistant
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="
                flex-1
                overflow-y-auto
                px-4
                py-4
                space-y-3
              "
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-[13.5px] leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-[#2F6C4F] text-white rounded-br-sm'
                        : 'bg-[#EAE6DB] text-[#1C231D] rounded-bl-sm'
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => (
                          <p className="mb-2 last:mb-0">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold">
                            {children}
                          </strong>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5 space-y-1 mb-2">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-5 space-y-1 mb-2">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li>{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="px-1.5 py-0.5 rounded bg-black/10 text-[12px] font-mono">
                            {children}
                          </code>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-medium hover:opacity-70"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {m.text}
                    </ReactMarkdown>
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

              {messages.length === 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="
                        text-[11.5px]
                        px-3
                        py-1.5
                        rounded-full

                        border
                        border-[#4F7A63]/40

                        text-[#34372F]

                        hover:bg-[#2F6C4F]
                        hover:text-white
                        hover:border-[#2F6C4F]

                        transition-colors
                      "
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="
                p-3
                border-t
                border-[#4F7A63]/20

                flex
                items-center
                gap-2

                shrink-0
              "
            >
              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                placeholder="Ask about my resume..."
                maxLength={2000}
                disabled={isTyping}
                className="
                  flex-1

                  bg-[#EAE6DB]

                  border
                  border-[#4F7A63]/25

                  focus:border-[#2F6C4F]

                  text-[13.5px]
                  text-[#1C231D]

                  placeholder-[#4F7A63]/70

                  px-3.5
                  py-2.5

                  rounded-full

                  outline-none

                  transition-colors

                  disabled:opacity-60
                "
              />

              <button
                type="submit"
                disabled={
                  isTyping ||
                  !input.trim()
                }
                className="
                  w-10
                  h-10

                  rounded-full

                  bg-[#2F6C4F]
                  hover:bg-[#1F4A34]

                  text-white

                  flex
                  items-center
                  justify-center

                  shrink-0

                  transition-colors

                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
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