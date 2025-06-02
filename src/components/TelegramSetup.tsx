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
  return <div className="space-y-6" data-unique-id="69b70ed8-3608-452c-a2fc-77dfe37f0261" data-file-name="components/TelegramSetup.tsx">
      <Card data-unique-id="a6dabd22-3176-47d9-8c93-b7f55d4334d4" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="a59395c5-8505-4e59-ac05-2a6f209871e7" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="4528f472-3ca8-4025-bbce-5b35ba932903" data-file-name="components/TelegramSetup.tsx">
            <CardTitle data-unique-id="2feb96ba-9658-4dd6-82a4-91e10fe69dab" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="f1b748d2-e721-4b87-8c54-892a6c7c6c03" data-file-name="components/TelegramSetup.tsx">Pengaturan Bot Telegram</span></CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setShowGuide(!showGuide)} className="flex items-center gap-1" data-unique-id="11729500-5f94-4a3c-a5a0-1c5b0615c463" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              <HelpCircle className="h-4 w-4" />
              {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
            </Button>
          </div>
          <CardDescription><span className="editable-text" data-unique-id="6fa50b6d-8783-4fe7-8417-584d0a2505fc" data-file-name="components/TelegramSetup.tsx">
            Konfigurasikan bot Telegram Anda untuk meneruskan pesan ke aplikasi ini
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="15922691-0bfd-455c-aa67-84e8d5ac24c4" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {showGuide && <div className="bg-muted p-4 rounded-md mb-4 space-y-3" data-unique-id="63ff6440-c86c-4f8a-b27f-52979a829029" data-file-name="components/TelegramSetup.tsx">
              <h3 className="font-medium text-lg" data-unique-id="989d49da-0634-4c88-bdb7-7acdca35046f" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="44eaa4b4-9034-432e-8829-82f4cb39da33" data-file-name="components/TelegramSetup.tsx">Panduan Mendapatkan Bot Token</span></h3>
              <ol className="list-decimal pl-5 space-y-2" data-unique-id="501bf93a-3a17-457b-af6f-eac9fc6d5dbb" data-file-name="components/TelegramSetup.tsx">
                <li data-unique-id="1b7ba9f7-1372-4b4f-841d-9971f2dbcaa8" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="70ad7f4a-0eff-4ef4-b978-01373de4c5b0" data-file-name="components/TelegramSetup.tsx">Buka Telegram dan cari </span><strong data-unique-id="9d76fed4-0fe9-4d40-bc11-780472b75aac" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="52a43a8c-47c8-46b0-8ea4-d585737ccaa9" data-file-name="components/TelegramSetup.tsx">@BotFather</span></strong></li>
                <li data-unique-id="463e96f8-f158-48eb-a51b-c4e437fea0ce" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="b7e41760-89ac-41b3-9151-8e5f972f3c71" data-file-name="components/TelegramSetup.tsx">Mulai percakapan dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="c9e38037-bdab-4d77-82c0-b5af2c1c8717" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="f2bd1d84-2306-4dcf-9603-52c6f78e9dc6" data-file-name="components/TelegramSetup.tsx">/start</span></code></li>
                <li data-unique-id="65b2439c-a84b-4d68-88f2-d0c5a255d6fd" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="afa92e10-bb29-4250-8f96-712f2cb8cc55" data-file-name="components/TelegramSetup.tsx">Buat bot baru dengan mengetik </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="73968d86-b9ac-4fd1-93f2-0816fb378ef4" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="eb88d332-aa72-49c3-ad16-820eb5661eec" data-file-name="components/TelegramSetup.tsx">/newbot</span></code></li>
                <li data-unique-id="b070667b-2cac-4d7f-a100-58df5c8c9c3e" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="0ffddd85-b77f-419d-a35a-a25f63d5ea21" data-file-name="components/TelegramSetup.tsx">Ikuti instruksi untuk memberikan nama dan username untuk bot Anda</span></li>
                <li data-unique-id="0852f4c5-00fd-4583-9b9c-620d91f6fc29" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="51b8975d-0f7f-4128-ad94-c6385121595a" data-file-name="components/TelegramSetup.tsx">BotFather akan memberikan token API yang terlihat seperti: </span><code className="bg-muted-foreground bg-opacity-20 px-1 rounded" data-unique-id="70a5779c-76b5-469f-ae5a-1bad3048579b" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="517525c8-d182-487a-b64b-ded48db087b1" data-file-name="components/TelegramSetup.tsx">5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh</span></code></li>
                <li data-unique-id="b470a8c4-e169-41fc-82e3-1b29e638b965" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="414a3058-d63d-4194-a19a-73c485c2fce7" data-file-name="components/TelegramSetup.tsx">Salin token tersebut ke kolom Bot Token di bawah</span></li>
              </ol>
              <Button variant="outline" size="sm" onClick={openTelegramBotFather} className="flex items-center gap-1 mt-2" data-unique-id="f9fa0bb3-231e-4a27-a7d7-b7eb0238e570" data-file-name="components/TelegramSetup.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="72bf842d-6f00-4a11-b5fa-cd3ed365da02" data-file-name="components/TelegramSetup.tsx">
                Buka BotFather di Telegram
              </span></Button>
            </div>}

          <div className="space-y-2" data-unique-id="db1740d9-3b26-4efb-b6ba-4ac24295593f" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="bot-token" data-unique-id="430b1dfa-8a9d-4fa3-8ed4-209ddcde75b0" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="85603300-6863-4fcf-916c-97f55df921ea" data-file-name="components/TelegramSetup.tsx">Bot Token</span></Label>
            <Input id="bot-token" type="text" placeholder="5555555555:AAHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHHh" value={botToken} onChange={e => setBotToken(e.target.value)} data-unique-id="5185c633-6348-4a1d-9b5f-ab35344396dc" data-file-name="components/TelegramSetup.tsx" />
            <p className="text-sm text-muted-foreground" data-unique-id="14024ce2-5ca3-4453-92f6-7573bdefbd0e" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="d3e7c50e-8547-410a-a6dd-d41e769f3472" data-file-name="components/TelegramSetup.tsx">
              Dapatkan token ini dari BotFather saat Anda membuat bot
            </span></p>
          </div>

          <div className="space-y-2" data-unique-id="f332c943-da34-4877-bddb-7a201c30f810" data-file-name="components/TelegramSetup.tsx">
            <Label htmlFor="webhook-url" data-unique-id="053a6957-bb59-4247-9c59-df967523edae" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="763d74ce-491f-454c-a71e-393b3803397c" data-file-name="components/TelegramSetup.tsx">Webhook URL</span></Label>
            <div className="flex gap-2" data-unique-id="3a58b4ae-f2dc-412c-9b0b-f28ff4e94c27" data-file-name="components/TelegramSetup.tsx">
              <Input id="webhook-url" type="text" placeholder="https://your-domain.com/api/telegram/webhook" value={webhookUrl} onChange={e => setWebhookUrl(e.target.value)} data-unique-id="a8a48102-3ff9-48a5-8c0f-330dd82682cc" data-file-name="components/TelegramSetup.tsx" />
              <Button variant="outline" size="icon" onClick={() => copyToClipboard(webhookUrl)} title="Salin ke clipboard" data-unique-id="d306bea6-84a1-4300-b3a2-6027963e9faa" data-file-name="components/TelegramSetup.tsx">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground" data-unique-id="6392366b-8711-4d37-ad1a-2acb2d3ce139" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="b3cf8e30-0a71-48c4-80d0-e1d8444da11a" data-file-name="components/TelegramSetup.tsx">
              Ini adalah URL tempat Telegram akan mengirimkan notifikasi
            </span></p>
          </div>

          <Button onClick={handleSetWebhook} disabled={isSettingWebhook} className="w-full" data-unique-id="eb4cae4c-72f3-4183-930c-170ae9e5bceb" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            {isSettingWebhook ? <>
                <span className="animate-spin mr-2" data-unique-id="feeeb8cf-12c2-403b-8fc7-56f0e2e94e11" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="263aa4c3-6a29-4ddc-a116-343203c9bced" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                Mengatur Webhook...
              </> : "Atur Webhook"}
          </Button>
          
          <div className="mt-6 border-t pt-6" data-unique-id="b366e04c-5a18-45ea-b29c-6188cb70154e" data-file-name="components/TelegramSetup.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="283fa02b-b1da-4abb-8922-764b6fd22e6e" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="86fb820f-0946-485a-b15b-0dba8affbd29" data-file-name="components/TelegramSetup.tsx">Pilihan Domain Tambahan</span></h3>
            <div className="space-y-4" data-unique-id="985ccd4c-a403-40f4-adbd-21fce2130d20" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
              {webhookUrlOptions.map((url, index) => <div key={index} className="flex flex-col gap-2" data-is-mapped="true" data-unique-id="cfbe17c8-877e-49e7-9010-9d1a0f7070cf" data-file-name="components/TelegramSetup.tsx">
                  <div className="flex gap-2" data-is-mapped="true" data-unique-id="a0d77c7e-ae83-4cb8-99eb-530688b9c3b2" data-file-name="components/TelegramSetup.tsx">
                    <Input type="text" value={url} readOnly className="text-sm font-mono" data-is-mapped="true" data-unique-id="45a6fa93-919f-47dc-b4f8-07e7358e55ac" data-file-name="components/TelegramSetup.tsx" />
                    <Button variant="outline" size="icon" onClick={() => copyToClipboard(url)} title="Salin ke clipboard" data-is-mapped="true" data-unique-id="dba3ecb9-32b4-4670-b50f-a582f8f171d1" data-file-name="components/TelegramSetup.tsx">
                      <Copy className="h-4 w-4" data-unique-id="7abaa005-1b23-4055-acc8-5a9dc1ca0d5e" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true" />
                    </Button>
                  </div>
                  <Button onClick={() => {
                setWebhookUrl(url);
                handleSetWebhook();
              }} disabled={isSettingWebhook} className="w-full" size="sm" data-is-mapped="true" data-unique-id="3c9bf73e-4249-4a44-89c1-521a7f912fa4" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                    {isSettingWebhook ? <>
                        <span className="animate-spin mr-2" data-is-mapped="true" data-unique-id="a1823407-8eff-4998-97ac-c42bbdc90f38" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="164a4d4d-9762-4140-8ea2-4817d3f926f2" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                        Mengatur Webhook...
                      </> : "Atur Webhook untuk Domain Ini"}
                  </Button>
                </div>)}
            </div>
          </div>

          {setupStatus === "success" && <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="497c4277-d043-4cbe-a407-af96c6e771ad" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="574160ff-bd5a-45cc-b528-ce1b87556c7a" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}

          {setupStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="eb39b221-2ac2-4efb-835d-7c96ea9bd351" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="88cbce92-34ab-4a49-88ae-14bf105e3425" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>

      <Card data-unique-id="e00dc06b-1dc7-4f1c-865e-ca135cefc1d0" data-file-name="components/TelegramSetup.tsx">
        <CardHeader data-unique-id="5d0c056f-c334-42b4-bdd8-ae24f02fd5b5" data-file-name="components/TelegramSetup.tsx">
          <div className="flex items-center justify-between" data-unique-id="1fb0737b-6b7c-45dc-8bb4-0fd196dc0381" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
            <CardTitle data-unique-id="c48da353-5976-48e8-8a3c-ad39ae6d4f75" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="f86414c4-d8b5-4121-b13f-1417b9ff3102" data-file-name="components/TelegramSetup.tsx">Format Pesan</span></CardTitle>
            {!isEditing ? <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="7e6dad58-290d-4874-b036-382d4cf4ca96" data-file-name="components/TelegramSetup.tsx">
                <Edit className="h-4 w-4" /><span className="editable-text" data-unique-id="4d47bc8c-19bd-4a6f-8fa7-260fea554e1f" data-file-name="components/TelegramSetup.tsx">
                Edit Format
              </span></Button> : <div className="flex gap-2" data-unique-id="f57c76bb-ea6e-459f-9325-0657282b8d9e" data-file-name="components/TelegramSetup.tsx">
                <Button onClick={() => setIsEditing(false)} variant="outline" size="sm" className="flex items-center gap-1" data-unique-id="81d28713-0c29-459e-9357-d111d261946e" data-file-name="components/TelegramSetup.tsx">
                  <X className="h-4 w-4" /><span className="editable-text" data-unique-id="09fdd3a7-f1e4-4bd1-bce0-9edb4749dea0" data-file-name="components/TelegramSetup.tsx">
                  Batal
                </span></Button>
                <Button onClick={saveMessageFormat} variant="default" size="sm" disabled={isSaving} className="flex items-center gap-1" data-unique-id="b7f3b26e-e76d-43a2-bb94-2b0fd1ad14cb" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                  {isSaving ? <>
                      <span className="animate-spin mr-2" data-unique-id="d3b0005d-9036-4350-bec6-964cfd85b362" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="5e098574-d496-4e98-aa01-61884c0e12c7" data-file-name="components/TelegramSetup.tsx">⏳</span></span>
                      Menyimpan...
                    </> : <>
                      <Save className="h-4 w-4" />
                      Simpan
                    </>}
                </Button>
              </div>}
          </div>
          <CardDescription><span className="editable-text" data-unique-id="40491a79-cba3-4bd7-8824-d986e51a97cb" data-file-name="components/TelegramSetup.tsx">
            Aplikasi akan memproses pesan dengan format ini
          </span></CardDescription>
        </CardHeader>
        <CardContent data-unique-id="e9d83fc1-163a-4022-b5e8-0782f38772c4" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
          {formatStatus === "success" && <div className="mb-4 bg-green-50 text-green-800 p-3 rounded-md flex items-center" data-unique-id="ac9f2ae6-a212-41ef-96b9-7e143800fd4f" data-file-name="components/TelegramSetup.tsx">
              <CheckCircle2 className="h-5 w-5 mr-2" />
              <span data-unique-id="a8f15b41-4aa9-49e2-a23f-c2cd153f231d" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {formatStatus === "error" && <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="6c5bfc82-6b6a-405b-8d1e-f11c6d415e6c" data-file-name="components/TelegramSetup.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="01fc4ccf-adab-46d4-84fe-85229c2914be" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">{formatMessage}</span>
            </div>}
          
          {isEditing ? <div className="space-y-2" data-unique-id="29ee8b19-e689-4638-87b3-c128fa98177b" data-file-name="components/TelegramSetup.tsx">
              <Label htmlFor="message-format" data-unique-id="93894eb9-4653-408c-bff9-4857e946692d" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="c42001ed-8eca-4192-aaa7-36904a4218f4" data-file-name="components/TelegramSetup.tsx">Edit Format Pesan</span></Label>
              <textarea id="message-format" className="w-full h-64 p-4 rounded-md font-mono text-sm bg-muted border border-input resize-none" value={messageFormat} onChange={e => setMessageFormat(e.target.value)} data-unique-id="fec2a45f-77fe-475a-a52b-a1207fd0acfb" data-file-name="components/TelegramSetup.tsx" />
              <p className="text-sm text-muted-foreground" data-unique-id="7c5bd87e-be04-4541-8bcd-a1607d828152" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="219dc9f0-524b-4d2f-941a-070c94084d43" data-file-name="components/TelegramSetup.tsx">
                Pastikan format pesan mengikuti struktur yang dapat diproses oleh sistem
              </span></p>
            </div> : <>
              <div className="bg-muted p-4 rounded-md font-mono text-sm whitespace-pre-wrap" data-unique-id="43ce0242-2c70-46ab-b7cb-33fcc1871be3" data-file-name="components/TelegramSetup.tsx" data-dynamic-text="true">
                {messageFormat}
              </div>
              <p className="mt-4 text-sm text-muted-foreground" data-unique-id="3fda5b77-2976-4f80-a995-1a54c07c81a0" data-file-name="components/TelegramSetup.tsx"><span className="editable-text" data-unique-id="75129790-a622-4842-976d-ab4c50ba35df" data-file-name="components/TelegramSetup.tsx">
                Sistem akan mengekstrak nomor telepon dan nama dari pesan pembayaran dan membuat akun pengguna secara otomatis.
              </span></p>
            </>}
        </CardContent>
      </Card>
    </div>;
}