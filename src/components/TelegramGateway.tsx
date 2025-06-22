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
  return <div className="space-y-6" data-unique-id="fe88815e-e761-4607-a9fa-ee4bc6fbf561" data-file-name="components/TelegramGateway.tsx">
      <Card data-unique-id="8cafaf61-bc31-434e-b6d6-192de25fa898" data-file-name="components/TelegramGateway.tsx">
        <CardHeader data-unique-id="ced74fe5-2614-451a-b81c-2d0423d7f29a" data-file-name="components/TelegramGateway.tsx">
          <CardTitle data-unique-id="4538baa2-80af-45e5-b3b9-de41265ad97d" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="ac771ce2-2a2f-415b-8d46-418eb27ffbbc" data-file-name="components/TelegramGateway.tsx">Gateway Telegram</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="ecaaaa8e-ad2a-44cb-bf44-bd7e722c3b87" data-file-name="components/TelegramGateway.tsx">
            Hubungkan perangkat desktop Anda dengan Telegram Web melalui QR code
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="1cdf4da6-94a5-4aa2-9254-183b4ee949ad" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted" data-unique-id="54aa6aa2-bfe2-41e8-872f-1e02dd9016e2" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
            {connectionStatus === "connected" ? <div className="flex flex-col items-center space-y-4 py-8" data-unique-id="16210743-9bfe-4a49-b79e-ac9992db8f35" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center" data-unique-id="40a0a8bb-806d-4882-a165-c0aa1b5cd1f4" data-file-name="components/TelegramGateway.tsx">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-700" data-unique-id="5ec20ad1-0291-4dbe-8319-48788701a88c" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="301015db-027c-46e7-b987-4f8d12814561" data-file-name="components/TelegramGateway.tsx">Perangkat Terhubung</span></h3>
                <p className="text-center text-muted-foreground" data-unique-id="ee343ff4-4340-462f-aef6-abc66e9ef16c" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</p>
                <Button variant="outline" className="mt-4" onClick={disconnectDevice} data-unique-id="c62ade84-1b18-4250-a6ac-87aadd311473" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="90669f25-9a32-4a20-a4fb-8afb46bf12cb" data-file-name="components/TelegramGateway.tsx">
                  Putuskan Koneksi
                </span></Button>
              </div> : qrCodeUrl ? <div className="flex flex-col items-center space-y-4" data-unique-id="c1349e5b-1498-49b0-899e-58ef7be81968" data-file-name="components/TelegramGateway.tsx">
                <div className="relative" ref={qrRef} data-unique-id="6848ce4c-5289-4522-b54d-7df7d2eb6758" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  <QRCodeSVG value={qrCodeUrl} size={256} level="H" className="h-64 w-64 rounded-lg" includeMargin={true} />
                  {countdown > 0 && <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium" data-unique-id="27200e2f-89e0-474b-b156-bea542a85ef8" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                      {countdown}
                    </div>}
                </div>
                <p className="text-center text-muted-foreground max-w-md" data-unique-id="e7c9449c-bb9e-4239-930d-4770ce1879ac" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  {statusMessage}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground" data-unique-id="1735646f-39eb-4112-b766-4f4f5fe91425" data-file-name="components/TelegramGateway.tsx">
                  <Smartphone className="h-4 w-4" />
                  <span data-unique-id="a53042e1-dbd6-4c77-9b01-ee5e9d4779a7" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="8654b786-fcc3-4c6d-8261-4e94e4a0b4f4" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di perangkat Anda dan scan QR code ini</span></span>
                </div>
                <Button variant="outline" className="mt-2" onClick={generateQrCode} disabled={isGenerating} data-unique-id="53ef2bed-1f71-4f91-b099-bd29d2411da6" data-file-name="components/TelegramGateway.tsx">
                  <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="183c5d6a-ddbd-461d-84ad-948c6ac7b2d9" data-file-name="components/TelegramGateway.tsx">
                  Refresh QR Code
                </span></Button>
              </div> : <div className="flex flex-col items-center space-y-6 py-8" data-unique-id="e9f2173c-bd10-4d46-9cab-c4ca39365219" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-muted-foreground bg-opacity-10 flex items-center justify-center" data-unique-id="8cdf3681-2d98-40c0-ae7a-e106c97532af" data-file-name="components/TelegramGateway.tsx">
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2" data-unique-id="c5023af0-fc25-4c4a-929a-46c3598604da" data-file-name="components/TelegramGateway.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="9b46effa-59df-44bf-91c7-bf889aae6c52" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="76c87741-8026-4420-bc8a-f809903702bc" data-file-name="components/TelegramGateway.tsx">Hubungkan Perangkat Desktop</span></h3>
                  <p className="text-muted-foreground max-w-md" data-unique-id="2071ac39-0907-4959-9441-f422388167af" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="fbce3758-839a-4c57-a95a-8fcd1b4df56f" data-file-name="components/TelegramGateway.tsx">
                    Scan QR code untuk menghubungkan perangkat desktop Anda dengan Telegram Web
                  </span></p>
                </div>
                <Button onClick={generateQrCode} disabled={isGenerating} className="mt-4" data-unique-id="292077fb-938f-417f-8a7a-b3cc4ead8440" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
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

          <Card className="bg-muted" data-unique-id="cd26845c-6e1d-4847-90f9-8e0b1105e708" data-file-name="components/TelegramGateway.tsx">
            <CardContent className="p-4" data-unique-id="23a4afa4-4f35-4405-89d5-1a7d05e90767" data-file-name="components/TelegramGateway.tsx">
              <div className="flex items-start space-x-2 mb-3" data-unique-id="f3706521-ae37-4913-97c1-f60749afb150" data-file-name="components/TelegramGateway.tsx">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700" data-unique-id="68267bbd-5df4-4b95-9c5b-97aa485b50b8" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="14cbdc2c-787a-411a-b08e-858b0ffc7fff" data-file-name="components/TelegramGateway.tsx">
                  Fitur ini menggunakan TDLib untuk menghubungkan aplikasi dengan akun Telegram Anda melalui QR code login.
                </span></p>
              </div>
              
              <h3 className="font-medium mb-2" data-unique-id="15bc7774-6728-40a9-a3e4-22207bc03f2e" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="c1d72171-8f62-4508-8363-24131f2552b4" data-file-name="components/TelegramGateway.tsx">Cara Menghubungkan Perangkat</span></h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm" data-unique-id="ec9014d3-c2ca-442e-bb93-07b04327d678" data-file-name="components/TelegramGateway.tsx">
                <li data-unique-id="e2323baf-e2d1-4189-8385-1cb3fd772b6d" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="a1ac41cd-9bf1-4626-927a-fad498f1fce5" data-file-name="components/TelegramGateway.tsx">Klik tombol "Generate QR Code" untuk membuat kode QR</span></li>
                <li data-unique-id="7b27da47-e75f-4dc8-85f2-c6f5026db427" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="cf56e443-0976-4010-913d-1dd7ad7129fc" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di smartphone Anda</span></li>
                <li data-unique-id="77850f2b-4b21-4746-838a-66724e6e75a7" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="05837e8a-4ceb-482f-b605-a5755d13fa96" data-file-name="components/TelegramGateway.tsx">Ketuk ikon </span><strong data-unique-id="e9fd783a-0b45-4642-b80d-d3751ea1da56" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="ae733b01-79b0-452f-8cd6-55fd44ea63e5" data-file-name="components/TelegramGateway.tsx">Pengaturan</span></strong><span className="editable-text" data-unique-id="573b8062-7134-43ab-8c91-2727c7cf6a81" data-file-name="components/TelegramGateway.tsx"> (⚙️) di pojok kanan bawah</span></li>
                <li data-unique-id="1b849dc2-0999-4ec9-be0c-dfcd10d1ad4d" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="8e99cf0d-4e7c-49ce-9ad9-332788a61414" data-file-name="components/TelegramGateway.tsx">Pilih </span><strong data-unique-id="0397b87e-b926-4b67-8be9-fb8724a66bd2" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="eefd9549-5a26-4611-892c-0571fe1ba158" data-file-name="components/TelegramGateway.tsx">Perangkat</span></strong><span className="editable-text" data-unique-id="78a3e1b2-cc55-49d9-8977-f7c9f2d3a93e" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="5269b9ab-5cee-4268-b5f7-41e7eb4deaf3" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="2f2f6777-be2e-4a6d-a022-c0841c8da595" data-file-name="components/TelegramGateway.tsx">Devices</span></strong></li>
                <li data-unique-id="be1f91bb-7840-40b2-956b-5cd107725f80" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="6e2bd239-dbc6-4603-942d-7b92ef3287df" data-file-name="components/TelegramGateway.tsx">Ketuk </span><strong data-unique-id="10ebf2ba-9d01-4994-9de1-a7d448422cc7" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="799d1389-de78-4fd1-814f-a74fb9b572f6" data-file-name="components/TelegramGateway.tsx">Scan QR Code</span></strong><span className="editable-text" data-unique-id="a0f2fb84-d840-4513-bf20-f43c8652283e" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="35c18a0a-39de-46fa-aa22-ac265b77b218" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="6a8d4be9-4afe-46e9-941c-0f59aad421c6" data-file-name="components/TelegramGateway.tsx">Link Desktop Device</span></strong></li>
                <li data-unique-id="bd8e4275-3672-4d58-a048-3823a48dadd6" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="9ae2a2ce-27d9-420a-a107-2384449a8d8e" data-file-name="components/TelegramGateway.tsx">Arahkan kamera ke QR code yang ditampilkan di sini</span></li>
                <li data-unique-id="a52c5e8f-7e9c-4b7f-b15a-92cceda1115c" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="c310e22e-6cde-4369-80b0-301c7369b0a3" data-file-name="components/TelegramGateway.tsx">Setelah terhubung, Anda dapat menggunakan Telegram Web melalui aplikasi ini</span></li>
              </ol>
            </CardContent>
          </Card>

          {connectionStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="14732a11-6d02-4a23-b7d2-84e79bd73260" data-file-name="components/TelegramGateway.tsx">
              <XCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="4bbe603d-7d9f-43f2-881d-3818f9b47661" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}