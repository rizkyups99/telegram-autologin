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
  const pageNumbers = Array.from({
    length: Math.min(5, totalPages)
  }, (_, i) => {
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

  // Predefined webhook URLs
  const webhookUrlOptions = ["https://langit-digital-telelogin.vercel.app/api/telegram/webhook", "https://telegram-autologin.getcreatr.dev/api/telegram/webhook", "https://www.ikhtiarjalurlangit.my.id/api/telegram/webhook"];

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
        body: JSON.stringify({
          format: messageFormat
        })
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
  return <div className="space-y-6" data-unique-id="7457c417-3651-4d10-bfa0-e37c3d0c505a" data-file-name="components/TelegramSetup.tsx">
      <Card data-unique-id="16eff987-b5c3-4459-b494-5ed10d2be8d1" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="282169ed-63e9-4f49-932a-83399240b179" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="e823d131-bc70-416f-9090-9a0ff63bd8ec" data-file-name="components/TelegramSetup.tsx">
            <CardTitle data-unique-id="4f1b2de3-c3ea-402e-b6d5-5fb258cebd9d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="6a8793f8-8989-4663-b688-ebda861a1be1" data-file-name="components/TelegramSetup.tsx">Pengaturan Bot Telegram</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="cdc1ebed-b77a-4c6f-983a-fa24330d4c3f" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="303100c2-d43c-411b-a61c-838a7a875360" data-file-name="components/TelegramSetup.tsx">
            Konfigurasikan bot Telegram Anda untuk meneruskan pesan ke aplikasi ini
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="f37dcdde-bc64-4426-8b44-ac9b9620c866" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="72958037-0cc9-4935-8293-c71a199fe7a3" data-file-name="components/TelegramSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="b1a808b6-581b-4fcf-999d-d91360cad28e" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="a06bff72-b189-45d2-9969-773a43a51700" data-file-name="components/TelegramSetup.tsx">Panduan Mendapatkan Bot Token</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="9e47c110-70ba-4d28-8d67-ae7981491596" data-file-name="components/TelegramSetup.tsx">
                <li data-unique-id="2b527482-45a7-4aeb-80c4-a084e3824beb" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="7597c52e-3b67-4c9e-9564-187e94b538b4" data-file-name="components/TelegramSetup.tsx">Buka Telegram dan cari </span><strong data-unique-id="ea95e73b-7db3-4958-9139-da6eda6872ca" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="3aa36bfb-e7d8-44bd-9af7-d830c5bc3b8e" data-file-name="components/TelegramSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="d611212c-e03c-4cb9-bf04-e7ab7fad90a1" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="8d05662d-2a21-421d-9781-be98b7cfc126" data-file-name="components/TelegramSetup.tsx">Mulai percakapan dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="6b34ca4e-61c8-4bf7-b251-7bcb22b52150" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="afa0256e-9bc9-4742-936f-eb9d91ea5b75" data-file-name="components/TelegramSetup.tsx">/start</span></code></li>
                <li data-unique-id="2677f943-aa99-43e5-8899-b31a1a836f0a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="79b6ce94-63e8-4db4-9371-2dda7b0235e8" data-file-name="components/TelegramSetup.tsx">Buat bot baru dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="2bde8c79-7a95-42e5-990f-4ad1fce4463d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="3f8c1d2e-3a53-4af5-a2b9-58a68d0af950" data-file-name="components/TelegramSetup.tsx">/newbot</span></code></li>
                <li data-unique-id="2dfd3dfe-b550-402f-b746-3c0c4dc29e49" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="01ce9a89-bf4e-4d52-b376-c8b5b70274f7" data-file-name="components/TelegramSetup.tsx">Ikuti instruksi untuk memberikan nama dan username untuk bot Anda</span></li>
                <li data-unique-id="4fc79049-c923-4341-83e2-5a035372db37" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="dae6e256-6df6-4c65-a9e7-5f439415a9f2" data-file-name="components/TelegramSetup.tsx">BotFather akan memberikan token API yang terlihat seperti: </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="0811fa80-2951-4cfd-baac-7f95e1ae1436" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="745e533c-5e1d-408f-98af-2cbb74e8a6e3" data-file-name="components/TelegramSetup.tsx">5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh</span></code></li>
                <li data-unique-id="f5d25271-9b71-45b2-805b-45f182dd3f34" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="269b1b88-ed47-4c6b-a85b-0b1f8f8944b3" data-file-name="components/TelegramSetup.tsx">Salin token tersebut ke kolom Bot Token di bawah</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="74f50dfe-18e9-4c37-9c91-b48de1bf604f" data-file-name="components/TelegramSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="34aecb7c-516d-40bf-b365-9131cf015e16" data-file-name="components/TelegramSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="0d94ce38-12a7-473e-b088-996e9629a69b" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="935a9cdc-6ec6-43f9-a169-97863ea795e5" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="67607b3b-28ff-4cad-a2ea-0e0b41f5b46b" data-file-name="components/TelegramSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh" value={botToken} onChange={e => setBotToken(e.target.value)} data-unique-id="3288aeed-73a5-4174-b2ea-4c346ce9f4fc" data-file-name="components/TelegramSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="ecc4ba6a-fab1-48db-8275-1d66b60d551e" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="09e8cd95-7daf-411e-a2e4-05d6458a485e" data-file-name="components/TelegramSetup.tsx">
              Dapatkan token ini dari BotFather saat Anda membuat bot
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="854356d4-869a-451a-96b3-61b98fca78bc" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="1b79bbcc-435c-4721-a405-bc7628ea539b" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="e65f2b16-fd48-4159-9655-4a8224fa5ae7" data-file-name="components/TelegramSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="7940ccc7-b7f8-4729-974e-04225a681336" data-file-name="components/TelegramSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="3372005b-eea2-4066-afc7-bbf9e54368de" data-file-name="components/TelegramSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="3a945b3e-9eb8-4bcb-9327-bfa5e9b30550" data-file-name="components/TelegramSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="9132c780-e26f-4b05-beb3-25c2d506ec6e" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="9a09d250-ff71-45e0-9e0e-34295d90e62c" data-file-name="components/TelegramSetup.tsx">
              Ini adalah URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="52d840b3-acf1-4ee0-b998-f7c9db784ed1" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            {isSettingWebhook ? <>
                <span className="animate-spin mr-2" data-unique-id="bbf1d4d9-eb9a-4738-88ab-3006dc43040d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="d38ef75b-d1f1-4a74-acdf-a04eea0da281" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                Mengatur Webhook...
              </> : "Atur Webhook"}
          </Button>
          
          <div className="mt-6 border-t pt-6" data-unique-id="af71e19b-d691-4a14-88ab-7e9c22a41d93" data-file-name="components/TelegramSetup.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="a2cb3641-2a18-4b18-873a-7c91dc9f1bd5" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="e50db7fb-2df5-4e53-94b6-8a1fd98053ee" data-file-name="components/TelegramSetup.tsx">Pilihan Domain Tambahan</span></h3>
            <div className="space-y-4" data-unique-id="c340daa1-30a9-4b78-87cb-880e61e5a72f" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              {webhookUrlOptions.map((url, index) => <div key={index} className="flex flex-col gap-2" data-is-mapped="true" data-unique-id="2c74cda0-f2d6-47a5-82b9-5f0b927597a7" data-file-name="components/TelegramSetup.tsx">
                  <div className="flex gap-2" data-is-mapped="true" data-unique-id="10e11d7a-ae93-42e8-8e84-53f8a5cf5241" data-file-name="components/TelegramSetup.tsx">
                    <Input type="text" value={url} readOnly className="text-sm font-mono" data-is-mapped="true" data-unique-id="6bbb3412-8ec9-4224-892e-74192f581e14" data-file-name="components/TelegramSetup.tsx" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(url)} title="Salin ke clipboard" data-is-mapped="true" data-unique-id="32141ddc-99b6-4944-81f4-ebacfc02c714" data-file-name="components/TelegramSetup.tsx">
                      <Copy className="h-4 w-4" data-unique-id="b77aff6d-7a09-48e8-8211-c02dc1022f64" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true" />
                    </Button>
                  </div>
                  <Button onClick={() => {
                setWebhookUrl(url);
                handleSetWebhook();
              }} disabled={isSettingWebhook} className="w-full" size="sm" data-is-mapped="true" data-unique-id="0302abdc-7dfd-4cb2-87c2-97503e2eed26" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                    {isSettingWebhook ? <>
                        <span className="animate-spin mr-2" data-is-mapped="true" data-unique-id="baec9c3f-18ec-4fc8-8d20-d1d6072f726d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="89108d4c-1de8-4cca-9c7a-dbfbe83acd50" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                        Mengatur Webhook...
                      </> : "Atur Webhook untuk Domain Ini"}
                  </Button>
                </div>)}
            </div>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="09da669f-8af5-46fa-a3c6-ebbaad105811" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="ce9836f6-a732-4ea7-99a6-02c2a0c77b05" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="85ec65eb-3e7d-4af1-aebe-8eacdd20b25e" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="ddcbafc0-cb55-4238-b158-fab8fc476f97" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>

      <Card data-unique-id="30b880fe-9a33-465f-85fb-88ae79f4fe94" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="d8705d5a-cfcb-46fb-a1fb-d328c5217dc3" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="4ea37bd0-b3ef-4749-89b8-019b90134ba5" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            <CardTitle data-unique-id="2d3141e5-0ac4-4803-b253-65fb29bcf636" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="81e2ee2b-a789-4415-b6c9-3f49921b38dc" data-file-name="components/TelegramSetup.tsx">Format Pesan</span></CardTitle>
            {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="83834f52-6ff1-4979-8c51-328079bfcc29" data-file-name="components/TelegramSetup.tsx">
                <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="314fdc67-f9ac-4ab5-96d1-27f57d83197e" data-file-name="components/TelegramSetup.tsx">
                Edit Format
              </span></Button> : <div className="flex gap-2" data-unique-id="ad08a005-496b-4c02-bdd7-107b853198bf" data-file-name="components/TelegramSetup.tsx">
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="7ed24414-3161-4ea0-988b-b1c5f9e5524e" data-file-name="components/TelegramSetup.tsx">
                  <X className="h-4 w-4" /><span className="editable-text" data-unique-id="e90064b5-e6af-4179-9260-7e7211b4a70d" data-file-name="components/TelegramSetup.tsx">
                  Batal
                </span></Button>
                <Button onClick={saveMessageFormat} variant="default" size="sm" disabled={isSaving} className="flex items-center gap-1" data-unique-id="a78f94a9-0aa1-45c0-acce-e8dcf9f17157" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                  {isSaving ? <>
                      <span className="animate-spin mr-2" data-unique-id="55138f66-4546-43e2-93bd-1c8a48e23a7c" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="f6ebb571-1a0b-4945-80f5-96e86a24c3d4" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                      Menyimpan...
                    </> : <>
                      <Save className="h-4 w-4" />
                      Simpan
                    </>}
                </Button>
              </div>}
          </div>
          <CardDescription><span className="editable-text" data-unique-id="1e91fc58-d287-4da5-b8f8-8dd9fc9c7125" data-file-name="components/TelegramSetup.tsx">
            Aplikasi akan memproses pesan dengan format ini
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="fba9f800-9acf-43cc-8192-044309027e68" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {formatStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="18290f80-480f-4d27-9bf4-b71e3ab56376" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="10c66b66-3f6b-40ad-8057-14dbc2ff1151" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {formatStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="636cf9da-2c19-4b0d-95fd-742af31ee4f3" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="46342a50-dd07-4807-a3ce-7348f1f2e920" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {isEditing ? <div className="space-y-2" data-unique-id="f3c121bb-0cbc-4ee8-8a49-fe58944ae3c7" data-file-name="components/TelegramSetup.tsx">
              <Label htmlFor="message-format" data-unique-id="e28c1500-9910-47f8-aa44-0c0a05be617e" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="aea49e7c-1b20-4a7e-89f0-09f889d794b0" data-file-name="components/TelegramSetup.tsx">Edit Format Pesan</span></Label>
              <textarea id="message-format" className="w-full h-64 p-4 rounded-md font-mono text-sm bg-muted border border-input resize-none" value={messageFormat} onChange={e => setMessageFormat(e.target.value)} data-unique-id="6e13a7b2-c126-4e51-a8a0-cc237ec6200c" data-file-name="components/TelegramSetup.tsx" />
              <p className="text-sm text-muted-foreground" data-unique-id="51adfc0f-084c-41a8-9094-f59d174bfc8a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="750791e6-1e35-418e-adf5-98f301def079" data-file-name="components/TelegramSetup.tsx">
                Pastikan format pesan mengikuti struktur yang dapat diproses oleh sistem
              </span></p>
            </div> : <>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="4f2a1702-6bb6-4fdc-b4e3-ee67e7d3fbf3" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                {messageFormat}
              </div>
              <p className="mt-4 text-sm text-muted-foreground" data-unique-id="96b5a874-6fda-4d46-aecc-fc796ca1b669" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="f090543b-0ab1-49c6-9b80-374e141be0d0" data-file-name="components/TelegramSetup.tsx">
                Sistem akan mengekstrak nomor telepon dan nama dari pesan pembayaran dan membuat akun pengguna secara otomatis.
              </span></p>
            </>}
        </CardContent>
      </Card>
    </div>;
}