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
  return <div className="space-y-6" data-unique-id="4b51ae1c-469c-4164-b7b3-4468a6a004ba" data-file-name="components/TelegramGateway.tsx">
      <Card data-unique-id="82bcfc03-1768-4458-948c-f4a9263d441e" data-file-name="components/TelegramGateway.tsx">
        <CardHeader data-unique-id="42269550-55ec-45dd-9890-ec8a3b5fa3ff" data-file-name="components/TelegramGateway.tsx">
          <CardTitle data-unique-id="970e09e9-f0ed-4dd0-a45e-5d1ba5547a60" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="6834720e-e6a2-4ea8-b000-ebb07b6a2fca" data-file-name="components/TelegramGateway.tsx">Gateway Telegram</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="80751fdf-2433-4a90-bcf8-d4729699cd00" data-file-name="components/TelegramGateway.tsx">
            Hubungkan perangkat desktop Anda dengan Telegram Web melalui QR code
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="bd098c35-85df-4d16-8840-2d01cf4bb4a5" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted" data-unique-id="cd652742-4957-470a-828e-0a88ae95c2c8" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
            {connectionStatus === "connected" ? <div className="flex flex-col items-center space-y-4 py-8" data-unique-id="78249722-a8c2-42c9-93d3-11696d6db643" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center" data-unique-id="9b48b0c4-be14-476b-ac44-4289935af76b" data-file-name="components/TelegramGateway.tsx">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-700" data-unique-id="9841858b-e60c-4f57-b17d-ba62ff380cb1" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="61023405-89ec-4ba4-a426-eb374426e191" data-file-name="components/TelegramGateway.tsx">Perangkat Terhubung</span></h3>
                <p className="text-center text-muted-foreground" data-unique-id="04976933-4af3-4aaf-823d-aa7772a3645b" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</p>
                <Button variant="outline" className="mt-4" onClick={disconnectDevice} data-unique-id="c1af0a4d-983e-455a-a2ab-bf071c67f5e1" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b965b6b1-6620-4c16-b819-7f7c3e80dcc1" data-file-name="components/TelegramGateway.tsx">
                  Putuskan Koneksi
                </span></Button>
              </div> : qrCodeUrl ? <div className="flex flex-col items-center space-y-4" data-unique-id="d9d3e8b1-5da9-4ba8-95b6-8969d392f606" data-file-name="components/TelegramGateway.tsx">
                <div className="relative" ref={qrRef} data-unique-id="d61749eb-6bb4-4285-9879-db120dd166dc" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  <QRCodeSVG value={qrCodeUrl} size={256} level="H" className="h-64 w-64 rounded-lg" includeMargin={true} />
                  {countdown > 0 && <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium" data-unique-id="11d10e16-f118-4a05-ad21-1d7e45b1adfb" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                      {countdown}
                    </div>}
                </div>
                <p className="text-center text-muted-foreground max-w-md" data-unique-id="826dfa45-c7aa-4551-a47b-c0462408ba06" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  {statusMessage}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground" data-unique-id="d1eb9567-5cee-469b-ac3a-bb1dd90487f8" data-file-name="components/TelegramGateway.tsx">
                  <Smartphone className="h-4 w-4" />
                  <span data-unique-id="d2c44fb5-8398-44fc-9ac3-4776b3e8b6a8" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b70d7177-2ce0-4912-ace1-ba2f1594e339" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di perangkat Anda dan scan QR code ini</span></span>
                </div>
                <Button variant="outline" className="mt-2" onClick={generateQrCode} disabled={isGenerating} data-unique-id="5dce6a45-cb87-48db-8fb2-306375b65bed" data-file-name="components/TelegramGateway.tsx">
                  <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="a2e41cf6-78bd-454a-a06b-710845fbcd7e" data-file-name="components/TelegramGateway.tsx">
                  Refresh QR Code
                </span></Button>
              </div> : <div className="flex flex-col items-center space-y-6 py-8" data-unique-id="49dc5f00-6bf6-43c1-9785-f9fb3bbf9c70" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-muted-foreground bg-opacity-10 flex items-center justify-center" data-unique-id="b7fd76a4-9228-4d65-8f0b-5dcabc53cab4" data-file-name="components/TelegramGateway.tsx">
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2" data-unique-id="185f9952-ccda-4954-8432-a2ae8784e080" data-file-name="components/TelegramGateway.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="aad19b79-f2ca-4efe-851d-00c76d1a9903" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b5c5c609-c63a-462e-a531-cc2f485c8d01" data-file-name="components/TelegramGateway.tsx">Hubungkan Perangkat Desktop</span></h3>
                  <p className="text-muted-foreground max-w-md" data-unique-id="23e82a53-ff5e-43b9-b590-ae3c9a0aeaeb" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="07c19e71-2af7-4833-b380-6f644c4b6e1f" data-file-name="components/TelegramGateway.tsx">
                    Scan QR code untuk menghubungkan perangkat desktop Anda dengan Telegram Web
                  </span></p>
                </div>
                <Button onClick={generateQrCode} disabled={isGenerating} className="mt-4" data-unique-id="8fc2bc5c-04bb-4e35-9b77-255e83248775" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
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

          <Card className="bg-muted" data-unique-id="e1f8ba6a-6ab9-4828-9ebf-dfc9c857811d" data-file-name="components/TelegramGateway.tsx">
            <CardContent className="p-4" data-unique-id="20cf4be4-3bb3-40e6-8c3c-30b524f1ed04" data-file-name="components/TelegramGateway.tsx">
              <div className="flex items-start space-x-2 mb-3" data-unique-id="f0ccbaaa-c55d-45f8-a287-ad40f3816824" data-file-name="components/TelegramGateway.tsx">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700" data-unique-id="76214781-2ce2-432e-bde9-fba00fb4f25e" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="a43c76d0-2128-4568-8210-85ba098c2807" data-file-name="components/TelegramGateway.tsx">
                  Fitur ini menggunakan TDLib untuk menghubungkan aplikasi dengan akun Telegram Anda melalui QR code login.
                </span></p>
              </div>
              
              <h3 className="font-medium mb-2" data-unique-id="712c6017-a2df-4949-a38e-6e3ce0bbec8b" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="4e3f969a-53c4-45f0-adf8-aa70df2e5151" data-file-name="components/TelegramGateway.tsx">Cara Menghubungkan Perangkat</span></h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm" data-unique-id="590a447e-6673-4020-8c97-d24e08b4d09b" data-file-name="components/TelegramGateway.tsx">
                <li data-unique-id="0949a8b1-b209-48a6-965d-cd9f5eccec69" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="6b3b931f-b4dd-41d2-805d-951fff9f7209" data-file-name="components/TelegramGateway.tsx">Klik tombol "Generate QR Code" untuk membuat kode QR</span></li>
                <li data-unique-id="c3335e0b-96d7-4eed-9ae3-788f400a79bd" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="d589245e-36f4-464b-8497-6898570a1a4c" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di smartphone Anda</span></li>
                <li data-unique-id="05e55924-9cb5-4cdd-88b3-e2cbd21fa851" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="c94cb026-0909-4ab7-9f2f-3bf23c9952fd" data-file-name="components/TelegramGateway.tsx">Ketuk ikon </span><strong data-unique-id="dc77b031-0e0a-4032-a2a0-274c4e1fcb9c" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="4c338048-312f-415c-bf57-97c7cd37f74c" data-file-name="components/TelegramGateway.tsx">Pengaturan</span></strong><span className="editable-text" data-unique-id="4b6922b6-12ae-47e1-9d06-e61078f62796" data-file-name="components/TelegramGateway.tsx"> (⚙️) di pojok kanan bawah</span></li>
                <li data-unique-id="76abaff3-0f2c-4590-ab65-343e69dc6787" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="5659a539-8076-4346-b1f0-f6ebca9f05ac" data-file-name="components/TelegramGateway.tsx">Pilih </span><strong data-unique-id="afccf64b-9743-4cbb-ad09-c33dcb3b9b2a" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="8037925c-b1a4-4ffa-97ea-6db4ecddb88c" data-file-name="components/TelegramGateway.tsx">Perangkat</span></strong><span className="editable-text" data-unique-id="6c00c053-6ff2-4b7c-b515-07b31fb81801" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="f6fafdba-6467-4067-9755-dab99790d929" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="69557f15-1d7c-4ec0-aea8-1af544b13284" data-file-name="components/TelegramGateway.tsx">Devices</span></strong></li>
                <li data-unique-id="521e885a-1679-403b-9536-aceb81f8e9c7" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="d1ebd465-c6e5-4563-8eb1-d15e6b95c8d7" data-file-name="components/TelegramGateway.tsx">Ketuk </span><strong data-unique-id="f2cd126f-2254-4528-bac0-749e41c4336a" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="fba87fca-3c9c-47f8-b90e-7409b12abadb" data-file-name="components/TelegramGateway.tsx">Scan QR Code</span></strong><span className="editable-text" data-unique-id="245fdca6-3e8f-44d2-b0bf-b8f1a0e03707" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="6a616024-66b7-485d-8ca3-a8796cc6e231" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="e600481d-8369-49a9-9fcb-2a31a1ecd6e2" data-file-name="components/TelegramGateway.tsx">Link Desktop Device</span></strong></li>
                <li data-unique-id="bf176a73-3047-42d3-9042-f6b2c05cf62a" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="80a3a372-3196-4e38-b19d-e1b40035d6a0" data-file-name="components/TelegramGateway.tsx">Arahkan kamera ke QR code yang ditampilkan di sini</span></li>
                <li data-unique-id="c4a8019f-4315-4c63-a06b-0239b1e997ae" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="f4f9cc81-5030-4916-930a-3ca44dc838e6" data-file-name="components/TelegramGateway.tsx">Setelah terhubung, Anda dapat menggunakan Telegram Web melalui aplikasi ini</span></li>
              </ol>
            </CardContent>
          </Card>

          {connectionStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="78d1e695-c556-4d26-8c5d-7e1fddfe994d" data-file-name="components/TelegramGateway.tsx">
              <XCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="253a41dc-569d-4637-ac67-7c570bd4f764" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}