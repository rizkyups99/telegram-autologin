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
  return <div className="space-y-6" data-unique-id="a5d969a8-1f4b-4d3a-a6f7-310463593911" data-file-name="components/TelegramGateway.tsx">
      <Card data-unique-id="8c09260a-2052-4777-9f79-f5c585a16d3f" data-file-name="components/TelegramGateway.tsx">
        <CardHeader data-unique-id="e3b72293-d4f2-4748-b451-e73579c1dbb6" data-file-name="components/TelegramGateway.tsx">
          <CardTitle data-unique-id="b3949746-ebd2-42a6-a0c6-85a781f94848" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="5f9c33c5-2704-44b5-b530-4ac13a2ce96e" data-file-name="components/TelegramGateway.tsx">Gateway Telegram</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="d7b21121-3ff1-4e45-a62b-e30a9246e76a" data-file-name="components/TelegramGateway.tsx">
            Hubungkan perangkat desktop Anda dengan Telegram Web melalui QR code
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="f228fd36-f4ce-4c21-b4d0-235cee0b70fd" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted" data-unique-id="80d80661-f609-4bc6-8384-5fa93bb20404" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
            {connectionStatus === "connected" ? <div className="flex flex-col items-center space-y-4 py-8" data-unique-id="ce2ac300-107d-4350-8976-5883d41c37fe" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center" data-unique-id="21462afa-0c4f-4685-bf43-57361d5ed985" data-file-name="components/TelegramGateway.tsx">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-700" data-unique-id="3d3ba35f-e24b-4304-aafb-99fe474a8024" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="18c1d3bc-1de9-4292-b210-f35908d76348" data-file-name="components/TelegramGateway.tsx">Perangkat Terhubung</span></h3>
                <p className="text-center text-muted-foreground" data-unique-id="75e8b918-e79d-44cb-920a-08c720067901" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</p>
                <Button variant="outline" className="mt-4" onClick={disconnectDevice} data-unique-id="9d255f9a-27af-45b5-af7c-58a9729adeb4" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="09ec2870-40f2-4021-a342-3e225a9794b6" data-file-name="components/TelegramGateway.tsx">
                  Putuskan Koneksi
                </span></Button>
              </div> : qrCodeUrl ? <div className="flex flex-col items-center space-y-4" data-unique-id="14aca059-bdd1-434f-b9aa-b41739fdf779" data-file-name="components/TelegramGateway.tsx">
                <div className="relative" ref={qrRef} data-unique-id="93245f4e-3889-4c35-9a00-c7ec45b69aaa" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  <QRCodeSVG value={qrCodeUrl} size={256} level="H" className="h-64 w-64 rounded-lg" includeMargin={true} />
                  {countdown > 0 && <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium" data-unique-id="016f9118-c26a-4ad4-9792-a93925a71261" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                      {countdown}
                    </div>}
                </div>
                <p className="text-center text-muted-foreground max-w-md" data-unique-id="66d13737-b107-4a46-b866-ce1e5dd7bc0c" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  {statusMessage}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground" data-unique-id="868da866-61ee-4489-8a8a-1534b29536de" data-file-name="components/TelegramGateway.tsx">
                  <Smartphone className="h-4 w-4" />
                  <span data-unique-id="d5ecf033-ed59-4d69-83ab-ecbd93a83850" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="a1c2ca89-ad48-4cb2-aa8b-ed930a4aab56" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di perangkat Anda dan scan QR code ini</span></span>
                </div>
                <Button variant="outline" className="mt-2" onClick={generateQrCode} disabled={isGenerating} data-unique-id="d9cb60c8-6691-42e6-ae7a-5c5b468f5bc3" data-file-name="components/TelegramGateway.tsx">
                  <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="1c24e560-79e4-4ec1-9812-fcdafbe93961" data-file-name="components/TelegramGateway.tsx">
                  Refresh QR Code
                </span></Button>
              </div> : <div className="flex flex-col items-center space-y-6 py-8" data-unique-id="7fd25415-3e09-425a-83ea-75fd181adf12" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-muted-foreground bg-opacity-10 flex items-center justify-center" data-unique-id="630bbd7e-30ca-4c4c-b574-6c02511c0822" data-file-name="components/TelegramGateway.tsx">
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2" data-unique-id="c1d48db6-3234-4474-bea6-5228d76fd7ec" data-file-name="components/TelegramGateway.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="a522bbb0-12ee-4178-b8de-ba047bad694d" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="e90a475e-c19b-4b3f-bb2e-59820341b413" data-file-name="components/TelegramGateway.tsx">Hubungkan Perangkat Desktop</span></h3>
                  <p className="text-muted-foreground max-w-md" data-unique-id="041f9391-02c9-47b8-b67e-bce9137fcd42" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="af09661e-48e7-41a3-9810-9035dbcbd967" data-file-name="components/TelegramGateway.tsx">
                    Scan QR code untuk menghubungkan perangkat desktop Anda dengan Telegram Web
                  </span></p>
                </div>
                <Button onClick={generateQrCode} disabled={isGenerating} className="mt-4" data-unique-id="ca837d87-805e-4ee0-a9f1-12caefed69e2" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
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

          <Card className="bg-muted" data-unique-id="e94cde9d-c9e6-4bfb-b413-0a7aabd40dde" data-file-name="components/TelegramGateway.tsx">
            <CardContent className="p-4" data-unique-id="f190106c-7bfe-428c-8836-7efa544aaeaf" data-file-name="components/TelegramGateway.tsx">
              <div className="flex items-start space-x-2 mb-3" data-unique-id="03f2e661-1c20-4e9d-a9cb-e691e94c6b38" data-file-name="components/TelegramGateway.tsx">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700" data-unique-id="2fd6a333-5dd0-4021-9ec0-7c081a226f32" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="49f2db44-dcfe-42fe-b1d3-c8bf0644ad3d" data-file-name="components/TelegramGateway.tsx">
                  Fitur ini menggunakan TDLib untuk menghubungkan aplikasi dengan akun Telegram Anda melalui QR code login.
                </span></p>
              </div>
              
              <h3 className="font-medium mb-2" data-unique-id="3c55616c-dc28-4e1f-a188-b72a1b3b8218" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="fa7f71ba-562a-444d-888a-a143c10ad6ad" data-file-name="components/TelegramGateway.tsx">Cara Menghubungkan Perangkat</span></h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm" data-unique-id="a3bbaae2-754f-4970-9d30-437fc3cbe6be" data-file-name="components/TelegramGateway.tsx">
                <li data-unique-id="6832205f-5195-4a92-9612-2840fd4ae5fe" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="a08bd9ef-14c9-47ba-ab98-8b365ed103aa" data-file-name="components/TelegramGateway.tsx">Klik tombol "Generate QR Code" untuk membuat kode QR</span></li>
                <li data-unique-id="c09d6334-d9cb-428a-bdfb-b2ee4ad78345" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="c30df9e4-5c96-4fe6-ace7-7658db378efd" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di smartphone Anda</span></li>
                <li data-unique-id="00678402-8ef5-47d8-8957-c5497086b561" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="d75f6aeb-2a6b-4494-b177-6bcf42730285" data-file-name="components/TelegramGateway.tsx">Ketuk ikon </span><strong data-unique-id="378cacdf-80a2-4101-af09-0b2448ac715b" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="dd696c08-0e41-4411-923e-f219c9205005" data-file-name="components/TelegramGateway.tsx">Pengaturan</span></strong><span className="editable-text" data-unique-id="c4ecd6c4-da54-481e-b75b-0cb1eb821767" data-file-name="components/TelegramGateway.tsx"> (⚙️) di pojok kanan bawah</span></li>
                <li data-unique-id="e9b88c0d-de50-45a9-b40a-4d3c386691d4" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="8efcf417-92e7-414f-8574-768dc096ef7e" data-file-name="components/TelegramGateway.tsx">Pilih </span><strong data-unique-id="2d67c827-0566-415a-9826-ec600b6229e1" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="7e7dc9f0-40df-422b-8b6d-b38d88d2bd9a" data-file-name="components/TelegramGateway.tsx">Perangkat</span></strong><span className="editable-text" data-unique-id="5157c0c5-204f-4539-ba57-063637970800" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="f2d567b3-93dc-4ed9-bd7c-6d5792894c5e" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="43c14c7c-d653-410d-9dcd-4788f0e5a268" data-file-name="components/TelegramGateway.tsx">Devices</span></strong></li>
                <li data-unique-id="ede927f9-e0d2-48e7-8574-0bdcae33477d" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="524d13a3-7be8-4e77-a8cb-afd867638c44" data-file-name="components/TelegramGateway.tsx">Ketuk </span><strong data-unique-id="f7e51deb-6b74-4d15-8edd-76a60469b0da" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="23bcded9-cd6f-43e9-953f-b83842b74b95" data-file-name="components/TelegramGateway.tsx">Scan QR Code</span></strong><span className="editable-text" data-unique-id="0f9887ae-0271-47ae-8404-ed0532c43f11" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="a6a99544-95c5-4e3f-baee-bc8cecb57ec9" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="c906a975-6d4a-402f-9961-726f1dbe197a" data-file-name="components/TelegramGateway.tsx">Link Desktop Device</span></strong></li>
                <li data-unique-id="9ebfcbcc-f695-4e82-9f1c-4e2c67bc354e" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="6fa32600-c066-4182-92d6-4b31c7fe0bfa" data-file-name="components/TelegramGateway.tsx">Arahkan kamera ke QR code yang ditampilkan di sini</span></li>
                <li data-unique-id="6f8fcbef-3b25-45d1-968f-8027e69ed02f" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="50cb69d9-e24f-4d84-b836-70b57dd47b33" data-file-name="components/TelegramGateway.tsx">Setelah terhubung, Anda dapat menggunakan Telegram Web melalui aplikasi ini</span></li>
              </ol>
            </CardContent>
          </Card>

          {connectionStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="a858ac0e-5f65-4ad5-840b-446ef90ad1cf" data-file-name="components/TelegramGateway.tsx">
              <XCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="d6ef6549-4628-476b-bbc8-b34c3e8aeb97" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}