import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  'What are your skills?',
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

  /*
   * Restore an existing public conversation
   * if the visitor refreshes the page.
   */
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

  /*
   * Keep the chat scrolled to the latest message.
   */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  /*
   * Save the public conversation credentials
   * for the current browser session.
   */
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

      /*
       * Store the conversation credentials returned
       * by the backend.
       */
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
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        className="fixed bottom-6 right-6 z-[60] w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#2F6C4F] hover:bg-[#1F4A34] text-white shadow-[0_10px_35px_rgba(47,108,79,0.45)] flex items-center justify-center transition-colors duration-300"
        aria-label="Open chat assistant"
      >
        <AnimatePresence
          mode="wait"
          initial={false}
        >
          {open ? (
            <motion.span
              key="close"
              initial={{
                rotate: -90,
                opacity: 0,
              }}
              animate={{
                rotate: 0,
                opacity: 1,
              }}
              exit={{
                rotate: 90,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
              className="text-2xl leading-none"
            >
              ×
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{
                scale: 0.7,
                opacity: 0,
              }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              exit={{
                scale: 0.7,
                opacity: 0,
              }}
              transition={{
                duration: 0.2,
              }}
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
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="fixed bottom-24 right-6 z-[60] w-[90vw] max-w-sm h-[70vh] max-h-[520px] bg-[#FDFCF8] border border-[#4F7A63]/30 rounded-2xl shadow-[0_25px_70px_rgba(28,35,29,0.35)] flex flex-col overflow-hidden"
            style={{
              fontFamily: "'Montserrat', sans-serif",
            }}
          >
            {/* Header */}
            <div className="px-5 py-4 bg-[#1C231D] flex items-center gap-3 shrink-0">
              <div
                className="w-9 h-9 rounded-full bg-[#2F6C4F] flex items-center justify-center text-white text-sm font-bold"
                style={{
                  fontFamily:
                    "'Bebas Neue', sans-serif",
                }}
              >
                AP
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white leading-tight">
                  Atharva's Assistant
                </p>

                <p className="text-[11px] text-[#8FD4B0] leading-tight">
                  Ask about skills, projects, resume
                </p>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
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

              {/* Suggestion chips */}
              {messages.length === 1 && !isTyping && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() =>
                        sendMessage(s)
                      }
                      className="text-[11.5px] px-3 py-1.5 rounded-full border border-[#4F7A63]/40 text-[#34372F] hover:bg-[#2F6C4F] hover:text-white hover:border-[#2F6C4F] transition-colors"
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
              className="p-3 border-t border-[#4F7A63]/20 flex items-center gap-2 shrink-0"
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
                className="flex-1 bg-[#EAE6DB] border border-[#4F7A63]/25 focus:border-[#2F6C4F] text-[13.5px] text-[#1C231D] placeholder-[#4F7A63]/70 px-3.5 py-2.5 rounded-full outline-none transition-colors disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={
                  isTyping ||
                  !input.trim()
                }
                className="w-10 h-10 rounded-full bg-[#2F6C4F] hover:bg-[#1F4A34] text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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