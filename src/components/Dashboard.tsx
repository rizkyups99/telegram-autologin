"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
export default function Dashboard() {
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="90308f79-e121-46d5-bf71-88799533884a" data-file-name="components/Dashboard.tsx">
      <header className="border-b border-border" data-unique-id="99c89c13-4d91-43b0-b06b-308550c42386" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="3c6fee25-b9d2-4ceb-87dc-22bd705576de" data-file-name="components/Dashboard.tsx">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="939b47f3-6bfd-4a5b-a48e-49fc704c00db" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="2dbebddb-869a-412d-98f4-dab36946c403" data-file-name="components/Dashboard.tsx">LANGIT DIGITAL</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="383c86d1-54ad-4bb0-90fb-24f91e300153" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="151f477a-5317-4285-88bb-4261292f3429" data-file-name="components/Dashboard.tsx">
            Selamat Datang di Platform Langit Digital
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow" data-unique-id="63827dc4-3b33-453d-a362-846a3a4594c2" data-file-name="components/Dashboard.tsx">
        <div className="max-w-md mx-auto" data-unique-id="a5d9375b-d236-47c6-9497-7fe460173462" data-file-name="components/Dashboard.tsx">
          <LoginForm />
        </div>
      </main>
      
      <footer className="border-t border-border py-4 sm:py-6" data-unique-id="a8538c00-11ad-4037-870b-de6486d6c9df" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground" data-unique-id="90f45073-9ed9-4063-b9d1-fae9df94407d" data-file-name="components/Dashboard.tsx">
          <p data-unique-id="c872cca8-9ebb-496c-9bb3-6a8a53f6f147" data-file-name="components/Dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="12bb014e-9505-43aa-94d0-05bc42027ae8" data-file-name="components/Dashboard.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="49840d13-d5d0-4696-8c70-c632afd3ac8c" data-file-name="components/Dashboard.tsx"> Langit Digital. All rights reserved.</span></p>
          <p className="mt-2" data-unique-id="a03873fb-a612-4d3f-bc02-b1fc119a85de" data-file-name="components/Dashboard.tsx">
            <Link href="/admin" className="hover:underline" data-unique-id="ae90f627-da10-498d-b5a2-dd54128486ee" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="8308dc0b-bea1-40b1-963d-4869918367a0" data-file-name="components/Dashboard.tsx">
              Langit Digital
            </span></Link>
          </p>
        </div>
      </footer>
    </div>;
}