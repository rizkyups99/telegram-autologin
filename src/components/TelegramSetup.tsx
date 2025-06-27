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
  return <div className="space-y-6" data-unique-id="4f5688a6-43f7-4a4b-8dda-abe692d18ef5" data-file-name="components/TelegramSetup.tsx">
      <Card data-unique-id="e0a65551-0b44-4c03-a339-2bdcb354e78e" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="425000d8-f7ec-4d74-a5bc-eb881d1c77dc" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="f4816c4b-ea0b-44dc-a9e2-3ac397110614" data-file-name="components/TelegramSetup.tsx">
            <CardTitle data-unique-id="6825603c-be4d-4811-ab76-381b7a8ffa3b" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="26087cf9-c14a-4bcd-8d45-3c286c062700" data-file-name="components/TelegramSetup.tsx">Pengaturan Bot Telegram</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="8c48bf83-a622-4baf-bcd3-193b3df8f4f6" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="c7c33318-4e49-4d4c-9633-201cc7eb3b74" data-file-name="components/TelegramSetup.tsx">
            Konfigurasikan bot Telegram Anda untuk meneruskan pesan ke aplikasi ini
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="e87dc13d-0de4-4690-ba80-4d18f3b5bd4d" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="adad1d0a-5788-46dd-a580-940a6454b410" data-file-name="components/TelegramSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="a16ce30d-04f7-48d3-a33f-ad8fc58aa14b" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="631df185-87dd-4688-b21f-aecf5552af00" data-file-name="components/TelegramSetup.tsx">Panduan Mendapatkan Bot Token</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="aaad1b4c-1eb7-4fcd-a739-c37c30a39fa8" data-file-name="components/TelegramSetup.tsx">
                <li data-unique-id="729c1c6d-64c0-4441-a19f-1e45af7e421e" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="65cf294b-35c0-4fe9-92fd-76f139e08276" data-file-name="components/TelegramSetup.tsx">Buka Telegram dan cari </span><strong data-unique-id="035aee62-6b3a-466d-aefc-5c3fe71d8751" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="880737b7-25ee-40c9-8c23-8536b3bdc3e3" data-file-name="components/TelegramSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="1304484c-b809-4f07-8b26-53fd7f35689c" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="eab97d76-f3e8-46cb-8b69-0982fb7fe9b1" data-file-name="components/TelegramSetup.tsx">Mulai percakapan dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="ab131fa6-332c-4187-9a96-fb8aa0fbac27" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="d8be4dab-bf91-4171-98ed-392c69b05455" data-file-name="components/TelegramSetup.tsx">/start</span></code></li>
                <li data-unique-id="3d6b3f63-695f-4da4-8463-91642eb375b2" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="3c64e47e-e667-457a-bd36-664d96b67932" data-file-name="components/TelegramSetup.tsx">Buat bot baru dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="3a800de4-9f00-43ec-99c8-82ce6d19dd83" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="6f189fae-de06-4390-8690-a35bce175d69" data-file-name="components/TelegramSetup.tsx">/newbot</span></code></li>
                <li data-unique-id="5e806555-69b8-4e74-ae2a-04c023cb0c00" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="e9d41ee8-f60a-4e28-a5ba-6a4d54243b00" data-file-name="components/TelegramSetup.tsx">Ikuti instruksi untuk memberikan nama dan username untuk bot Anda</span></li>
                <li data-unique-id="c20eeadb-e585-4c13-923e-fb4a5ed45672" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="9216a5a0-4f78-42dc-a6c2-fe0f8afabe8a" data-file-name="components/TelegramSetup.tsx">BotFather akan memberikan token API yang terlihat seperti: </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="0ff8cfb1-8abb-4219-8382-efdadc8e30e9" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="ef067c58-c107-48e8-9bd6-1b471eff776e" data-file-name="components/TelegramSetup.tsx">5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh</span></code></li>
                <li data-unique-id="b1da2889-dd05-4c02-b800-a8d85fc015fb" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="c4226eab-937a-4461-afdc-c131f1492ad4" data-file-name="components/TelegramSetup.tsx">Salin token tersebut ke kolom Bot Token di bawah</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="6d3b291a-b324-47d9-9326-957b26dac138" data-file-name="components/TelegramSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="a190f8b9-eb7b-4707-aabd-fe1014446f84" data-file-name="components/TelegramSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="0736d798-d028-48e0-92b1-ff60908b74c9" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="10f057a7-dac5-4662-bfb2-9ab2f8327826" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="afe916fc-c336-49f0-a98e-8fb9543fd317" data-file-name="components/TelegramSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh" value={botToken} onChange={e => setBotToken(e.target.value)} data-unique-id="1c776ceb-fa13-42a0-82cd-e218761c876a" data-file-name="components/TelegramSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="873a5f24-c649-485f-9119-98185c43f96d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="bf4c6bdb-ff2e-4cc6-957d-728f3fc65586" data-file-name="components/TelegramSetup.tsx">
              Dapatkan token ini dari BotFather saat Anda membuat bot
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="c676bfb7-0885-432f-810c-c66f17e97602" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="73cd7a49-3ce4-4c9c-949d-24aa4c69aaa5" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="f9f08968-07e1-45c5-8881-1d5e442bab4d" data-file-name="components/TelegramSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="3c396f52-2552-4735-9b0e-a42271185d0a" data-file-name="components/TelegramSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="df5dd197-62da-4e25-9f70-a50705bb237c" data-file-name="components/TelegramSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="e539d5a7-4070-4225-b3d5-9391aa5d7de1" data-file-name="components/TelegramSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="351ab55e-6e36-4e4e-a510-fdb122abd660" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="0935d83c-e62a-440a-8f8f-3b2fdc40c254" data-file-name="components/TelegramSetup.tsx">
              Ini adalah URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="488b8e43-f781-454f-b234-48e77f7ac483" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            {isSettingWebhook ? <>
                <span className="animate-spin mr-2" data-unique-id="208a70bd-1a40-4e33-834d-cd65a835a8c2" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="58e73a28-b22c-4901-83cc-e8cae65c9fc9" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                Mengatur Webhook...
              </> : "Atur Webhook"}
          </Button>
          
          <div className="mt-6 border-t pt-6" data-unique-id="008bd95c-6b6f-4fca-b6f1-a89be9e84f21" data-file-name="components/TelegramSetup.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="e3224a8e-a52c-4759-b8c1-3ba029238e45" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="a1996508-9c8d-40c0-b88f-52bc196a3ed8" data-file-name="components/TelegramSetup.tsx">Pilihan Domain Tambahan</span></h3>
            <div className="space-y-4" data-unique-id="3a79effd-417e-4b28-9836-5746c3c7d807" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              {webhookUrlOptions.map((url, index) => <div key={index} className="flex flex-col gap-2" data-is-mapped="true" data-unique-id="0111a40f-1a33-4ad0-ba57-631807307a01" data-file-name="components/TelegramSetup.tsx">
                  <div className="flex gap-2" data-is-mapped="true" data-unique-id="1566a748-be7f-4a03-882c-5846c5febbd5" data-file-name="components/TelegramSetup.tsx">
                    <Input type="text" value={url} readOnly className="text-sm font-mono" data-is-mapped="true" data-unique-id="fb84391f-f608-4117-8a34-fd6c83c1bba6" data-file-name="components/TelegramSetup.tsx" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(url)} title="Salin ke clipboard" data-is-mapped="true" data-unique-id="9e81b992-ed02-47b0-a172-149051e99974" data-file-name="components/TelegramSetup.tsx">
                      <Copy className="h-4 w-4" data-unique-id="f1e4b225-b018-4614-8994-d8590bf15762" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true" />
                    </Button>
                  </div>
                  <Button onClick={() => {
                setWebhookUrl(url);
                handleSetWebhook();
              }} disabled={isSettingWebhook} className="w-full" size="sm" data-is-mapped="true" data-unique-id="f4511eee-2b78-4939-89ad-56def01b962d" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                    {isSettingWebhook ? <>
                        <span className="animate-spin mr-2" data-is-mapped="true" data-unique-id="91423304-2c12-4d25-a508-2444ef753821" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="44c43932-6fc3-4c97-9c3a-07106cdb4f55" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                        Mengatur Webhook...
                      </> : "Atur Webhook untuk Domain Ini"}
                  </Button>
                </div>)}
            </div>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="4c32e6a9-a4f8-4d85-a674-44116c3e64a7" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="890762b1-bca7-4561-851f-d77c0ad8ae2b" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="12778eca-f644-496b-9975-38be2fd89a59" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="5b39a4d1-2c5a-4cc6-bf6f-ef5f1c06931c" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>

      <Card data-unique-id="4d347d38-1b43-4fa4-bf90-592eb9e52acc" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="708c4a53-a84b-49f1-a8ef-a3970c3dae38" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="eceaceed-df46-4f32-b347-cffcd7f6988f" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            <CardTitle data-unique-id="3ef35191-7dba-48af-abe4-749fd92d542a" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="eb277cac-f96d-4e39-aa62-c065624c90eb" data-file-name="components/TelegramSetup.tsx">Format Pesan</span></CardTitle>
            {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="ff8a9c41-cb03-4609-aca3-5f2f149950cd" data-file-name="components/TelegramSetup.tsx">
                <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="1d98bbad-ab38-4c10-a07f-820e3699bcc7" data-file-name="components/TelegramSetup.tsx">
                Edit Format
              </span></Button> : <div className="flex gap-2" data-unique-id="28118e74-6fc2-4453-856d-4b2ebbb42fbe" data-file-name="components/TelegramSetup.tsx">
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="be1aee2f-da6e-4a01-8bac-5320a9c9ec47" data-file-name="components/TelegramSetup.tsx">
                  <X className="h-4 w-4" /><span className="editable-text" data-unique-id="5e0939e9-8036-4808-a549-07ed431e222e" data-file-name="components/TelegramSetup.tsx">
                  Batal
                </span></Button>
                <Button onClick={saveMessageFormat} variant="default" size="sm" disabled={isSaving} className="flex items-center gap-1" data-unique-id="1b295816-7e1d-413b-a5c9-784d81b07b7a" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                  {isSaving ? <>
                      <span className="animate-spin mr-2" data-unique-id="edde7e2c-6a14-4997-a9f0-20cf9bc2cd2c" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="aa27499b-21ff-4993-99c7-e2a641952e37" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                      Menyimpan...
                    </> : <>
                      <Save className="h-4 w-4" />
                      Simpan
                    </>}
                </Button>
              </div>}
          </div>
          <CardDescription><span className="editable-text" data-unique-id="343eccba-3c29-4b41-bf2f-18d151c1366b" data-file-name="components/TelegramSetup.tsx">
            Aplikasi akan memproses pesan dengan format ini
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="c207b847-69aa-4d53-817c-47f3a19acd7d" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {formatStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="0d55a006-3af1-44aa-827d-801a9b1fc70d" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="b8c578f9-ea6d-4314-a450-37370c5153fc" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {formatStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="b7b36105-8267-4ce8-8304-b2a2f7541aad" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="0e69f974-0ae4-4766-9a33-e2011b3b0791" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {isEditing ? <div className="space-y-2" data-unique-id="459a54d9-1f8d-46e0-914c-131351bc3ab6" data-file-name="components/TelegramSetup.tsx">
              <Label htmlFor="message-format" data-unique-id="86315d59-d62a-4126-b830-816e9c203bae" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="7f461d5f-c8a5-41d8-9fbd-5e0c8f64f629" data-file-name="components/TelegramSetup.tsx">Edit Format Pesan</span></Label>
              <textarea id="message-format" className="w-full h-64 p-4 rounded-md font-mono text-sm bg-muted border border-input resize-none" value={messageFormat} onChange={e => setMessageFormat(e.target.value)} data-unique-id="d8975c66-d81b-492c-a9ff-d87bfd363f99" data-file-name="components/TelegramSetup.tsx" />
              <p className="text-sm text-muted-foreground" data-unique-id="dca957fa-3afd-4969-b963-048face10567" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="36a9c587-c5b0-4ac5-9ba3-1d384e282ae2" data-file-name="components/TelegramSetup.tsx">
                Pastikan format pesan mengikuti struktur yang dapat diproses oleh sistem
              </span></p>
            </div> : <>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="4563d5e4-53d7-40ee-9a81-4d90f839de56" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                {messageFormat}
              </div>
              <p className="mt-4 text-sm text-muted-foreground" data-unique-id="268f1b79-d4e3-4e72-b995-306e28e988fc" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="248a94e3-a31c-42c1-aa9e-ce1b41cc4918" data-file-name="components/TelegramSetup.tsx">
                Sistem akan mengekstrak nomor telepon dan nama dari pesan pembayaran dan membuat akun pengguna secara otomatis.
              </span></p>
            </>}
        </CardContent>
      </Card>
    </div>;
}