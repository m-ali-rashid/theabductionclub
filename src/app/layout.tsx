import type { Metadata } from "next";
import "@fontsource/bricolage-grotesque/800.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE ABDUCTION CLUB — Creative AI Product & Engineering Studio",
  description:
    "We abduct boring workflows. We build intelligent agents, automate complex workflows, and turn ambitious AI ideas into useful digital products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-canvas-bg text-ink antialiased">{children}</body>
    </html>
  );
}
