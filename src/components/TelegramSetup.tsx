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
  return <div className="space-y-6" data-unique-id="c3b350c5-7c86-470b-8584-5c3273288bd1" data-file-name="components/TelegramSetup.tsx">
      <Card data-unique-id="23df9867-6ec9-42d7-8a98-498c0e609709" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="2c4cd7cc-aaae-4877-a5a3-adca91fd3746" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="bdad747d-3084-4d5f-8f91-2655a27d613f" data-file-name="components/TelegramSetup.tsx">
            <CardTitle data-unique-id="95cb41c5-11d2-440b-82c6-f02e65c32245" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="036c68e7-9b77-4050-8cb6-f94e245b4a08" data-file-name="components/TelegramSetup.tsx">Pengaturan Bot Telegram</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="4cf67e24-db79-464f-8f3c-6745ca8b842b" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="e3d0af23-7989-45bd-a48b-c921645ff1fa" data-file-name="components/TelegramSetup.tsx">
            Konfigurasikan bot Telegram Anda untuk meneruskan pesan ke aplikasi ini
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="6a981f84-04ce-4c1a-b8e2-2fd4dfd2d1a7" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="d93eb46e-4b37-4eee-9a2a-82961728473c" data-file-name="components/TelegramSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="1a46a783-0f36-4e3e-a774-f4d1bfb2427e" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="f6a6bab6-631a-4975-9b54-b9e02a23ee5b" data-file-name="components/TelegramSetup.tsx">Panduan Mendapatkan Bot Token</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="01403b05-7013-4970-b6a0-05df533f61e4" data-file-name="components/TelegramSetup.tsx">
                <li data-unique-id="6422b9ae-b00e-4af2-8876-397917f77073" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="48cf2fdc-7400-4a9b-b645-b55f7b29cca0" data-file-name="components/TelegramSetup.tsx">Buka Telegram dan cari </span><strong data-unique-id="562bb887-cbe0-4cce-a28d-cc4eb92527a3" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="fb2d8dd9-4e3a-4133-b4f3-ac305ed12a49" data-file-name="components/TelegramSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="6c11f3ee-a836-47e4-b8f9-3c8bf9dc66a5" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="e34faab4-62dd-40b9-af71-f5f4faf44e38" data-file-name="components/TelegramSetup.tsx">Mulai percakapan dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="911a0dc3-3f8d-4bbb-a04a-357c65f79aad" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="74509f73-10c9-411c-929c-c8db90230ca1" data-file-name="components/TelegramSetup.tsx">/start</span></code></li>
                <li data-unique-id="9b341847-a5db-4584-818c-2e65475972ab" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="e28db8dc-6968-4d1a-a6b0-b6523e7a5cde" data-file-name="components/TelegramSetup.tsx">Buat bot baru dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="031f93db-9789-473e-b4db-60319592bc61" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="ffd2f2ae-88e8-4faf-8d22-27a9c52e42e6" data-file-name="components/TelegramSetup.tsx">/newbot</span></code></li>
                <li data-unique-id="08d0b936-3b75-424f-85c6-1a25b421aff1" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="3c18e8ff-6a6e-4e73-b5bb-4ef92beb62ad" data-file-name="components/TelegramSetup.tsx">Ikuti instruksi untuk memberikan nama dan username untuk bot Anda</span></li>
                <li data-unique-id="699aea78-76db-45bf-9d0a-6b892a6449ca" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="d9b2f692-b1f9-4c98-93e2-41c7e16313fa" data-file-name="components/TelegramSetup.tsx">BotFather akan memberikan token API yang terlihat seperti: </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="1295bed5-581f-4f43-8db1-6d1624293bfe" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="afb2c5f0-9baf-4326-86a5-d99fb7d88358" data-file-name="components/TelegramSetup.tsx">5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh</span></code></li>
                <li data-unique-id="0cd13b7b-4aa2-4ba9-980f-6b620b201fae" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="f57dc662-a82a-4a77-8920-6efb3c87d55f" data-file-name="components/TelegramSetup.tsx">Salin token tersebut ke kolom Bot Token di bawah</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="101fdf6b-6eda-4f96-8eeb-bcb342524270" data-file-name="components/TelegramSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="a88be784-5ae3-4ed4-ac16-e61ff70c1ae3" data-file-name="components/TelegramSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="f588ba4a-32b3-4893-ba2a-cf49dd685c95" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="81553575-7f79-4909-abcd-6d42ff168a2a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="43c16bd0-589f-450f-ab27-ab300bdc8d0f" data-file-name="components/TelegramSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh" value={botToken} onChange={e => setBotToken(e.target.value)} data-unique-id="17652013-70df-4bcb-bd9e-d6ee0e4f89d5" data-file-name="components/TelegramSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="370a98c7-2242-4bc0-97cc-df08e4148531" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="fcb70ca3-ee82-439b-adc2-4cecface6885" data-file-name="components/TelegramSetup.tsx">
              Dapatkan token ini dari BotFather saat Anda membuat bot
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="3c16587f-793d-407e-8c0d-985ac4ede9e0" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="fd07152a-92e8-4dff-947c-83dac5e6c7b6" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="aea97e24-1c96-43bb-ba83-8015e29b53e3" data-file-name="components/TelegramSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="63702c58-c362-48fe-a410-9821b6295810" data-file-name="components/TelegramSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="50194e78-6e62-4c61-9bc1-e9fabb26d4c5" data-file-name="components/TelegramSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="6214aa40-4bfd-4657-bb69-47f6f3a8df06" data-file-name="components/TelegramSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="5f143bbd-74e4-4eca-9c73-74601beb9789" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="c69b8d50-6d5c-402d-87ed-758a2464f191" data-file-name="components/TelegramSetup.tsx">
              Ini adalah URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="217e5b90-b520-47c7-a0a3-dcfa1354f484" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            {isSettingWebhook ? <>
                <span className="animate-spin mr-2" data-unique-id="8e560326-8803-4403-b0df-a86f89fcb8b9" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="b607acca-f577-4322-a634-297e0512397b" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                Mengatur Webhook...
              </> : "Atur Webhook"}
          </Button>
          
          <div className="mt-6 border-t pt-6" data-unique-id="4fbfa462-08db-41ea-aa36-2115086dac55" data-file-name="components/TelegramSetup.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="4ae0e37e-dd8f-4a6b-bf71-042d2e02d811" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="acb4facb-6136-4f1c-8214-1af44495665a" data-file-name="components/TelegramSetup.tsx">Pilihan Domain Tambahan</span></h3>
            <div className="space-y-4" data-unique-id="81c4c67d-aab0-4da8-85dd-1c31834b27c2" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              {webhookUrlOptions.map((url, index) => <div key={index} className="flex flex-col gap-2" data-is-mapped="true" data-unique-id="7c8ddf70-ad50-48d8-a8be-4022fce85aee" data-file-name="components/TelegramSetup.tsx">
                  <div className="flex gap-2" data-is-mapped="true" data-unique-id="5751ab66-240f-4c47-874a-bba7350b2b49" data-file-name="components/TelegramSetup.tsx">
                    <Input type="text" value={url} readOnly className="text-sm font-mono" data-is-mapped="true" data-unique-id="c3d9dbc8-e2a6-407c-851e-c5babe2d843b" data-file-name="components/TelegramSetup.tsx" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(url)} title="Salin ke clipboard" data-is-mapped="true" data-unique-id="77b4ea83-29cc-4b83-9c41-a3e90820ad97" data-file-name="components/TelegramSetup.tsx">
                      <Copy className="h-4 w-4" data-unique-id="83604a72-d8ae-4595-b439-c9360c6d005a" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true" />
                    </Button>
                  </div>
                  <Button onClick={() => {
                setWebhookUrl(url);
                handleSetWebhook();
              }} disabled={isSettingWebhook} className="w-full" size="sm" data-is-mapped="true" data-unique-id="fbc69131-de88-4fbb-813a-49687b7f3b51" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                    {isSettingWebhook ? <>
                        <span className="animate-spin mr-2" data-is-mapped="true" data-unique-id="4c5b4ba7-6c07-48f2-8992-9854c40b7d8c" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="7d94a838-e496-4a7c-ba6e-e8faeacf9bdd" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                        Mengatur Webhook...
                      </> : "Atur Webhook untuk Domain Ini"}
                  </Button>
                </div>)}
            </div>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="d1c55449-c1f0-43f9-9b48-6f6e6a40cfa1" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="54c276ac-87e8-4d37-adf3-a949f2cba7b0" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="178efef4-ee59-48d8-8331-6a43c9169aaa" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="cc8cd4f1-9be3-40bb-b492-d79977898f8e" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>

      <Card data-unique-id="5942a598-439f-4be1-aa1c-af2d8c9c4046" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="b3fd5fe3-b04d-48b2-a642-6717d75d47f8" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="4acc7d05-9eeb-4bfc-8b02-f80a22e4d2cc" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            <CardTitle data-unique-id="0f1e6a43-81ce-474d-8f59-040fbdf5d3e2" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="4e6b42d2-0ae0-4a7a-803b-60ff7441f88e" data-file-name="components/TelegramSetup.tsx">Format Pesan</span></CardTitle>
            {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="b84ba256-2909-444e-a73f-8e840bba36e3" data-file-name="components/TelegramSetup.tsx">
                <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="0f64f021-de76-40f1-80f2-3f2ecbf6b013" data-file-name="components/TelegramSetup.tsx">
                Edit Format
              </span></Button> : <div className="flex gap-2" data-unique-id="9bea45b8-24fa-496d-a228-4e514fa36208" data-file-name="components/TelegramSetup.tsx">
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="70f1468a-94d0-4864-90e4-f24cd7a72b58" data-file-name="components/TelegramSetup.tsx">
                  <X className="h-4 w-4" /><span className="editable-text" data-unique-id="203f36f9-ed60-4024-a434-a90546259ffe" data-file-name="components/TelegramSetup.tsx">
                  Batal
                </span></Button>
                <Button onClick={saveMessageFormat} variant="default" size="sm" disabled={isSaving} className="flex items-center gap-1" data-unique-id="0c701aff-d6ce-4135-b722-98bc0792c03c" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                  {isSaving ? <>
                      <span className="animate-spin mr-2" data-unique-id="a56d9d44-bbb8-41fe-af62-593dda30700c" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="b978304b-73bd-4616-a898-b1b62b1689e8" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                      Menyimpan...
                    </> : <>
                      <Save className="h-4 w-4" />
                      Simpan
                    </>}
                </Button>
              </div>}
          </div>
          <CardDescription><span className="editable-text" data-unique-id="e14096af-7aaf-44f8-aa2e-69dff835ddb2" data-file-name="components/TelegramSetup.tsx">
            Aplikasi akan memproses pesan dengan format ini
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="1d21f338-e0e3-43c1-9ff7-0fddbbc77c24" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {formatStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="2bb9c98b-0794-4026-bd9f-d43abfbf9b11" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="dfb65bc3-5c42-458b-9c55-912e18c7d0d4" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {formatStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="f6e199cb-1a19-4b7d-b89b-3478243aaa75" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="0a83702a-784d-4610-bef2-198a0c9207d9" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {isEditing ? <div className="space-y-2" data-unique-id="f811b30f-17e4-4235-b657-1d1796dd2135" data-file-name="components/TelegramSetup.tsx">
              <Label htmlFor="message-format" data-unique-id="8b983010-f84d-405a-9eac-0dd7320b369f" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="d797729a-8c55-4425-b316-bbc85061c1f4" data-file-name="components/TelegramSetup.tsx">Edit Format Pesan</span></Label>
              <textarea id="message-format" className="w-full h-64 p-4 rounded-md font-mono text-sm bg-muted border border-input resize-none" value={messageFormat} onChange={e => setMessageFormat(e.target.value)} data-unique-id="b6b18183-63e9-40e7-9064-1f61e7b529b3" data-file-name="components/TelegramSetup.tsx" />
              <p className="text-sm text-muted-foreground" data-unique-id="f7185ddd-bb2a-4155-87ae-4ce94fc7ee4d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="b8aa1c01-e4fb-4e4a-9313-1ba14c8e4c0d" data-file-name="components/TelegramSetup.tsx">
                Pastikan format pesan mengikuti struktur yang dapat diproses oleh sistem
              </span></p>
            </div> : <>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="04ad73d6-7673-4ab7-a178-97e7e09edb9f" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                {messageFormat}
              </div>
              <p className="mt-4 text-sm text-muted-foreground" data-unique-id="fa8cd213-3107-4de2-9679-5bcfae4ab170" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="8326cdc2-638e-4e02-9170-386717453c97" data-file-name="components/TelegramSetup.tsx">
                Sistem akan mengekstrak nomor telepon dan nama dari pesan pembayaran dan membuat akun pengguna secara otomatis.
              </span></p>
            </>}
        </CardContent>
      </Card>
    </div>;
}