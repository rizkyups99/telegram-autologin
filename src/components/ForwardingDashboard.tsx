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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="99e22d6c-8258-4c2c-840f-e6da08e702a7" data-file-name="components/ForwardingDashboard.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="b2a56bf2-0586-466d-8de1-ce4ac6b58138" data-file-name="components/ForwardingDashboard.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background" data-unique-id="5642a71b-77b8-407a-82c8-ad645021e646" data-file-name="components/ForwardingDashboard.tsx">
      <header className="border-b border-border" data-unique-id="a2a44a3f-2b01-4eaf-8260-b94741e3e2eb" data-file-name="components/ForwardingDashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6" data-unique-id="191ad61f-2196-456f-99b9-1470ffe1ca4d" data-file-name="components/ForwardingDashboard.tsx">
          <h1 className="text-2xl sm:text-3xl font-bold" data-unique-id="30dbee0f-0001-4807-b9df-215909cd8125" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="9714ba4d-25f6-42fb-9cff-8fdef1e33f53" data-file-name="components/ForwardingDashboard.tsx">Telegram Message Forwarding</span></h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2" data-unique-id="a93fdfd2-b416-4ee1-9832-8789d0ec5d6c" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="1bca791b-abf9-4134-b238-7065558d2184" data-file-name="components/ForwardingDashboard.tsx">
            Teruskan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8" data-unique-id="8d7c6a96-c4e6-4099-bffd-6f9c03ddea63" data-file-name="components/ForwardingDashboard.tsx">
        <div className="mb-6 sm:mb-8 flex justify-between items-center" data-unique-id="691367b8-4506-4c0a-ad4b-b11de3bd9243" data-file-name="components/ForwardingDashboard.tsx">
          <Link href="/admin" data-unique-id="a4bff368-66c4-441b-8ffa-7a7c45bb9953" data-file-name="components/ForwardingDashboard.tsx">
            <Button variant="outline" size="sm" data-unique-id="ccafc8e0-890a-4afd-9896-d2092623f927" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="6f2cdc3f-5efb-4b39-afa4-1274def6eaad" data-file-name="components/ForwardingDashboard.tsx">Kembali ke Admin Panel</span></Button>
          </Link>
        </div>
        
        <Tabs defaultValue="gateway" className="w-full" data-unique-id="07f64dfc-89c4-49d9-9478-1fb9d787d5e5" data-file-name="components/ForwardingDashboard.tsx">
          <div className="overflow-x-auto" data-unique-id="67503a40-72eb-4243-8d93-1b4e917359a7" data-file-name="components/ForwardingDashboard.tsx">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="gateway"><span className="editable-text" data-unique-id="26ee08e6-f90d-4efd-889d-cf571317444c" data-file-name="components/ForwardingDashboard.tsx">Gateway Telegram</span></TabsTrigger>
            <TabsTrigger value="setup"><span className="editable-text" data-unique-id="b64c920d-bc2d-4eb6-99a3-f0d65e6342a9" data-file-name="components/ForwardingDashboard.tsx">Pengaturan</span></TabsTrigger>
            <TabsTrigger value="rules"><span className="editable-text" data-unique-id="7eac64f6-fc33-466e-9d9e-13b258e9c17f" data-file-name="components/ForwardingDashboard.tsx">Aturan Filter</span></TabsTrigger>
            <TabsTrigger value="logs"><span className="editable-text" data-unique-id="68b0da03-21a5-492e-a69c-f95acaa0d9a8" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></TabsTrigger>
            <TabsTrigger value="audio_cloud"><span className="editable-text" data-unique-id="bf32c34b-f173-4f8f-a2dd-5b3ebf1a35ea" data-file-name="components/ForwardingDashboard.tsx">Audio Cloud</span></TabsTrigger>
            <TabsTrigger value="pdf_cloud"><span className="editable-text" data-unique-id="8f87d39e-33b3-46a6-ab33-3d5319c1f2ab" data-file-name="components/ForwardingDashboard.tsx">PDF Cloud</span></TabsTrigger>
            <TabsTrigger value="file_cloud"><span className="editable-text" data-unique-id="a4a200a6-2a4a-460c-85d2-a7cdbcf9d444" data-file-name="components/ForwardingDashboard.tsx">File Cloud</span></TabsTrigger>
            <TabsTrigger value="preview_cloud"><span className="editable-text" data-unique-id="36ef6e82-370b-4272-a955-9b89422684d0" data-file-name="components/ForwardingDashboard.tsx">Preview Cloud</span></TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="setup">
            <ForwardingSetup />
          </TabsContent>
          
          <TabsContent value="rules">
            <ForwardingRules />
          </TabsContent>
          
          <TabsContent value="logs">
            <Card data-unique-id="77c3343e-6063-4fee-87fa-bf6be7001dc2" data-file-name="components/ForwardingDashboard.tsx">
              <CardHeader data-unique-id="e7f17d82-02ae-451f-ab2b-30a8d932ed21" data-file-name="components/ForwardingDashboard.tsx">
                <CardTitle data-unique-id="d2ade765-4705-4c32-8f4f-29804c9017eb" data-file-name="components/ForwardingDashboard.tsx"><span className="editable-text" data-unique-id="b946eaf2-af34-41ab-94f5-fd15695a07cf" data-file-name="components/ForwardingDashboard.tsx">Log Aktivitas</span></CardTitle>
                <CardDescription><span className="editable-text" data-unique-id="aefb8e0f-bb5c-434d-94a3-cfee5d1485a9" data-file-name="components/ForwardingDashboard.tsx">
                  Riwayat pesan yang diterima dan diteruskan
                </span></CardDescription>
              </CardHeader>
              <CardContent data-unique-id="e0fe50c7-cb76-4173-8ac1-6b4e6d916db1" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">
                {loading ? <div className="flex justify-center py-8" data-unique-id="bc7730c5-eb56-4b98-a1d9-84e6102a5aea" data-file-name="components/ForwardingDashboard.tsx">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="39fa49e2-6696-4e2a-84ed-0b6ba44dcaee" data-file-name="components/ForwardingDashboard.tsx"></div>
                  </div> : error ? <div className="text-red-500 py-4" data-unique-id="7066403b-7f00-4780-810b-d6e5108ec1ae" data-file-name="components/ForwardingDashboard.tsx" data-dynamic-text="true">{error}</div> : <ForwardingLogs logs={logs} />}
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