"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
export default function Dashboard() {
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="0a91b623-0615-4bd4-b8ff-17f1e93ae67a" data-file-name="components/Dashboard.tsx">
      <header className="border-b border-border" data-unique-id="97eef44d-95f3-4011-8360-b7e4ab103d43" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="b7e53347-50d2-4d8f-a5e2-00e4963977d7" data-file-name="components/Dashboard.tsx">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="7ece12d2-d711-4949-a424-22438707d910" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="a530270a-72c2-45e4-bdb5-380212a173e4" data-file-name="components/Dashboard.tsx">LANGIT DIGITAL</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="af49c647-f639-4a8f-a7a5-58413e9c786e" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="0e7f7566-52d9-4d2a-a07b-6e9b47c5febc" data-file-name="components/Dashboard.tsx">
            Selamat Datang di Platform Langit Digital
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow" data-unique-id="bc8a4c56-1d6e-4ce9-b3b5-a7d5776b4271" data-file-name="components/Dashboard.tsx">
        <div className="max-w-md mx-auto" data-unique-id="bf9e9199-2168-4baa-93b5-54ac7a3b2db4" data-file-name="components/Dashboard.tsx">
          <LoginForm />
        </div>
      </main>
      
      <footer className="border-t border-border py-4 sm:py-6" data-unique-id="33ac59f8-a6f7-422c-9094-2ec4153075be" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground" data-unique-id="066b8139-b1fa-4826-a58e-71e928eaca61" data-file-name="components/Dashboard.tsx">
          <p data-unique-id="a9d192e6-5155-4749-85a8-ee34cc0cf83f" data-file-name="components/Dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c5a253b6-bbe9-4567-ac3d-7186366bfc09" data-file-name="components/Dashboard.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="437425ca-1a69-433c-8736-47cffbd6f9f1" data-file-name="components/Dashboard.tsx"> Langit Digital. All rights reserved.</span></p>
          <p className="mt-2" data-unique-id="5f9a7d89-22a1-4767-bee2-ee50c7ec9d2f" data-file-name="components/Dashboard.tsx">
            <Link href="/admin" className="hover:underline" data-unique-id="c01337d2-92c6-408b-8e99-9f2d62d75905" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="907f48f9-75ef-4eec-ae9e-66a6d4bb1ba4" data-file-name="components/Dashboard.tsx">
              Langit Digital
            </span></Link>
          </p>
        </div>
      </footer>
    </div>;
}