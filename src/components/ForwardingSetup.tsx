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
  return <div className="space-y-6" data-unique-id="bb04da8e-0a70-46a7-a77a-49bd62682c05" data-file-name="components/ForwardingSetup.tsx">
      <Card data-unique-id="f2bd4c2a-5791-416d-b557-c4ae6682d88f" data-file-name="components/ForwardingSetup.tsx">
        <CardHeader data-unique-id="45ddc197-b1d5-45f9-bdb1-bc9b4a8a9d81" data-file-name="components/ForwardingSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="07a41e81-88f2-4c58-a527-3c0330f195fe" data-file-name="components/ForwardingSetup.tsx">
            <CardTitle data-unique-id="0d4ebac8-2d82-4d87-9a0a-64cae2ad8ac9" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="5baa73ef-dd65-40cf-8f88-ffcfc711cbef" data-file-name="components/ForwardingSetup.tsx">Pengaturan Penerusan Pesan</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="393a627d-2f80-42d2-9112-0d5643e5c6ed" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="d85fd134-db50-4128-97bd-b0686c188b7f" data-file-name="components/ForwardingSetup.tsx">
            Konfigurasikan penerusan pesan dari @scalevid_bot ke bot Telegram pribadi Anda
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="863093f8-7f7c-4fd9-822f-d3189acb6f0c" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="e7eac83a-751c-49a2-8725-e2068a4fbfae" data-file-name="components/ForwardingSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="53087a59-8d6a-4e17-8270-90f4f33569b9" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="233915aa-345e-4fe0-8eeb-c70b589607e7" data-file-name="components/ForwardingSetup.tsx">Panduan Penerusan Pesan</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="7b37fedf-9cf3-4107-bcf0-6affcd524f27" data-file-name="components/ForwardingSetup.tsx">
                <li data-unique-id="94577005-a24e-4069-9b27-6785a1ceb258" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="471546d6-f0a8-4e60-9570-95c2cd385129" data-file-name="components/ForwardingSetup.tsx">Pastikan Anda telah membuat bot Telegram menggunakan </span><strong data-unique-id="6fc8cbab-7189-4a23-bafb-648bc9eb1cbb" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="a64fa862-6d8b-4be7-a6b6-41cff740e744" data-file-name="components/ForwardingSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="68cc8f3d-072a-423c-9e2a-be44305991eb" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="542e44b4-9207-4b1f-8e73-d18ec407ad05" data-file-name="components/ForwardingSetup.tsx">Salin token bot Anda dan masukkan di kolom "Bot Token" di bawah</span></li>
                <li data-unique-id="1eb0576f-a883-41f9-b3ab-c074a0ea16c8" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="977a852f-70ac-42cd-9e90-4f18ab82a066" data-file-name="components/ForwardingSetup.tsx">Klik "Atur Webhook" untuk menghubungkan bot Anda dengan aplikasi ini</span></li>
                <li data-unique-id="5dea84ef-4e09-4194-bba3-94518cfc4bab" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="63bb697c-5a81-41e6-8cf0-b39f10a1ab6c" data-file-name="components/ForwardingSetup.tsx">Aktifkan penerusan pesan dengan mengklik tombol "Aktifkan Penerusan"</span></li>
                <li data-unique-id="3d991b15-2138-4921-b63c-614cbddd41d7" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="98ac2bb2-7c2b-4b41-abe9-771e2ce48245" data-file-name="components/ForwardingSetup.tsx">Pesan dari Scalev Notification Bot yang mengandung kata kunci "pembayaran" akan diteruskan ke bot Anda</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="40b87e81-150d-4a46-b67a-f8eb9e86a540" data-file-name="components/ForwardingSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="f5f33554-2141-468d-bd24-7a437b6bf5cc" data-file-name="components/ForwardingSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="968ef240-4d1b-4165-8111-e0c92d3db59f" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="source-bot" data-unique-id="4a659ed7-de31-453f-9a97-e64cf4c1d1c9" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="6815f02f-c20a-458a-a5d2-e07f8bb46fe9" data-file-name="components/ForwardingSetup.tsx">Bot Sumber</span></Label>
            <Input id="source-bot" type="text" value={sourceBot} onChange={e => setSourceBot(e.target.value)} disabled data-unique-id="1c370820-6721-4d0e-b33b-ed346cb5756b" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="b7fc58cf-412f-4e27-ad75-f0b7c5a91c4f" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="2287d22d-c993-4af0-bfce-e24a24162bc6" data-file-name="components/ForwardingSetup.tsx">
              Bot yang mengirimkan pesan yang ingin diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="34b39eb4-e156-4b0c-bb3c-9426715adc7e" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="target-bot" data-unique-id="5a6d3b1e-9bc7-49d6-9d7f-85870f5c021e" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="c0146ff5-2ba0-44fe-b96a-29a474196467" data-file-name="components/ForwardingSetup.tsx">Bot Tujuan</span></Label>
            <Input id="target-bot" type="text" value={targetBot} onChange={e => setTargetBot(e.target.value)} disabled data-unique-id="86f1a125-b243-4f61-8c36-fedc6cb816b0" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="63cbb50f-39b3-4596-81b2-f44711b3df1b" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="96c84550-45f2-4454-ba88-5bcfd50ce1e0" data-file-name="components/ForwardingSetup.tsx">
              Bot Telegram pribadi Anda yang akan menerima pesan yang diteruskan
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="c9ccbe45-3171-4fe1-9197-4b33ac0a0cea" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="e522b718-8224-49a8-a7c6-b60f1932308a" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="5aaa9c9d-ffbc-42bd-8ede-f428f97ad761" data-file-name="components/ForwardingSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="8175916366:AAE4D1L_phr3HyadQ1QgLWJsX_cpkBgsYOo" value={targetBotToken} onChange={e => setTargetBotToken(e.target.value)} data-unique-id="023e482d-27c2-4560-b105-bc72b800b68a" data-file-name="components/ForwardingSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="21b3593c-38e7-477a-8b1f-578c13eac6f3" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="6c518a5d-4cfe-4a36-8864-c50c9793e15e" data-file-name="components/ForwardingSetup.tsx">
              Token bot Telegram pribadi Anda (@iky2025bot)
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="dac13658-c463-4044-942a-ecff62fc7943" data-file-name="components/ForwardingSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="d39b5e0a-5904-4e9f-997a-a4708e539289" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="b80c8995-1f3a-4557-a656-d1704ce0f4cf" data-file-name="components/ForwardingSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="b9f383c8-e9b4-45e6-be56-9677b0dc0c76" data-file-name="components/ForwardingSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="8cbe068f-f77b-40f1-9cc7-dbb2f55ec50b" data-file-name="components/ForwardingSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="02b38ba7-f82e-40cb-bc7a-8904585eea42" data-file-name="components/ForwardingSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="61a9e59f-6f46-4cb3-9cc5-b85fe8324331" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="fe7b134b-40a7-418a-8c81-86104b9e738d" data-file-name="components/ForwardingSetup.tsx">
              URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <div className="flex flex-col gap-4" data-unique-id="1b80374c-2d2a-48d8-ae1d-9a78a36f247e" data-file-name="components/ForwardingSetup.tsx">
            <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="0fdea472-1532-4e9d-9f20-f0f6dd44b2ea" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isSettingWebhook ? <>
                  <span className="animate-spin mr-2" data-unique-id="fc8dde58-ebe3-4e61-90e2-2aba9d01f292" data-file-name="components/ForwardingSetup.tsx"><span className="editable-text" data-unique-id="ec2aa95a-9faf-4e25-8d2e-dbfcaaafd007" data-file-name="components/ForwardingSetup.tsx">⏳</span></span>
                  Mengatur Webhook...
                </> : "Atur Webhook"}
            </Button>

            <Button onClick={toggleForwarding} variant={isForwardingActive ? "destructive" : "default"} className="w-full" data-unique-id="f1dd4e8f-a419-44b8-bba0-6734eafab5e1" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">
              {isForwardingActive ? "Nonaktifkan Penerusan" : "Aktifkan Penerusan"}
            </Button>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="af6f292e-1e6f-4018-81a0-21555c0e58a0" data-file-name="components/ForwardingSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="602d42fc-c10c-4e86-86b7-fda381dc16b4" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="84e6ea6b-5c5c-4402-abcb-26bdfa7cd00d" data-file-name="components/ForwardingSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="d1edea92-2e41-4319-92e2-03621d7202ca" data-file-name="components/ForwardingSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}