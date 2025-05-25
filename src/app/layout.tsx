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
  description: "A modern web application built with Next.js and TypeScript",
  applicationName: "Creatr",
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
  return <html lang="en" className={`${GeistSans.variable}`} data-unique-id="e93b4d06-e2bc-4ddc-8da3-ea704a94669c" data-file-name="app/layout.tsx">
      
  <body data-unique-id="f9494a7f-e794-48c9-9485-b6dd996bd54c" data-file-name="app/layout.tsx"><DevtoolsProvider hideBranding={true}>{children}</DevtoolsProvider></body>

    </html>;
}
