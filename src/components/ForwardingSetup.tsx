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
  return <div className="space-y-6" data-unique-id="d88d9682-bc5d-44ed-9b2e-ef9080b619ca" data-file-name="components/ForwardingSetup.tsx">
      <Card data-unique-id="e056e641-0c99-45e1-b90e-448c290652ad" data-file-name="components/ForwardingSetup.tsx">
        <CardHeader data-unique-id="e151122d-89a2-4d7e-9c94-26c6a464c0d8" data-file-name="components/ForwardingSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="5d4fc3f2-9bc4-442b-883f-4cea91d67c5d" data-file-name="components/ForwardingSetup.tsx">
            <CardTitle data-unique-id="3372d65a-7e3b-42c4-aa68-84108c9ce416" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="4d7ab677-cfdb-43f7-8aae-7e76a6c90476" data-file-name="components/ForwardingSetup.tsx">Pengaturan Penerusan Pesan</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="9f332340-1d6e-47a5-9806-db63a0d67271" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="a4b6a02c-1d99-4b87-a457-63c4d379dd50" data-file-name="components/ForwardingSetup.tsx">
            Konfigurasikan penerusan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="d37891d0-d191-4520-a669-54de1eba9786" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="938976ee-729c-41c4-a01b-297bd93fda20" data-file-name="components/ForwardingSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="3331132f-4799-48f7-928a-1f4bfadf669d" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="fb698f37-d3f1-415d-a4fb-adcb630ecab4" data-file-name="components/ForwardingSetup.tsx">Panduan Penerusan Pesan</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="2d8c7f5c-7522-4a85-b2de-996c21443921" data-file-name="components/ForwardingSetup.tsx">
                <li data-unique-id="3bcaea5d-c45e-4d1f-a5c9-82ebbb4654cf" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="a2cbdcd1-7502-44e4-8f88-46a6c9cabe93" data-file-name="components/ForwardingSetup.tsx">Pastikan Anda telah membuat bot Telegram menggunakan </span><strong data-unique-id="7a1e2741-b2d1-4160-850d-cab8c1eaa3cc" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="7fa7ef55-7bff-4604-b2a2-d07716113d96" data-file-name="components/ForwardingSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="de5dcbb7-afb8-4531-acfd-c168fbbe6d77" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="9e776478-1b5b-40a8-a9be-3fa1eca29a02" data-file-name="components/ForwardingSetup.tsx">Salin token bot Anda dan masukkan di kolom "Bot Token" di bawah</span></li>
                <li data-unique-id="97638b9a-36e2-4bc7-98d4-2a6d999c4329" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="d171d820-acb3-4c10-b510-1aca06e4b31f" data-file-name="components/ForwardingSetup.tsx">Klik "Atur Webhook" untuk menghubungkan bot Anda dengan aplikasi ini</span></li>
                <li data-unique-id="01b78d2b-4663-469a-b14b-9a0fbb269d74" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="70f32797-d9d4-42b9-a639-9762647f16de" data-file-name="components/ForwardingSetup.tsx">Aktifkan penerusan pesan dengan mengklik tombol "Aktifkan Penerusan"</span></li>
                <li data-unique-id="a61814f9-56c3-4321-b952-79a961aa4f8d" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="4bfe47ad-3e98-42b6-8184-4dd1c74c4588" data-file-name="components/ForwardingSetup.tsx">Pesan dari Scalev Notification Bot yang mengandung kata kunci "pembayaran" akan diteruskan ke bot Anda</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="d2a76a6b-0c1e-4d58-a08b-bea9a5002900" data-file-name="components/ForwardingSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="c91df8c4-9e81-42bd-8dce-7753329beb1b" data-file-name="components/ForwardingSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="85abb2ec-a250-4971-95fa-74b048647b67" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="source-bot" data-unique-id="b967ccc8-9869-469d-b16e-2893bbbb4a69" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="7792cb5f-1d30-4df2-9996-89e138f931a5" data-file-name="components/ForwardingSetup.tsx">Bot Sumber</span></Label>
            <Input id="source-bot" type="text" value={sourceBot} onChange={e => setSourceBot(e.target.value)} disabled data-unique-id="55b914e7-dd30-480e-9677-3352865b3291" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="2e09ddb7-f0e5-4408-8696-7c39ccd1fd73" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="b35d5fea-bed4-4ccd-b01e-86cd8fa00616" data-file-name="components/ForwardingSetup.tsx">
              Bot yang mengirimkan pesan yang ingin diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="cae121e3-0c5c-43af-abbf-038b4810c4e2" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="target-bot" data-unique-id="838955a8-6474-4c79-9de1-375f9faa771e" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="bfe02da7-54e8-43b7-bbb4-9a880aa10568" data-file-name="components/ForwardingSetup.tsx">Bot Tujuan</span></Label>
            <Input id="target-bot" type="text" value={targetBot} onChange={e => setTargetBot(e.target.value)} disabled data-unique-id="1e6a93ab-aa2e-42ce-ade6-6ddc48b5c541" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="33dd34d5-262f-4148-9cd7-4eb811808957" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="cda5ff97-4466-4c55-a06b-492489bbcb22" data-file-name="components/ForwardingSetup.tsx">
              Bot Telegram pribadi Anda yang akan menerima pesan yang diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="4fc2270d-1323-4598-95e7-17e239c0e118" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="13a14c75-720e-443c-8da9-296f7f636a15" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="026c6aab-5d2a-4bc8-b130-bacb048c02b3" data-file-name="components/ForwardingSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="8175916366:AAE4D1L_phr3HyadQ1QgLWJsX_cpkBgsYOo" value={targetBotToken} onChange={e => setTargetBotToken(e.target.value)} data-unique-id="cbb643c9-b5b8-4193-80af-8ef95c465476" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="89d0cf54-3b42-4072-b0b5-0c339bdf6e44" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="b6e59ec4-930b-4919-be56-fa1f6bc7a872" data-file-name="components/ForwardingSetup.tsx">
              Token bot Telegram pribadi Anda (@iky2025bot)
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="cbdb42a8-9ef6-417f-a4f9-b4c49e532dbe" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="530b04b0-dacb-468c-bfe6-6dd90cf59aef" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="b05bf643-086d-43f6-a1d0-793674c8addf" data-file-name="components/ForwardingSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="91caf076-d8d4-42b7-b375-e471c680a825" data-file-name="components/ForwardingSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="849656bd-ecc2-49ac-8575-c518c1fa128d" data-file-name="components/ForwardingSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="d8d45c10-e530-4f9a-9f52-8e975b9f5e10" data-file-name="components/ForwardingSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="b91b6e82-0004-4d9c-b9f0-4490acca3ba1" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="8d978f19-b960-4247-97ee-34ad2cec9d50" data-file-name="components/ForwardingSetup.tsx">
              URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <div className="flex flex-col gap-4" data-unique-id="22303157-3634-4f49-a5ef-efb75c19d8f9" data-file-name="components/ForwardingSetup.tsx">
            <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="3d733d1a-9e64-4733-9927-fc7d0dcd52ce" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isSettingWebhook ? <>
                  <span className="animate-spin mr-2" data-unique-id="d4b08332-ace6-4461-8e78-f461abf4c6c1" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="25c88513-be97-45a2-84f3-39df81b6a1c3" data-file-name="components/ForwardingSetup.tsx">⏳</span></span>
                  Mengatur Webhook...
                </> : "Atur Webhook"}
            </Button>

            <Button onClick={toggleForwarding} variant={isForwardingActive ? "destructive" : "default"} className="w-full" data-unique-id="69d2eb46-deba-4b91-9487-66ac5c286101" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isForwardingActive ? "Nonaktifkan Penerusan" : "Aktifkan Penerusan"}
            </Button>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="51853421-6fbf-4e4c-886d-238efd60ff14" data-file-name="components/ForwardingSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="3f94040d-a97e-4611-a196-77b0a86ad1bd" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="48c274b7-3716-45bc-aaff-263a2c63ed5c" data-file-name="components/ForwardingSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="acda8a5d-2bd6-4f6b-9041-645dd64c72a0" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}