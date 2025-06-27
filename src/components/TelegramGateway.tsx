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
  return <div className="space-y-6" data-unique-id="e7728f03-353d-453b-8ef5-84379c9ce594" data-file-name="components/TelegramGateway.tsx">
      <Card data-unique-id="ebdffa6a-d89a-47e8-8b12-1ef3728c90ae" data-file-name="components/TelegramGateway.tsx">
        <CardHeader data-unique-id="03e8287a-afce-4706-9681-3b42ad4ebacd" data-file-name="components/TelegramGateway.tsx">
          <CardTitle data-unique-id="ebfb509a-6842-454e-9df2-c31923e7c9b2" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="f265c586-6915-4496-925b-57477d2f52d6" data-file-name="components/TelegramGateway.tsx">Gateway Telegram</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="0f37668f-1166-4251-a410-fc9289fac615" data-file-name="components/TelegramGateway.tsx">
            Hubungkan perangkat desktop Anda dengan Telegram Web melalui QR code
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="2f2b2eb7-9e5c-43e8-98e4-8587c94bdcc6" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted" data-unique-id="761ff32b-a948-48d0-b0da-d362e35b41ce" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
            {connectionStatus === "connected" ? <div className="flex flex-col items-center space-y-4 py-8" data-unique-id="ebfc98a5-b0d3-4451-8168-d2e6f1cfef14" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center" data-unique-id="ab1e051a-9b11-4565-9a19-462aafe91605" data-file-name="components/TelegramGateway.tsx">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-700" data-unique-id="a4c75e55-c5ec-44c5-a457-5209bff88b42" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="5adf535f-3a9c-4f31-8d6f-253e1f7f7a35" data-file-name="components/TelegramGateway.tsx">Perangkat Terhubung</span></h3>
                <p className="text-center text-muted-foreground" data-unique-id="5c3e84e1-7014-4df0-a01d-f0d8ca2d415d" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</p>
                <Button variant="outline" className="mt-4" onClick={disconnectDevice} data-unique-id="9c6bf398-ec3a-40df-abda-5318976f785f" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="5adf3d7c-2dd8-47f1-bfc7-78b2e82b1f30" data-file-name="components/TelegramGateway.tsx">
                  Putuskan Koneksi
                </span></Button>
              </div> : qrCodeUrl ? <div className="flex flex-col items-center space-y-4" data-unique-id="57c65187-9a97-4020-af4a-92032136c50c" data-file-name="components/TelegramGateway.tsx">
                <div className="relative" ref={qrRef} data-unique-id="2fd6996f-b7e1-492f-9446-72145bacf200" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  <QRCodeSVG value={qrCodeUrl} size={256} level="H" className="h-64 w-64 rounded-lg" includeMargin={true} />
                  {countdown > 0 && <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium" data-unique-id="128e7b50-9643-4976-a727-d9b736d437cd" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                      {countdown}
                    </div>}
                </div>
                <p className="text-center text-muted-foreground max-w-md" data-unique-id="d00e0aed-71fd-4bf1-a1fe-a52b370cdb47" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
                  {statusMessage}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground" data-unique-id="6e112629-dffa-43bd-a0da-32ac7a44a3eb" data-file-name="components/TelegramGateway.tsx">
                  <Smartphone className="h-4 w-4" />
                  <span data-unique-id="68980ca0-17f9-44d6-acc4-3f3ad73d3467" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="259e4505-8805-4c5b-a007-82860c5d919a" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di perangkat Anda dan scan QR code ini</span></span>
                </div>
                <Button variant="outline" className="mt-2" onClick={generateQrCode} disabled={isGenerating} data-unique-id="1a1bda36-1e07-45c8-af26-7b69f29b2b9c" data-file-name="components/TelegramGateway.tsx">
                  <RefreshCw className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="8337cdaa-fa31-407e-af72-cf09ac140b29" data-file-name="components/TelegramGateway.tsx">
                  Refresh QR Code
                </span></Button>
              </div> : <div className="flex flex-col items-center space-y-6 py-8" data-unique-id="1ffecb8e-6837-46ce-bdb8-eb8db1faa935" data-file-name="components/TelegramGateway.tsx">
                <div className="h-16 w-16 rounded-full bg-muted-foreground bg-opacity-10 flex items-center justify-center" data-unique-id="9910a7e5-b263-44c2-9a2f-540b4551e7db" data-file-name="components/TelegramGateway.tsx">
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2" data-unique-id="e863aa41-4c10-4f07-a9b3-9e126e947e2d" data-file-name="components/TelegramGateway.tsx">
                  <h3 className="text-lg font-medium" data-unique-id="6f779fc5-0273-40b3-b705-57f971298bb7" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="76d6afb7-8aae-418d-95d6-ca2d2ef5e47b" data-file-name="components/TelegramGateway.tsx">Hubungkan Perangkat Desktop</span></h3>
                  <p className="text-muted-foreground max-w-md" data-unique-id="bac3c1c2-98f5-40f0-951b-8a6b3f271da8" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="1abf864f-c096-4c1c-ba52-b04902ceeb04" data-file-name="components/TelegramGateway.tsx">
                    Scan QR code untuk menghubungkan perangkat desktop Anda dengan Telegram Web
                  </span></p>
                </div>
                <Button onClick={generateQrCode} disabled={isGenerating} className="mt-4" data-unique-id="6e4c16c8-330d-42e6-b5ed-a2da9efa6ba8" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">
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

          <Card className="bg-muted" data-unique-id="bbd1eadb-3587-479c-a455-e3f94d27bf94" data-file-name="components/TelegramGateway.tsx">
            <CardContent className="p-4" data-unique-id="8bd199db-5c69-4cda-bfd5-366fc37113be" data-file-name="components/TelegramGateway.tsx">
              <div className="flex items-start space-x-2 mb-3" data-unique-id="be7cadc4-6008-46cb-a5c9-8f12415891f8" data-file-name="components/TelegramGateway.tsx">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700" data-unique-id="bfe90bff-1836-49a6-ae63-1023db088f71" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="e7e93a1d-9613-4c92-b0c7-4af20fec05ae" data-file-name="components/TelegramGateway.tsx">
                  Fitur ini menggunakan TDLib untuk menghubungkan aplikasi dengan akun Telegram Anda melalui QR code login.
                </span></p>
              </div>
              
              <h3 className="font-medium mb-2" data-unique-id="37590d49-82e2-4c17-b12b-d03cabd3b803" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="80aed374-1f2e-477d-9279-05bf65396e4d" data-file-name="components/TelegramGateway.tsx">Cara Menghubungkan Perangkat</span></h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm" data-unique-id="5f00379a-53b9-4055-b18d-e7610fb8eb90" data-file-name="components/TelegramGateway.tsx">
                <li data-unique-id="4b46c2e8-1087-431d-8789-a23b71b12286" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="9328e474-984e-4c76-a0de-b87fc3f67395" data-file-name="components/TelegramGateway.tsx">Klik tombol "Generate QR Code" untuk membuat kode QR</span></li>
                <li data-unique-id="f78d3d12-d58c-403b-8d29-0face4450d76" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="e10a9b10-cf25-4c45-8eec-c611a3185aae" data-file-name="components/TelegramGateway.tsx">Buka aplikasi Telegram di smartphone Anda</span></li>
                <li data-unique-id="d547b1e6-42bb-4eb8-8ba0-ed1a2e8ea0fe" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="4a155e5a-aea1-46c8-ad21-f3e03e63af51" data-file-name="components/TelegramGateway.tsx">Ketuk ikon </span><strong data-unique-id="5d103d5e-a36c-45f3-b633-b6e27775820b" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="489207ac-1c08-460c-b222-a3679a7ae5ce" data-file-name="components/TelegramGateway.tsx">Pengaturan</span></strong><span className="editable-text" data-unique-id="7eecdb32-e265-458c-b6ba-32ee2bdc9616" data-file-name="components/TelegramGateway.tsx"> (⚙️) di pojok kanan bawah</span></li>
                <li data-unique-id="ca315691-439a-49bd-b2c8-4e34cd32c050" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="b148e8b5-b3f3-4f23-9e16-3d1f16bb24fd" data-file-name="components/TelegramGateway.tsx">Pilih </span><strong data-unique-id="ff292189-db1c-48d7-bbe0-e81ac3aff17a" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="535a3807-2399-4f87-9eec-11add4513c32" data-file-name="components/TelegramGateway.tsx">Perangkat</span></strong><span className="editable-text" data-unique-id="69831926-c20a-440a-8a51-20f55d8f82d0" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="6bdb11d2-5585-4c87-ade0-01cba9699949" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="966bd764-6bb4-480d-b8d6-e5eecca41674" data-file-name="components/TelegramGateway.tsx">Devices</span></strong></li>
                <li data-unique-id="88ef0268-7d01-45c3-b756-19a2bf923f6a" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="9f6cd276-ab88-481d-90e4-d3105e8bbeca" data-file-name="components/TelegramGateway.tsx">Ketuk </span><strong data-unique-id="d21bfad1-6cdd-4c93-8268-bee5edf473e6" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="fca9ce5e-cd21-49cc-a822-4a45b38a1f03" data-file-name="components/TelegramGateway.tsx">Scan QR Code</span></strong><span className="editable-text" data-unique-id="9e41fb88-349f-4206-93fc-d89d923af4cf" data-file-name="components/TelegramGateway.tsx"> atau </span><strong data-unique-id="d4a743c1-3d2e-4e14-8e96-72b021e596c0" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="33ecc0fe-b954-4690-8d91-8829dcb85485" data-file-name="components/TelegramGateway.tsx">Link Desktop Device</span></strong></li>
                <li data-unique-id="7dabdbba-a1cb-4d94-9f1e-1ae99e3d2f79" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="36572e71-f729-42ce-a0f2-302e4552b799" data-file-name="components/TelegramGateway.tsx">Arahkan kamera ke QR code yang ditampilkan di sini</span></li>
                <li data-unique-id="758fcf6a-3c76-434c-ab34-1a64b55fa8ca" data-file-name="components/TelegramGateway.tsx"><span className="editable-text" data-unique-id="614c22e3-28a2-4058-8a0e-c3e155305753" data-file-name="components/TelegramGateway.tsx">Setelah terhubung, Anda dapat menggunakan Telegram Web melalui aplikasi ini</span></li>
              </ol>
            </CardContent>
          </Card>

          {connectionStatus === "error" && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="b08d0c73-f757-4978-b81c-9f1c6d6f4aea" data-file-name="components/TelegramGateway.tsx">
              <XCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="777c4db4-e86d-477f-ab8d-eb91d3a307ef" data-file-name="components/TelegramGateway.tsx" data-dynamic-text="true">{statusMessage}</span>
            </div>}
        </CardContent>
      </Card>
    </div>;
}