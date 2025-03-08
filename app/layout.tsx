import type { Metadata } from "next";
import "./globals.css";
import StarsBackground from "@/src/StarsBackground";
import {Orbitron} from 'next/font/google'

export const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ["400","500","600", "700"],
})


export const metadata: Metadata = {
  title: "Personal website",
  description: "Personal website",
  openGraph: {
    images: [
      {
        url: "/og_image.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={orbitron.className}>
      <StarsBackground>{children}</StarsBackground>
    </html>
  );
}
