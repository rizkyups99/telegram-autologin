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
  return <div className="space-y-6" data-unique-id="19eaae02-3c82-428b-80ae-a50cc9686bc9" data-file-name="components/TelegramGateway.tsx">
      <Card data-unique-id="ac680062-07a5-4f04-ae3b-c7456615172e" data-file-name="components/TelegramGateway.tsx">
        <CardHeader data-unique-id="f0410eee-a63f-4284-a6f1-5bf70bddac0c" data-file-name="components/TelegramGateway.tsx">
          <CardTitle data-unique-id="938cfc01-b2ca-49de-9620-c714f6eca113" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="388bb08e-7b46-402c-984b-13e04ebfec65" data-file-name="components/TelegramGateway.tsx">Gateway Telegram</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="90f6b767-36d6-45d0-8cc8-7215a7a65fbb" data-file-name="components/TelegramGateway.tsx">
            Hubungkan perangkat desktop Anda dengan Telegram Web melalui QR code
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="bcfcd0d2-3de5-4e3a-9e7e-229ff15ff9c3" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted" data-unique-id="05ed8578-4ec3-4789-ba75-68abfb100bc4" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
            {connectionStatus === "connected" ? <div className="flex flex-col items-center space-y-4 py-8" data-unique-id="26db1715-c4d9-4301-908d-9180b49df5ee" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center" data-unique-id="37733bbc-338b-49c7-bb40-c3cddc8098d0" data-file-name="components/TelegramGateway.tsx">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-700" data-unique-id="8ba96d53-16cf-428a-9530-21d82d57fea6" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="a1e0b2d0-ed61-40e3-8320-946e43d5a717" data-file-name="components/TelegramGateway.tsx">Perangkat Terhubung</span></h3>
                <p className="text-center text-muted-foreground" data-unique-id="173f98df-f7c1-482c-aa19-f377be3c86bf" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</p>
                <Button variant="outline" className="mt-4" onClick={disconnectDevice} data-unique-id="4b350834-675f-4465-b697-90caa4ce1523" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="6ceec0af-b04c-4390-b3cc-2f84c7ca5434" data-file-name="components/TelegramGateway.tsx">
                  Putuskan Koneksi
                </span></Button>
              </div> : qrCodeUrl ? <div className="flex flex-col items-center space-y-4" data-unique-id="8b874e49-e726-4a9a-ad76-e9752a7222e5" data-file-name="components/TelegramGateway.tsx">
                <div className="relative" ref={qrRef} data-unique-id="fde1d9d5-5666-4feb-af43-a43deebf7f64" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  <QRCodeSVG value={qrCodeUrl} size={256} level="H" className="h-64 w-64 rounded-lg" includeMargin={true} />
                  {countdown > 0 && <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium" data-unique-id="0059a80e-117d-4a39-ab60-818d16e7c58b" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                      {countdown}
                    </div>}
                </div>
                <p className="text-center text-muted-foreground max-w-md" data-unique-id="44ba01fa-2f17-4677-8bd1-60fb94220a51" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  {statusMessage}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground" data-unique-id="7b0c85e9-1a83-447c-9f68-88ab0b75f7ea" data-file-name="components/TelegramGateway.tsx">
                  <Smartphone className="h-4 w-4" />
                  <span data-unique-id="8e747ad1-becc-4d27-86fe-22b6f55b5a1e" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="94ab0479-9ed9-4047-a77c-47f5e6d8496b" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di perangkat Anda dan scan QR code ini</span></span>
                </div>
                <Button variant="outline" className="mt-2" onClick={generateQrCode} disabled={isGenerating} data-unique-id="6064fc27-08fd-4d26-b731-a5db20793fd8" data-file-name="components/TelegramGateway.tsx">
                  <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="54d93248-c584-44fc-abc9-ed3e9c23dc4e" data-file-name="components/TelegramGateway.tsx">
                  Refresh QR Code
                </span></Button>
              </div> : <div className="flex flex-col items-center space-y-6 py-8" data-unique-id="3fe122dd-464f-4844-8415-40b34ccb0abe" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-muted-foreground bg-opacity-10 flex items-center justify-center" data-unique-id="5ac0bb6a-f271-4611-acc5-62178a0ad4eb" data-file-name="components/TelegramGateway.tsx">
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2" data-unique-id="e3ef6f3a-2ce8-4ed3-a6c1-2dc17e6ba69a" data-file-name="components/TelegramGateway.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="825fc665-8b60-49ed-8113-0b9fb587009c" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="4166cb44-9088-4e33-b120-cc8881705b50" data-file-name="components/TelegramGateway.tsx">Hubungkan Perangkat Desktop</span></h3>
                  <p className="text-muted-foreground max-w-md" data-unique-id="810eb384-634a-46c6-97df-fb8660cd91e9" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="41e69124-c725-482b-8d52-038f7922649e" data-file-name="components/TelegramGateway.tsx">
                    Scan QR code untuk menghubungkan perangkat desktop Anda dengan Telegram Web
                  </span></p>
                </div>
                <Button onClick={generateQrCode} disabled={isGenerating} className="mt-4" data-unique-id="3c67ee2a-3552-4869-aa70-aec06c11bfc5" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
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

          <Card className="bg-muted" data-unique-id="ec421984-10a7-47f9-b0d2-edc2d33ceb9f" data-file-name="components/TelegramGateway.tsx">
            <CardContent className="p-4" data-unique-id="16160b36-8a5c-4f62-bb3f-4e504a369e45" data-file-name="components/TelegramGateway.tsx">
              <div className="flex items-start space-x-2 mb-3" data-unique-id="1a4d2fe2-274e-4f73-82e9-37d8cf1524bc" data-file-name="components/TelegramGateway.tsx">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700" data-unique-id="c4a2ab60-c3df-4da9-8d65-7de125196ad7" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="a0ef081e-870a-4408-b68c-0e1202ab6634" data-file-name="components/TelegramGateway.tsx">
                  Fitur ini menggunakan TDLib untuk menghubungkan aplikasi dengan akun Telegram Anda melalui QR code login.
                </span></p>
              </div>
              
              <h3 className="font-medium mb-2" data-unique-id="104bbfdb-e85f-486a-9bae-739e3a98f45f" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="1d5dabac-c9c8-47d9-bcc1-e3f9df5be81d" data-file-name="components/TelegramGateway.tsx">Cara Menghubungkan Perangkat</span></h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm" data-unique-id="47241d2e-607d-4f52-84d4-a635003092bb" data-file-name="components/TelegramGateway.tsx">
                <li data-unique-id="95349f40-61c4-41d7-84c6-4b65bb627d62" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="fb4ef6ee-a801-400b-98bb-96bfb35caee0" data-file-name="components/TelegramGateway.tsx">Klik tombol "Generate QR Code" untuk membuat kode QR</span></li>
                <li data-unique-id="445a2736-cd64-42b4-91f1-30574f1ce7bd" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="df8c3dcf-1770-4c98-aa87-b18c06047862" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di smartphone Anda</span></li>
                <li data-unique-id="ca79cbf3-d752-491c-a0be-10e86fc5d5d3" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="3d38a5d9-ab46-4a60-9d20-0ce1789fcc8f" data-file-name="components/TelegramGateway.tsx">Ketuk ikon </span><strong data-unique-id="d2ae45fc-cddd-4e45-bb8f-b18fa63a3adb" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="76624eba-e19b-4a7b-99cc-9cc22afbc463" data-file-name="components/TelegramGateway.tsx">Pengaturan</span></strong><span className="editable-text" data-unique-id="c15cfe2d-410c-4f28-a5ff-b5916da1008f" data-file-name="components/TelegramGateway.tsx"> (⚙️) di pojok kanan bawah</span></li>
                <li data-unique-id="8c209a14-63a7-4293-8090-6dd3459533a5" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="77e1a567-9a0c-4307-9af7-3446e9bade1a" data-file-name="components/TelegramGateway.tsx">Pilih </span><strong data-unique-id="44f69ad7-511e-430d-acb0-33a2e39a099f" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b0c9576f-0885-4693-bbac-6f3da1485585" data-file-name="components/TelegramGateway.tsx">Perangkat</span></strong><span className="editable-text" data-unique-id="46fec0e5-f4f1-49b4-b850-c322bbd9c515" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="7bef6b32-f61b-4db1-a987-765a2f373f9e" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="15e3bd5d-153c-4333-8abf-fe0f1701e82f" data-file-name="components/TelegramGateway.tsx">Devices</span></strong></li>
                <li data-unique-id="1b0f2294-c90e-4e07-8593-9affac68d74a" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b75e5d27-bfaf-438d-a2fa-c0881232ee61" data-file-name="components/TelegramGateway.tsx">Ketuk </span><strong data-unique-id="89115ca3-18b2-41c6-ae5a-0f0b6ca57e44" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="61bf4d3d-89d7-4493-b146-94238e0c8bba" data-file-name="components/TelegramGateway.tsx">Scan QR Code</span></strong><span className="editable-text" data-unique-id="58cbf2f8-1df1-4de3-b0d0-0c72d97420e0" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="8d401477-4501-41a2-b528-1bc4e3436134" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="3fc97dcd-4103-4f20-9100-98e719bfda3e" data-file-name="components/TelegramGateway.tsx">Link Desktop Device</span></strong></li>
                <li data-unique-id="7a7d60ac-cb32-43ad-8262-2027607ebf9c" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="520602ac-9ffb-4a10-a913-80f73712d3f1" data-file-name="components/TelegramGateway.tsx">Arahkan kamera ke QR code yang ditampilkan di sini</span></li>
                <li data-unique-id="fd6e7230-bf77-44ed-933b-430069399ca1" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="04a5ef94-f694-41b6-9738-7f6916b8bb06" data-file-name="components/TelegramGateway.tsx">Setelah terhubung, Anda dapat menggunakan Telegram Web melalui aplikasi ini</span></li>
              </ol>
            </CardContent>
          </Card>

          {connectionStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="1f1cfd1e-1fdb-4a12-96cd-5a844d8b508d" data-file-name="components/TelegramGateway.tsx">
              <XCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="be03aacb-3128-4081-9b60-012076aae5bb" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}