"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import ForwardingSetup from "./ForwardingSetup";
import ForwardingLogs from "./ForwardingLogs";
import ForwardingRules from "./ForwardingRules";
import TelegramGateway from "./TelegramGateway";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ForwardingDashboard() {
  const [logs, setLogs] = useState<any[]|null>([]);
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Telegram Message Forwarding</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Teruskan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8 flex justify-between items-center">
          <Link href="/admin">
            <Button variant="outline" size="sm">Kembali ke Admin Panel</Button>
          </Link>
        </div>
        
        <Tabs defaultValue="gateway" className="w-full">
          <div className="overflow-x-auto">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="gateway">Gateway Telegram</TabsTrigger>
            <TabsTrigger value="setup">Pengaturan</TabsTrigger>
            <TabsTrigger value="rules">Aturan Filter</TabsTrigger>
            <TabsTrigger value="logs">Log Aktivitas</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="setup">
            <ForwardingSetup />
          </TabsContent>
          
          <TabsContent value="rules">
            <ForwardingRules />
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Log Aktivitas</CardTitle>
                <CardDescription>
                  Riwayat pesan yang diterima dan diteruskan
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : error ? (
                  <div className="text-red-500 py-4">{error}</div>
                ) : (
                  <ForwardingLogs logs={logs} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="gateway">
            <TelegramGateway />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
