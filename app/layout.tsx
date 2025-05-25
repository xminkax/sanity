import type { Metadata } from "next";
import "./globals.css";
import StarsLayout from "@/components/StarsLayout";
import { orbitron } from "@/lib/fonts";
import { Analytics } from "@vercel/analytics/react";
import { GameStateProvider } from "@/context/SnakeGameContext";

export const metadata: Metadata = {
  title: "Monika Kindernayova",
  description: "I am a software engineer with over 12 years of professional experience.",
  robots: "index, follow",
  openGraph: {
    images: [
      {
        url: "/og_image.png",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={orbitron.className}>
      <GameStateProvider>
        <StarsLayout>
          {children}
          <Analytics />
        </StarsLayout>
      </GameStateProvider>
    </html>
  );
}
