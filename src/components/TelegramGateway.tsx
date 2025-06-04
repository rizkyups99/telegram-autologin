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
  return <div className="space-y-6" data-unique-id="c7fd57ce-27ff-43c3-868d-e5efcd70b767" data-file-name="components/TelegramGateway.tsx">
      <Card data-unique-id="f44ee811-8b03-4fb5-a38c-1257f6a9713a" data-file-name="components/TelegramGateway.tsx">
        <CardHeader data-unique-id="bc0698b9-0f7b-477c-9282-68c8f7db6f77" data-file-name="components/TelegramGateway.tsx">
          <CardTitle data-unique-id="fbea832a-ea1b-4946-bcb7-3337cc0b9725" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="615a4e03-76da-4955-9d36-45bb1ae37d61" data-file-name="components/TelegramGateway.tsx">Gateway Telegram</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="9942a71d-e7d1-492d-9f57-1349e498a24d" data-file-name="components/TelegramGateway.tsx">
            Hubungkan perangkat desktop Anda dengan Telegram Web melalui QR code
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="956782ec-dfdb-468d-bdea-ebf43a42b364" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted" data-unique-id="5ec608f4-1350-43c3-9f66-0900b64dc79d" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
            {connectionStatus === "connected" ? <div className="flex flex-col items-center space-y-4 py-8" data-unique-id="aafc58ea-337a-4ffc-b6ac-3b3005dc4fad" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center" data-unique-id="3c190f93-bdcc-4b4e-b72f-0229c6636acd" data-file-name="components/TelegramGateway.tsx">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-700" data-unique-id="ab583d8f-67f8-472a-a34a-b25de4127dc0" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b0a92abb-9c2b-4531-ae86-cccfaea71a30" data-file-name="components/TelegramGateway.tsx">Perangkat Terhubung</span></h3>
                <p className="text-center text-muted-foreground" data-unique-id="a709ea7a-9d21-4337-bc5e-571f231c0f77" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</p>
                <Button variant="outline" className="mt-4" onClick={disconnectDevice} data-unique-id="5c9aedd3-7c63-4654-a742-bde2328124c6" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="07d60fdc-722b-4fc0-8b68-7f398f83550f" data-file-name="components/TelegramGateway.tsx">
                  Putuskan Koneksi
                </span></Button>
              </div> : qrCodeUrl ? <div className="flex flex-col items-center space-y-4" data-unique-id="965fe6f9-e27f-4c2b-bd45-077a2197da2c" data-file-name="components/TelegramGateway.tsx">
                <div className="relative" ref={qrRef} data-unique-id="a176a8fa-400d-44cd-8da5-65160551c3ef" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  <QRCodeSVG value={qrCodeUrl} size={256} level="H" className="h-64 w-64 rounded-lg" includeMargin={true} />
                  {countdown > 0 && <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium" data-unique-id="a2f61a3c-8c7f-4012-a18d-ad314574826e" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                      {countdown}
                    </div>}
                </div>
                <p className="text-center text-muted-foreground max-w-md" data-unique-id="a247da6f-0fb7-4d3b-81d0-314ba64bc395" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  {statusMessage}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground" data-unique-id="d3309702-1dff-438c-9c67-a77e9566d665" data-file-name="components/TelegramGateway.tsx">
                  <Smartphone className="h-4 w-4" />
                  <span data-unique-id="a9b780fa-8e5b-43c9-8047-33204646d1ab" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="14361d2e-50b9-4600-9a69-4fda3e83bf46" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di perangkat Anda dan scan QR code ini</span></span>
                </div>
                <Button variant="outline" className="mt-2" onClick={generateQrCode} disabled={isGenerating} data-unique-id="c397734f-aa6d-4c2e-9171-a8d4a0f015d6" data-file-name="components/TelegramGateway.tsx">
                  <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="89b28592-d798-4d3c-9cd3-36d08a742e7b" data-file-name="components/TelegramGateway.tsx">
                  Refresh QR Code
                </span></Button>
              </div> : <div className="flex flex-col items-center space-y-6 py-8" data-unique-id="0d7b236a-22b0-4989-b5b8-8baca8e5d1b5" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-muted-foreground bg-opacity-10 flex items-center justify-center" data-unique-id="67b6890b-39dc-4ea1-a5ea-a248e9e0d830" data-file-name="components/TelegramGateway.tsx">
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2" data-unique-id="74f6b68b-2bdd-493a-9f23-4b4315502cb3" data-file-name="components/TelegramGateway.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="0175e078-6c8b-4025-8f24-4e87ef68a103" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="a90d9bdd-4313-4df0-bb46-7c2c838fe242" data-file-name="components/TelegramGateway.tsx">Hubungkan Perangkat Desktop</span></h3>
                  <p className="text-muted-foreground max-w-md" data-unique-id="9d2ac82a-6291-4838-9b6a-3e3f83571844" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="a6055af6-6ecd-49df-827d-4b9470435718" data-file-name="components/TelegramGateway.tsx">
                    Scan QR code untuk menghubungkan perangkat desktop Anda dengan Telegram Web
                  </span></p>
                </div>
                <Button onClick={generateQrCode} disabled={isGenerating} className="mt-4" data-unique-id="8da3f489-e738-4a02-8916-756b1bb0523a" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
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

          <Card className="bg-muted" data-unique-id="12531c5d-7a01-4c33-82f6-0f36d0afe656" data-file-name="components/TelegramGateway.tsx">
            <CardContent className="p-4" data-unique-id="2c5a19eb-407b-45d5-88e0-f4e912d464cd" data-file-name="components/TelegramGateway.tsx">
              <div className="flex items-start space-x-2 mb-3" data-unique-id="02a424b2-54e5-4abd-83d8-8e6688e2a661" data-file-name="components/TelegramGateway.tsx">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700" data-unique-id="528f17ff-0c3c-4bee-a02f-d4284d6437da" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="ef502e80-eee8-4dc5-af60-bda8010f1ffc" data-file-name="components/TelegramGateway.tsx">
                  Fitur ini menggunakan TDLib untuk menghubungkan aplikasi dengan akun Telegram Anda melalui QR code login.
                </span></p>
              </div>
              
              <h3 className="font-medium mb-2" data-unique-id="4dd71dd8-7ec1-4b24-973f-f7710318a4cb" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="5d26f19e-2532-443c-b5b2-e1fe5ba58bbb" data-file-name="components/TelegramGateway.tsx">Cara Menghubungkan Perangkat</span></h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm" data-unique-id="98908a54-ca54-4223-a26c-a3a17bab6035" data-file-name="components/TelegramGateway.tsx">
                <li data-unique-id="a7437966-3152-4f11-94d7-cbf1c1720f84" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b5b69ec6-9aed-4501-9689-78dca45cbf81" data-file-name="components/TelegramGateway.tsx">Klik tombol "Generate QR Code" untuk membuat kode QR</span></li>
                <li data-unique-id="70b9d2d8-af12-47e9-919a-fa496e566472" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="3b90914c-2e8d-47b3-b5ab-8fc362a39273" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di smartphone Anda</span></li>
                <li data-unique-id="5018c524-f5c0-499d-9029-d4021720c0d3" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="ab28effe-2d96-4450-98f7-e9b3d003c28d" data-file-name="components/TelegramGateway.tsx">Ketuk ikon </span><strong data-unique-id="1e2a4227-e320-40ea-93e4-c8b4eeb42d64" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="4966d0d0-672c-4166-bedd-31ed592cb0de" data-file-name="components/TelegramGateway.tsx">Pengaturan</span></strong><span className="editable-text" data-unique-id="12a3f717-b419-4c0b-9525-38de75b38e7d" data-file-name="components/TelegramGateway.tsx"> (⚙️) di pojok kanan bawah</span></li>
                <li data-unique-id="4a5856f3-2afe-4b08-a6ae-d228bb66bc86" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="352ac106-8080-488d-9d60-c300995971a6" data-file-name="components/TelegramGateway.tsx">Pilih </span><strong data-unique-id="4cb80f5b-e379-4334-b556-bc10732e928f" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="3b7b03b2-0dab-4972-b974-21fba27a0225" data-file-name="components/TelegramGateway.tsx">Perangkat</span></strong><span className="editable-text" data-unique-id="29f258a8-ced7-49cf-976d-c9b30234b714" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="c90dc209-e0d7-40a5-9b44-fdb3a8c40c06" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="395bb3d4-1811-4980-8782-b32f7d68f09b" data-file-name="components/TelegramGateway.tsx">Devices</span></strong></li>
                <li data-unique-id="9252d1a8-0a2e-421b-9b3d-32ae7a507a3b" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="88098b6d-7421-41f4-bb22-7ae5082e7b8b" data-file-name="components/TelegramGateway.tsx">Ketuk </span><strong data-unique-id="1bd763cf-fc82-4091-96c9-bb70313bc9c1" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="0444b958-c7c9-49df-babf-0056c22023c2" data-file-name="components/TelegramGateway.tsx">Scan QR Code</span></strong><span className="editable-text" data-unique-id="d087dd84-3e2d-4c2a-b943-1ea909ad6a0d" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="03ac6659-44b6-46dc-a3f5-45241ba0d334" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="49d8bf30-82ff-4afa-84f0-61fab467bae9" data-file-name="components/TelegramGateway.tsx">Link Desktop Device</span></strong></li>
                <li data-unique-id="e2cf67b8-9d2a-4f2e-b5fe-0451fe06c89d" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="a2f3049e-c976-4a89-baab-e6c9f15ccedd" data-file-name="components/TelegramGateway.tsx">Arahkan kamera ke QR code yang ditampilkan di sini</span></li>
                <li data-unique-id="9eda803a-3e82-49f2-996e-10812223b8e8" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="08d50142-ac6f-48cc-b69e-99f57fce3ccc" data-file-name="components/TelegramGateway.tsx">Setelah terhubung, Anda dapat menggunakan Telegram Web melalui aplikasi ini</span></li>
              </ol>
            </CardContent>
          </Card>

          {connectionStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="a99e9b37-8b84-4cc8-b827-02c0a2e3271a" data-file-name="components/TelegramGateway.tsx">
              <XCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="458dcf77-a867-4904-9048-5e48755781de" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}