"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
export default function Dashboard() {
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="7216d07c-cb78-49b8-872e-b533e0959c45" data-file-name="components/Dashboard.tsx">
      <header className="border-b border-border" data-unique-id="d000c315-600e-4adc-8426-fde3e51c3dc0" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="fffe66a8-6020-44b7-8468-911b0effcfab" data-file-name="components/Dashboard.tsx">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="14d21100-2d9b-4aba-bd56-930ad9ff627c" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="43817205-cf73-48b6-984d-e9f893c442ce" data-file-name="components/Dashboard.tsx">LANGIT DIGITAL</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="91bc47e3-16a7-4fe7-841a-0ef1c6153037" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="2b186c88-9673-4aee-9dba-76de5a6184e5" data-file-name="components/Dashboard.tsx">
            Selamat Datang di Platform Langit Digital
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow" data-unique-id="33a10674-df21-45ec-9494-4e8966cbf453" data-file-name="components/Dashboard.tsx">
        <div className="max-w-md mx-auto" data-unique-id="24af5183-346e-47ca-96b6-fcc20224ed8c" data-file-name="components/Dashboard.tsx">
          <LoginForm />
        </div>
      </main>
      
      <footer className="border-t border-border py-4 sm:py-6" data-unique-id="6851bfd0-c771-407f-95d2-1a580d9e0749" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground" data-unique-id="98038239-890b-4ff4-832e-e60892e5c1fb" data-file-name="components/Dashboard.tsx">
          <p data-unique-id="a9e9c20b-96b1-4353-8d5c-f34c285317b1" data-file-name="components/Dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="288d5330-e7f4-40fc-86f6-17c014817604" data-file-name="components/Dashboard.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="7e0c2136-a63f-4b9e-9910-f46c8cc9bc7a" data-file-name="components/Dashboard.tsx"> Langit Digital. All rights reserved.</span></p>
          <p className="mt-2" data-unique-id="1e3e8d53-b0d4-4367-a031-246d65d729f4" data-file-name="components/Dashboard.tsx">
            <Link href="/admin" className="hover:underline" data-unique-id="94287b88-1cbf-4283-ab58-cd86ad038cf9" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="ff53cd69-af65-4582-978e-75bbbdfbe860" data-file-name="components/Dashboard.tsx">
              Langit Digital
            </span></Link>
          </p>
        </div>
      </footer>
    </div>;
}