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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="fb232bd0-5314-42c4-87f5-81ffbd33a494" data-file-name="components/ForwardingDashboard.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="d05e798d-d5fe-4891-bc42-4bbdfe32b44a" data-file-name="components/ForwardingDashboard.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background" data-unique-id="903fbd76-b5a6-4cba-b888-bd063d2b5bc6" data-file-name="components/ForwardingDashboard.tsx">
      <header className="border-b border-border" data-unique-id="a6759675-c067-4fd7-82d9-301f2a0a90d2" data-file-name="components/ForwardingDashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6" data-unique-id="ff55251b-21d3-409a-884b-bf353de6b070" data-file-name="components/ForwardingDashboard.tsx">
          <h1 className="text-2xl sm:text-3xl font-bold" data-unique-id="7b8eba2a-6fb8-4565-92f2-197d231ba95c" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="33876f6f-3d2d-4398-b560-9b8a6a6bc9af" data-file-name="components/ForwardingDashboard.tsx">Telegram Message Forwarding</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2" data-unique-id="34c382f3-ed03-485b-af48-d8b7737198f4" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="34327a44-e801-42bc-8257-d75d750889a6" data-file-name="components/ForwardingDashboard.tsx">
            Teruskan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8" data-unique-id="0a18e3c4-6e1d-42aa-afb2-41a494dab3e1" data-file-name="components/ForwardingDashboard.tsx">
        <div className="mb-6 sm:mb-8 flex justify-between items-center" data-unique-id="c6bbc776-2d54-4729-941f-e0fb1d536b27" data-file-name="components/ForwardingDashboard.tsx">
          <Link href="/admin" data-unique-id="53b8210b-48b0-43bb-bd21-317734b99d03" data-file-name="components/ForwardingDashboard.tsx">
            <Button variant="outline" size="sm" data-unique-id="f70f5806-1284-4e0a-9eba-6ce6362d3e59" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="2ee37ace-8d5f-4f3b-bc0d-1596244a3e58" data-file-name="components/ForwardingDashboard.tsx">Kembali ke Admin Panel</span></Button>
          </Link>
        </div>
        
        <Tabs defaultValue="gateway" className="w-full" data-unique-id="ac395126-c9da-4564-ae38-bd3c5f313e03" data-file-name="components/ForwardingDashboard.tsx">
          <div className="overflow-x-auto" data-unique-id="72fead81-843d-4e63-b905-9e3517ff8666" data-file-name="components/ForwardingDashboard.tsx">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="gateway"><span className="editable-text" data-unique-id="c65f2290-a083-437f-b4b7-3643c27e1771" data-file-name="components/ForwardingDashboard.tsx">Gateway Telegram</span></TabsTrigger>
            <TabsTrigger value="setup"><span className="editable-text" data-unique-id="121bad7e-4185-4e56-a74e-e66e58cf6eab" data-file-name="components/ForwardingDashboard.tsx">Pengaturan</span></TabsTrigger>
            <TabsTrigger value="rules"><span className="editable-text" data-unique-id="9cc4cfdd-4a5b-42a2-a157-2e11cfec78c5" data-file-name="components/ForwardingDashboard.tsx">Aturan Filter</span></TabsTrigger>
            <TabsTrigger value="logs"><span className="editable-text" data-unique-id="fbace1e4-4843-47ea-91b6-4b91d0046bd4" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></TabsTrigger>
            <TabsTrigger value="audio_cloud"><span className="editable-text" data-unique-id="8875ba3f-05fd-4312-968f-983d5397d094" data-file-name="components/ForwardingDashboard.tsx">Audio Cloud</span></TabsTrigger>
            <TabsTrigger value="pdf_cloud"><span className="editable-text" data-unique-id="1c6879ef-ca86-4cce-a1ec-db93d0971508" data-file-name="components/ForwardingDashboard.tsx">PDF Cloud</span></TabsTrigger>
            <TabsTrigger value="file_cloud"><span className="editable-text" data-unique-id="2ecb0f31-9330-4678-8880-c3b41292b962" data-file-name="components/ForwardingDashboard.tsx">File Cloud</span></TabsTrigger>
            <TabsTrigger value="preview_cloud"><span className="editable-text" data-unique-id="d21e54a6-d87f-4a41-9dc9-222406db472a" data-file-name="components/ForwardingDashboard.tsx">Preview Cloud</span></TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="setup">
            <ForwardingSetup />
          </TabsContent>
          
          <TabsContent value="rules">
            <ForwardingRules />
          </TabsContent>
          
          <TabsContent value="logs">
            <Card data-unique-id="00d35e07-6699-4f4f-bda3-ac6d061ee6d1" data-file-name="components/ForwardingDashboard.tsx">
              <CardHeader data-unique-id="600f0318-5955-40ec-a31f-add36f91555c" data-file-name="components/ForwardingDashboard.tsx">
                <CardTitle data-unique-id="9d6b47e4-299a-4182-9f82-2d6174749920" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="37fac06e-3d31-451e-9731-4ef218669280" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></CardTitle>
                <CardDescription><span className="editable-text" data-unique-id="017c3afd-2d9f-4622-9628-be38843b1e35" data-file-name="components/ForwardingDashboard.tsx">
                  Riwayat pesan yang diterima dan diteruskan
                </span></CardDescription>
              </CardHeader>
              <CardContent data-unique-id="2435d8e0-580f-48e0-b0ea-674553dc379e" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">
                {loading ? <div className="flex justify-center py-8" data-unique-id="0df96b26-2579-4e3c-92ef-464f125cf57c" data-file-name="components/ForwardingDashboard.tsx">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="8c0eddfc-8641-402f-a0e1-5038fd070a23" data-file-name="components/ForwardingDashboard.tsx"></div>
                  </div> : error ? <div className="text-red-500 py-4" data-unique-id="4d951c4c-6748-43aa-8699-82108930ffdb" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">{error}</div> : <ForwardingLogs logs={logs} />}
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