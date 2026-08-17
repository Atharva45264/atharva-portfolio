# Atharva Phanse — Cinematic Portfolio

A React + TypeScript + Vite portfolio with a light, cinematic theme (Bebas Neue headlines,
Montserrat body text, warm ivory/bronze palette, Framer Motion animations).

## Getting Started

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Before you deploy — add your own media

1. **Hero background video** — drop your edited video at:
   `public/videos/hero.mp4`
   (Landscape/portrait clip, ideally under ~15–20MB, muted, loopable. If this file is
   missing the hero section will just show the ivory background with no video, no crash.)

2. **Portrait photo** — already set from your uploaded photo at:
   `src/assets/about.png` (swap this file to update the About section image)

3. **Resume PDF** — already copied to:
   `public/resume.pdf` (linked from the "Download Resume" button)

## Sections

- `HeroSection.tsx` — full-screen intro, nav, headline, CTA buttons
- `AboutSection.tsx` — bio, stats, 3D tilt portrait card
- `ProjectsSection.tsx` — scroll-stacking project cards (FlowForge, NewsNaut)
- `SkillsSection.tsx` — bento grid of skill categories
- `ExperienceSection.tsx` — animated timeline (internship, volunteering, education)
- `ContactSection.tsx` — direct contact links + static contact form
  (form currently just shows a "sent" state locally — wire it up to
  [Formspree](https://formspree.io/) or [EmailJS](https://www.emailjs.com/) to actually
  receive messages)

## Customizing colors

Current theme: **Deep Emerald**. The palette lives inline in each component's Tailwind classes:
- Background: `#EAE6DB` (warm sand)
- Text: `#1C231D` (near-black green-charcoal)
- Muted text: `#56594F`
- Accent: `#2F6C4F` (forest green)
- Secondary accent tones (gradients/borders): `#4F7A63`, `#6FAE8B`, `#1F4A34`, `#3F7A5A`, `#BFE3CC`

Find-and-replace these hex values across `src/components/*.tsx` and `src/App.tsx` to shift the theme again.
