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
  return <div className="space-y-6" data-unique-id="1022eb55-705f-4aeb-a3be-e236fb1d8e8f" data-file-name="components/TelegramSetup.tsx">
      <Card data-unique-id="feabfeb6-f6e4-4c77-b877-a425814db30f" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="a14a6ca4-ce03-4e70-9926-ea1fbf3e1386" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="a9712454-1e64-4442-a1b7-017d37f94153" data-file-name="components/TelegramSetup.tsx">
            <CardTitle data-unique-id="113f1b45-2c52-4823-8964-5c03a5d95d3a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="0025176e-30e9-4b7e-8a6f-a9dd73f61976" data-file-name="components/TelegramSetup.tsx">Pengaturan Bot Telegram</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="cde88c5d-5de4-4b7c-9c56-742ada6413f7" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="7d40be86-b230-4de7-9aba-9f1824411f03" data-file-name="components/TelegramSetup.tsx">
            Konfigurasikan bot Telegram Anda untuk meneruskan pesan ke aplikasi ini
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="7aabc241-9835-4ca8-a902-94fb21c61e1e" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="b7801d19-7451-484f-a083-94c2f8c56f03" data-file-name="components/TelegramSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="6c3a9a98-277d-401f-b489-62f0705c6828" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="19c17ee6-a517-46f2-bca3-e9f92ba6b38e" data-file-name="components/TelegramSetup.tsx">Panduan Mendapatkan Bot Token</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="70e61ff8-b8e9-4007-8f05-afab290110c5" data-file-name="components/TelegramSetup.tsx">
                <li data-unique-id="8457fb24-6a3e-4741-99be-e71d4e5362a3" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="dbf0d4a1-a920-4f9f-bfc5-fe75d4130381" data-file-name="components/TelegramSetup.tsx">Buka Telegram dan cari </span><strong data-unique-id="71382e90-ca77-47e0-89c0-7d594841b076" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="2c2c14de-089a-44e4-840c-6a1c4c909099" data-file-name="components/TelegramSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="fc39eed7-eb2f-4856-868b-5980d5eb0d51" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="19131b56-4e83-4794-9ed2-01f2aa6d93ec" data-file-name="components/TelegramSetup.tsx">Mulai percakapan dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="089678e8-3886-4d05-8482-c93998df0308" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="fcb1f94f-9103-45da-8fa7-3941c395ebb7" data-file-name="components/TelegramSetup.tsx">/start</span></code></li>
                <li data-unique-id="9c9ee68e-3024-4837-9473-c32eda84c601" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="afac2a4e-d1f1-4841-a1d5-547db1a17883" data-file-name="components/TelegramSetup.tsx">Buat bot baru dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="d79b1b44-a5a8-4be0-8085-d8dd4a5f1720" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="2fa87582-712f-48a8-aaf8-4f34c7562eda" data-file-name="components/TelegramSetup.tsx">/newbot</span></code></li>
                <li data-unique-id="8f6a7283-9cb5-4a97-ae08-b0237164b4b2" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="26964b0a-8e53-4b5e-adb2-842556651dd9" data-file-name="components/TelegramSetup.tsx">Ikuti instruksi untuk memberikan nama dan username untuk bot Anda</span></li>
                <li data-unique-id="da38aaf7-7b40-4750-b2aa-b1b2cbee75d6" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="5b7abb5b-b113-4972-a96c-32c70aba3a57" data-file-name="components/TelegramSetup.tsx">BotFather akan memberikan token API yang terlihat seperti: </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="23ab004b-a51d-41eb-9f01-5cf7c6fddb4a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="13aa4660-163e-433b-8552-d39dfff02d93" data-file-name="components/TelegramSetup.tsx">5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh</span></code></li>
                <li data-unique-id="29554e02-9ec2-417e-8ae8-92e431b1a909" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="7e744dac-3e79-4dc2-a62a-c44a580dfbd3" data-file-name="components/TelegramSetup.tsx">Salin token tersebut ke kolom Bot Token di bawah</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="36566428-1a33-47ff-9843-140dd1482186" data-file-name="components/TelegramSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="1758db17-fae7-4576-a9ac-c3322d57e1ac" data-file-name="components/TelegramSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="07785234-5fe8-4e55-8e69-28ef30e27d0f" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="05c58255-eb43-4421-8f39-40cd26b67e48" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="909b7e13-6e7f-4021-af74-6ba65da7d998" data-file-name="components/TelegramSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh" value={botToken} onChange={e => setBotToken(e.target.value)} data-unique-id="cf12c4c3-b056-43a1-82f6-e428fb5b914c" data-file-name="components/TelegramSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="6feca13f-6145-476c-b647-685216f08751" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="7c809b24-0af9-48e3-913e-9b5a6c456fff" data-file-name="components/TelegramSetup.tsx">
              Dapatkan token ini dari BotFather saat Anda membuat bot
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="b1fc6ba8-5da4-4cf4-ad7d-6f268a2a0b60" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="c48ee4c0-ac65-42df-b6cf-a303b5751e9e" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="cfa6deae-4195-4617-927f-b8c8849b94f8" data-file-name="components/TelegramSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="7e49130f-aa2d-4a59-9a15-7a32aad68f37" data-file-name="components/TelegramSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="877580e0-0d2f-45ec-ab55-73ad5dfa443c" data-file-name="components/TelegramSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="055d7188-b59f-4900-b1d0-b4f128011b23" data-file-name="components/TelegramSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="0a8cf91c-9220-41e0-b971-67f88fae7676" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="7bb22813-782b-4dfd-927c-1a3c565c98ce" data-file-name="components/TelegramSetup.tsx">
              Ini adalah URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="beb03362-84e1-4ed1-88cc-7e0ef92b1d31" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            {isSettingWebhook ? <>
                <span className="animate-spin mr-2" data-unique-id="10ea9c79-62e6-4bf6-85a8-888f525d79f4" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="59c4e528-d4d8-4745-a37c-db6f13a7754a" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                Mengatur Webhook...
              </> : "Atur Webhook"}
          </Button>
          
          <div className="mt-6 border-t pt-6" data-unique-id="1aa9ee1a-4cc4-4c54-86e8-5877c30ce973" data-file-name="components/TelegramSetup.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="17ace3ac-62f2-4c43-8e21-137db3bdb598" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="ae3cf7b3-d430-4036-a3f0-50716ff0c92c" data-file-name="components/TelegramSetup.tsx">Pilihan Domain Tambahan</span></h3>
            <div className="space-y-4" data-unique-id="fd565c22-87e4-4c1a-95dc-ca1ef0b0512c" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              {webhookUrlOptions.map((url, index) => <div key={index} className="flex flex-col gap-2" data-is-mapped="true" data-unique-id="f33aae43-71e4-4d6b-bc32-203e1f509f1e" data-file-name="components/TelegramSetup.tsx">
                  <div className="flex gap-2" data-is-mapped="true" data-unique-id="2602029f-5b2d-4265-aae3-a38922584279" data-file-name="components/TelegramSetup.tsx">
                    <Input type="text" value={url} readOnly className="text-sm font-mono" data-is-mapped="true" data-unique-id="41c68461-08ed-43cb-a67e-85d6591df8eb" data-file-name="components/TelegramSetup.tsx" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(url)} title="Salin ke clipboard" data-is-mapped="true" data-unique-id="d66c1c27-7781-4aba-805b-7e47bad7be55" data-file-name="components/TelegramSetup.tsx">
                      <Copy className="h-4 w-4" data-unique-id="645248ab-5089-43a9-bc26-26c5dfaa15bb" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true" />
                    </Button>
                  </div>
                  <Button onClick={() => {
                setWebhookUrl(url);
                handleSetWebhook();
              }} disabled={isSettingWebhook} className="w-full" size="sm" data-is-mapped="true" data-unique-id="21d87b7a-ca98-4cf4-b9a3-588425597bc3" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                    {isSettingWebhook ? <>
                        <span className="animate-spin mr-2" data-is-mapped="true" data-unique-id="a3255dd9-7dd2-4914-9c47-98772dc1a410" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="a019cb49-22d4-4747-8d73-692246479738" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                        Mengatur Webhook...
                      </> : "Atur Webhook untuk Domain Ini"}
                  </Button>
                </div>)}
            </div>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="9782c210-8071-4f15-914e-1a2dadd5d466" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="63212702-2de0-44cb-b6fe-b05358833ef5" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="edab46a8-fae2-4fb9-b0ff-a5d7fb27ff3a" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="1f6f3b5d-8f9a-4b0d-8dc5-06f5c303459f" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>

      <Card data-unique-id="1c5a7bcb-c443-483e-af40-d57ff8b09bee" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="4e13c25f-3e1a-4c1c-9acb-3ec7fde0eec3" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="97905943-3cba-4e18-a153-76b194adcd4b" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            <CardTitle data-unique-id="5572f52a-ae4e-4811-b882-f07828937809" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="819ac39e-f0cb-44fb-a077-df63e07d24e5" data-file-name="components/TelegramSetup.tsx">Format Pesan</span></CardTitle>
            {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="b41b84e6-149b-4c30-b43f-3fb65dc8bfce" data-file-name="components/TelegramSetup.tsx">
                <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="685f58db-2626-42ca-9147-5debd897eb68" data-file-name="components/TelegramSetup.tsx">
                Edit Format
              </span></Button> : <div className="flex gap-2" data-unique-id="60dcffa7-cccf-4c4a-835a-34233b027383" data-file-name="components/TelegramSetup.tsx">
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="2ab49b82-9427-4c7d-b92f-20e60e924800" data-file-name="components/TelegramSetup.tsx">
                  <X className="h-4 w-4" /><span className="editable-text" data-unique-id="20e87533-f753-45d0-b0c3-ef69197b7fc0" data-file-name="components/TelegramSetup.tsx">
                  Batal
                </span></Button>
                <Button onClick={saveMessageFormat} variant="default" size="sm" disabled={isSaving} className="flex items-center gap-1" data-unique-id="68e23ee7-450d-4bec-869e-fec817b1e8e9" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                  {isSaving ? <>
                      <span className="animate-spin mr-2" data-unique-id="672e5b3e-4ce7-4622-919f-b761161ce9f6" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="9e2cca7a-b947-4397-96b3-31207b19375e" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                      Menyimpan...
                    </> : <>
                      <Save className="h-4 w-4" />
                      Simpan
                    </>}
                </Button>
              </div>}
          </div>
          <CardDescription><span className="editable-text" data-unique-id="a1e13b23-455f-471c-a40f-9c49b308c03e" data-file-name="components/TelegramSetup.tsx">
            Aplikasi akan memproses pesan dengan format ini
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="90bfef3e-2c3d-419f-826e-3dd70c006840" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {formatStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="7c6b6aac-eec5-4a42-9acf-87502604c600" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="06a9fb16-8fa7-41c7-9ae2-8102b3275f04" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {formatStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="74c6c2ab-ca55-475f-aa44-350ce2d73697" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="0d44481f-7e26-4f8d-bd35-6c844dd346f5" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {isEditing ? <div className="space-y-2" data-unique-id="7147b9a2-3998-4fa9-b31b-7aef85b461b4" data-file-name="components/TelegramSetup.tsx">
              <Label htmlFor="message-format" data-unique-id="3103290f-635a-4005-88d0-ba567e556251" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="22451919-7623-4c1e-ac38-bebd36b3d52f" data-file-name="components/TelegramSetup.tsx">Edit Format Pesan</span></Label>
              <textarea id="message-format" className="w-full h-64 p-4 rounded-md font-mono text-sm bg-muted border border-input resize-none" value={messageFormat} onChange={e => setMessageFormat(e.target.value)} data-unique-id="178bfbe8-7c1d-4bb3-bccf-fe8bf58cc939" data-file-name="components/TelegramSetup.tsx" />
              <p className="text-sm text-muted-foreground" data-unique-id="bcb553e2-1dcd-4eda-afcd-8f1526eac684" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="76304f13-b4e6-44bb-9abd-a04482466f6e" data-file-name="components/TelegramSetup.tsx">
                Pastikan format pesan mengikuti struktur yang dapat diproses oleh sistem
              </span></p>
            </div> : <>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="17f85189-e9ef-4e65-a5c8-089a0a68bc23" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                {messageFormat}
              </div>
              <p className="mt-4 text-sm text-muted-foreground" data-unique-id="d4ca8473-47c1-483a-8bf4-acbb44f6c198" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="07cc8c1b-fc8a-465a-90c7-2968c6cbbb3e" data-file-name="components/TelegramSetup.tsx">
                Sistem akan mengekstrak nomor telepon dan nama dari pesan pembayaran dan membuat akun pengguna secara otomatis.
              </span></p>
            </>}
        </CardContent>
      </Card>
    </div>;
}