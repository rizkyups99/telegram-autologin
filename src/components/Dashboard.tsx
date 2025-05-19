"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">LANGIT DIGITAL</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto">
            Selamat Datang di Platform Langit Digital
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow">
        <div className="max-w-md mx-auto">
          <LoginForm />
        </div>
      </main>
      
      <footer className="border-t border-border py-4 sm:py-6">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Langit Digital. All rights reserved.</p>
          <p className="mt-2">
            <Link href="/admin" className="hover:underline">
              Langit Digital
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
