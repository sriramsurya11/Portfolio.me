import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata = {
  title: "Sriram E — Backend Focused Full-Stack Developer",
  description:
    "Portfolio of Sriram E, featuring backend architecture, full-stack systems, dynamic fluid pixel canvas shaders, and interactive scribble guestbook.",
  keywords: [
    "Sriram E",
    "Full-Stack Developer",
    "Backend Developer",
    "Node.js",
    "React",
    "Next.js",
    "MongoDB",
    "Portfolio",
  ],
  authors: [{ name: "Sriram E" }],
  icons: {
    icon: "/favicon.jpg",
    shortcut: "/favicon.jpg",
    apple: "/favicon.jpg",
  },
  openGraph: {
    title: "Sriram E — Developer Portfolio",
    description: "Backend focused full-stack developer portfolio with dynamic shaders.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="bg-[#060606] text-zinc-100 antialiased selection:bg-rose-500/30 selection:text-rose-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
