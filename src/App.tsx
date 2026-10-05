import { useEffect, useRef, useState } from "react";
import { BlessingSection } from "./components/BlessingSection";
import { Countdown } from "./components/Countdown";
import { EngagementDetails } from "./components/EngagementDetails";
import { FamilyBlessings } from "./components/FamilyBlessings";
import { FinalSection } from "./components/FinalSection";
import { FloatingNav } from "./components/FloatingNav";
import { Footer } from "./components/Footer";
import { Gallery } from "./components/Gallery";
import { HeroSection } from "./components/HeroSection";
import { InvitationCover } from "./components/InvitationCover";
import { MusicPlayer } from "./components/MusicPlayer";
import { PetalShower, burstPetals } from "./components/PetalShower";
import { ToastProvider } from "./components/Toast";
import { VenueSection } from "./components/VenueSection";
import { useReducedMotion } from "./hooks/useReducedMotion";
import { useReveal } from "./hooks/useReveal";
import { invitation } from "./config/invitation";
import { playMusic } from "./lib/music";

type Phase = "cover" | "opening" | "open";

/** A link to a section (e.g. …/#venue) skips the cover and goes straight there. */
const initialPhase = (): Phase => (window.location.hash.length > 1 ? "open" : "cover");

export default function App() {
  const [phase, setPhase] = useState<Phase>(initialPhase);
  const reduced = useReducedMotion();
  const mainRef = useRef<HTMLElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);

  useReveal(phase !== "cover");

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("is-locked", phase !== "open");
    root.classList.toggle("is-revealed", phase !== "cover");
    if (pageRef.current) pageRef.current.inert = phase === "cover";
  }, [phase]);

  const openInvitation = () => {
    // The tap on "Open Invitation" is the user gesture browsers require before sound can play
    const { music } = invitation;
    if (music.enabled && music.autoplayOnOpen && music.url.trim()) void playMusic(music.url);
    burstPetals(90);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setPhase("opening");
    window.setTimeout(
      () => {
        setPhase("open");
        mainRef.current?.focus({ preventScroll: true });
      },
      reduced ? 0 : 1300, // matches the door transition in .cover__door
    );
  };

  return (
    <ToastProvider>
      <PetalShower active={phase !== "cover"} />
      {phase !== "open" && <InvitationCover leaving={phase === "opening"} onOpen={openInvitation} />}

      <div ref={pageRef} aria-hidden={phase === "cover" ? true : undefined}>
      <main ref={mainRef} tabIndex={-1}>
        <HeroSection />
        <FamilyBlessings />
        <EngagementDetails />
        <Countdown />
        <BlessingSection />
        <Gallery />
        <VenueSection />
        <FinalSection />
      </main>
      <Footer />
      </div>

      {phase === "open" && (
        <>
          <div className="float-controls">
            <MusicPlayer />
          </div>
          <FloatingNav />
        </>
      )}
    </ToastProvider>
  );
}
