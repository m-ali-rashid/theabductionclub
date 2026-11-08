import { Experience } from "@/components/three/Experience";
import { Hud } from "@/components/ui/Hud";
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
        <Hud />
      </section>

      {/* THE COLLECTION — Six Experiments in Applied Intelligence */}
      <ProjectCollection />
    </main>
  );
}
