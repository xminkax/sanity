import type {Metadata} from "next";
import "./globals.css";
import StarsLayout from "@/components/StarsLayout";
import {Orbitron} from "next/font/google";
import {ReactNode} from "react";
import {Analytics} from "@vercel/analytics/react";
import {GameStateProvider} from '@/context/SnakeGameContext';

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({
                                     children,
                                     // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                   }: RootLayoutProps) {
  return (
    <html lang="en" className={orbitron.className}>
    <GameStateProvider>
      <StarsLayout>
        {children}
        <Analytics/>
      </StarsLayout>
    </GameStateProvider>
    </html>
  );
}
