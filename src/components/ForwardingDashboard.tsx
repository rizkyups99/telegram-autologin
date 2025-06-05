"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import ForwardingSetup from "./ForwardingSetup";
import ForwardingLogs from "./ForwardingLogs";
import ForwardingRules from "./ForwardingRules";
import TelegramGateway from "./TelegramGateway";
import AudioCloudManager from "./AudioCloudManager";
import PDFCloudManager from "./PDFCloudManager";
import FileCloudManager from "./FileCloudManager";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function ForwardingDashboard() {
  const [logs, setLogs] = useState<any[] | null>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  useEffect(() => {
    // Check if admin is logged in
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      router.push('/admin');
      return;
    }
    try {
      const parsedAdmin = JSON.parse(adminData);
      if (!parsedAdmin.isAdmin) {
        router.push('/admin');
        return;
      }
      setIsAdmin(true);
      fetchLogs();
    } catch (error) {
      console.error('Error parsing admin data:', error);
      localStorage.removeItem('admin');
      router.push('/admin');
    }
  }, [router]);
  const fetchLogs = async () => {
    try {
      const response = await fetch("/api/telegram/logs");
      if (!response.ok) {
        throw new Error("Gagal mengambil data log");
      }
      const data = await response.json();
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Error memuat data log. Silakan coba lagi nanti.");
      console.error(err);
    } finally {
      setLoading(false);
    }

    // Set up polling for logs every 30 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/telegram/logs");
        if (!response.ok) {
          throw new Error("Gagal mengambil data log");
        }
        const data = await response.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
      }
    }, 30000);
    return () => clearInterval(interval);
  };
  if (!isAdmin) {
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="f320e815-8c3a-4fce-a8ec-6b8430d932da" data-file-name="components/ForwardingDashboard.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="152cb7a3-199b-4816-8dd2-cb6adb3f8464" data-file-name="components/ForwardingDashboard.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background" data-unique-id="d87d0aa9-b811-4664-ad3f-e62ef6051a76" data-file-name="components/ForwardingDashboard.tsx">
      <header className="border-b border-border" data-unique-id="bb870d80-70af-4b52-9ec3-9e867664d436" data-file-name="components/ForwardingDashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6" data-unique-id="c05227fa-f6b9-4a26-b84f-43a710b905af" data-file-name="components/ForwardingDashboard.tsx">
          <h1 className="text-2xl sm:text-3xl font-bold" data-unique-id="912d8ffe-69f5-4447-8e2f-2ff0c2170218" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="7ee43185-226a-44a5-8f87-5ddd86f367a9" data-file-name="components/ForwardingDashboard.tsx">Telegram Message Forwarding</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2" data-unique-id="f1940e3f-fd30-4ac3-a30b-5ce35cf1d17d" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="ae7db54c-0426-492f-a9db-66a293aa0816" data-file-name="components/ForwardingDashboard.tsx">
            Teruskan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8" data-unique-id="74c6cade-64ae-470e-ac5e-7c7730b4e662" data-file-name="components/ForwardingDashboard.tsx">
        <div className="mb-6 sm:mb-8 flex justify-between items-center" data-unique-id="0b603f83-9668-48dc-b7cf-afee64de3bab" data-file-name="components/ForwardingDashboard.tsx">
          <Link href="/admin" data-unique-id="685f0f9c-25ca-4e3c-87ef-3cb73091b17b" data-file-name="components/ForwardingDashboard.tsx">
            <Button variant="outline" size="sm" data-unique-id="1c4ce1f3-e7a3-463a-9451-c66bb639e9b6" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="aed0d539-d98a-4c6b-aa88-45eef2bc9639" data-file-name="components/ForwardingDashboard.tsx">Kembali ke Admin Panel</span></Button>
          </Link>
        </div>
        
        <Tabs defaultValue="gateway" className="w-full" data-unique-id="5ac5b035-02a9-41ac-bc62-a6b85fa57db7" data-file-name="components/ForwardingDashboard.tsx">
          <div className="overflow-x-auto" data-unique-id="d64f90b4-81ca-4d05-9b1a-79ea5fbf596e" data-file-name="components/ForwardingDashboard.tsx">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="gateway"><span className="editable-text" data-unique-id="68990902-6e44-48f8-9813-c20f223c5459" data-file-name="components/ForwardingDashboard.tsx">Gateway Telegram</span></TabsTrigger>
            <TabsTrigger value="setup"><span className="editable-text" data-unique-id="a019f0c2-ef31-46c4-9d57-52e73f09530f" data-file-name="components/ForwardingDashboard.tsx">Pengaturan</span></TabsTrigger>
            <TabsTrigger value="rules"><span className="editable-text" data-unique-id="ffd6f02c-be39-4e55-8597-c964d0d15c3a" data-file-name="components/ForwardingDashboard.tsx">Aturan Filter</span></TabsTrigger>
            <TabsTrigger value="logs"><span className="editable-text" data-unique-id="f1ba1444-b955-41af-85c5-2e3baa3d574f" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></TabsTrigger>
            <TabsTrigger value="audio_cloud"><span className="editable-text" data-unique-id="f3aeef9d-a6a1-41ef-b3ed-9abc89f07f53" data-file-name="components/ForwardingDashboard.tsx">Audio Cloud</span></TabsTrigger>
            <TabsTrigger value="pdf_cloud"><span className="editable-text" data-unique-id="651f5939-d9fc-4dc1-aad6-b58182e5dd1d" data-file-name="components/ForwardingDashboard.tsx">PDF Cloud</span></TabsTrigger>
            <TabsTrigger value="file_cloud"><span className="editable-text" data-unique-id="82dbf3df-2378-4dac-a652-978089576f18" data-file-name="components/ForwardingDashboard.tsx">File Cloud</span></TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="setup">
            <ForwardingSetup />
          </TabsContent>
          
          <TabsContent value="rules">
            <ForwardingRules />
          </TabsContent>
          
          <TabsContent value="logs">
            <Card data-unique-id="57a51d2c-76e8-472e-880d-91742c6f8948" data-file-name="components/ForwardingDashboard.tsx">
              <CardHeader data-unique-id="a7d915e1-8ea3-4d10-a6e7-5b4219081391" data-file-name="components/ForwardingDashboard.tsx">
                <CardTitle data-unique-id="d8635ade-7b32-478b-a434-e5faab8c8b5e" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="de50a563-f7c6-4a66-b1d2-e6706f19d04d" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></CardTitle>
                <CardDescription><span className="editable-text" data-unique-id="230b28f2-bb84-4e16-8f08-d1d61285bc1c" data-file-name="components/ForwardingDashboard.tsx">
                  Riwayat pesan yang diterima dan diteruskan
                </span></CardDescription>
              </CardHeader>
              <CardContent data-unique-id="50af3385-ac08-4a4b-aefc-05fa5ceafda6" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">
                {loading ? <div className="flex justify-center py-8" data-unique-id="a053ae7e-3634-4709-9194-2bbb7affb354" data-file-name="components/ForwardingDashboard.tsx">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="3eabdd54-9e7b-46d4-9352-5e7bcb54cfff" data-file-name="components/ForwardingDashboard.tsx"></div>
                  </div> : error ? <div className="text-red-500 py-4" data-unique-id="82fce3af-1076-4ab2-bd41-867e4d10f09a" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">{error}</div> : <ForwardingLogs logs={logs} />}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gateway">
            <TelegramGateway />
          </TabsContent>
          
          <TabsContent value="audio_cloud">
            <AudioCloudManager />
          </TabsContent>
          
          <TabsContent value="pdf_cloud">
            <PDFCloudManager />
          </TabsContent>
          
          <TabsContent value="file_cloud">
            <FileCloudManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}