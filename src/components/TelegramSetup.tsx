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
  return <div className="space-y-6" data-unique-id="35efeedc-51ec-4341-9da6-26b58684142b" data-file-name="components/TelegramSetup.tsx">
      <Card data-unique-id="3b3d2731-9860-46c6-b813-a1f631887a5e" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="244f7426-53c6-4f02-9240-1bfdf9f284f4" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="e197f2d6-d3db-4664-9b02-68d88cce9ce8" data-file-name="components/TelegramSetup.tsx">
            <CardTitle data-unique-id="0b65766a-5f85-42e8-8fa0-ae5ed443b39f" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="b520bd13-acb4-4066-a10b-018f79fd956b" data-file-name="components/TelegramSetup.tsx">Pengaturan Bot Telegram</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="b02659ef-7889-4f50-86c6-b37692a22998" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="0efc0401-d32b-4d17-a1e4-a45b3228cc92" data-file-name="components/TelegramSetup.tsx">
            Konfigurasikan bot Telegram Anda untuk meneruskan pesan ke aplikasi ini
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="2cdbb648-13da-4647-b77d-2ad88d820bed" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="cc6ca6b3-98fa-4e5a-95ea-772f9b672e91" data-file-name="components/TelegramSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="832cde2e-697a-4f18-9ce8-2201149b0d01" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="047a5989-57a0-49f8-82d2-ad568734f5f8" data-file-name="components/TelegramSetup.tsx">Panduan Mendapatkan Bot Token</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="f0ba4798-42f4-467f-bc90-a691e970d0ff" data-file-name="components/TelegramSetup.tsx">
                <li data-unique-id="bfdacb66-120a-4fa9-a590-e09caf76a65d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="29799486-8d20-4f01-bef6-77c1929e016b" data-file-name="components/TelegramSetup.tsx">Buka Telegram dan cari </span><strong data-unique-id="58535692-ca1f-41f0-92d0-6d1c3803195d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="ba8b3342-6064-4919-96e1-de2e0bd518af" data-file-name="components/TelegramSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="9da5c0ec-c827-4353-97cc-49c60f98b6ab" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="ac438462-5b82-4e5f-8335-8b601179aafd" data-file-name="components/TelegramSetup.tsx">Mulai percakapan dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="52d38e31-30c3-4d7c-904f-6b9b984c8717" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="2cfd94cf-1ec1-42d2-bc06-49ca65619c75" data-file-name="components/TelegramSetup.tsx">/start</span></code></li>
                <li data-unique-id="552baa9d-4076-4b53-8f19-cfa742a78f4b" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="8eccbef3-a3b8-44f6-bc23-c869357237a4" data-file-name="components/TelegramSetup.tsx">Buat bot baru dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="4207c27e-1ca7-406d-8357-5c445e4e14dd" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="ff8bd393-94da-46aa-a3ae-237f7922cb72" data-file-name="components/TelegramSetup.tsx">/newbot</span></code></li>
                <li data-unique-id="4eb1d3f2-1d9c-4e64-81c9-75af3d5e05c3" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="af8f3152-eff5-4285-ab62-02a5b55a9ae1" data-file-name="components/TelegramSetup.tsx">Ikuti instruksi untuk memberikan nama dan username untuk bot Anda</span></li>
                <li data-unique-id="df05f73e-c80f-487b-8dcc-14ef7336f820" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="1fd690df-760f-4903-b744-e79b159f9094" data-file-name="components/TelegramSetup.tsx">BotFather akan memberikan token API yang terlihat seperti: </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="2f20060e-767b-499e-9848-274660b7f84a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="4ae16508-13c5-4045-ba40-6bf2e3e22dc8" data-file-name="components/TelegramSetup.tsx">5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh</span></code></li>
                <li data-unique-id="4f3ed6ec-9ce8-4051-b5fc-68c17d9110ea" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="a2b96b48-0fce-40a8-bfcb-1de53d6aa29a" data-file-name="components/TelegramSetup.tsx">Salin token tersebut ke kolom Bot Token di bawah</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="9bc9ed11-15e3-41d6-a4c3-b93af400372d" data-file-name="components/TelegramSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="5b2fb171-2839-42c4-bf84-e71fb67872d0" data-file-name="components/TelegramSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="31105f5e-f4ba-446c-8f64-08a0eead1f99" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="964536b3-0b59-4ae8-bcfc-a0aa360bbcad" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="9e7c8794-d818-45ef-9133-615e7ccf31b0" data-file-name="components/TelegramSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh" value={botToken} onChange={e => setBotToken(e.target.value)} data-unique-id="e9a014e8-f1d9-4970-872e-73d78f4c0eba" data-file-name="components/TelegramSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="0c550d9d-66fb-4a8d-880d-b3f1690a734f" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="fd3972e2-6ea3-4bd5-8285-18370730965b" data-file-name="components/TelegramSetup.tsx">
              Dapatkan token ini dari BotFather saat Anda membuat bot
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="219862c4-61c7-47e9-957e-d3dcd93a346e" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="0dd14ad2-75f8-437e-aa89-ec9822336028" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="33602b8a-d535-42ca-8c93-696d741ef523" data-file-name="components/TelegramSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="0767e25c-016d-4f8c-85bc-3346e59149b4" data-file-name="components/TelegramSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="d5f10537-41d6-434d-bdb5-08c376343eb2" data-file-name="components/TelegramSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="750618e0-2675-4ac2-ba97-b76209253a60" data-file-name="components/TelegramSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="e1edc03f-b4b9-4f7e-811b-a943033a5425" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="0ae7d9fb-5dc8-4399-8a02-42afae1dcd1c" data-file-name="components/TelegramSetup.tsx">
              Ini adalah URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="076bdcd0-13f5-4568-a0bd-85f88d443429" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            {isSettingWebhook ? <>
                <span className="animate-spin mr-2" data-unique-id="3149ffcf-86c7-4a39-a8af-db75010849ef" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="9d3e131e-9078-427d-9c99-05340f0068f4" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                Mengatur Webhook...
              </> : "Atur Webhook"}
          </Button>
          
          <div className="mt-6 border-t pt-6" data-unique-id="380e5b09-10fb-457c-8335-e223c1a32da7" data-file-name="components/TelegramSetup.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="4745cc21-1c34-45b2-b29a-72d9f59087b3" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="2f5b00b9-d372-4d57-b939-9f18aac533c4" data-file-name="components/TelegramSetup.tsx">Pilihan Domain Tambahan</span></h3>
            <div className="space-y-4" data-unique-id="3304c98f-ed62-49ad-ad03-d31b8cf12f02" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              {webhookUrlOptions.map((url, index) => <div key={index} className="flex flex-col gap-2" data-is-mapped="true" data-unique-id="d9a17796-81f7-4afe-847c-11c1bcfed6c7" data-file-name="components/TelegramSetup.tsx">
                  <div className="flex gap-2" data-is-mapped="true" data-unique-id="970e92cf-b1b5-4167-bbb0-86af72e8ef7c" data-file-name="components/TelegramSetup.tsx">
                    <Input type="text" value={url} readOnly className="text-sm font-mono" data-is-mapped="true" data-unique-id="c2da3525-07b0-4a0b-a0ee-b0f67eb8adec" data-file-name="components/TelegramSetup.tsx" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(url)} title="Salin ke clipboard" data-is-mapped="true" data-unique-id="7143913b-e94c-476f-8311-ced66efcaf12" data-file-name="components/TelegramSetup.tsx">
                      <Copy className="h-4 w-4" data-unique-id="f127e040-ca93-4fcb-a833-3ffc2c2a26f8" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true" />
                    </Button>
                  </div>
                  <Button onClick={() => {
                setWebhookUrl(url);
                handleSetWebhook();
              }} disabled={isSettingWebhook} className="w-full" size="sm" data-is-mapped="true" data-unique-id="797f272c-2c59-4cc3-b8dc-b55aabe22fd5" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                    {isSettingWebhook ? <>
                        <span className="animate-spin mr-2" data-is-mapped="true" data-unique-id="5be6d532-d790-43d3-81a8-bd9b1daed29a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="8e31b9a5-fd82-4919-a6c4-92832437532f" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                        Mengatur Webhook...
                      </> : "Atur Webhook untuk Domain Ini"}
                  </Button>
                </div>)}
            </div>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="41a30edb-8b2b-4008-a95d-db5477cfc412" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="32ca8212-4f78-441f-a3a6-2ef16a23d512" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="e9ea3ef7-4533-4f02-8594-f65421382e0c" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="fca19207-d60d-4a79-9e4a-ba41a94acea8" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>

      <Card data-unique-id="a8d2230c-3583-4eeb-9ff4-bd63573e78d4" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="f2937e84-013b-4b07-b65e-41cdb821dbff" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="84c305c8-397e-4914-b258-52dfcc5116d9" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            <CardTitle data-unique-id="5547cf3c-617c-4b89-aeb0-b50942300f7b" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="ec977101-fe5e-461b-bd68-fc498c219c03" data-file-name="components/TelegramSetup.tsx">Format Pesan</span></CardTitle>
            {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="0230b886-57bd-4595-9c66-fce3bc3c8238" data-file-name="components/TelegramSetup.tsx">
                <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="3be3a094-a5ff-41d6-a4dd-93781b60774b" data-file-name="components/TelegramSetup.tsx">
                Edit Format
              </span></Button> : <div className="flex gap-2" data-unique-id="06d9134d-cce0-4d21-a384-5de6056f3a88" data-file-name="components/TelegramSetup.tsx">
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="358c69d6-bf18-4153-ac01-de32da5a4262" data-file-name="components/TelegramSetup.tsx">
                  <X className="h-4 w-4" /><span className="editable-text" data-unique-id="798a6295-a10d-4d06-aad0-d42329e5f80a" data-file-name="components/TelegramSetup.tsx">
                  Batal
                </span></Button>
                <Button onClick={saveMessageFormat} variant="default" size="sm" disabled={isSaving} className="flex items-center gap-1" data-unique-id="359dd122-6d24-48a8-a8bd-efa236c4a296" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                  {isSaving ? <>
                      <span className="animate-spin mr-2" data-unique-id="4806e9be-d266-467e-a7b3-372035f96e15" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="7314a27f-0eaa-4a2e-8cea-af7562e6c335" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                      Menyimpan...
                    </> : <>
                      <Save className="h-4 w-4" />
                      Simpan
                    </>}
                </Button>
              </div>}
          </div>
          <CardDescription><span className="editable-text" data-unique-id="f08e25bb-dcb6-4e1b-a2c4-cfaa1c3b2134" data-file-name="components/TelegramSetup.tsx">
            Aplikasi akan memproses pesan dengan format ini
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="6bc68b3f-2a75-4f4b-bebb-2ae04f42165e" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {formatStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="60600cf3-0749-4d8c-a548-4c8f748ecb86" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="e2fa1035-123c-4da3-a13c-db664ee17c33" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {formatStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="3b28e6d6-933c-4445-81a9-3000beadd615" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="95e571af-9abd-47a9-a918-256918d0de3b" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {isEditing ? <div className="space-y-2" data-unique-id="ab9e9622-ed86-46dd-8880-4dffca46ab74" data-file-name="components/TelegramSetup.tsx">
              <Label htmlFor="message-format" data-unique-id="bd89ce14-14a3-4f17-a948-99287047c6d1" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="7689644a-8e8d-46ea-ab65-69085da613eb" data-file-name="components/TelegramSetup.tsx">Edit Format Pesan</span></Label>
              <textarea id="message-format" className="w-full h-64 p-4 rounded-md font-mono text-sm bg-muted border border-input resize-none" value={messageFormat} onChange={e => setMessageFormat(e.target.value)} data-unique-id="88a0bc3d-e4f2-4b77-b4be-113b77271da4" data-file-name="components/TelegramSetup.tsx" />
              <p className="text-sm text-muted-foreground" data-unique-id="7be03d0a-a566-4b1d-a0f7-f6b041508031" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="42d6d5e0-50fe-4db4-9c22-edd11b2719b9" data-file-name="components/TelegramSetup.tsx">
                Pastikan format pesan mengikuti struktur yang dapat diproses oleh sistem
              </span></p>
            </div> : <>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="3dea9e30-1819-4374-bf8b-ed96b35eaebe" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                {messageFormat}
              </div>
              <p className="mt-4 text-sm text-muted-foreground" data-unique-id="47aa8484-30f0-4294-9519-e86bb535620b" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="8a6a27e7-e232-4752-bd32-c94f818d3d66" data-file-name="components/TelegramSetup.tsx">
                Sistem akan mengekstrak nomor telepon dan nama dari pesan pembayaran dan membuat akun pengguna secara otomatis.
              </span></p>
            </>}
        </CardContent>
      </Card>
    </div>;
}