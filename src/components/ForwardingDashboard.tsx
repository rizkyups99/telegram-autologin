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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="993870c9-fa34-485e-9534-0a8d03c9b331" data-file-name="components/ForwardingDashboard.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="5a6c4eed-d7d5-4f32-9a35-3fc5c442c9e4" data-file-name="components/ForwardingDashboard.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background" data-unique-id="1e2aaac0-46fe-4f21-87a7-19e82eb529f2" data-file-name="components/ForwardingDashboard.tsx">
      <header className="border-b border-border" data-unique-id="8d491bfa-54cb-4bf5-9a0c-2368c6494b2e" data-file-name="components/ForwardingDashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6" data-unique-id="6bc7176b-4290-4e67-a158-9b2152eea21b" data-file-name="components/ForwardingDashboard.tsx">
          <h1 className="text-2xl sm:text-3xl font-bold" data-unique-id="bd4af650-e428-4809-b7ed-56233c06d91e" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="83f4d3ef-4efa-4675-8584-166c2a96d586" data-file-name="components/ForwardingDashboard.tsx">Telegram Message Forwarding</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2" data-unique-id="4dffbbbc-7426-4a9f-b4c1-7d6b6d4ecbd3" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="f300c0a5-6c8f-4768-a877-839b76f05777" data-file-name="components/ForwardingDashboard.tsx">
            Teruskan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8" data-unique-id="a4e230e2-7cc6-4d10-9325-7ff3494a1020" data-file-name="components/ForwardingDashboard.tsx">
        <div className="mb-6 sm:mb-8 flex justify-between items-center" data-unique-id="21531fc8-1e9c-4aa4-bd03-595fb7e1f832" data-file-name="components/ForwardingDashboard.tsx">
          <Link href="/admin" data-unique-id="360c819c-898f-4848-9a55-2a52159e169a" data-file-name="components/ForwardingDashboard.tsx">
            <Button variant="outline" size="sm" data-unique-id="5138a9bb-ba43-4f81-ba29-2b388d803e6e" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="22e37d98-20d2-4d23-a346-dd0cacb88a99" data-file-name="components/ForwardingDashboard.tsx">Kembali ke Admin Panel</span></Button>
          </Link>
        </div>
        
        <Tabs defaultValue="gateway" className="w-full" data-unique-id="41a3d142-3c77-4885-89e3-ad6fb84154e2" data-file-name="components/ForwardingDashboard.tsx">
          <div className="overflow-x-auto" data-unique-id="55c68b42-f542-467a-bad7-e6189e397508" data-file-name="components/ForwardingDashboard.tsx">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="gateway"><span className="editable-text" data-unique-id="d88a1dec-ee7c-4e9a-8d64-236b53a52655" data-file-name="components/ForwardingDashboard.tsx">Gateway Telegram</span></TabsTrigger>
            <TabsTrigger value="setup"><span className="editable-text" data-unique-id="7378f150-8db1-4ab3-89f6-c67079a28ce7" data-file-name="components/ForwardingDashboard.tsx">Pengaturan</span></TabsTrigger>
            <TabsTrigger value="rules"><span className="editable-text" data-unique-id="3ca5933d-a8ff-419f-884b-db91a0812fe2" data-file-name="components/ForwardingDashboard.tsx">Aturan Filter</span></TabsTrigger>
            <TabsTrigger value="logs"><span className="editable-text" data-unique-id="708c4493-109a-4ff8-8f24-be954b586f50" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></TabsTrigger>
            <TabsTrigger value="audio_cloud"><span className="editable-text" data-unique-id="786b7882-526b-429c-8159-2da0312260b8" data-file-name="components/ForwardingDashboard.tsx">Audio Cloud</span></TabsTrigger>
            <TabsTrigger value="pdf_cloud"><span className="editable-text" data-unique-id="e6fdb2fe-ab0f-4c9e-bfbd-f5c561098e5b" data-file-name="components/ForwardingDashboard.tsx">PDF Cloud</span></TabsTrigger>
            <TabsTrigger value="file_cloud"><span className="editable-text" data-unique-id="8a0af151-52ca-470e-be39-c2642a0fb94d" data-file-name="components/ForwardingDashboard.tsx">File Cloud</span></TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="setup">
            <ForwardingSetup />
          </TabsContent>
          
          <TabsContent value="rules">
            <ForwardingRules />
          </TabsContent>
          
          <TabsContent value="logs">
            <Card data-unique-id="e4b3cbd2-d664-42e5-88aa-a09d07725efa" data-file-name="components/ForwardingDashboard.tsx">
              <CardHeader data-unique-id="986383d7-04e0-4f72-a7a4-c5a3ba2a2251" data-file-name="components/ForwardingDashboard.tsx">
                <CardTitle data-unique-id="42f335d7-5338-40ea-8cb1-607ff1815cca" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="344a7556-fb98-4b98-ae20-ee62be17731f" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></CardTitle>
                <CardDescription><span className="editable-text" data-unique-id="067160a1-e46f-41ea-84fc-d014f921237a" data-file-name="components/ForwardingDashboard.tsx">
                  Riwayat pesan yang diterima dan diteruskan
                </span></CardDescription>
              </CardHeader>
              <CardContent data-unique-id="45920944-362e-4df3-86c9-5172772fb870" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">
                {loading ? <div className="flex justify-center py-8" data-unique-id="348c0571-14b6-48c9-bb9a-67dcf19f854c" data-file-name="components/ForwardingDashboard.tsx">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="a55df290-9dd1-495c-9b65-904e5e49ea35" data-file-name="components/ForwardingDashboard.tsx"></div>
                  </div> : error ? <div className="text-red-500 py-4" data-unique-id="b71ca849-e8ca-47ce-96e4-569d50617ec4" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">{error}</div> : <ForwardingLogs logs={logs} />}
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