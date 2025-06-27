"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
export default function Dashboard() {
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="0509c91f-73b4-4d34-8991-dd95328c58ea" data-file-name="components/Dashboard.tsx">
      <header className="border-b border-border" data-unique-id="ce143aee-490d-4caf-9a64-f035203b0474" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="756cfb0f-e90e-4d4f-841d-fba1d6aeace6" data-file-name="components/Dashboard.tsx">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="e5f0cf09-48ba-45d4-916b-209b78fb1cfd" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="dd384f6e-317d-4e5e-a32b-9f8047b23819" data-file-name="components/Dashboard.tsx">LANGIT DIGITAL</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="b19b8383-437d-48a3-a565-0018b3660ebf" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="93018aae-baa2-4a6e-b8ac-e6be545694ca" data-file-name="components/Dashboard.tsx">
            Selamat Datang di Platform Langit Digital
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow" data-unique-id="750d2edc-2941-4c31-a5fe-cdd9d0cb2b2a" data-file-name="components/Dashboard.tsx">
        <div className="max-w-md mx-auto" data-unique-id="bbc0c58b-877e-4790-b1d9-21ef42381da3" data-file-name="components/Dashboard.tsx">
          <LoginForm />
        </div>
      </main>
      
      <footer className="border-t border-border py-4 sm:py-6" data-unique-id="9fe3f182-8bbb-4b99-8fae-3d148345bb09" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground" data-unique-id="5ad16bcd-aae2-415b-b968-a9293421a95f" data-file-name="components/Dashboard.tsx">
          <p data-unique-id="1aba321b-8f16-423d-b482-8806d283cf86" data-file-name="components/Dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1bfa49bf-9765-44a7-b44d-a557e4ebb616" data-file-name="components/Dashboard.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="d5ddcea1-276d-48d6-be35-91060725c254" data-file-name="components/Dashboard.tsx"> Langit Digital. All rights reserved.</span></p>
          <p className="mt-2" data-unique-id="90c2df85-2c77-44cd-8d71-15615dc3f8cd" data-file-name="components/Dashboard.tsx">
            <Link href="/admin" className="hover:underline" data-unique-id="d0fe4c43-087d-4e9c-9558-ce93e483852e" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="69a5ed17-b515-4673-852c-7f2be2ee2898" data-file-name="components/Dashboard.tsx">
              Langit Digital
            </span></Link>
          </p>
        </div>
      </footer>
    </div>;
}