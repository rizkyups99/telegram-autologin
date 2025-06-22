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
  return <div className="space-y-6" data-unique-id="1f60712f-aef2-4d93-8ea0-9cc3a03726bd" data-file-name="components/TelegramSetup.tsx">
      <Card data-unique-id="1c7c6057-bd37-4ba5-806a-49e96ad4f942" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="686f4184-4454-4340-8bfc-356e03f305ba" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="003d18f5-2cb6-43e7-9e06-a836165705d6" data-file-name="components/TelegramSetup.tsx">
            <CardTitle data-unique-id="85419da4-630d-4e68-b512-4c5e39f5b34c" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="a8309968-cf6c-427d-96aa-bfc560eca5a0" data-file-name="components/TelegramSetup.tsx">Pengaturan Bot Telegram</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="13ac72a8-423f-40ad-9435-fe94ada775a6" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="33a7cce9-8e82-4222-b607-0794447a025a" data-file-name="components/TelegramSetup.tsx">
            Konfigurasikan bot Telegram Anda untuk meneruskan pesan ke aplikasi ini
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="e4f1ff5a-6011-4eb6-9ccd-650ca37e62da" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="345d6a40-f4de-47dc-9f4c-b1aadd6c11d4" data-file-name="components/TelegramSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="71244b41-5c4e-4ad5-bf0c-a46ffdeacb0c" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="645aafba-a341-443e-8859-8d57c5eccae0" data-file-name="components/TelegramSetup.tsx">Panduan Mendapatkan Bot Token</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="a6af56df-1982-47c8-8acf-b32e388fa5c7" data-file-name="components/TelegramSetup.tsx">
                <li data-unique-id="13e5886c-280e-4995-9c83-8e1f336559be" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="b7c38a1b-9e0d-4f0d-8bd7-482802f34984" data-file-name="components/TelegramSetup.tsx">Buka Telegram dan cari </span><strong data-unique-id="0080e0d1-38e0-494b-ad23-092097dd1904" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="607fd8e9-f4ab-488d-a684-6ccc5ed617f2" data-file-name="components/TelegramSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="ecb5b4e3-aac0-418c-bd3b-f3563b8c173e" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="df1de0b0-c74e-468e-8688-b9d3c20844f5" data-file-name="components/TelegramSetup.tsx">Mulai percakapan dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="75c98816-ee48-4a22-a09d-7a77dcffb076" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="1eb6c04c-87a3-42d9-b761-e05e99fd4523" data-file-name="components/TelegramSetup.tsx">/start</span></code></li>
                <li data-unique-id="cfe51ee3-df7e-4583-be09-3edeca48e848" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="09259ec0-ca0a-443d-af4a-5c284da7bd76" data-file-name="components/TelegramSetup.tsx">Buat bot baru dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="ad155b03-9972-403d-a105-c523c1327c97" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="784695c8-1fc6-4f8e-b178-e2225f6a39e0" data-file-name="components/TelegramSetup.tsx">/newbot</span></code></li>
                <li data-unique-id="fe82ec1e-9170-4228-9342-3a47c543e52f" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="15444939-2832-4218-8e67-2c8b6c4b2a53" data-file-name="components/TelegramSetup.tsx">Ikuti instruksi untuk memberikan nama dan username untuk bot Anda</span></li>
                <li data-unique-id="0d9c27d1-809f-4a1d-a032-a6973a1ac9a8" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="7fd77bb7-ccf1-4cb0-9c66-b4e3be8f56b2" data-file-name="components/TelegramSetup.tsx">BotFather akan memberikan token API yang terlihat seperti: </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="1fd3b3ca-ec6f-4b2f-998e-754ece2a0fa7" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="f8d066c2-9ce6-4458-91c3-20c97629fd3a" data-file-name="components/TelegramSetup.tsx">5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh</span></code></li>
                <li data-unique-id="2cf03a3d-e98f-4466-afb2-8dea067fa5f3" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="20a9b4f2-5b8f-40a8-b17b-06ad96069e59" data-file-name="components/TelegramSetup.tsx">Salin token tersebut ke kolom Bot Token di bawah</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="da29fceb-f730-4825-b917-97a15ac5e286" data-file-name="components/TelegramSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="4d7ee216-6f48-423f-9dd5-8415ecaf2e27" data-file-name="components/TelegramSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="00c76e7f-df25-46e9-b21c-18b39c12eee1" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="cb73aeed-10ca-4b04-a1ed-182201ac1a24" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="4e0689bb-e337-42f2-9d65-aaba49a0ead6" data-file-name="components/TelegramSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh" value={botToken} onChange={e => setBotToken(e.target.value)} data-unique-id="85698110-6254-423c-a33a-15ad06f275a6" data-file-name="components/TelegramSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="b734a896-5eba-42b0-ab26-53f857311349" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="02a15fa6-5c6d-4a5d-85fc-1cc4b4138cb9" data-file-name="components/TelegramSetup.tsx">
              Dapatkan token ini dari BotFather saat Anda membuat bot
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="04f3b964-0fcc-44b6-8b00-22542c6474a9" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="559d42e4-b51e-48b9-9d19-dbae3a35391a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="0590cc99-7153-46b1-bc97-027f83fcb8ad" data-file-name="components/TelegramSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="a3c74ff6-2068-4c6c-a67f-32fb23435cb3" data-file-name="components/TelegramSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="86d24e9d-d3e2-4560-9b1c-781d00b3d94b" data-file-name="components/TelegramSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="edce46f1-20c9-4be4-bf88-1c2119df39b8" data-file-name="components/TelegramSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="52693e63-c9e0-4369-b286-c1aff2f3a537" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="574781e8-e99a-4b79-a0c8-370289b17dad" data-file-name="components/TelegramSetup.tsx">
              Ini adalah URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="f4e16e91-e24b-41e7-9a6b-1d0f418bf186" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            {isSettingWebhook ? <>
                <span className="animate-spin mr-2" data-unique-id="8b7069bd-0b37-45f8-bb50-f5d3dc14db7c" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="a9f84257-21e4-4bb7-9820-b847ac85e238" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                Mengatur Webhook...
              </> : "Atur Webhook"}
          </Button>
          
          <div className="mt-6 border-t pt-6" data-unique-id="890cb874-14f6-463e-ad7a-168baae5ca59" data-file-name="components/TelegramSetup.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="a73ec59f-79e5-481b-bb30-874f41ec49a1" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="f7bd14ef-954f-4369-b55f-a6e141a9a855" data-file-name="components/TelegramSetup.tsx">Pilihan Domain Tambahan</span></h3>
            <div className="space-y-4" data-unique-id="a109b44f-4ef4-4d88-ba41-650c8d28b23f" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              {webhookUrlOptions.map((url, index) => <div key={index} className="flex flex-col gap-2" data-is-mapped="true" data-unique-id="5ee1d7d0-72d1-48b6-ab01-ffd0bb9cb760" data-file-name="components/TelegramSetup.tsx">
                  <div className="flex gap-2" data-is-mapped="true" data-unique-id="ad89b29a-a08f-4005-8ab1-c1cfa52d96f4" data-file-name="components/TelegramSetup.tsx">
                    <Input type="text" value={url} readOnly className="text-sm font-mono" data-is-mapped="true" data-unique-id="dd0e133b-273d-45fe-b769-a8c86dd65655" data-file-name="components/TelegramSetup.tsx" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(url)} title="Salin ke clipboard" data-is-mapped="true" data-unique-id="650a8352-26ed-48c8-a05e-5f26100cd985" data-file-name="components/TelegramSetup.tsx">
                      <Copy className="h-4 w-4" data-unique-id="3222647c-52da-406f-a0c5-706b5cb024a5" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true" />
                    </Button>
                  </div>
                  <Button onClick={() => {
                setWebhookUrl(url);
                handleSetWebhook();
              }} disabled={isSettingWebhook} className="w-full" size="sm" data-is-mapped="true" data-unique-id="8d2d58f3-13bd-4d56-a67e-e915d95ea08b" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                    {isSettingWebhook ? <>
                        <span className="animate-spin mr-2" data-is-mapped="true" data-unique-id="54de9c83-b718-4e1d-b6f7-5378b84ec422" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="7d684513-6128-4d86-a20d-a92d66a449cc" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                        Mengatur Webhook...
                      </> : "Atur Webhook untuk Domain Ini"}
                  </Button>
                </div>)}
            </div>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="c01b9ecd-d0de-403b-8823-33992e17f90a" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="87320583-65d9-4210-baad-284750a891a0" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="3cd49d23-795a-4afe-a815-da542a9444f8" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="1a13fa1e-3ade-46cc-b508-ede3c203107d" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>

      <Card data-unique-id="90560649-57ee-4db6-af23-449a53cfbae0" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="c61ddf7c-64e1-4375-ad88-1fd1102a8f64" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="cf759eb2-edc1-4e5b-ba69-ae5e55ab1eac" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            <CardTitle data-unique-id="8fed40cd-2ac9-463a-bde3-5d785fafc00a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="fa9fde82-8166-49a6-aaea-e78950cf28df" data-file-name="components/TelegramSetup.tsx">Format Pesan</span></CardTitle>
            {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="3f91057c-4199-4ca6-a11c-ae499df1730c" data-file-name="components/TelegramSetup.tsx">
                <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="5c9c0ba5-d3c3-4d6d-9bb0-4d2fa4569599" data-file-name="components/TelegramSetup.tsx">
                Edit Format
              </span></Button> : <div className="flex gap-2" data-unique-id="67da2c34-8da3-4a61-b8c1-89b2c5eb3fc3" data-file-name="components/TelegramSetup.tsx">
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="11960f1f-b11f-43f5-8189-f688298d44a3" data-file-name="components/TelegramSetup.tsx">
                  <X className="h-4 w-4" /><span className="editable-text" data-unique-id="6a595c0d-32d6-42d1-9fd8-3b97ccc395a2" data-file-name="components/TelegramSetup.tsx">
                  Batal
                </span></Button>
                <Button onClick={saveMessageFormat} variant="default" size="sm" disabled={isSaving} className="flex items-center gap-1" data-unique-id="0838c4b6-edc5-41ef-af9b-8e600dcd3bca" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                  {isSaving ? <>
                      <span className="animate-spin mr-2" data-unique-id="a69284db-ec81-486f-9d6c-ca3ef7e82b68" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="aa6d1e3b-d578-443e-9db9-333650830bc5" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                      Menyimpan...
                    </> : <>
                      <Save className="h-4 w-4" />
                      Simpan
                    </>}
                </Button>
              </div>}
          </div>
          <CardDescription><span className="editable-text" data-unique-id="82024204-3a8d-4638-86bc-4a64b8c229b7" data-file-name="components/TelegramSetup.tsx">
            Aplikasi akan memproses pesan dengan format ini
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="70ef2003-a41f-4a74-88ba-354c7b859941" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {formatStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="d2386a20-5b16-4603-a8a0-9a604495f67a" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="00db1284-5434-474d-b569-e39b34c6dac0" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {formatStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="7cd04ef1-dd89-4628-9549-8a3da75a79a5" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="ebb33eaf-4d49-4772-91f5-54f0d51655fb" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {isEditing ? <div className="space-y-2" data-unique-id="fa93a3d4-2d2e-487d-8209-f91808e2daa5" data-file-name="components/TelegramSetup.tsx">
              <Label htmlFor="message-format" data-unique-id="af19db76-ec51-4664-9e39-e4e50ed53ba6" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="b8920332-bad3-410d-b7cf-8d4b9bc5c907" data-file-name="components/TelegramSetup.tsx">Edit Format Pesan</span></Label>
              <textarea id="message-format" className="w-full h-64 p-4 rounded-md font-mono text-sm bg-muted border border-input resize-none" value={messageFormat} onChange={e => setMessageFormat(e.target.value)} data-unique-id="e568326e-c5ce-494e-8112-95d3cdb7b1e2" data-file-name="components/TelegramSetup.tsx" />
              <p className="text-sm text-muted-foreground" data-unique-id="ffdaff9e-63dd-4e1e-af7a-bb186051ffaf" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="5114db55-5f2a-4818-bdf7-9c5828b8d99c" data-file-name="components/TelegramSetup.tsx">
                Pastikan format pesan mengikuti struktur yang dapat diproses oleh sistem
              </span></p>
            </div> : <>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="41c98378-242e-4e0f-a2ec-127a60719af8" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                {messageFormat}
              </div>
              <p className="mt-4 text-sm text-muted-foreground" data-unique-id="c7d4c601-4455-4cee-a710-855b957d903f" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="b8e0c65d-d9b9-49ad-a477-0952ed4ec77e" data-file-name="components/TelegramSetup.tsx">
                Sistem akan mengekstrak nomor telepon dan nama dari pesan pembayaran dan membuat akun pengguna secara otomatis.
              </span></p>
            </>}
        </CardContent>
      </Card>
    </div>;
}