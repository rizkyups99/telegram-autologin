"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
export default function Dashboard() {
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="136d7621-73b7-4f31-b181-ffda644861b4" data-file-name="components/Dashboard.tsx">
      <header className="border-b border-border" data-unique-id="f7dc297f-74f8-41d6-bb23-7a1c9c7f48b0" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="ddd76475-2d7c-4d5f-97eb-e9a0078d04a5" data-file-name="components/Dashboard.tsx">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="c1091c35-5f50-4023-8460-16057e334730" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="9040dfcb-7fa0-499a-899e-060dc239aa37" data-file-name="components/Dashboard.tsx">LANGIT DIGITAL</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="d47b447a-820a-4359-adf6-e8e7468ee7e8" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="b484d71a-0eff-4f6b-b60c-70362e56b423" data-file-name="components/Dashboard.tsx">
            Selamat Datang di Platform Langit Digital
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow" data-unique-id="9ebb44d7-36af-4214-8a22-ce1fbc9a9533" data-file-name="components/Dashboard.tsx">
        <div className="max-w-md mx-auto" data-unique-id="9ab64bb1-aca3-4395-94b3-4931c624ff25" data-file-name="components/Dashboard.tsx">
          <LoginForm />
        </div>
      </main>
      
      <footer className="border-t border-border py-4 sm:py-6" data-unique-id="e65d17a3-fcf8-43f3-8a58-31225d4e8d4a" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground" data-unique-id="2f3b2666-4c45-4988-8583-067868a4d3e3" data-file-name="components/Dashboard.tsx">
          <p data-unique-id="55f712cd-90c3-4499-be0c-57ecdb937575" data-file-name="components/Dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6295dac7-0d87-473b-b263-1fee149cf609" data-file-name="components/Dashboard.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="7613e454-8682-40ed-a3b1-a29c20d2e0a8" data-file-name="components/Dashboard.tsx"> Langit Digital. All rights reserved.</span></p>
          <p className="mt-2" data-unique-id="b2ca6a1a-e517-47cc-9767-836aac76de05" data-file-name="components/Dashboard.tsx">
            <Link href="/admin" className="hover:underline" data-unique-id="46e8b466-f53b-4b89-b6c8-79fcf4363358" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="c967f7d2-d4fc-4b35-a73d-4b598ebefce6" data-file-name="components/Dashboard.tsx">
              Langit Digital
            </span></Link>
          </p>
        </div>
      </footer>
    </div>;
}