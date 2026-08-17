// src/components/ContactSection.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const socials = [
  {
    label: 'EMAIL',
    value: 'atharvaphanse403@gmail.com',
    href: 'mailto:atharvaphanse403@gmail.com',
  },
  {
    label: 'PHONE',
    value: '+91 73870 89622',
    href: 'tel:+917387089622',
  },
  {
    label: 'LINKEDIN',
    value: 'atharva-phanse',
    href: 'https://linkedin.com/in/atharva-phanse-2aa4b62a5',
  },
  {
    label: 'GITHUB',
    value: 'Atharva45264',
    href: 'https://github.com/Atharva45264',
  },
];

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setStatus('sending');
    setErrorMessage('');

    try {
      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/contact`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  }
);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Something went wrong.'
        );
      }

      setStatus('success');

      setFormData({
        name: '',
        email: '',
        message: '',
      });
    } catch (error) {
      console.error('Contact form error:', error);

      setStatus('error');

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to send your message. Please try again.'
      );
    }
  };

  return (
    <footer
      id="contact"
      className="relative w-full bg-[#EAE6DB] text-[#1C231D] font-sans selection:bg-[#2F6C4F] selection:text-white pt-16 pb-16 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto w-full relative z-10">

        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>

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
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  05 / CONTACT
                </span>

                <div className="w-16 h-[1px] bg-gradient-to-r from-[#2F6C4F]/80 via-[#4F7A63]/40 to-transparent" />
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="mb-8"
              >
                <h2
                  className="text-5xl sm:text-6xl md:text-7xl tracking-tight uppercase leading-[0.85] select-none"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                  }}
                >
                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#1C231D] via-[#3A342C] to-[#5A4E3E] drop-shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
                    LET'S BUILD
                  </span>

                  <span className="block text-transparent bg-clip-text bg-gradient-to-b from-[#6FAE8B] via-[#2F6C4F] to-[#1F4A34] drop-shadow-[0_6px_18px_rgba(176,121,60,0.22)]">
                    SOMETHING.
                  </span>
                </h2>
              </motion.div>

              <p
                className="text-sm sm:text-[14.5px] font-normal text-[#34372F] leading-relaxed max-w-md mb-10"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                }}
              >
                Have a role, project, or collaboration in mind?
                I'm currently open to work — reach out directly or
                send a message below.
              </p>

              {/* Direct Contact Links */}
              <div className="space-y-4">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target={
                      s.href.startsWith('http')
                        ? '_blank'
                        : undefined
                    }
                    rel={
                      s.href.startsWith('http')
                        ? 'noopener noreferrer'
                        : undefined
                    }
                    className="flex items-center justify-between group border-b border-[#4F7A63]/20 pb-3 hover:border-[#2F6C4F]/60 transition-colors"
                  >
                    <span
                      className="text-[11.5px] font-mono tracking-[0.2em] uppercase text-[#4F7A63]"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {s.label}
                    </span>

                    <span
                      className="text-[14.5px] font-normal text-[#3A342C] group-hover:text-[#3F7A5A] transition-colors"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    >
                      {s.value}{' '}
                      <span className="text-[11.5px]">
                        ↗
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 relative w-full rounded-sm border border-[#4F7A63]/25 bg-white p-8 sm:p-10 shadow-[0_20px_50px_rgba(90,78,62,0.15)] overflow-hidden"
          >

            {/* ================= SUCCESS ================= */}

            {status === 'success' ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">

                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 12,
                  }}
                  className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2F6C4F] text-white text-2xl mb-5"
                >
                  ✓
                </motion.span>

                <p
                  className="text-base text-[#3A342C]"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Message received. I'll get back to you soon.
                </p>

                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 text-[11px] uppercase tracking-[0.2em] text-[#2F6C4F] hover:text-[#1F4A34] transition-colors"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Send another message
                </button>

              </div>
            ) : (

              /* ================= FORM ================= */

              <form
                onSubmit={handleSubmit}
                className="space-y-6"
              >

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  {/* NAME */}

                  <div>
                    <span className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#4F7A63] mb-2">
                      // NAME
                    </span>

                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter name"
                      disabled={status === 'sending'}
                      className="w-full bg-[#EAE6DB] border border-[#4F7A63]/25 focus:border-[#2F6C4F] text-sm text-[#1C231D] placeholder-[#4F7A63]/60 px-4 py-3 outline-none rounded-sm transition-colors disabled:opacity-60"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <span className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#4F7A63] mb-2">
                      // EMAIL
                    </span>

                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter email"
                      disabled={status === 'sending'}
                      className="w-full bg-[#EAE6DB] border border-[#4F7A63]/25 focus:border-[#2F6C4F] text-sm text-[#1C231D] placeholder-[#4F7A63]/60 px-4 py-3 outline-none rounded-sm transition-colors disabled:opacity-60"
                      style={{
                        fontFamily: "'Montserrat', sans-serif",
                      }}
                    />
                  </div>

                </div>

                {/* MESSAGE */}

                <div>
                  <span className="block text-[11px] font-mono tracking-[0.2em] uppercase text-[#4F7A63] mb-2">
                    // MESSAGE
                  </span>

                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                    placeholder="Enter your message..."
                    disabled={status === 'sending'}
                    className="w-full bg-[#EAE6DB] border border-[#4F7A63]/25 focus:border-[#2F6C4F] text-sm text-[#1C231D] placeholder-[#4F7A63]/60 p-4 outline-none rounded-sm transition-colors resize-none disabled:opacity-60"
                    style={{
                      fontFamily: "'Montserrat', sans-serif",
                    }}
                  />
                </div>

                {/* ERROR */}

                {status === 'error' && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -5,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    className="border border-red-300 bg-red-50 px-4 py-3 text-center"
                  >
                    <p
                      className="text-xs text-red-700"
                      style={{
                        fontFamily:
                          "'Montserrat', sans-serif",
                      }}
                    >
                      {errorMessage}
                    </p>
                  </motion.div>
                )}

                {/* SUBMIT BUTTON */}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-3.5 border border-[#4F7A63]/40 bg-[#EAE6DB] hover:border-[#2F6C4F] hover:bg-[#2F6C4F] text-[#1C231D] hover:text-white text-sm font-medium tracking-[0.25em] uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(90,78,62,0.08)] disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  {status === 'sending'
                    ? 'SENDING...'
                    : 'SEND MESSAGE ↗'}
                </button>

                <p
                  className="text-[11px] text-[#4F7A63] text-center"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                  }}
                >
                  Your message will be sent directly to my
                  inbox.
                </p>

              </form>
            )}

          </motion.div>

        </div>

        {/* System Footer Line */}

        <div className="pt-16 mt-16 border-t border-[#4F7A63]/15 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">

          <span className="text-[11.5px] font-mono tracking-widest text-[#4F7A63] uppercase">
            ATHARVA PHANSE // PORTFOLIO
          </span>

          <span className="text-[11.5px] font-mono text-[#4F7A63]">
            © {new Date().getFullYear()} • BUILT WITH REACT &
            FRAMER MOTION
          </span>

        </div>

      </div>
    </footer>
  );
};

export default ContactSection;