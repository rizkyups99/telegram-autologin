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
  return <div className="space-y-6" data-unique-id="e0d55468-da8e-421c-82f0-837646a9d180" data-file-name="components/ForwardingSetup.tsx">
      <Card data-unique-id="32272c32-a553-4e51-9a9e-2dbc0ad02770" data-file-name="components/ForwardingSetup.tsx">
        <CardHeader data-unique-id="ea8c6323-af56-4a93-a5eb-8887b67ece88" data-file-name="components/ForwardingSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="90e1a608-8c4a-4797-b665-2ef011712f7b" data-file-name="components/ForwardingSetup.tsx">
            <CardTitle data-unique-id="47a2637a-d8a3-4794-ba1e-9445e247b029" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="583b2452-c05d-4d64-8b89-0ea6e31cda87" data-file-name="components/ForwardingSetup.tsx">Pengaturan Penerusan Pesan</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="68c53b18-5b32-4474-951b-6504e1ab0b22" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="7903bc66-6737-4fc6-a2cb-b9b1b8bc3d68" data-file-name="components/ForwardingSetup.tsx">
            Konfigurasikan penerusan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="c999eeb0-847e-4f36-82a4-6c54da724e4c" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="33e14f91-a5c4-4d17-8779-fc23ce03c411" data-file-name="components/ForwardingSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="d28588b8-3f39-4864-bd2e-6687f8a49493" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="def4ce78-34e0-4d17-ae61-4a0209d5bbdd" data-file-name="components/ForwardingSetup.tsx">Panduan Penerusan Pesan</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="3a70c2a1-b91d-4cbd-a686-c7807f157730" data-file-name="components/ForwardingSetup.tsx">
                <li data-unique-id="848771ab-dbbc-4bd8-8bcb-755dbb9ca280" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="f5627e38-f27b-4a41-adf6-ec4c9aeb65d2" data-file-name="components/ForwardingSetup.tsx">Pastikan Anda telah membuat bot Telegram menggunakan </span><strong data-unique-id="772d637b-ae19-4288-8fee-dd61950c0cd8" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="49464ab0-bc2b-4edd-b9a6-7ad78a13011f" data-file-name="components/ForwardingSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="e6790edb-646e-4dd4-8cca-166f6e010657" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="2bd113d3-1f19-4268-93e7-6c3ede36bf4d" data-file-name="components/ForwardingSetup.tsx">Salin token bot Anda dan masukkan di kolom "Bot Token" di bawah</span></li>
                <li data-unique-id="ae126232-4c8f-4b89-a547-3edfb596eec5" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="95196b68-34a8-46bd-88bd-6afcd3276d97" data-file-name="components/ForwardingSetup.tsx">Klik "Atur Webhook" untuk menghubungkan bot Anda dengan aplikasi ini</span></li>
                <li data-unique-id="561d4283-f370-4df4-90e2-46c6f29d302e" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="3d74aec4-0929-4526-93e9-3f705c69ecba" data-file-name="components/ForwardingSetup.tsx">Aktifkan penerusan pesan dengan mengklik tombol "Aktifkan Penerusan"</span></li>
                <li data-unique-id="88cd66ae-f8dd-4cef-8c8f-13edce3d1e4c" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="b65a385f-6b7c-4ff1-9cfc-15068e5ef107" data-file-name="components/ForwardingSetup.tsx">Pesan dari Scalev Notification Bot yang mengandung kata kunci "pembayaran" akan diteruskan ke bot Anda</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="605a5c1f-b2fb-48be-ade3-b775f2466b04" data-file-name="components/ForwardingSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="9a80b6b3-d015-4fa8-b552-1f47fa5dfcf3" data-file-name="components/ForwardingSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="15ffebfc-499b-4b01-bf00-8363c6cedb87" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="source-bot" data-unique-id="4b6a48c6-187f-4a91-9c55-4833b7f008a0" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="5ae40131-8095-4740-a33d-ca0477813bc7" data-file-name="components/ForwardingSetup.tsx">Bot Sumber</span></Label>
            <Input id="source-bot" type="text" value={sourceBot} onChange={e => setSourceBot(e.target.value)} disabled data-unique-id="2b9bddb0-bc9e-4807-a5ff-4907066ebb97" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="c0c13666-8f87-4c01-8d0a-047e1aa11676" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="4dc56f25-3ec2-4d3b-8d3a-d5f2846ee8ff" data-file-name="components/ForwardingSetup.tsx">
              Bot yang mengirimkan pesan yang ingin diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="784c4ca2-b534-4e87-9067-517738868806" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="target-bot" data-unique-id="93d31856-605f-42fc-a880-30647a9418b6" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="a5dcf3cc-ba19-4ba6-9d26-33a25890b03d" data-file-name="components/ForwardingSetup.tsx">Bot Tujuan</span></Label>
            <Input id="target-bot" type="text" value={targetBot} onChange={e => setTargetBot(e.target.value)} disabled data-unique-id="9ae1adbe-44f9-40b5-8484-2c58c2e6eaa9" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="b7e4bd5b-df5f-4804-9913-0e429228a99c" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="8c05ac79-64b2-4289-b43d-6c45ff0096ea" data-file-name="components/ForwardingSetup.tsx">
              Bot Telegram pribadi Anda yang akan menerima pesan yang diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="973e8204-eeb1-4ccc-9136-64dfc614f9ad" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="1a348b1f-ea5a-4799-8cba-732c0b2fb182" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="b774aa67-bdeb-4577-8add-d24e7212424d" data-file-name="components/ForwardingSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="8175916366:AAE4D1L_phr3HyadQ1QgLWJsX_cpkBgsYOo" value={targetBotToken} onChange={e => setTargetBotToken(e.target.value)} data-unique-id="ee7913e9-aa5e-4e06-b749-5d6ac8c1f6be" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="532d2114-a26d-4ac3-a0c8-8f27fba6c1e7" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="67d75d14-b2ae-4136-b890-4a4f08e1bae9" data-file-name="components/ForwardingSetup.tsx">
              Token bot Telegram pribadi Anda (@iky2025bot)
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="885c7a5e-b115-4b28-997a-35a7ade2136a" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="18ccba7d-a7e4-406c-908a-be394e917741" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="1d01ced7-ca5f-4c42-86bb-eaf6006f1714" data-file-name="components/ForwardingSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="c740e1c8-83c6-4a4f-81ed-0b9b4e97bd16" data-file-name="components/ForwardingSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="88881b9b-14b5-4277-867c-69f38ab97bd8" data-file-name="components/ForwardingSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="66c6231c-f9f3-40d1-b144-335c5c17bc88" data-file-name="components/ForwardingSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="fa19ba7c-b60e-4486-855c-c8a6c4cc2fd5" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="81249726-b5d8-49a6-aece-65e79e84f081" data-file-name="components/ForwardingSetup.tsx">
              URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <div className="flex flex-col gap-4" data-unique-id="cad0fb70-2893-446b-8438-e538bac0d6a3" data-file-name="components/ForwardingSetup.tsx">
            <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="1fee7d28-11fa-4a6d-9310-2782c9de1fb1" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isSettingWebhook ? <>
                  <span className="animate-spin mr-2" data-unique-id="059383dc-e7cc-41d9-8d23-9e957d70e086" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="365d70f5-965e-42ed-8a7f-3cd5ebdd0f72" data-file-name="components/ForwardingSetup.tsx">⏳</span></span>
                  Mengatur Webhook...
                </> : "Atur Webhook"}
            </Button>

            <Button onClick={toggleForwarding} variant={isForwardingActive ? "destructive" : "default"} className="w-full" data-unique-id="f93e04ba-2549-4017-88c8-3611e8829085" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isForwardingActive ? "Nonaktifkan Penerusan" : "Aktifkan Penerusan"}
            </Button>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="466b1649-a163-4b45-aca2-fce361044244" data-file-name="components/ForwardingSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="5fdd82f3-8340-4f3d-8628-2fa5d74c893e" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="6d3d8d15-6184-4002-b35f-a6e2124edc86" data-file-name="components/ForwardingSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="7a3a3407-65f9-45b1-9206-b2dfac33776e" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}