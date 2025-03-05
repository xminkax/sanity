import type { Metadata } from "next";
import "./globals.css";
import StarsBackground from "@/src/StarsBackground";

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
    <html lang="en">
      <StarsBackground>{children}</StarsBackground>
    </html>
  );
}
