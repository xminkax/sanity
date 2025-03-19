import type { Metadata } from "next";
import "./globals.css";
import StarsLayout from "@/components/StarsLayout";
import { Orbitron } from "next/font/google";
import { ReactNode } from "react";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Welcome to my website",
  description: "I am a software engineer with over 12 years of professional experience.",
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
      <StarsLayout>{children}</StarsLayout>
    </html>
  );
}
