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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="4fb6f8ac-ce9f-4616-9ab0-4f0e687d2ea3" data-file-name="components/ForwardingDashboard.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="7bc18e16-fd70-4c95-9dc9-5adcb243140b" data-file-name="components/ForwardingDashboard.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background" data-unique-id="5972e415-f52a-441a-8570-56490975275b" data-file-name="components/ForwardingDashboard.tsx">
      <header className="border-b border-border" data-unique-id="a6f9f1d7-7a1e-4b5c-965a-62338bd1c58e" data-file-name="components/ForwardingDashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6" data-unique-id="53d1d867-4ee5-4284-a45d-3707c4f9da16" data-file-name="components/ForwardingDashboard.tsx">
          <h1 className="text-2xl sm:text-3xl font-bold" data-unique-id="40f32d2e-f6ea-4d83-8d57-7148a417a7bb" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="94c2b16f-cdbd-4145-b809-56b1897219a1" data-file-name="components/ForwardingDashboard.tsx">Telegram Message Forwarding</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2" data-unique-id="3a2b562b-e240-4bc9-81bb-c1b0cb8155a8" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="7b7df72c-ae1b-4953-aa19-dac1e2429616" data-file-name="components/ForwardingDashboard.tsx">
            Teruskan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8" data-unique-id="4a4574c9-76c7-41d8-baf0-541c8c58eb59" data-file-name="components/ForwardingDashboard.tsx">
        <div className="mb-6 sm:mb-8 flex justify-between items-center" data-unique-id="ae6e3829-b199-41e4-a860-9247fcb6c72d" data-file-name="components/ForwardingDashboard.tsx">
          <Link href="/admin" data-unique-id="7775b422-317c-451c-97fe-a03276db33dd" data-file-name="components/ForwardingDashboard.tsx">
            <Button variant="outline" size="sm" data-unique-id="1693fe5c-e95a-4e0a-8cf1-d147c1bea311" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="9b1846e3-b834-4638-8ab3-9c6f31338d54" data-file-name="components/ForwardingDashboard.tsx">Kembali ke Admin Panel</span></Button>
          </Link>
        </div>
        
        <Tabs defaultValue="gateway" className="w-full" data-unique-id="1634d85e-a491-40c3-b875-0230b371f190" data-file-name="components/ForwardingDashboard.tsx">
          <div className="overflow-x-auto" data-unique-id="f2974a57-c16a-4489-818d-4722cd4a7961" data-file-name="components/ForwardingDashboard.tsx">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="gateway"><span className="editable-text" data-unique-id="3d29c993-1278-4eaf-9355-2d1153dc6ec8" data-file-name="components/ForwardingDashboard.tsx">Gateway Telegram</span></TabsTrigger>
            <TabsTrigger value="setup"><span className="editable-text" data-unique-id="e2b80425-0971-4dc2-931b-251423830ba7" data-file-name="components/ForwardingDashboard.tsx">Pengaturan</span></TabsTrigger>
            <TabsTrigger value="rules"><span className="editable-text" data-unique-id="10da63be-d169-4a8a-898c-1ea28e36c6fb" data-file-name="components/ForwardingDashboard.tsx">Aturan Filter</span></TabsTrigger>
            <TabsTrigger value="logs"><span className="editable-text" data-unique-id="dc5d30f1-5359-41f9-9fbd-e93a3a4285fb" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></TabsTrigger>
            <TabsTrigger value="audio_cloud"><span className="editable-text" data-unique-id="63f1a2b9-10e0-4904-9189-bf161adc2931" data-file-name="components/ForwardingDashboard.tsx">Audio Cloud</span></TabsTrigger>
            <TabsTrigger value="pdf_cloud"><span className="editable-text" data-unique-id="0ae5bf93-8679-4d09-a10e-9ae071c3e6e0" data-file-name="components/ForwardingDashboard.tsx">PDF Cloud</span></TabsTrigger>
            <TabsTrigger value="file_cloud"><span className="editable-text" data-unique-id="112fc1be-da1d-4d22-9943-05c8c4a29695" data-file-name="components/ForwardingDashboard.tsx">File Cloud</span></TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="setup">
            <ForwardingSetup />
          </TabsContent>
          
          <TabsContent value="rules">
            <ForwardingRules />
          </TabsContent>
          
          <TabsContent value="logs">
            <Card data-unique-id="82306eaa-a8bc-445e-a345-9d45239f9820" data-file-name="components/ForwardingDashboard.tsx">
              <CardHeader data-unique-id="8f07f745-1960-4d4a-b573-52a1c913acf4" data-file-name="components/ForwardingDashboard.tsx">
                <CardTitle data-unique-id="93553e17-61d9-4db5-ae28-522512d66c87" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="afd93f4d-4d8c-419d-aa5c-0153e034c4b0" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></CardTitle>
                <CardDescription><span className="editable-text" data-unique-id="05c69a3a-adf8-4c59-b1d5-3aa9a16e2d21" data-file-name="components/ForwardingDashboard.tsx">
                  Riwayat pesan yang diterima dan diteruskan
                </span></CardDescription>
              </CardHeader>
              <CardContent data-unique-id="3dde631a-30c3-4c97-be15-bcfde4ede841" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">
                {loading ? <div className="flex justify-center py-8" data-unique-id="c85e79c2-01ec-4754-957b-f56ba59c2efa" data-file-name="components/ForwardingDashboard.tsx">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="51a1d595-894b-4635-bc7c-89a1b9e8b77e" data-file-name="components/ForwardingDashboard.tsx"></div>
                  </div> : error ? <div className="text-red-500 py-4" data-unique-id="b2623e86-d448-4db6-93d8-f0cb338c2aec" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">{error}</div> : <ForwardingLogs logs={logs} />}
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