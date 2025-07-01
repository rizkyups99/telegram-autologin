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
import CloudPreview from "./CloudPreview";
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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="019b0bc3-fdec-4aec-9431-63865bd06c69" data-file-name="components/ForwardingDashboard.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="c263323f-f096-4a99-b8b5-6458f83785cb" data-file-name="components/ForwardingDashboard.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background" data-unique-id="7e460997-ca43-45f1-831b-30473153e664" data-file-name="components/ForwardingDashboard.tsx">
      <header className="border-b border-border" data-unique-id="07be4c1f-e26d-4d44-a90b-58bf4b5c983c" data-file-name="components/ForwardingDashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6" data-unique-id="a755ac8f-7057-4fe2-a471-cfabb852160a" data-file-name="components/ForwardingDashboard.tsx">
          <h1 className="text-2xl sm:text-3xl font-bold" data-unique-id="266c5b14-8bf1-4e2e-8eae-35db0a6a0b6d" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="b32af6e9-3302-4de2-9e98-a7c5451e228f" data-file-name="components/ForwardingDashboard.tsx">Telegram Message Forwarding</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2" data-unique-id="0a65da14-a138-481e-99ff-898d93245265" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="be00ba34-217d-4eeb-b92a-2e9782d54f09" data-file-name="components/ForwardingDashboard.tsx">
            Teruskan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8" data-unique-id="ff30fc5b-2d42-4c15-9ade-3316ab8c14d2" data-file-name="components/ForwardingDashboard.tsx">
        <div className="mb-6 sm:mb-8 flex justify-between items-center" data-unique-id="17b40d40-d709-463b-9386-de5c4240e4ce" data-file-name="components/ForwardingDashboard.tsx">
          <Link href="/admin" data-unique-id="cbe4c008-0b95-4941-ab9c-dd56af8790e5" data-file-name="components/ForwardingDashboard.tsx">
            <Button variant="outline" size="sm" data-unique-id="7d447ece-c0ad-43f2-a858-b86cab390fca" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="407d931e-91f8-4b27-aece-68e4db3d1916" data-file-name="components/ForwardingDashboard.tsx">Kembali ke Admin Panel</span></Button>
          </Link>
        </div>
        
        <Tabs defaultValue="gateway" className="w-full" data-unique-id="d4984413-dcfa-4fb9-9c6d-6367f40b1c6c" data-file-name="components/ForwardingDashboard.tsx">
          <div className="overflow-x-auto" data-unique-id="ecc22d38-3fb3-45ba-a6e8-297e995dd4b1" data-file-name="components/ForwardingDashboard.tsx">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="gateway"><span className="editable-text" data-unique-id="64ea873b-4977-4044-9812-b202d1c76650" data-file-name="components/ForwardingDashboard.tsx">Gateway Telegram</span></TabsTrigger>
            <TabsTrigger value="setup"><span className="editable-text" data-unique-id="ca0c2d58-0601-481c-ac90-72c6fee8baaf" data-file-name="components/ForwardingDashboard.tsx">Pengaturan</span></TabsTrigger>
            <TabsTrigger value="rules"><span className="editable-text" data-unique-id="42a40a9d-39d0-48de-9f42-28900baccdec" data-file-name="components/ForwardingDashboard.tsx">Aturan Filter</span></TabsTrigger>
            <TabsTrigger value="logs"><span className="editable-text" data-unique-id="99e0c4ca-6e85-470a-804e-dac923257085" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></TabsTrigger>
            <TabsTrigger value="audio_cloud"><span className="editable-text" data-unique-id="ff5717d0-8e48-4f0e-b41f-2d26964a1300" data-file-name="components/ForwardingDashboard.tsx">Audio Cloud</span></TabsTrigger>
            <TabsTrigger value="pdf_cloud"><span className="editable-text" data-unique-id="c8f0932b-010b-4630-bb70-21bb8c0d63eb" data-file-name="components/ForwardingDashboard.tsx">PDF Cloud</span></TabsTrigger>
            <TabsTrigger value="file_cloud"><span className="editable-text" data-unique-id="d3f3bc20-3ff3-4463-a97d-e5956229f296" data-file-name="components/ForwardingDashboard.tsx">File Cloud</span></TabsTrigger>
            <TabsTrigger value="preview_cloud"><span className="editable-text" data-unique-id="664e80e8-9a5f-431f-a10d-2e4103f58621" data-file-name="components/ForwardingDashboard.tsx">Preview Cloud</span></TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="setup">
            <ForwardingSetup />
          </TabsContent>
          
          <TabsContent value="rules">
            <ForwardingRules />
          </TabsContent>
          
          <TabsContent value="logs">
            <Card data-unique-id="a89917c9-e2d9-4947-8b62-5929d0d4428a" data-file-name="components/ForwardingDashboard.tsx">
              <CardHeader data-unique-id="5af60ea2-95c7-43ba-be87-f67b055d9a5f" data-file-name="components/ForwardingDashboard.tsx">
                <CardTitle data-unique-id="f6dbcfb5-a76c-47e2-9508-700fbd935185" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="ea05b0d9-e4f7-4602-97d6-60fb29afb9f2" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></CardTitle>
                <CardDescription><span className="editable-text" data-unique-id="cbae6c23-a31e-4edc-a0f5-a14e46963acf" data-file-name="components/ForwardingDashboard.tsx">
                  Riwayat pesan yang diterima dan diteruskan
                </span></CardDescription>
              </CardHeader>
              <CardContent data-unique-id="94bd7a86-e1b3-46af-9e0c-68e1e6a42d20" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">
                {loading ? <div className="flex justify-center py-8" data-unique-id="8f66bf75-2cf3-47f7-897e-f1a7ef88f4cc" data-file-name="components/ForwardingDashboard.tsx">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="f4bd2006-f4dd-4355-b4b6-04d7173e9a31" data-file-name="components/ForwardingDashboard.tsx"></div>
                  </div> : error ? <div className="text-red-500 py-4" data-unique-id="30ae87fd-b921-417e-910c-a6d7205ea5d3" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">{error}</div> : <ForwardingLogs logs={logs} />}
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
          
          <TabsContent value="preview_cloud">
            <CloudPreview />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}