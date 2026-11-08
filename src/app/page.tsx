import { Experience } from "@/components/three/Experience";
import { Hud } from "@/components/ui/Hud";

export default function HomePage() {
  return (
    <main className="relative h-screen w-screen overflow-hidden bg-canvas-bg">
      <Experience />
      <Hud />
    </main>
  );
}
