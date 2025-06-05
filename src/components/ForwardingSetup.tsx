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
  return <div className="space-y-6" data-unique-id="c09f4134-11fd-4da1-9b24-ca80e0bb8400" data-file-name="components/ForwardingSetup.tsx">
      <Card data-unique-id="1a163249-2136-4c6c-a7c4-33a319f33535" data-file-name="components/ForwardingSetup.tsx">
        <CardHeader data-unique-id="64d2ada2-b168-4dd1-aa70-d864a71d5288" data-file-name="components/ForwardingSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="85f78697-4f7f-4013-80f1-04a7e7a51713" data-file-name="components/ForwardingSetup.tsx">
            <CardTitle data-unique-id="066bf68c-02bb-4570-881b-04e040671e39" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="83b41f49-7c69-426f-a390-dbed69efaafb" data-file-name="components/ForwardingSetup.tsx">Pengaturan Penerusan Pesan</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="a6989f48-70f8-403f-845f-94d1be289722" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="69804936-9721-4582-9578-1dc9a4c04ca7" data-file-name="components/ForwardingSetup.tsx">
            Konfigurasikan penerusan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="98202ece-07d2-40a1-87f5-c26f1b18edc5" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="65e2a4d1-bdc3-4643-b2aa-884d12f38bd6" data-file-name="components/ForwardingSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="f486c63e-0cf5-4568-90f9-239c878a7a3b" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="3501ca24-bc0c-400c-aa78-62aa4b72ee71" data-file-name="components/ForwardingSetup.tsx">Panduan Penerusan Pesan</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="1b8ae27a-4a31-4dc5-9d05-b82ec10459d0" data-file-name="components/ForwardingSetup.tsx">
                <li data-unique-id="ff1d14b8-7d8f-451e-97d6-4a0e93aee271" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="931ca124-d4a5-4f8a-b080-f813a0e2a699" data-file-name="components/ForwardingSetup.tsx">Pastikan Anda telah membuat bot Telegram menggunakan </span><strong data-unique-id="ff71e020-cdb1-4eb8-87ab-7dd7f6a96ea3" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="56218bf5-5434-4e74-8865-7b22535b85a2" data-file-name="components/ForwardingSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="5a765149-0491-4f22-919e-cc777b5b088c" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="97d34fc6-62c4-4220-abc6-ce6d7b767383" data-file-name="components/ForwardingSetup.tsx">Salin token bot Anda dan masukkan di kolom "Bot Token" di bawah</span></li>
                <li data-unique-id="f4b544bc-8b66-4a89-9495-d54c78b4e431" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="ec63b1f3-ec93-4dc3-a4a8-d305c318a618" data-file-name="components/ForwardingSetup.tsx">Klik "Atur Webhook" untuk menghubungkan bot Anda dengan aplikasi ini</span></li>
                <li data-unique-id="87543de5-3708-44fc-8187-69c85d8c7c6f" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="71128d0e-d4a7-4183-b3dc-3e56c664d6bb" data-file-name="components/ForwardingSetup.tsx">Aktifkan penerusan pesan dengan mengklik tombol "Aktifkan Penerusan"</span></li>
                <li data-unique-id="3880811c-b40c-4686-b8a0-3e919c92f7f1" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="1f4003ca-d29c-4d6d-b56f-e7be0e45336d" data-file-name="components/ForwardingSetup.tsx">Pesan dari Scalev Notification Bot yang mengandung kata kunci "pembayaran" akan diteruskan ke bot Anda</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="d56e2dfe-1b1f-4ba3-95c1-e5eedf680642" data-file-name="components/ForwardingSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="c299f57f-04a8-4e0c-b791-55ee60eb3130" data-file-name="components/ForwardingSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="def9bfdf-98e5-4ca3-86c0-0eb6af6c741f" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="source-bot" data-unique-id="b98725ca-2899-478a-b266-91c45aa60d61" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="c843d6f2-b864-4f7a-8171-5f9ae58818bb" data-file-name="components/ForwardingSetup.tsx">Bot Sumber</span></Label>
            <Input id="source-bot" type="text" value={sourceBot} onChange={e => setSourceBot(e.target.value)} disabled data-unique-id="51486ee8-893f-4dc4-ba40-509539515037" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="8494776a-45aa-4c11-893e-5fee8d1feec3" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="69037138-0897-4ea7-b0f4-786a5228f9ef" data-file-name="components/ForwardingSetup.tsx">
              Bot yang mengirimkan pesan yang ingin diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="24cbd32e-1774-401a-b5a8-9fb3b46ef3b2" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="target-bot" data-unique-id="5e8d0424-88de-4afe-9320-75ad542c8c85" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="d71a4033-9f0f-4114-ac32-ad23fd55de88" data-file-name="components/ForwardingSetup.tsx">Bot Tujuan</span></Label>
            <Input id="target-bot" type="text" value={targetBot} onChange={e => setTargetBot(e.target.value)} disabled data-unique-id="580c840d-128f-4c91-87b7-7f391bb77724" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="8ea3ca44-1496-4559-b737-e1597d87e5de" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="8bcc981d-e7f7-48c0-a4c3-d4af9fa6c924" data-file-name="components/ForwardingSetup.tsx">
              Bot Telegram pribadi Anda yang akan menerima pesan yang diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="ef3b3a69-eef1-4858-9e15-da3dfad24190" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="9cb99062-aa60-43ad-9fcd-ed848fabdc2c" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="09678c07-b2ff-4d22-b786-66d1a99f34a0" data-file-name="components/ForwardingSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="8175916366:AAE4D1L_phr3HyadQ1QgLWJsX_cpkBgsYOo" value={targetBotToken} onChange={e => setTargetBotToken(e.target.value)} data-unique-id="62621e96-f05c-4214-819f-6c426c39734c" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="2f3e8d8a-7af0-47df-813e-fcedb7ac9a50" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="da85c7ac-f63b-4c02-9ef1-9dd6b5598378" data-file-name="components/ForwardingSetup.tsx">
              Token bot Telegram pribadi Anda (@iky2025bot)
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="92c81a03-ea8b-40e8-ba5c-e517204b8f60" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="56ec3ed2-669d-492d-81d4-4228d211bb84" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="a83d1477-d8aa-4021-8704-3cf8aa36df38" data-file-name="components/ForwardingSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="360572e8-027f-49cd-83a1-108fa43cff21" data-file-name="components/ForwardingSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="7edd6ad7-3806-4d6d-855d-8449fa3c8d8b" data-file-name="components/ForwardingSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="a1cb0a86-cbcf-40de-b955-5f7a3f76cdac" data-file-name="components/ForwardingSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="cbac5f95-d1c9-4fb0-8a56-dea5d1a38261" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="1db2dda4-d163-413d-bcb6-ac0b796df7c8" data-file-name="components/ForwardingSetup.tsx">
              URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <div className="flex flex-col gap-4" data-unique-id="4ea66125-e6d1-4872-b387-9d600ba94d7a" data-file-name="components/ForwardingSetup.tsx">
            <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="637510b9-90e8-4e17-a8a5-ffa59a3a49a0" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isSettingWebhook ? <>
                  <span className="animate-spin mr-2" data-unique-id="b95fcc4e-aa6c-4d16-8ca6-bce70e7021d3" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="956f3fb0-b742-426a-9d33-1196c4f5e8e9" data-file-name="components/ForwardingSetup.tsx">⏳</span></span>
                  Mengatur Webhook...
                </> : "Atur Webhook"}
            </Button>

            <Button onClick={toggleForwarding} variant={isForwardingActive ? "destructive" : "default"} className="w-full" data-unique-id="b13c11c6-1ba1-4d9b-a006-24184e95d4b4" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isForwardingActive ? "Nonaktifkan Penerusan" : "Aktifkan Penerusan"}
            </Button>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="f0059681-4526-4e1d-91a3-a28c4b80b697" data-file-name="components/ForwardingSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="14da100e-f43b-46b4-9cb9-12b33a5094b3" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="f1ea2af4-736d-4731-a0a6-13c58345a029" data-file-name="components/ForwardingSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="eb946305-fc50-4b6e-b7fc-cd8f75a899f3" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}