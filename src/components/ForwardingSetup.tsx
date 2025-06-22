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
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        active: newState
      })
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
  return <div className="space-y-6" data-unique-id="c9206320-9173-41ff-b1b7-e589988231e7" data-file-name="components/ForwardingSetup.tsx">
      <Card data-unique-id="39f27c8f-0de8-48a1-ad06-b1fa42f6481b" data-file-name="components/ForwardingSetup.tsx">
        <CardHeader data-unique-id="ffa5739e-97f4-40a1-8093-fb54918bcdf3" data-file-name="components/ForwardingSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="4d486d10-74ea-4db6-99d0-457e95731554" data-file-name="components/ForwardingSetup.tsx">
            <CardTitle data-unique-id="ab6641f9-5594-422a-a256-7061b48b560b" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="7242c7ff-9b18-4234-b762-d4a4a21c8094" data-file-name="components/ForwardingSetup.tsx">Pengaturan Penerusan Pesan</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="0824d4f6-ccf8-43ca-a5e5-a286bb6fcaf4" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="b8743050-7438-45dc-aeba-86dfcf1b574b" data-file-name="components/ForwardingSetup.tsx">
            Konfigurasikan penerusan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="86f192ba-5920-4ab1-b129-4d2e3acfcc28" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="1df59218-f12d-47f6-a063-f4538e57d15d" data-file-name="components/ForwardingSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="3a3c58aa-a25e-406c-84f7-1ac54199dfec" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="94bacc1f-9df9-4cfe-8a53-c6beefc6fda1" data-file-name="components/ForwardingSetup.tsx">Panduan Penerusan Pesan</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="e3f2832b-5f60-4edc-870e-0bff9d23af84" data-file-name="components/ForwardingSetup.tsx">
                <li data-unique-id="d6936420-c823-458e-b9bb-299ecb789ad3" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="49fe0504-ef33-4b44-a157-f4bc79098de0" data-file-name="components/ForwardingSetup.tsx">Pastikan Anda telah membuat bot Telegram menggunakan </span><strong data-unique-id="af618805-7410-49ed-8c0b-16ec96872c45" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="809f7785-8bfc-4a55-a5f1-1e095331527a" data-file-name="components/ForwardingSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="c4de10e3-6aa3-4071-b679-e75b9b2a75bb" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="a9a3cf96-ae27-46fc-8321-8917a33bd11e" data-file-name="components/ForwardingSetup.tsx">Salin token bot Anda dan masukkan di kolom "Bot Token" di bawah</span></li>
                <li data-unique-id="78bec881-95eb-4bb9-99b1-a4e8b5713ece" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="7f951caf-716e-49e9-ae23-ad9dc0cd4afc" data-file-name="components/ForwardingSetup.tsx">Klik "Atur Webhook" untuk menghubungkan bot Anda dengan aplikasi ini</span></li>
                <li data-unique-id="39e1141e-818f-4dac-b8ee-8b04bfc1bddd" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="9c644a01-8e3b-4688-860c-c79c1a6d5a2f" data-file-name="components/ForwardingSetup.tsx">Aktifkan penerusan pesan dengan mengklik tombol "Aktifkan Penerusan"</span></li>
                <li data-unique-id="587343ee-ffc0-4256-88cc-903ed4d9ad2f" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="198c5c42-797f-4b00-8d0f-fbf93b222ee2" data-file-name="components/ForwardingSetup.tsx">Pesan dari Scalev Notification Bot yang mengandung kata kunci "pembayaran" akan diteruskan ke bot Anda</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="b0ab58de-48e2-4b59-8d30-5719488142f8" data-file-name="components/ForwardingSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="6f4d692c-144a-44ca-8c70-3a93c8a89890" data-file-name="components/ForwardingSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="f35f5868-3ce9-465d-849f-6d783abfc297" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="source-bot" data-unique-id="55d90b14-6cae-483c-9992-fcc6b7795612" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="9dd1d7fc-9ffb-4ded-a727-bd6ce523ac61" data-file-name="components/ForwardingSetup.tsx">Bot Sumber</span></Label>
            <Input id="source-bot" type="text" value={sourceBot} onChange={e => setSourceBot(e.target.value)} disabled data-unique-id="e2735de8-0226-4370-afea-9c12621c6e5a" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="f36873ea-1b87-4a73-9e7a-f554380acffc" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="f9c03580-01a0-48fb-9a7e-39ddb7cfd62c" data-file-name="components/ForwardingSetup.tsx">
              Bot yang mengirimkan pesan yang ingin diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="3b4786af-9883-4be5-b323-464954dc2552" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="target-bot" data-unique-id="53d319a0-788c-4c09-b734-f3a917093eed" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="b956a28f-da96-41e5-9e8b-4aba82b71adc" data-file-name="components/ForwardingSetup.tsx">Bot Tujuan</span></Label>
            <Input id="target-bot" type="text" value={targetBot} onChange={e => setTargetBot(e.target.value)} disabled data-unique-id="fcaae3ba-507d-4a9e-848f-a41877a85a46" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="44219fb5-a7e8-40f8-97d8-60c5f5b8b542" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="3a4cc2df-836f-4a4d-a1eb-1170a737f969" data-file-name="components/ForwardingSetup.tsx">
              Bot Telegram pribadi Anda yang akan menerima pesan yang diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="ac414437-93a0-4ac2-ba16-758d18d1d42e" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="a40e4407-bd20-478f-af0c-e6876d2e6efe" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="046b8d38-9c74-4989-9f0e-f756eb57cde3" data-file-name="components/ForwardingSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="8175916366:AAE4D1L_phr3HyadQ1QgLWJsX_cpkBgsYOo" value={targetBotToken} onChange={e => setTargetBotToken(e.target.value)} data-unique-id="9b27a9c5-7c58-4103-8e93-d09eae52f1fe" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="60139508-68fa-4082-8cb7-411b82e2bd00" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="d7803b40-6786-4205-8119-96981a4706f2" data-file-name="components/ForwardingSetup.tsx">
              Token bot Telegram pribadi Anda (@iky2025bot)
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="e8e1e75a-0ffc-4219-b5a7-2e699573dbcc" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="85ff3216-c475-4b63-a50f-aeb8e298482e" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="3c7698f0-c6c5-4fea-bbd8-79cf7c958a8e" data-file-name="components/ForwardingSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="c5eee82d-cfbc-40f9-8deb-87d70e54822c" data-file-name="components/ForwardingSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="abf9edb0-6622-492f-a67a-29f120376375" data-file-name="components/ForwardingSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="0f053f9f-2107-41f5-8e5f-f3ce83513748" data-file-name="components/ForwardingSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="8e7a67c1-5307-475b-9002-0dc35511896e" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="2dce7e62-24f8-4a99-851b-0df68c3ef29f" data-file-name="components/ForwardingSetup.tsx">
              URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <div className="flex flex-col gap-4" data-unique-id="c0520f04-c76d-447f-a16e-d02cf2d10da7" data-file-name="components/ForwardingSetup.tsx">
            <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="07c662e5-e534-4a8a-bc79-23339ed162b2" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isSettingWebhook ? <>
                  <span className="animate-spin mr-2" data-unique-id="94049899-2109-4106-905a-805831c25b33" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="bd7ae41e-f1a2-4d09-8fc0-47cf964aeb10" data-file-name="components/ForwardingSetup.tsx">⏳</span></span>
                  Mengatur Webhook...
                </> : "Atur Webhook"}
            </Button>

            <Button onClick={toggleForwarding} variant={isForwardingActive ? "destructive" : "default"} className="w-full" data-unique-id="01ee5a4d-e06c-4e4f-b6ec-24d4aae0aed4" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isForwardingActive ? "Nonaktifkan Penerusan" : "Aktifkan Penerusan"}
            </Button>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="76b0e3c8-8beb-4e10-b29c-284f91da7d3b" data-file-name="components/ForwardingSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="17eae509-2323-4d2e-9c03-fd049ed90407" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="3c624b7c-719b-4ec0-ae99-76fd59e54c1f" data-file-name="components/ForwardingSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="c84e62bc-19f7-4d5c-a183-c50d6882da7e" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}