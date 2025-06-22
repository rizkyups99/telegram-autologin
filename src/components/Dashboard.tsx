"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
export default function Dashboard() {
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="d60f2385-5d80-4f87-a074-f1fcfc52370c" data-file-name="components/Dashboard.tsx">
      <header className="border-b border-border" data-unique-id="f9f1d3d5-66fb-4a68-a7ad-ade32e301f72" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="11c22f47-48a9-4258-ae72-9cb49b0d614e" data-file-name="components/Dashboard.tsx">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="bb991e3e-698a-4160-9913-b527683cdda5" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="95cec4b9-9c54-4db3-bda7-28870e631a65" data-file-name="components/Dashboard.tsx">LANGIT DIGITAL</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="c8adb22b-2ef9-4d33-a802-f06950e0aad2" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="da568e1a-cc0a-4079-850e-4d83a4417a36" data-file-name="components/Dashboard.tsx">
            Selamat Datang di Platform Langit Digital
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow" data-unique-id="0af81f10-858c-4374-8e6b-6f4a4d049207" data-file-name="components/Dashboard.tsx">
        <div className="max-w-md mx-auto" data-unique-id="da94166a-5f88-4b07-999f-58c24bdd6883" data-file-name="components/Dashboard.tsx">
          <LoginForm />
        </div>
      </main>
      
      <footer className="border-t border-border py-4 sm:py-6" data-unique-id="2633e75a-c8c3-4fbb-b38f-7d7caec329f9" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground" data-unique-id="8393e072-8504-4016-b15d-8f57ac83ae14" data-file-name="components/Dashboard.tsx">
          <p data-unique-id="04cc0308-4cb9-42f0-9e13-a3f420040dc3" data-file-name="components/Dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="69d87a7b-b8d3-4dab-ae3c-bea41b659583" data-file-name="components/Dashboard.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="48d235f8-8abb-4154-8a0d-38858e1a5164" data-file-name="components/Dashboard.tsx"> Langit Digital. All rights reserved.</span></p>
          <p className="mt-2" data-unique-id="dcf91ef1-8538-4d54-a211-4df31b60d1ba" data-file-name="components/Dashboard.tsx">
            <Link href="/admin" className="hover:underline" data-unique-id="6c42d558-187d-47e9-a678-c26483917b79" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="621098dd-001d-4974-9003-2d7a0d09e666" data-file-name="components/Dashboard.tsx">
              Langit Digital
            </span></Link>
          </p>
        </div>
      </footer>
    </div>;
}