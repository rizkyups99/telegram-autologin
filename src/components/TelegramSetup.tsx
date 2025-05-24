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
  return <div className="space-y-6" data-unique-id="66548aa0-cbb8-47e3-ae72-390cb4d9644a" data-file-name="components/TelegramSetup.tsx">
      <Card data-unique-id="2f80d5d8-df96-45a5-a6be-40c761dc531f" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="fe6962d1-bf58-42b3-ae06-e1e4d1a115d8" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="69b54620-6d90-4109-94e8-2e09abba4b4e" data-file-name="components/TelegramSetup.tsx">
            <CardTitle data-unique-id="f85141a8-0e37-4b93-a05b-e795ae3c2ef5" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="c0e8e5a2-fccd-4f8d-bcbb-790929a8fdaa" data-file-name="components/TelegramSetup.tsx">Pengaturan Bot Telegram</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="f620cca3-2c4e-4d59-844a-6002baf34b4b" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="f1567c84-513c-4acd-94d1-a3869a4f52f6" data-file-name="components/TelegramSetup.tsx">
            Konfigurasikan bot Telegram Anda untuk meneruskan pesan ke aplikasi ini
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="634458f1-e889-4a27-a988-f9bd6358d1f2" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="cf72e284-6c0f-4af6-9b8a-62273865ee17" data-file-name="components/TelegramSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="5bab5c56-a372-42da-8e87-fc8bdd903356" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="49b2a1f3-150f-4bce-ae87-b549b9b23c91" data-file-name="components/TelegramSetup.tsx">Panduan Mendapatkan Bot Token</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="7716fb89-d19b-4cca-b185-7574b5e190ea" data-file-name="components/TelegramSetup.tsx">
                <li data-unique-id="541fdc71-11c0-4f27-b7ba-f3b6d6249a11" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="9a1a19b4-96cc-44d7-94df-09957daa4dc9" data-file-name="components/TelegramSetup.tsx">Buka Telegram dan cari </span><strong data-unique-id="6a9a2e53-c4c3-4cfd-b1c8-92923410ad0d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="2d0b8608-8c12-4e9f-b4ed-30c7ffacfb47" data-file-name="components/TelegramSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="95e48e0d-dff9-4975-b8ed-05c19e7578be" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="43d10f2c-a375-4ea7-907b-07702c44ebe2" data-file-name="components/TelegramSetup.tsx">Mulai percakapan dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="7be4dd45-f2ae-4e42-a966-d72c0709cebe" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="5be4a833-9dde-4525-b481-bbf977f7e245" data-file-name="components/TelegramSetup.tsx">/start</span></code></li>
                <li data-unique-id="47c30419-9248-4e6e-9665-727029182a4f" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="cc96dc47-8c02-4d5d-b01a-11d410a8fdcd" data-file-name="components/TelegramSetup.tsx">Buat bot baru dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="4362c279-53eb-40d6-880e-8bb93d4993a5" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="ed691463-1526-4b94-b995-8879a11cba60" data-file-name="components/TelegramSetup.tsx">/newbot</span></code></li>
                <li data-unique-id="8900c716-62be-435c-99f8-a38ebd82957a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="9893ee81-6c68-4bc1-a680-7eaae576bd65" data-file-name="components/TelegramSetup.tsx">Ikuti instruksi untuk memberikan nama dan username untuk bot Anda</span></li>
                <li data-unique-id="7e16d80b-c361-42d8-810b-605ab2aece8a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="07f45109-2b4e-4ca5-905d-4be0607906eb" data-file-name="components/TelegramSetup.tsx">BotFather akan memberikan token API yang terlihat seperti: </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="4d403bf2-7e43-47c9-8738-83b04f814fe0" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="5d0d7419-d830-482a-a882-14193610de83" data-file-name="components/TelegramSetup.tsx">5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh</span></code></li>
                <li data-unique-id="aea4b4ad-8f82-4e08-b2bd-fe84cb0342a3" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="0d1c293a-e08b-4aa3-b4b1-1f47f0219a95" data-file-name="components/TelegramSetup.tsx">Salin token tersebut ke kolom Bot Token di bawah</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="c5317b49-0334-4894-8f66-a0827beaa296" data-file-name="components/TelegramSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="ecdd39e6-b224-431f-91fa-09db99626409" data-file-name="components/TelegramSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="41ed84a2-0f2b-499f-b53d-bb8cdea36b7b" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="4225b09a-1d01-4dcf-8ee6-c887f2f28660" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="27b2874c-076f-4b7b-9c82-5682f9058ec8" data-file-name="components/TelegramSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh" value={botToken} onChange={e => setBotToken(e.target.value)} data-unique-id="7d507567-bbc5-4e53-8f4d-b3350434184d" data-file-name="components/TelegramSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="68facceb-d3be-499c-882c-0544f5f4e045" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="4f71160b-1e57-4671-952b-ce2bbdca58d9" data-file-name="components/TelegramSetup.tsx">
              Dapatkan token ini dari BotFather saat Anda membuat bot
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="b3247eaa-19b6-4db6-bc8f-8079a81ac1fb" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="a704fe69-4b92-454c-b381-d6c0bb09586b" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="2dc1813c-255d-4c85-a14b-244d3edc7d11" data-file-name="components/TelegramSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="4130b510-16bb-46b0-9c17-5bcb3ef8cf1d" data-file-name="components/TelegramSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="2e35ea89-fa63-42c8-b948-ca6854074f05" data-file-name="components/TelegramSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="8c2e7b19-570a-4d52-9773-fdc2d490cb02" data-file-name="components/TelegramSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="16020674-39a1-4285-b919-359a745ab49d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="0dee0fe1-5952-4d2f-82a6-8c06d6b4aef1" data-file-name="components/TelegramSetup.tsx">
              Ini adalah URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="84c60936-dda8-48e9-8f89-04161708dd64" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            {isSettingWebhook ? <>
                <span className="animate-spin mr-2" data-unique-id="094cbf2d-0a7e-4eff-9af9-26e64b86e21b" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="3aef7998-e4b9-49df-bfc1-19843a09ba0d" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                Mengatur Webhook...
              </> : "Atur Webhook"}
          </Button>
          
          <div className="mt-6 border-t pt-6" data-unique-id="fe2164ac-399a-4c3f-9199-47d02c83e385" data-file-name="components/TelegramSetup.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="4eee0eee-8fd2-4a62-853f-7583a80fc87d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="f50ffcfd-890e-4e73-b8e9-07cd8e8e3536" data-file-name="components/TelegramSetup.tsx">Pilihan Domain Tambahan</span></h3>
            <div className="space-y-4" data-unique-id="8af4b39a-5049-4b3d-86fa-b13326b6d0bb" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              {webhookUrlOptions.map((url, index) => <div key={index} className="flex flex-col gap-2" data-is-mapped="true" data-unique-id="345a0355-e1f8-47a0-83dd-60982081953a" data-file-name="components/TelegramSetup.tsx">
                  <div className="flex gap-2" data-is-mapped="true" data-unique-id="6b798653-3b32-4552-8437-f3ef822294ee" data-file-name="components/TelegramSetup.tsx">
                    <Input type="text" value={url} readOnly className="text-sm font-mono" data-is-mapped="true" data-unique-id="c4db2c92-a9bb-4624-9b9f-bcb4575db310" data-file-name="components/TelegramSetup.tsx" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(url)} title="Salin ke clipboard" data-is-mapped="true" data-unique-id="f3d45eac-6154-4360-b8a9-16e0295020a9" data-file-name="components/TelegramSetup.tsx">
                      <Copy className="h-4 w-4" data-unique-id="aca2ee9d-3898-4f63-b40c-21e419800ca2" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true" />
                    </Button>
                  </div>
                  <Button onClick={() => {
                setWebhookUrl(url);
                handleSetWebhook();
              }} disabled={isSettingWebhook} className="w-full" size="sm" data-is-mapped="true" data-unique-id="3d30584a-85bb-4207-a322-a2fd9ad0b55b" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                    {isSettingWebhook ? <>
                        <span className="animate-spin mr-2" data-is-mapped="true" data-unique-id="eb3b3971-6b6b-4696-9d2f-fd86472f6208" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="c3e72528-61c4-4134-857e-8c2d9caa8b51" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                        Mengatur Webhook...
                      </> : "Atur Webhook untuk Domain Ini"}
                  </Button>
                </div>)}
            </div>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="995c2865-fd9b-4930-b36b-50974e35f225" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="2385a1be-cac2-42e6-b815-d8a354f664f5" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="9c61c84b-05cf-47a6-9045-af0a67bd52d8" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="610117f4-ed23-4856-b269-4cb8b9305bc8" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>

      <Card data-unique-id="a29e1106-19d5-4307-8168-b2327613d216" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="03155cbf-0ac1-4b6a-82c3-fd6521f84c0b" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="ca74065b-cb93-4c19-b65a-aa9bbdedd1fe" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            <CardTitle data-unique-id="4c54ae1e-db6a-4957-a68a-a2adc544372a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="8208b439-0832-4d95-a25b-eeebf8ce4d96" data-file-name="components/TelegramSetup.tsx">Format Pesan</span></CardTitle>
            {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="ebfc091f-5120-486d-87b8-10caa4eb9c07" data-file-name="components/TelegramSetup.tsx">
                <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="ba774572-e816-4475-9dcd-b4e2335affd1" data-file-name="components/TelegramSetup.tsx">
                Edit Format
              </span></Button> : <div className="flex gap-2" data-unique-id="911c340b-a028-4c4e-9112-bad3b79668aa" data-file-name="components/TelegramSetup.tsx">
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="3292afe2-8438-4561-be1d-9d92a51391fe" data-file-name="components/TelegramSetup.tsx">
                  <X className="h-4 w-4" /><span className="editable-text" data-unique-id="2d98f377-a986-4faa-ab6b-04127395d10a" data-file-name="components/TelegramSetup.tsx">
                  Batal
                </span></Button>
                <Button onClick={saveMessageFormat} variant="default" size="sm" disabled={isSaving} className="flex items-center gap-1" data-unique-id="29fa095b-8700-405d-9871-627afe52e16b" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                  {isSaving ? <>
                      <span className="animate-spin mr-2" data-unique-id="96d7daea-1fd5-4c79-b3f2-15060ca54aed" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="107215f3-9c67-43a2-934d-6501ce6f1a99" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                      Menyimpan...
                    </> : <>
                      <Save className="h-4 w-4" />
                      Simpan
                    </>}
                </Button>
              </div>}
          </div>
          <CardDescription><span className="editable-text" data-unique-id="2485bd0a-0585-4a09-877d-abc8276a79f8" data-file-name="components/TelegramSetup.tsx">
            Aplikasi akan memproses pesan dengan format ini
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="3131c052-c0ff-45ce-a6b3-f244c1d9750b" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {formatStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="17906b71-046f-4a0e-b052-19bcc084d64e" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="3ca6aa2e-e1ef-478c-ad3b-cce247874df6" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {formatStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="87a09f28-5839-46a3-84da-422fa3d55ed5" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="802d8283-2e61-4ffe-ad13-c7fe3fb5f928" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {isEditing ? <div className="space-y-2" data-unique-id="0913e51f-44f1-4044-b5ef-2950a6c021a6" data-file-name="components/TelegramSetup.tsx">
              <Label htmlFor="message-format" data-unique-id="43055c63-0468-4b79-8d8d-8fedc6591af7" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="19b5e76e-d051-4d83-ae40-22f8fe826ece" data-file-name="components/TelegramSetup.tsx">Edit Format Pesan</span></Label>
              <textarea id="message-format" className="w-full h-64 p-4 rounded-md font-mono text-sm bg-muted border border-input resize-none" value={messageFormat} onChange={e => setMessageFormat(e.target.value)} data-unique-id="f5a21523-5f4a-4ab6-8432-45ab1b685120" data-file-name="components/TelegramSetup.tsx" />
              <p className="text-sm text-muted-foreground" data-unique-id="5b32f68e-4ea2-4655-b22a-1e1e62351d0f" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="eea205c6-9f81-4e24-b72f-6aa0e1eeb852" data-file-name="components/TelegramSetup.tsx">
                Pastikan format pesan mengikuti struktur yang dapat diproses oleh sistem
              </span></p>
            </div> : <>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="9cb0b7fb-f340-4134-8c72-a4e3d8724110" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                {messageFormat}
              </div>
              <p className="mt-4 text-sm text-muted-foreground" data-unique-id="29496243-3d41-46ab-9fcd-272d28dc21dd" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="12449252-8c14-4e04-9943-7a96d6aaa2cd" data-file-name="components/TelegramSetup.tsx">
                Sistem akan mengekstrak nomor telepon dan nama dari pesan pembayaran dan membuat akun pengguna secara otomatis.
              </span></p>
            </>}
        </CardContent>
      </Card>
    </div>;
}