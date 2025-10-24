import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReduxProvider from "../providers/ReduxProvider";
import QueryProvider from "../providers/QueryProvider";
import SyncUserWrapper from "@/components/ui/SyncUserWrapper";
import { ConvexClientProvider } from "@/providers/ConvexProvider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { Toaster } from "sonner";
import { ModalProvider } from "@/providers/ModalProvider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Collabify – Real-time Collaboration Platform",
  description:
    "Collabify is your all-in-one creative collaboration hub. Work together on docs, whiteboards, and projects in real time – just like Notion, Figma, and Zoom combined.",
  keywords: [
    "Collabify",
    "real-time collaboration",
    "team workspace",
    "whiteboard",
    "Notion alternative",
    "Figma alternative",
    "Zoom alternative",
    "creative collaboration SaaS",
  ],
  authors: [{ name: "Sarthak Chaudhari" }],
  openGraph: {
    title: "Collabify – Real-time Collaboration Platform",
    description:
      "Work together seamlessly with docs, whiteboards, video rooms, and cloud storage – all in one place.",
    url: "https://collabify-beige.vercel.app",
    siteName: "Collabify",
    locale: "en_US",
    type: "website",
  },
  metadataBase: new URL("https://collabify-beige.vercel.app"), // Your domain
};

export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClientProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <QueryProvider>
            <ReduxProvider>
              <SyncUserWrapper />
              <EdgeStoreProvider>
                <Toaster position="bottom-center" />
                <ModalProvider />
                {children}
              </EdgeStoreProvider>
            </ReduxProvider>
          </QueryProvider>
        </body>
      </html>
    </ConvexClientProvider>
  );
}
