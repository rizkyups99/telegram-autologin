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
  return <div className="space-y-6" data-unique-id="6fd5268f-ca14-49b8-ba7d-bcd98af5f354" data-file-name="components/ForwardingSetup.tsx">
      <Card data-unique-id="e09cd391-ae73-47d7-a015-5f9a9961c94c" data-file-name="components/ForwardingSetup.tsx">
        <CardHeader data-unique-id="d49b20f0-8fe9-44a8-8020-3a2d16d3f26e" data-file-name="components/ForwardingSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="9249c2f7-2619-478e-8886-62e756272a84" data-file-name="components/ForwardingSetup.tsx">
            <CardTitle data-unique-id="b2dcd9b7-c5e2-47bf-b56e-6a2f44856fa0" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="1f216b89-742a-4e30-96fb-b7a3407c7695" data-file-name="components/ForwardingSetup.tsx">Pengaturan Penerusan Pesan</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="92a877aa-8234-4e45-b49d-fd051f5fe474" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="5ff80fec-11e0-4ad3-b490-582b5dfbd633" data-file-name="components/ForwardingSetup.tsx">
            Konfigurasikan penerusan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="628eac94-65ed-472e-9ab2-dbd7d0550a9c" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="7f56656b-c105-4716-9b00-d63d158c3d38" data-file-name="components/ForwardingSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="0eaaf8de-459e-448d-8780-a141d09303b7" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="d41a383f-6cc2-4ae2-82ce-27c5c102f347" data-file-name="components/ForwardingSetup.tsx">Panduan Penerusan Pesan</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="5a8264d0-b0d6-4942-af7e-10264c794759" data-file-name="components/ForwardingSetup.tsx">
                <li data-unique-id="78f75baf-1b29-4e64-bc25-4facecf4b645" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="2181b798-0bdf-460d-9bdb-666a64dd4e50" data-file-name="components/ForwardingSetup.tsx">Pastikan Anda telah membuat bot Telegram menggunakan </span><strong data-unique-id="b9c66b65-4db7-4df1-a8bb-5b9c36213ecc" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="52fd43e2-bf05-450f-a111-39a347b2f9db" data-file-name="components/ForwardingSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="49cbd5ff-f895-45f4-a9e3-9da1b6e821dc" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="16de2b92-6118-4d3b-be41-597daefeceac" data-file-name="components/ForwardingSetup.tsx">Salin token bot Anda dan masukkan di kolom "Bot Token" di bawah</span></li>
                <li data-unique-id="022a37f2-f153-4f36-a957-8145ad848fac" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="d78537fb-9a99-4e80-b523-410c12b59ec7" data-file-name="components/ForwardingSetup.tsx">Klik "Atur Webhook" untuk menghubungkan bot Anda dengan aplikasi ini</span></li>
                <li data-unique-id="b27c625d-1718-4cc8-ba12-0e94138c1606" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="703838d2-fc48-4b2e-920c-01e19bec2f8b" data-file-name="components/ForwardingSetup.tsx">Aktifkan penerusan pesan dengan mengklik tombol "Aktifkan Penerusan"</span></li>
                <li data-unique-id="bc2d5b22-606b-4b10-9581-92eb52708e35" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="28aa04b8-693f-46a6-ba4c-0e106eb069a6" data-file-name="components/ForwardingSetup.tsx">Pesan dari Scalev Notification Bot yang mengandung kata kunci "pembayaran" akan diteruskan ke bot Anda</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="163c0c61-1f82-425a-9ec2-7178153da5d7" data-file-name="components/ForwardingSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="c06dc7f6-82df-4afc-b816-52502281f9ce" data-file-name="components/ForwardingSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="805f4748-03c2-4a8f-b3eb-a598d4d0f6af" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="source-bot" data-unique-id="169d63d9-d6a3-436d-8e0e-885ae2082b7e" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="f390510f-0a96-4540-b52b-f9d19cb903be" data-file-name="components/ForwardingSetup.tsx">Bot Sumber</span></Label>
            <Input id="source-bot" type="text" value={sourceBot} onChange={e => setSourceBot(e.target.value)} disabled data-unique-id="04ad5b51-3e8b-464a-8f73-cf17aa8fad14" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="b8464ec6-b987-4d12-a13c-11f1990e67fe" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="f918e915-9260-4ada-bcfb-df6e43f77099" data-file-name="components/ForwardingSetup.tsx">
              Bot yang mengirimkan pesan yang ingin diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="f2f187cf-aa1b-48de-b472-d469fd395c10" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="target-bot" data-unique-id="54c4bb64-b6ad-45d6-b561-3f6c05f18350" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="56a13052-891b-43fe-a55e-ebaf3cd37788" data-file-name="components/ForwardingSetup.tsx">Bot Tujuan</span></Label>
            <Input id="target-bot" type="text" value={targetBot} onChange={e => setTargetBot(e.target.value)} disabled data-unique-id="54fced0d-1f3f-44e0-a487-cb3c30e027ef" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="4670136c-7639-4b04-bdf9-d56cbb96ce74" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="92aa0342-6a67-45ce-a5fc-41fa01e64e72" data-file-name="components/ForwardingSetup.tsx">
              Bot Telegram pribadi Anda yang akan menerima pesan yang diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="f51b9e94-debf-4c3f-a5dc-a15d159810b0" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="555ea49d-718c-4da7-bfb0-5b3743e0376e" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="274f8f69-ca3a-4b8b-9ff8-4014f1a0999f" data-file-name="components/ForwardingSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="8175916366:AAE4D1L_phr3HyadQ1QgLWJsX_cpkBgsYOo" value={targetBotToken} onChange={e => setTargetBotToken(e.target.value)} data-unique-id="09bc6a59-9faf-498a-951e-3c8252f10d47" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="a2777dec-a40a-42f2-a93d-185b2265692b" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="6f4f8edf-bf76-48b3-a130-7c057ba176b1" data-file-name="components/ForwardingSetup.tsx">
              Token bot Telegram pribadi Anda (@iky2025bot)
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="914d8eeb-b864-4e88-a630-4c3e4f636b37" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="bcec0b33-fd90-4ac6-b072-48486edb143d" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="0f23d67f-25f0-4e2c-82a7-ad7aff2996bb" data-file-name="components/ForwardingSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="7950eb58-98eb-4f81-9065-f56ffc77a8ac" data-file-name="components/ForwardingSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="e926e14e-bb7f-4716-9b74-a34702ae1a69" data-file-name="components/ForwardingSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="0102d504-10f0-477d-9a23-ce383f3b412e" data-file-name="components/ForwardingSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="3c41ca81-d0ae-4b18-92a2-8e9431a93eab" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="f4c26a83-f603-4127-b875-9ee6d869f121" data-file-name="components/ForwardingSetup.tsx">
              URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <div className="flex flex-col gap-4" data-unique-id="acff6878-d2fb-4033-80b9-c14ea53607d7" data-file-name="components/ForwardingSetup.tsx">
            <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="67fb955b-e193-4356-9903-271e33ed7ae0" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isSettingWebhook ? <>
                  <span className="animate-spin mr-2" data-unique-id="67cc42a3-91d1-4d62-9465-be160b4f600a" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="ec28f855-56ea-4d6f-b19a-00f8183ca744" data-file-name="components/ForwardingSetup.tsx">⏳</span></span>
                  Mengatur Webhook...
                </> : "Atur Webhook"}
            </Button>

            <Button onClick={toggleForwarding} variant={isForwardingActive ? "destructive" : "default"} className="w-full" data-unique-id="042d5bde-bcf8-4ca9-b70c-5584b56c9a3b" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isForwardingActive ? "Nonaktifkan Penerusan" : "Aktifkan Penerusan"}
            </Button>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="b7eaae0d-6615-43f5-9ee8-5f64dc4f26f7" data-file-name="components/ForwardingSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="00ce6e19-f2b3-4084-a4d2-cc5aeab99fea" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="13045505-394b-4782-a9f5-4ba8f73c8b2b" data-file-name="components/ForwardingSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="760852d9-a903-4a2e-9e33-ef7f1f22257c" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}