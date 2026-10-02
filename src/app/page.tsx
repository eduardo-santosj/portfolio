"use client";

import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";

import { Contact } from "@/components/site/contact";
import { ExperienceSection } from "@/components/site/experience";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/site/hero";
import { Navbar } from "@/components/site/navbar";
import { Numbers } from "@/components/site/numbers";
import { Projects } from "@/components/site/projects";
import { Services } from "@/components/site/services";
import { StackMarquee } from "@/components/site/stack-marquee";
import { VelaStudio } from "@/components/site/vela-studio";
import { useLanguage } from "@/contexts/LanguageContext";
import { PROFILE } from "@/lib/profile";

export default function Page() {
  const { t } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <MotionConfig reducedMotion="user">
      <a href="#conteudo" className="sr-only focus:not-sr-only">
        {t("a11y.skipToContent")}
      </a>

      <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-primary" aria-hidden="true" />
      <div aria-hidden="true" className="tech-grid pointer-events-none fixed inset-0 -z-10" />

      <Navbar />

      <main id="conteudo" className="relative">
        <Hero />
        <StackMarquee />
        <Projects />
        <VelaStudio />
        <Numbers />
        <Services />
        <ExperienceSection />
        <Contact />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: PROFILE.nome,
            jobTitle: "Senior Front-End Engineer",
            url: PROFILE.url,
            sameAs: [PROFILE.github, PROFILE.linkedin],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Itajaí",
              addressRegion: "Santa Catarina",
              addressCountry: "BR",
            },
            email: PROFILE.email,
            knowsAbout: ["React", "Next.js", "TypeScript", "Node.js", "Design Systems", "Web Performance", "Front-End Architecture"],
            alumniOf: {
              "@type": "CollegeOrUniversity",
              name: "Centro Universitário FAM",
            },
          }),
        }}
      />
    </MotionConfig>
  );
}
