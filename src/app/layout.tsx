import "@/styles/globals.css";
import React from "react";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { createStorageBuckets } from "@/db/supabase";
import { DevtoolsProvider } from 'creatr-devtools';
// Initialize storage buckets and ensure they exist with proper limits
if (typeof window === 'undefined') {
  // Only run on server side
  console.log("Server initialization: Creating storage buckets");

  // Use setImmediate to ensure this runs after other initialization
  setImmediate(() => {
    createStorageBuckets().then(result => {
      console.log("Server initialization: Storage buckets creation complete", result);
    }).catch(error => {
      console.error("Server initialization: Error creating storage buckets:", error);
      // Don't throw - we want the app to start even if buckets fail
    });
  });
}
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};
export const metadata: Metadata = {
  title: {
    default: "Langit Digital",
    template: "%s | Langit Digital"
  },
  description: "Platform menonton Video, Membaca Ebook Kesayangan Anda",
  applicationName: "Langit Digital",
  keywords: ["next.js", "react", "typescript", "web application"],
  authors: [{
    name: "Creatr Team"
  }],
  creator: "Creatr Team",
  publisher: "Creatr Team",
  icons: {
    icon: [{
      url: "/favicon-16x16.png",
      sizes: "16x16",
      type: "image/png"
    }, {
      url: "/favicon-32x32.png",
      sizes: "32x32",
      type: "image/png"
    }, {
      url: "/favicon.ico",
      sizes: "48x48",
      type: "image/x-icon"
    }],
    apple: [{
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png"
    }]
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Creatr"
  },
  formatDetection: {
    telephone: false
  }
};
export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <html lang="en" className={`${GeistSans.variable}`} data-unique-id="20ff255a-24f6-40a3-affe-57f7a0f51d41" data-file-name="app/layout.tsx">
      
  <body data-unique-id="3db3eb4e-2b7d-4727-a716-1fdb650c6c46" data-file-name="app/layout.tsx"><DevtoolsProvider hideBranding={true}>{children}</DevtoolsProvider></body>

    </html>;
}
