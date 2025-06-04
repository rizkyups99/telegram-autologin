"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import Link from "next/link";
export default function Dashboard() {
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="bf94d019-e9eb-408c-8e92-eea73e18c49f" data-file-name="components/Dashboard.tsx">
      <header className="border-b border-border" data-unique-id="f194e0be-be8d-4ac1-b3af-7706c2fadad7" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="b48a84d9-5342-4ee9-902f-32884a7499b9" data-file-name="components/Dashboard.tsx">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="b4525536-5f97-4c50-b6d3-6747a3d00491" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="33dfaef6-fbbb-4827-b814-9f6f296bca3a" data-file-name="components/Dashboard.tsx">LANGIT DIGITAL</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="e0198c0c-f848-4eb6-849d-adb7a6639ec9" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="e0454294-28fb-4e1f-bbbe-e91887761e59" data-file-name="components/Dashboard.tsx">
            Selamat Datang di Platform Langit Digital
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8 flex-grow" data-unique-id="bf9ec434-dd0d-457f-89c2-8480d4dd6ec3" data-file-name="components/Dashboard.tsx">
        <div className="max-w-md mx-auto" data-unique-id="d0b2698d-63c5-4745-b360-a04efe6e8f47" data-file-name="components/Dashboard.tsx">
          <LoginForm />
        </div>
      </main>
      
      <footer className="border-t border-border py-4 sm:py-6" data-unique-id="afb45501-7270-4d83-b080-bb8a92741089" data-file-name="components/Dashboard.tsx">
        <div className="container mx-auto px-4 text-center text-xs sm:text-sm text-muted-foreground" data-unique-id="ec0485f6-a952-4d75-9e07-5e4e26ca7028" data-file-name="components/Dashboard.tsx">
          <p data-unique-id="124c3723-be5d-437f-92e0-766fa9f43c55" data-file-name="components/Dashboard.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d686cb2b-5227-4f23-b871-22670ed796de" data-file-name="components/Dashboard.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="ba839dca-6753-470c-b737-59b9eb8e016b" data-file-name="components/Dashboard.tsx"> Langit Digital. All rights reserved.</span></p>
          <p className="mt-2" data-unique-id="f608a76f-d39f-4975-a76c-c84a3964ff62" data-file-name="components/Dashboard.tsx">
            <Link href="/admin" className="hover:underline" data-unique-id="bd336d18-ecf4-4bd8-8500-26c18193af2d" data-file-name="components/Dashboard.tsx"><span className="editable-text" data-unique-id="49b01613-78cd-4503-937a-e39630bdb02f" data-file-name="components/Dashboard.tsx">
              Langit Digital
            </span></Link>
          </p>
        </div>
      </footer>
    </div>;
}