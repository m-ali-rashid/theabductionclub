import type { Metadata } from "next";
import "@fontsource/bricolage-grotesque/800.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/ibm-plex-mono/500.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE ABDUCTION CLUB — Interactive 3D Designer Art Toy Playground",
  description:
    "Three objects. One very curious UFO. An interactive 3D designer vinyl toy playground and creative engineering portfolio.",
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
