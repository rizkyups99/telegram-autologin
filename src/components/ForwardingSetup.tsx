"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertCircle, CheckCircle2, Copy, ExternalLink, HelpCircle } from "lucide-react";

export default function ForwardingSetup() {
  const [sourceBot, setSourceBot] = useState("@scalevid_bot");
  const [targetBot, setTargetBot] = useState("@iky2025bot");
  const [targetBotToken, setTargetBotToken] = useState("8175916366:AAE4D1L_phr3HyadQ1QgLWJsX_cpkBgsYOo");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isSettingWebhook, setIsSettingWebhook] = useState(false);
  const [setupStatus, setSetupStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [isForwardingActive, setIsForwardingActive] = useState(false);

  // Get the current domain for the webhook URL suggestion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const domain = window.location.origin;
      setWebhookUrl(`${domain}/api/telegram/webhook`);
      
      // Check if forwarding is active from localStorage
      const active = localStorage.getItem("forwardingActive") === "true";
      setIsForwardingActive(active);
    }
  }, []);

  const handleSetWebhook = async () => {
    if (!targetBotToken || !webhookUrl) {
      setSetupStatus("error");
      setStatusMessage("Mohon masukkan Bot Token dan Webhook URL");
      return;
    }

    setIsSettingWebhook(true);
    setSetupStatus("idle");

    try {
      // Make a real API call to Telegram
      const telegramApiUrl = `https://api.telegram.org/bot${targetBotToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
      
      const response = await fetch(telegramApiUrl);
      const data = await response.json();
      
      if (!data.ok) throw new Error(data.description || "Gagal mengatur webhook");
      
      setSetupStatus("success");
      setStatusMessage("Webhook berhasil diatur! Bot Anda sekarang akan menerima pesan yang diteruskan.");
      
      // Save the token in localStorage for future reference
      localStorage.setItem("targetBotToken", targetBotToken);
      localStorage.setItem("webhookUrl", webhookUrl);
      
    } catch (error) {
      setSetupStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Gagal mengatur webhook");
    } finally {
      setIsSettingWebhook(false);
    }
  };

  const toggleForwarding = () => {
    const newState = !isForwardingActive;
    setIsForwardingActive(newState);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem("forwardingActive", newState.toString());
    }
    
    // In a real app, you would make an API call to enable/disable forwarding
    fetch("/api/telegram/toggle-forwarding", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ active: newState }),
    });
  };

  // Load saved values from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem("targetBotToken");
      if (savedToken) setTargetBotToken(savedToken);
      
      const savedWebhook = localStorage.getItem("webhookUrl");
      if (savedWebhook) setWebhookUrl(savedWebhook);
    }
  }, []);

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
    }
  };

  const openTelegramBotFather = () => {
    if (typeof window !== 'undefined') {
      window.open("https://t.me/BotFather", "_blank");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pengaturan Penerusan Pesan</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-1"
            >
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription>
            Konfigurasikan penerusan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showGuide && (
            <div className="bg-muted p-4 rounded-md mb-4 space-y-3">
              <h3 className="font-medium text-lg">Panduan Penerusan Pesan</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Pastikan Anda telah membuat bot Telegram menggunakan <strong>@BotFather</strong></li>
                <li>Salin token bot Anda dan masukkan di kolom "Bot Token" di bawah</li>
                <li>Klik "Atur Webhook" untuk menghubungkan bot Anda dengan aplikasi ini</li>
                <li>Aktifkan penerusan pesan dengan mengklik tombol "Aktifkan Penerusan"</li>
                <li>Pesan dari Scalev Notification Bot yang mengandung kata kunci "pembayaran" akan diteruskan ke bot Anda</li>
              </ol>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={openTelegramBotFather}
                className="flex items-center gap-1 mt-2"
              >
                <ExternalLink className="h-4 w-4" />
                Buka BotFather di Telegram
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="source-bot">Bot Sumber</Label>
            <Input
              id="source-bot"
              type="text"
              value={sourceBot}
              onChange={(e) => setSourceBot(e.target.value)}
              disabled
            />
            <p className="text-sm text-muted-foreground">
              Bot yang mengirimkan pesan yang ingin diteruskan
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-bot">Bot Tujuan</Label>
            <Input
              id="target-bot"
              type="text"
              value={targetBot}
              onChange={(e) => setTargetBot(e.target.value)}
              disabled
            />
            <p className="text-sm text-muted-foreground">
              Bot Telegram pribadi Anda yang akan menerima pesan yang diteruskan
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bot-token">Bot Token</Label>
            <Input
              id="bot-token"
              type="text"
              placeholder="8175916366:AAE4D1L_phr3HyadQ1QgLWJsX_cpkBgsYOo"
              value={targetBotToken}
              onChange={(e) => setTargetBotToken(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Token bot Telegram pribadi Anda (@iky2025bot)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                type="text"
                placeholder="https://your-domain.com/api/telegram/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(webhookUrl)}
                title="Salin ke clipboard"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              URL tempat Telegram akan mengirimkan notifikasi
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              onClick={handleSetWebhook} 
              disabled={isSettingWebhook}
              className="w-full"
            >
              {isSettingWebhook ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Mengatur Webhook...
                </>
              ) : "Atur Webhook"}
            </Button>

            <Button 
              onClick={toggleForwarding}
              variant={isForwardingActive ? "destructive" : "default"}
              className="w-full"
            >
              {isForwardingActive ? "Nonaktifkan Penerusan" : "Aktifkan Penerusan"}
            </Button>
          </div>

          {setupStatus === "success" && (
            <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span>{statusMessage}</span>
            </div>
          )}

          {setupStatus === "error" && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{statusMessage}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
