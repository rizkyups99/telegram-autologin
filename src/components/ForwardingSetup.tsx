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
  return <div className="space-y-6" data-unique-id="af77d635-dad0-40f5-a446-982ad472ccf3" data-file-name="components/ForwardingSetup.tsx">
      <Card data-unique-id="6408aa3c-33c2-4458-ad26-81b688b07221" data-file-name="components/ForwardingSetup.tsx">
        <CardHeader data-unique-id="ac4672ad-6b8e-46f3-a5da-8ff5db444421" data-file-name="components/ForwardingSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="4649188a-a9b3-4a6b-85b0-25c5ccde3560" data-file-name="components/ForwardingSetup.tsx">
            <CardTitle data-unique-id="89c6e191-c7ce-4378-9a47-c6330e64c7c2" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="a7e39779-70b5-4aa9-9436-6ce7ba784be0" data-file-name="components/ForwardingSetup.tsx">Pengaturan Penerusan Pesan</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="56eaa089-1eeb-44fe-a7f4-8126c8e51bc3" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="86b64876-f3e6-445b-8cbd-9f23b58c73dd" data-file-name="components/ForwardingSetup.tsx">
            Konfigurasikan penerusan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="acd2b0d8-b965-41ae-a52c-8b088d8aa2d1" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="ab5ba07e-cdff-4bea-9c32-2f71448875bc" data-file-name="components/ForwardingSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="7a5cf5af-c34b-4983-8a5e-d5ab9af56297" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="04e39e30-8b22-4d1a-9f52-04c132e4ed8a" data-file-name="components/ForwardingSetup.tsx">Panduan Penerusan Pesan</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="45046904-f622-4361-95c7-9e940edec031" data-file-name="components/ForwardingSetup.tsx">
                <li data-unique-id="d4777561-aa60-4fc6-8c02-3c6e875854f2" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="40cad893-7732-47a0-9de5-54ff00efdac9" data-file-name="components/ForwardingSetup.tsx">Pastikan Anda telah membuat bot Telegram menggunakan </span><strong data-unique-id="db438871-7682-41a0-8e36-f29801b8a6aa" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="5b45cf75-27ef-432a-8216-563c25f28c7f" data-file-name="components/ForwardingSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="7144483d-05ec-4d74-91a6-58db066f0e7f" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="057117a6-053c-4e35-b81c-f63b9cb02470" data-file-name="components/ForwardingSetup.tsx">Salin token bot Anda dan masukkan di kolom "Bot Token" di bawah</span></li>
                <li data-unique-id="69de0d44-94d7-4929-b41f-0629591210ef" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="68e417f7-c962-4da2-8080-e3ad8fcb6e7a" data-file-name="components/ForwardingSetup.tsx">Klik "Atur Webhook" untuk menghubungkan bot Anda dengan aplikasi ini</span></li>
                <li data-unique-id="26a12eb3-b635-45f4-b8b3-aff281ae5ee3" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="0dd9f165-fe86-4dda-8c0f-0e2fd6d18037" data-file-name="components/ForwardingSetup.tsx">Aktifkan penerusan pesan dengan mengklik tombol "Aktifkan Penerusan"</span></li>
                <li data-unique-id="60af2031-a5c6-4071-86d9-bdd71cfa0f47" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="546b5f7f-c27e-4791-af6f-d82d64e78006" data-file-name="components/ForwardingSetup.tsx">Pesan dari Scalev Notification Bot yang mengandung kata kunci "pembayaran" akan diteruskan ke bot Anda</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="1017c05f-5ed1-4444-a78f-036d5aba6c62" data-file-name="components/ForwardingSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="4783c222-b22a-4d9e-bbbe-e5f2c599eebf" data-file-name="components/ForwardingSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="4d847f27-e62f-4af8-9562-6da6798d23f7" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="source-bot" data-unique-id="f3e44974-17fb-4a11-904d-d477db49a0c4" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="1ebce4be-62c3-4a48-ab7a-c365f06fe0eb" data-file-name="components/ForwardingSetup.tsx">Bot Sumber</span></Label>
            <Input id="source-bot" type="text" value={sourceBot} onChange={e => setSourceBot(e.target.value)} disabled data-unique-id="4d59fdb3-171c-4d34-a9ff-99bbd98abb9c" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="4963540c-f6a9-41d4-ae2d-38e0c1532450" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="1ffa7147-a32c-48de-9b0c-cd49beaeb082" data-file-name="components/ForwardingSetup.tsx">
              Bot yang mengirimkan pesan yang ingin diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="e6d70f88-112a-4ace-8574-7544c9aaa548" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="target-bot" data-unique-id="f5ff5e69-3c30-4228-96a2-a87629ef25c6" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="c8e978e8-ea02-4a2b-9617-563f0d42db4d" data-file-name="components/ForwardingSetup.tsx">Bot Tujuan</span></Label>
            <Input id="target-bot" type="text" value={targetBot} onChange={e => setTargetBot(e.target.value)} disabled data-unique-id="78679ab3-a926-4ba4-a933-4687e48d03f5" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="1fd1ee40-56a9-4c64-ad6f-dc1e84cdba71" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="d56aa128-8c83-478c-a8ff-7fd5287a6c35" data-file-name="components/ForwardingSetup.tsx">
              Bot Telegram pribadi Anda yang akan menerima pesan yang diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="2629d4a7-8bc6-4351-b9a7-39e96d68ace7" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="15719dc6-674d-4533-af7a-59465c247c8e" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="625120b8-1b5b-46b1-aadd-09d87811c380" data-file-name="components/ForwardingSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="8175916366:AAE4D1L_phr3HyadQ1QgLWJsX_cpkBgsYOo" value={targetBotToken} onChange={e => setTargetBotToken(e.target.value)} data-unique-id="b4cb2d32-1d1c-41fc-b1b8-0f6b4f652bd7" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="010d8d4e-9b6a-4cd2-8541-bc125a4c2a5c" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="5463e478-9e1c-421a-a8e3-bdcd5a5428a1" data-file-name="components/ForwardingSetup.tsx">
              Token bot Telegram pribadi Anda (@iky2025bot)
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="1c668c23-89ad-4c58-b332-bbf3356705ac" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="1767f454-d0fe-4df2-b40c-7a4d3825ff7d" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="a8544568-6cd7-4e5b-8158-237988ee9a12" data-file-name="components/ForwardingSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="a20fdb37-d01f-443e-9174-2454ac6ae7b5" data-file-name="components/ForwardingSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="b8473437-b242-4156-8288-0a9f88819167" data-file-name="components/ForwardingSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="ecec7b0f-8c8e-44b9-bb27-e299b632ae59" data-file-name="components/ForwardingSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="ca933b83-c252-4066-94a1-d2f0ae0eb6ac" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="e1bf9929-322b-47b8-877d-b3c675c83655" data-file-name="components/ForwardingSetup.tsx">
              URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <div className="flex flex-col gap-4" data-unique-id="d33f2cee-05fb-46cb-9c19-f878f2a3267d" data-file-name="components/ForwardingSetup.tsx">
            <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="eb12dea9-e49f-4af0-92c7-c4f70bd5c46c" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isSettingWebhook ? <>
                  <span className="animate-spin mr-2" data-unique-id="1f85b136-0993-4a8d-8c95-6eb87eaf1e6b" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="03d118ee-959b-46c1-a193-eae1f934e173" data-file-name="components/ForwardingSetup.tsx">⏳</span></span>
                  Mengatur Webhook...
                </> : "Atur Webhook"}
            </Button>

            <Button onClick={toggleForwarding} variant={isForwardingActive ? "destructive" : "default"} className="w-full" data-unique-id="ce935f96-0e6c-476c-9588-d60a48f79951" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isForwardingActive ? "Nonaktifkan Penerusan" : "Aktifkan Penerusan"}
            </Button>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="416ab44a-3e30-404e-b003-31c36e948416" data-file-name="components/ForwardingSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="ff3a7002-8937-4aec-aa4d-9aaa4f489ce7" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="00098cea-7ada-48f4-ae34-f979d0810a10" data-file-name="components/ForwardingSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="769d02fd-5e89-4377-8fa0-b390fca45565" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}