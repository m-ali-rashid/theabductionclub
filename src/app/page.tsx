import { Experience } from "@/components/three/Experience";
import { Hud } from "@/components/ui/Hud";
import { HudGate, IntroOverlay } from "@/components/ui/IntroOverlay";
import { ProjectCollection } from "@/components/projects/ProjectCollection";

export default function HomePage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-canvas-bg">
      {/* Interactive 3D UFO Playground Hero Stage */}
      <section
        id="hero-stage"
        className="relative h-screen w-full overflow-hidden bg-canvas-bg"
      >
        <Experience />
        {/* Cinematic intro: alien greeting happens inside the real 3D scene; HUD fades in after the pull-back */}
        <IntroOverlay />
        <HudGate>
          <Hud />
        </HudGate>
      </section>

      {/* THE COLLECTION — Six Experiments in Applied Intelligence */}
      <ProjectCollection />
    </main>
  );
}
