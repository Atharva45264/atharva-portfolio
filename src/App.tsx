import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { ProjectsSection } from './components/ProjectsSection';
import { SkillsSection } from './components/SkillsSection';
import { ExperienceSection } from './components/ExperienceSection';
import { ContactSection } from './components/ContactSection';
import { ChatbotWidget } from './components/ChatbotWidget';

function App() {
  return (
    <div className="w-full min-h-screen bg-[#EAE6DB] text-[#1C231D] selection:bg-[#2F6C4F] selection:text-white">
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <SkillsSection />
      <ExperienceSection />
      <ContactSection />
      <ChatbotWidget />
    </div>
  );
}

export default App;
