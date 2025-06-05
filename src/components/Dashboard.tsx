"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
export default function Dashboard() {
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="f2ea118c-230f-4599-b32c-143b19e46009" data-file-name="components/Dashboard.tsx">
      <header className="border-b border-border" data-unique-id="e1740e1e-f606-4901-989f-1d6872814fca" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="02bbb13e-f606-4ab5-9d4f-33f18d2ea115" data-file-name="components/Dashboard.tsx">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="5b4c8269-4acb-40e3-b8b6-5c44e510b473" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="86d78d83-584d-4ca6-94b6-2675f0b768a8" data-file-name="components/Dashboard.tsx">LANGIT DIGITAL</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="3658fb72-4436-4da9-be9b-acd6d38949fd" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="0c4d5e4a-89ab-4f02-825f-ea6903481d5f" data-file-name="components/Dashboard.tsx">
            Selamat Datang di Platform Langit Digital
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow" data-unique-id="b1bfee53-2979-49f5-a79f-2b615f39c3af" data-file-name="components/Dashboard.tsx">
        <div className="max-w-md mx-auto" data-unique-id="324f4723-e041-4a5d-8e3c-83f9b2ee27c4" data-file-name="components/Dashboard.tsx">
          <LoginForm />
        </div>
      </main>
      
      <footer className="border-t border-border py-4 sm:py-6" data-unique-id="63dcb9f6-f6c4-40a9-8d24-8cafeb12c010" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground" data-unique-id="b97ebdcc-b1e7-4933-b463-2779aac04b2e" data-file-name="components/Dashboard.tsx">
          <p data-unique-id="bb14705c-2ef3-499f-8a94-3e2195f1d89d" data-file-name="components/Dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f667be73-4b6e-4f4b-8619-8f67102d248d" data-file-name="components/Dashboard.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="03f7bd63-8d73-4216-84a0-a4f04e3aeabf" data-file-name="components/Dashboard.tsx"> Langit Digital. All rights reserved.</span></p>
          <p className="mt-2" data-unique-id="3e2646a5-079e-44cc-a21e-63a195aca484" data-file-name="components/Dashboard.tsx">
            <Link href="/admin" className="hover:underline" data-unique-id="44111c22-e8c0-40e5-854f-2c536909d8e7" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="2d16b117-a98d-4364-a972-575a321735cd" data-file-name="components/Dashboard.tsx">
              Langit Digital
            </span></Link>
          </p>
        </div>
      </footer>
    </div>;
}