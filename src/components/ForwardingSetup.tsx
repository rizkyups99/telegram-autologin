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
  return <div className="space-y-6" data-unique-id="00d4827c-0006-41e2-9127-10aa8dbd8ddf" data-file-name="components/ForwardingSetup.tsx">
      <Card data-unique-id="62f1af34-5b73-40e0-975b-70ec6df796f6" data-file-name="components/ForwardingSetup.tsx">
        <CardHeader data-unique-id="84edfe3a-78aa-481d-b228-6b9d423c09b7" data-file-name="components/ForwardingSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="942ed0c7-f4b9-4dbe-b132-4f623e1fe83b" data-file-name="components/ForwardingSetup.tsx">
            <CardTitle data-unique-id="7d98b9fe-2269-4fe9-8668-e83f550a27f0" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="86f4ba58-91c1-44b9-bf40-4c15995656fd" data-file-name="components/ForwardingSetup.tsx">Pengaturan Penerusan Pesan</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="a2d60ec9-0fe2-4e7f-a0e4-4cb0352d8e57" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="187357bd-5631-4e4a-9f78-c0ced13dcb6f" data-file-name="components/ForwardingSetup.tsx">
            Konfigurasikan penerusan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="0c5a7cc6-6165-432b-803a-3b82e1a1c1cc" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="b8ba6782-290b-4711-9563-892676aba1a5" data-file-name="components/ForwardingSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="f42502e9-51f1-4567-8a80-eed0690bf0bb" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="c1ab3ad4-f1e6-4b9a-a633-00836224ac37" data-file-name="components/ForwardingSetup.tsx">Panduan Penerusan Pesan</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="e4e60500-8ae0-4995-9f1c-9ce5ee509e97" data-file-name="components/ForwardingSetup.tsx">
                <li data-unique-id="a51ca8d5-663e-4a1f-aa55-4a0759ee201b" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="22526786-657c-44f6-9212-8f2319d53d28" data-file-name="components/ForwardingSetup.tsx">Pastikan Anda telah membuat bot Telegram menggunakan </span><strong data-unique-id="b3d4b218-2fa5-41e9-a320-a574c3911891" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="c2de8c8b-e65c-4b94-999f-0306b542be06" data-file-name="components/ForwardingSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="41ffca09-43b9-4c07-8445-7f71fc035afb" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="f3efc2c3-77e8-4856-8de9-1e3a87e00670" data-file-name="components/ForwardingSetup.tsx">Salin token bot Anda dan masukkan di kolom "Bot Token" di bawah</span></li>
                <li data-unique-id="23c4fdd4-b977-4c11-960a-3831a8fd4e61" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="348c4c67-abe9-40a6-a1f2-e4ad955c7df2" data-file-name="components/ForwardingSetup.tsx">Klik "Atur Webhook" untuk menghubungkan bot Anda dengan aplikasi ini</span></li>
                <li data-unique-id="6c535d53-e9a7-44b0-a6ab-980c52acfa79" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="dcc34018-297c-45a9-8cc0-c1597ccc528f" data-file-name="components/ForwardingSetup.tsx">Aktifkan penerusan pesan dengan mengklik tombol "Aktifkan Penerusan"</span></li>
                <li data-unique-id="a27744a1-47a4-4608-91c7-817f7a351978" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="d6edff51-932b-4f60-9d15-580725524ad8" data-file-name="components/ForwardingSetup.tsx">Pesan dari Scalev Notification Bot yang mengandung kata kunci "pembayaran" akan diteruskan ke bot Anda</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="515724a6-df44-4751-a20a-69d82fd54d94" data-file-name="components/ForwardingSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="f88a1b01-d029-4d5d-9c7d-f0607e6b3b7c" data-file-name="components/ForwardingSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="074f3175-f7e4-4b2d-95d8-cd01138a3e79" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="source-bot" data-unique-id="77228e42-3da0-4473-ac91-2bf601614805" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="966d6037-a105-42f2-876a-f84c1a2aa8ee" data-file-name="components/ForwardingSetup.tsx">Bot Sumber</span></Label>
            <Input id="source-bot" type="text" value={sourceBot} onChange={e => setSourceBot(e.target.value)} disabled data-unique-id="a9254d39-1231-438f-a845-0d552c78842d" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="23bd8cb0-e043-41c8-ad55-e8f9bf61dadd" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="20036de0-454f-40bb-93f5-2ea293127e25" data-file-name="components/ForwardingSetup.tsx">
              Bot yang mengirimkan pesan yang ingin diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="781aab4a-3b4e-4338-b077-b775ec88914b" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="target-bot" data-unique-id="eb531370-4110-4767-8b3e-5214496de027" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="8a590dd2-fc64-49ee-a877-66f27d5dde6a" data-file-name="components/ForwardingSetup.tsx">Bot Tujuan</span></Label>
            <Input id="target-bot" type="text" value={targetBot} onChange={e => setTargetBot(e.target.value)} disabled data-unique-id="fd668e37-31dc-4f1a-984d-2125cef198cd" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="d1521e87-2933-43f2-b4d1-893ccb00a394" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="11659d18-1e6f-411f-9f71-90f63697e0ae" data-file-name="components/ForwardingSetup.tsx">
              Bot Telegram pribadi Anda yang akan menerima pesan yang diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="35fc716d-8966-49be-b8c2-d330a6d6ed09" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="883989da-5e6b-460e-9cc0-58048b41a829" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="d7364105-b265-4baf-839f-6c16a2fed831" data-file-name="components/ForwardingSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="8175916366:AAE4D1L_phr3HyadQ1QgLWJsX_cpkBgsYOo" value={targetBotToken} onChange={e => setTargetBotToken(e.target.value)} data-unique-id="907b0a83-7b36-4b81-8bd7-e68a60bd5e85" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="1c760a9e-a5c3-4e8a-850b-a05ddb5b2143" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="64f485c1-6168-49c3-a347-c5340d67c704" data-file-name="components/ForwardingSetup.tsx">
              Token bot Telegram pribadi Anda (@iky2025bot)
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="e3c60358-fd64-484e-8c34-c8c5b28750a5" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="9aa69115-4555-4c2b-838b-5a27404ac557" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="276e2161-f63c-4c94-be66-d9904ba3a8c8" data-file-name="components/ForwardingSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="2ff97233-ebc2-45aa-a49e-21e0063ffc03" data-file-name="components/ForwardingSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="79b94983-66fd-4eac-bd9d-b30ea50c8af7" data-file-name="components/ForwardingSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="cd17b162-d34a-4b48-affa-c3651a71e08f" data-file-name="components/ForwardingSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="a4085ced-2bf9-44ac-aa3e-d5477ccf2d6a" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="9e81ae10-1424-4b49-95d6-acc1efc05368" data-file-name="components/ForwardingSetup.tsx">
              URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <div className="flex flex-col gap-4" data-unique-id="0569674a-cbe8-4926-9b54-f767b9530148" data-file-name="components/ForwardingSetup.tsx">
            <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="c1dea1f0-317a-4eec-a647-6c26e3733d79" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isSettingWebhook ? <>
                  <span className="animate-spin mr-2" data-unique-id="68108c50-5950-47a3-b54e-5a9d48f7de82" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="01a10c43-31c8-46a4-9e1a-f4690dcdf2c1" data-file-name="components/ForwardingSetup.tsx">⏳</span></span>
                  Mengatur Webhook...
                </> : "Atur Webhook"}
            </Button>

            <Button onClick={toggleForwarding} variant={isForwardingActive ? "destructive" : "default"} className="w-full" data-unique-id="c3b747bc-84b1-4644-8ed0-62fbb1ce46cc" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isForwardingActive ? "Nonaktifkan Penerusan" : "Aktifkan Penerusan"}
            </Button>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="6b172821-5900-4ea3-b222-4ad20c359a90" data-file-name="components/ForwardingSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="6c964cb0-608b-4963-9439-90ec2b010fc3" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="7565f511-fb56-4b83-97c2-facad23003df" data-file-name="components/ForwardingSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="29230b3b-4acc-4433-9ff1-7a9c9127b55b" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}