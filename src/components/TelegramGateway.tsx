"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { QrCode, RefreshCw, Smartphone, Loader2, CheckCircle2, XCircle, Info } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

// TDLib API configuration
const API_ID = 94575; // Example API ID - replace with your actual API ID
const API_HASH = "a3406de8d171bb422bb6ddf3bbd800e2"; // Example API Hash - replace with your actual API Hash

interface LoginToken {
  expires: number;
  token: string;
}
export default function TelegramGateway() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [loginToken, setLoginToken] = useState<LoginToken | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "connecting" | "connected" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState(0);
  const [pollingInterval, setPollingInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Function to generate QR code for Telegram login
  const generateQrCode = async () => {
    setIsGenerating(true);
    setConnectionStatus("connecting");
    setStatusMessage("Menghubungkan ke Telegram...");
    try {
      // Call the API to get a login token
      const response = await fetch("/api/telegram/login-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          apiId: API_ID,
          apiHash: API_HASH
        })
      });
      if (!response.ok) {
        throw new Error("Failed to get login token");
      }
      const data = await response.json();
      if (!data.token) {
        throw new Error("Invalid login token response");
      }

      // Store the login token
      const tokenData: LoginToken = {
        expires: data.expires || Math.floor(Date.now() / 1000) + 30,
        // Default 30 seconds expiry
        token: data.token
      };
      setLoginToken(tokenData);

      // Create the QR code URL
      // The token must be encoded using base64url and embedded in a tg://login?token=base64encodedtoken URL
      const base64Token = btoa(data.token).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      const loginUrl = `tg://login?token=${base64Token}`;
      setQrCodeUrl(loginUrl);

      // Set countdown based on token expiration
      const expiresInSeconds = tokenData.expires - Math.floor(Date.now() / 1000);
      setCountdown(expiresInSeconds > 0 ? expiresInSeconds : 30);
      setStatusMessage("Scan QR code dengan aplikasi Telegram di perangkat Anda");

      // Start polling for login status
      startPollingLoginStatus(data.token);
    } catch (error) {
      console.error("Error generating QR code:", error);
      setConnectionStatus("error");
      setStatusMessage("Gagal menghubungkan ke Telegram. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Function to poll for login status
  const startPollingLoginStatus = (token: string) => {
    // Clear any existing polling interval
    if (pollingInterval) {
      clearInterval(pollingInterval);
    }

    // Poll every 2 seconds
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/telegram/check-login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token
          })
        });
        if (!response.ok) {
          throw new Error("Failed to check login status");
        }
        const data = await response.json();
        if (data.status === "success") {
          // Login successful
          clearInterval(interval);
          setPollingInterval(null);
          setConnectionStatus("connected");
          setStatusMessage("Perangkat berhasil terhubung dengan Telegram!");
          setQrCodeUrl(null);
          setCountdown(0);

          // Save connection status and auth data to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem("telegramDeviceConnected", "true");
            localStorage.setItem("telegramDeviceConnectedAt", new Date().toISOString());
            localStorage.setItem("telegramAuthData", JSON.stringify(data.authorization));
          }
        } else if (data.status === "waiting") {
          // Still waiting for login
        } else if (data.status === "error") {
          // Error occurred
          clearInterval(interval);
          setPollingInterval(null);
          setConnectionStatus("error");
          setStatusMessage(data.message || "Terjadi kesalahan saat login");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    }, 2000);
    setPollingInterval(interval);

    // Clean up interval on component unmount
    return () => {
      clearInterval(interval);
    };
  };

  // Countdown timer for QR code expiration
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && qrCodeUrl) {
      // QR code expired
      setQrCodeUrl(null);
      setConnectionStatus("idle");
      setStatusMessage("QR code telah kedaluwarsa. Silakan generate QR code baru.");

      // Clear polling interval
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  }, [countdown, qrCodeUrl, pollingInterval]);

  // Check if device is already connected on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isConnected = localStorage.getItem("telegramDeviceConnected") === "true";
      const connectedAt = localStorage.getItem("telegramDeviceConnectedAt");
      if (isConnected && connectedAt) {
        setConnectionStatus("connected");
        setStatusMessage(`Perangkat terhubung sejak ${new Date(connectedAt).toLocaleString()}`);
      }
    }

    // Clean up polling interval on component unmount
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, []);

  // Function to disconnect device
  const disconnectDevice = async () => {
    try {
      // Call API to logout if needed
      if (typeof window !== 'undefined') {
        const authData = localStorage.getItem("telegramAuthData");
        if (authData) {
          await fetch("/api/telegram/logout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: authData
          });
        }

        // Clear local storage
        localStorage.removeItem("telegramDeviceConnected");
        localStorage.removeItem("telegramDeviceConnectedAt");
        localStorage.removeItem("telegramAuthData");
      }

      // Reset state
      setConnectionStatus("idle");
      setStatusMessage("");
      setQrCodeUrl(null);
      setCountdown(0);
    } catch (error) {
      console.error("Error disconnecting device:", error);
      setStatusMessage("Gagal memutuskan koneksi. Silakan coba lagi.");
    }
  };
  return <div className="space-y-6" data-unique-id="f8476639-7df8-49d6-87df-7f4ec79c94f4" data-file-name="components/TelegramGateway.tsx">
      <Card data-unique-id="bf5619df-31fb-4ca0-a81f-ecb3b76958ad" data-file-name="components/TelegramGateway.tsx">
        <CardHeader data-unique-id="6e796004-ef42-4c07-aef0-be0b0653e8f9" data-file-name="components/TelegramGateway.tsx">
          <CardTitle data-unique-id="462c966c-cba5-4604-9b99-c7666da85f47" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="c69f2cef-6c7c-4bc0-a010-4b1a0bdc68aa" data-file-name="components/TelegramGateway.tsx">Gateway Telegram</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="e645ab2c-684b-401e-8009-9693b1e7837c" data-file-name="components/TelegramGateway.tsx">
            Hubungkan perangkat desktop Anda dengan Telegram Web melalui QR code
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="a16372ac-5d0e-44d8-9c69-a49ec398b966" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted" data-unique-id="f3f02470-7c19-4661-a708-26f6c7977e27" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
            {connectionStatus === "connected" ? <div className="flex flex-col items-center space-y-4 py-8" data-unique-id="030b66ca-4fd1-410e-a080-6b79a2bcb234" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center" data-unique-id="aba523a8-c588-4e89-b2d0-053a0c5e165e" data-file-name="components/TelegramGateway.tsx">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-700" data-unique-id="e2c5f7bc-0df8-4302-8eae-e529bfc2009b" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="9bfd53b6-376c-46af-81da-818094aa04f0" data-file-name="components/TelegramGateway.tsx">Perangkat Terhubung</span></h3>
                <p className="text-center text-muted-foreground" data-unique-id="6059de1c-083b-4d3d-b6cb-b19f0eed1ff6" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</p>
                <Button variant="outline" className="mt-4" onClick={disconnectDevice} data-unique-id="0fd8177e-a6f8-4db7-a80d-980cbbf12e99" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="fd3071c1-4bf3-4b52-9805-15cc9e201585" data-file-name="components/TelegramGateway.tsx">
                  Putuskan Koneksi
                </span></Button>
              </div> : qrCodeUrl ? <div className="flex flex-col items-center space-y-4" data-unique-id="9283c43b-4f65-46db-a325-7c90e8334c7a" data-file-name="components/TelegramGateway.tsx">
                <div className="relative" ref={qrRef} data-unique-id="3cceda1d-2eb7-4644-8c15-097b3de529b1" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  <QRCodeSVG value={qrCodeUrl} size={256} level="H" className="h-64 w-64 rounded-lg" includeMargin={true} />
                  {countdown > 0 && <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium" data-unique-id="26d43e55-bbca-4332-a493-0e0368a60492" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                      {countdown}
                    </div>}
                </div>
                <p className="text-center text-muted-foreground max-w-md" data-unique-id="fbeed775-0d18-4980-b91b-4e2647d27787" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  {statusMessage}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground" data-unique-id="a3a2cdaa-75e1-4443-8c0c-360835f62c02" data-file-name="components/TelegramGateway.tsx">
                  <Smartphone className="h-4 w-4" />
                  <span data-unique-id="a8a36fa1-1a50-4e6e-9650-60c1d73934e1" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b5887498-7cfc-40e8-a646-507aeba9c47c" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di perangkat Anda dan scan QR code ini</span></span>
                </div>
                <Button variant="outline" className="mt-2" onClick={generateQrCode} disabled={isGenerating} data-unique-id="deca55e6-1a69-4f8d-9c4b-37e5f7930494" data-file-name="components/TelegramGateway.tsx">
                  <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="78c4a1a3-c7b2-41d6-bda3-461d8d05ae0c" data-file-name="components/TelegramGateway.tsx">
                  Refresh QR Code
                </span></Button>
              </div> : <div className="flex flex-col items-center space-y-6 py-8" data-unique-id="65bf134e-1c38-49a3-8fd1-997890b674aa" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-muted-foreground bg-opacity-10 flex items-center justify-center" data-unique-id="f1df648b-13fd-45ec-ae46-c949a4812768" data-file-name="components/TelegramGateway.tsx">
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2" data-unique-id="57bfa78a-eeaa-4065-a1bf-be944854f808" data-file-name="components/TelegramGateway.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="215f7966-2c06-4fc6-8c8e-09223d5475f2" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="77b03467-1f93-4900-ad34-ec71a2e34e19" data-file-name="components/TelegramGateway.tsx">Hubungkan Perangkat Desktop</span></h3>
                  <p className="text-muted-foreground max-w-md" data-unique-id="71cc5ead-c285-4420-8796-13c7c3efa8e1" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="4ec01192-8ff5-4846-9416-990c3dbeee9d" data-file-name="components/TelegramGateway.tsx">
                    Scan QR code untuk menghubungkan perangkat desktop Anda dengan Telegram Web
                  </span></p>
                </div>
                <Button onClick={generateQrCode} disabled={isGenerating} className="mt-4" data-unique-id="04c331d7-a8dc-4990-9a4f-a8331bdf3c9d" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  {isGenerating ? <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating QR Code...
                    </> : <>
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </>}
                </Button>
              </div>}
          </div>

          <Card className="bg-muted" data-unique-id="0f454eb4-04e3-4b87-a872-94455a142eb7" data-file-name="components/TelegramGateway.tsx">
            <CardContent className="p-4" data-unique-id="797adb11-3a8c-4216-b147-95cef63d2946" data-file-name="components/TelegramGateway.tsx">
              <div className="flex items-start space-x-2 mb-3" data-unique-id="1064df16-d9cc-4dba-b8cd-f856b9ccabb6" data-file-name="components/TelegramGateway.tsx">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700" data-unique-id="52541589-4d84-4d25-9b30-c34d80f14856" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="9546309c-198c-4eae-a06b-022435163ca7" data-file-name="components/TelegramGateway.tsx">
                  Fitur ini menggunakan TDLib untuk menghubungkan aplikasi dengan akun Telegram Anda melalui QR code login.
                </span></p>
              </div>
              
              <h3 className="font-medium mb-2" data-unique-id="934c4558-fa79-4ab6-8a00-dff0d1bea877" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="13436926-5298-4477-8274-7bc54a9821dd" data-file-name="components/TelegramGateway.tsx">Cara Menghubungkan Perangkat</span></h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm" data-unique-id="3c259654-cba7-471d-85ed-8f991b369caa" data-file-name="components/TelegramGateway.tsx">
                <li data-unique-id="7146c278-860a-4eed-87cb-f5941e1897e8" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="0b4ff992-8a2e-4447-959a-e3c3befb0450" data-file-name="components/TelegramGateway.tsx">Klik tombol "Generate QR Code" untuk membuat kode QR</span></li>
                <li data-unique-id="ca81f40c-2b8a-4eba-b6fb-89ba83690b85" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="127fcb0f-bf73-4c6e-8051-ab4f488f88bd" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di smartphone Anda</span></li>
                <li data-unique-id="7d849ed4-2746-470d-a925-a23f352d90cf" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="576cc451-a337-42fe-8340-c8b28734e6eb" data-file-name="components/TelegramGateway.tsx">Ketuk ikon </span><strong data-unique-id="dbd73049-653b-479f-8d0d-3148a4549675" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="17ee5fcc-e85b-4cce-87a3-d6d8357f3f95" data-file-name="components/TelegramGateway.tsx">Pengaturan</span></strong><span className="editable-text" data-unique-id="9ceacc45-ef16-4968-ab8d-4b29e0dfa4d2" data-file-name="components/TelegramGateway.tsx"> (⚙️) di pojok kanan bawah</span></li>
                <li data-unique-id="17218c87-e224-402f-99a5-642e0419dbe7" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="907e7938-9cae-4d54-b51b-e39a81864f93" data-file-name="components/TelegramGateway.tsx">Pilih </span><strong data-unique-id="30bdb1c6-778d-46a5-bd9b-5306dd0407da" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="6e49ea09-ef59-4d76-b62e-9dbeedd748cc" data-file-name="components/TelegramGateway.tsx">Perangkat</span></strong><span className="editable-text" data-unique-id="69ce436b-52b1-45f7-a3ef-2010bc90d9ce" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="16c771a5-6f41-4e92-bf6a-8879764f2128" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="e7704ffa-089b-445a-9c54-b7854b941e1f" data-file-name="components/TelegramGateway.tsx">Devices</span></strong></li>
                <li data-unique-id="febe75b3-d929-4708-863e-8024ac8f88c9" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="43a033ce-c7da-4b73-9d58-9ef48d2fe013" data-file-name="components/TelegramGateway.tsx">Ketuk </span><strong data-unique-id="1b306771-20ce-4d00-bc4f-07820c9a28fd" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="965f65be-8fbd-4cd1-9f36-2aa3b0ecba52" data-file-name="components/TelegramGateway.tsx">Scan QR Code</span></strong><span className="editable-text" data-unique-id="7409efd9-37b2-45bf-9a1a-875caa1ac50e" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="868f1fc4-8e68-4961-9b81-01346d4d70f4" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b7046ad7-2e7d-42ce-996f-767e406e71f8" data-file-name="components/TelegramGateway.tsx">Link Desktop Device</span></strong></li>
                <li data-unique-id="ff623eed-0fa2-45cb-8865-040ecc0e53c5" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="4a3f431d-a08a-4490-81db-72ad015412de" data-file-name="components/TelegramGateway.tsx">Arahkan kamera ke QR code yang ditampilkan di sini</span></li>
                <li data-unique-id="033a489b-bc13-4bc6-818f-ed21bb5e571c" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="32cd7547-6f9c-45b8-a946-eb0859da6787" data-file-name="components/TelegramGateway.tsx">Setelah terhubung, Anda dapat menggunakan Telegram Web melalui aplikasi ini</span></li>
              </ol>
            </CardContent>
          </Card>

          {connectionStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="2907cc05-642a-4dc5-b785-ab186cd948b0" data-file-name="components/TelegramGateway.tsx">
              <XCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="70ebf1d4-a34c-459e-bbac-dea7a155dd23" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}