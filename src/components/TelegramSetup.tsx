"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { AlertCircle, CheckCircle2, Copy, ExternalLink, HelpCircle, Save, Edit, X } from "lucide-react";

export default function TelegramSetup() {
  const [botToken, setBotToken] = useState("");
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isSettingWebhook, setIsSettingWebhook] = useState(false);
  const [setupStatus, setSetupStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [showGuide, setShowGuide] = useState(false);
  const [messageFormat, setMessageFormat] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formatStatus, setFormatStatus] = useState<"idle" | "success" | "error">("idle");
  const [formatMessage, setFormatMessage] = useState("");
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  
  // Calculated pagination values
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
    // Center current page when possible
    let startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
    return startPage + i;
  }).filter(num => num > 0 && num <= totalPages);

  // Get the current domain for the webhook URL suggestion
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const domain = window.location.origin;
      setWebhookUrl(`${domain}/api/telegram/webhook`);
    }
  }, []);

  // Load message format
  useEffect(() => {
    fetchMessageFormat();
  }, []);

  const fetchMessageFormat = async () => {
    try {
      const response = await fetch('/api/telegram/message-format');
      if (response.ok) {
        const data = await response.json();
        setMessageFormat(data.format);
      }
    } catch (error) {
      console.error('Error fetching message format:', error);
    }
  };

  const saveMessageFormat = async () => {
    setIsSaving(true);
    setFormatStatus("idle");
    
    try {
      const response = await fetch('/api/telegram/message-format', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ format: messageFormat })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save message format');
      }
      
      setFormatStatus("success");
      setFormatMessage("Format pesan berhasil disimpan");
      setIsEditing(false);
      
      setTimeout(() => {
        setFormatStatus("idle");
        setFormatMessage("");
      }, 3000);
    } catch (error) {
      setFormatStatus("error");
      setFormatMessage(error instanceof Error ? error.message : "Gagal menyimpan format pesan");
    } finally {
      setIsSaving(false);
    }
  };

  // Actually make the API call to set the webhook
  const handleSetWebhook = async () => {
    if (!botToken || !webhookUrl) {
      setSetupStatus("error");
      setStatusMessage("Mohon masukkan Bot Token dan Webhook URL");
      return;
    }

    setIsSettingWebhook(true);
    setSetupStatus("idle");

    try {
      // Make a real API call to Telegram
      const telegramApiUrl = `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`;
      
      const response = await fetch(telegramApiUrl);
      const data = await response.json();
      
      if (!data.ok) throw new Error(data.description || "Gagal mengatur webhook");
      
      setSetupStatus("success");
      setStatusMessage("Webhook berhasil diatur! Bot Anda sekarang akan meneruskan pesan ke aplikasi ini.");
      
      // Save the token in localStorage for future reference
      localStorage.setItem("telegramBotToken", botToken);
      localStorage.setItem("telegramWebhookUrl", webhookUrl);
      
    } catch (error) {
      setSetupStatus("error");
      setStatusMessage(error instanceof Error ? error.message : "Gagal mengatur webhook");
    } finally {
      setIsSettingWebhook(false);
    }
  };

  // Load saved values from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem("telegramBotToken");
      if (savedToken) setBotToken(savedToken);
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
            <CardTitle>Pengaturan Bot Telegram</CardTitle>
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
            Konfigurasikan bot Telegram Anda untuk meneruskan pesan ke aplikasi ini
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {showGuide && (
            <div className="bg-muted p-4 rounded-md mb-4 space-y-3">
              <h3 className="font-medium text-lg">Panduan Mendapatkan Bot Token</h3>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Buka Telegram dan cari <strong>@BotFather</strong></li>
                <li>Mulai percakapan dengan mengetik <code className="bg-muted-foreground bg-opacity-20 px-1 rounded">/start</code></li>
                <li>Buat bot baru dengan mengetik <code className="bg-muted-foreground bg-opacity-20 px-1 rounded">/newbot</code></li>
                <li>Ikuti instruksi untuk memberikan nama dan username untuk bot Anda</li>
                <li>BotFather akan memberikan token API yang terlihat seperti: <code className="bg-muted-foreground bg-opacity-20 px-1 rounded">5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh</code></li>
                <li>Salin token tersebut ke kolom Bot Token di bawah</li>
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
            <Label htmlFor="bot-token">Bot Token</Label>
            <Input
              id="bot-token"
              type="text"
              placeholder="5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh"
              value={botToken}
              onChange={(e) => setBotToken(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Dapatkan token ini dari BotFather saat Anda membuat bot
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
              Ini adalah URL tempat Telegram akan mengirimkan notifikasi
            </p>
          </div>

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

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Format Pesan</CardTitle>
            {!isEditing ? (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <Edit className="h-4 w-4" />
                Edit Format
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Batal
                </Button>
                <Button 
                  onClick={saveMessageFormat}
                  variant="default"
                  size="sm"
                  disabled={isSaving}
                  className="flex items-center gap-1"
                >
                  {isSaving ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Simpan
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
          <CardDescription>
            Aplikasi akan memproses pesan dengan format ini
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formatStatus === "success" && (
            <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span>{formatMessage}</span>
            </div>
          )}
          
          {formatStatus === "error" && (
            <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{formatMessage}</span>
            </div>
          )}
          
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="message-format">Edit Format Pesan</Label>
              <textarea
                id="message-format"
                className="w-full h-64 p-4 rounded-md font-mono text-sm bg-muted border border-input resize-none"
                value={messageFormat}
                onChange={(e) => setMessageFormat(e.target.value)}
              />
              <p className="text-sm text-muted-foreground">
                Pastikan format pesan mengikuti struktur yang dapat diproses oleh sistem
              </p>
            </div>
          ) : (
            <>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
                {messageFormat}
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                Sistem akan mengekstrak nomor telepon dan nama dari pesan pembayaran dan membuat akun pengguna secara otomatis.
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
