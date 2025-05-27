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
  return <div className="space-y-6" data-unique-id="bbc42dbd-543d-4cbf-b590-b41a93f99fa1" data-file-name="components/TelegramGateway.tsx">
      <Card data-unique-id="14a10fbd-45f6-412b-bc76-d62a906a4b97" data-file-name="components/TelegramGateway.tsx">
        <CardHeader data-unique-id="b02de81b-c51b-4333-9ce1-d12ee3938184" data-file-name="components/TelegramGateway.tsx">
          <CardTitle data-unique-id="a70b1d53-1e7d-4d3c-bf94-b1c1ad34c5c3" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="f87b1596-5235-4848-a043-eb7336496d78" data-file-name="components/TelegramGateway.tsx">Gateway Telegram</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="737a3924-7601-4746-a1ac-d1f1b546b5b7" data-file-name="components/TelegramGateway.tsx">
            Hubungkan perangkat desktop Anda dengan Telegram Web melalui QR code
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="9f581cfe-7c1e-4124-acd6-6f940d39f6df" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted" data-unique-id="1d1f5e85-5732-442a-8c94-2a08faa8a1f4" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
            {connectionStatus === "connected" ? <div className="flex flex-col items-center space-y-4 py-8" data-unique-id="45d1a35f-7f8f-4ffb-b206-e6c02ef85c8e" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center" data-unique-id="97c518ea-5133-4ed5-a105-a2cca7d6dcea" data-file-name="components/TelegramGateway.tsx">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-700" data-unique-id="b80b82cd-57cf-49d5-8b33-cb226157e5d7" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b5ab6355-0a53-41b1-b60c-2c3eddb0d5ad" data-file-name="components/TelegramGateway.tsx">Perangkat Terhubung</span></h3>
                <p className="text-center text-muted-foreground" data-unique-id="b1fed807-be6f-4a69-98ff-6f993a7e6926" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</p>
                <Button variant="outline" className="mt-4" onClick={disconnectDevice} data-unique-id="47d7b1f6-25cf-40a4-93e9-ddbf467bba37" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="58c0b729-fa0c-4a3a-a67f-d495dd0bc6c6" data-file-name="components/TelegramGateway.tsx">
                  Putuskan Koneksi
                </span></Button>
              </div> : qrCodeUrl ? <div className="flex flex-col items-center space-y-4" data-unique-id="e6ac6d79-26cb-4f6d-9cb6-7a2d1211f773" data-file-name="components/TelegramGateway.tsx">
                <div className="relative" ref={qrRef} data-unique-id="6d40d453-e417-4cfc-b335-e48a2223cf42" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  <QRCodeSVG value={qrCodeUrl} size={256} level="H" className="h-64 w-64 rounded-lg" includeMargin={true} />
                  {countdown > 0 && <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium" data-unique-id="c7285f01-8b3c-4aae-859b-a11cccf9bd1b" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                      {countdown}
                    </div>}
                </div>
                <p className="text-center text-muted-foreground max-w-md" data-unique-id="d2f0bd58-686d-47af-a1eb-57eb15d4c70d" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  {statusMessage}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground" data-unique-id="acae18e5-ba34-48d0-a6c8-e1f7bee8965c" data-file-name="components/TelegramGateway.tsx">
                  <Smartphone className="h-4 w-4" />
                  <span data-unique-id="88793cae-c552-4a07-bbed-c0d7e1a99643" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="fa5e26aa-3f3d-4ed6-86fc-adf113ffbea1" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di perangkat Anda dan scan QR code ini</span></span>
                </div>
                <Button variant="outline" className="mt-2" onClick={generateQrCode} disabled={isGenerating} data-unique-id="b025f4b8-7f53-4797-af43-d3bc0e31c5d0" data-file-name="components/TelegramGateway.tsx">
                  <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="87f3db65-192c-4ca0-9be0-0882b6de3ad1" data-file-name="components/TelegramGateway.tsx">
                  Refresh QR Code
                </span></Button>
              </div> : <div className="flex flex-col items-center space-y-6 py-8" data-unique-id="942c4580-0927-4d63-af92-f8a4bb035db2" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-muted-foreground bg-opacity-10 flex items-center justify-center" data-unique-id="b428715a-c01e-4558-bfe2-778734055ebc" data-file-name="components/TelegramGateway.tsx">
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2" data-unique-id="21d84b67-ff93-42b1-a7ac-86482a147f63" data-file-name="components/TelegramGateway.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="384a0d1f-78be-49e3-a603-36df98c9cba5" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="ff99382e-05c3-4e73-b893-33f0dd87a358" data-file-name="components/TelegramGateway.tsx">Hubungkan Perangkat Desktop</span></h3>
                  <p className="text-muted-foreground max-w-md" data-unique-id="ee11d9ce-1783-4dc7-b0e2-3b3f43a9bf03" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="dd2f4a22-0f8b-49b3-89b2-692ac40c0e3d" data-file-name="components/TelegramGateway.tsx">
                    Scan QR code untuk menghubungkan perangkat desktop Anda dengan Telegram Web
                  </span></p>
                </div>
                <Button onClick={generateQrCode} disabled={isGenerating} className="mt-4" data-unique-id="a0f40a27-c423-4eb1-abae-38462216de0d" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
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

          <Card className="bg-muted" data-unique-id="a3bd6258-8411-4468-a064-2b3ab124f9db" data-file-name="components/TelegramGateway.tsx">
            <CardContent className="p-4" data-unique-id="f2454090-5ed5-4ef3-b91e-bd9514f3f211" data-file-name="components/TelegramGateway.tsx">
              <div className="flex items-start space-x-2 mb-3" data-unique-id="0f82f295-50a4-4c97-b707-f686d316d2a3" data-file-name="components/TelegramGateway.tsx">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700" data-unique-id="638ffbb7-ccbe-45eb-8436-ca85df686075" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="274eb968-ddc5-4239-9af7-08c2abce2c04" data-file-name="components/TelegramGateway.tsx">
                  Fitur ini menggunakan TDLib untuk menghubungkan aplikasi dengan akun Telegram Anda melalui QR code login.
                </span></p>
              </div>
              
              <h3 className="font-medium mb-2" data-unique-id="4b286924-c582-4c1e-8bae-ed0be6c23e15" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="90d59935-640e-4821-ae79-1ff7e58ad0c9" data-file-name="components/TelegramGateway.tsx">Cara Menghubungkan Perangkat</span></h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm" data-unique-id="9921367c-f6ae-4b06-9011-5d2e9f84238e" data-file-name="components/TelegramGateway.tsx">
                <li data-unique-id="009f6c18-f9b5-4671-a2d2-780f1f9bca46" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="d2de800c-a966-4213-824a-952832ce7a90" data-file-name="components/TelegramGateway.tsx">Klik tombol "Generate QR Code" untuk membuat kode QR</span></li>
                <li data-unique-id="0478f4d5-f6b7-40e4-8bdc-691a70f4e1c3" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="aeaebff7-75bd-4ef0-8050-a5da0ba62bb4" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di smartphone Anda</span></li>
                <li data-unique-id="c0906ee1-d417-47d6-94e3-544fe0dbb45c" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="294f084c-fca6-4b07-8b4b-540056be709e" data-file-name="components/TelegramGateway.tsx">Ketuk ikon </span><strong data-unique-id="b4255b1b-1450-4030-8e2a-a4765aa73fd9" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="6b825bac-6c7a-4679-9359-9094f424267b" data-file-name="components/TelegramGateway.tsx">Pengaturan</span></strong><span className="editable-text" data-unique-id="fef2c6eb-e55c-4a10-ac37-b7fccd1d2256" data-file-name="components/TelegramGateway.tsx"> (⚙️) di pojok kanan bawah</span></li>
                <li data-unique-id="dc44ce2d-42e8-4a37-9779-cbd1e92ff696" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="a2b3ff20-1ecd-4d46-acc1-d77f072e2ff1" data-file-name="components/TelegramGateway.tsx">Pilih </span><strong data-unique-id="db74c561-8958-4ae4-800c-830140eb69f0" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="564d089b-c2b7-4a4c-a263-983d4c43919a" data-file-name="components/TelegramGateway.tsx">Perangkat</span></strong><span className="editable-text" data-unique-id="8e0412c1-a16a-43e6-b6f3-afd66f3e6529" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="b0517a08-5fa4-4d20-9434-63be6ae34d64" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="381e1329-86a4-4d98-91fc-0a61b218daaa" data-file-name="components/TelegramGateway.tsx">Devices</span></strong></li>
                <li data-unique-id="e20b0163-4fe0-42a9-8552-052f71a4552b" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="538af218-c741-42da-b999-390af66b9ae2" data-file-name="components/TelegramGateway.tsx">Ketuk </span><strong data-unique-id="ab80dd78-d87a-439d-a5e9-2a473ada11bd" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="a58b756d-e6f7-445d-9e2e-c72819e2b913" data-file-name="components/TelegramGateway.tsx">Scan QR Code</span></strong><span className="editable-text" data-unique-id="756b6b6d-fc73-4ecb-9d0f-e610cdef3f0e" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="8d08563e-c346-4138-8a13-bd205e17e627" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="88d3155b-fa9c-4d6a-92d4-b9a558117522" data-file-name="components/TelegramGateway.tsx">Link Desktop Device</span></strong></li>
                <li data-unique-id="2b519e7f-8317-40f1-b1d0-2d3f5147058b" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="ebd1fb5d-f434-4135-8fab-2f617bc1c57f" data-file-name="components/TelegramGateway.tsx">Arahkan kamera ke QR code yang ditampilkan di sini</span></li>
                <li data-unique-id="6e5bce45-3aca-4dc5-932a-5159f3b0f390" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b7406d2a-b750-4599-a699-b5d7595dd5b9" data-file-name="components/TelegramGateway.tsx">Setelah terhubung, Anda dapat menggunakan Telegram Web melalui aplikasi ini</span></li>
              </ol>
            </CardContent>
          </Card>

          {connectionStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="041d52ea-bf25-4390-9d54-f08c41ee2f0f" data-file-name="components/TelegramGateway.tsx">
              <XCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="2083d197-9568-4d23-bd1a-db5d71974f4d" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}