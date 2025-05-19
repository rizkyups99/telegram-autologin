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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apiId: API_ID,
          apiHash: API_HASH
        }),
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
        expires: data.expires || Math.floor(Date.now() / 1000) + 30, // Default 30 seconds expiry
        token: data.token
      };
      
      setLoginToken(tokenData);
      
      // Create the QR code URL
      // The token must be encoded using base64url and embedded in a tg://login?token=base64encodedtoken URL
      const base64Token = btoa(data.token)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
      
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
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
              "Content-Type": "application/json",
            },
            body: authData,
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gateway Telegram</CardTitle>
          <CardDescription>
            Hubungkan perangkat desktop Anda dengan Telegram Web melalui QR code
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-muted">
            {connectionStatus === "connected" ? (
              <div className="flex flex-col items-center space-y-4 py-8">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-green-700">Perangkat Terhubung</h3>
                <p className="text-center text-muted-foreground">{statusMessage}</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={disconnectDevice}
                >
                  Putuskan Koneksi
                </Button>
              </div>
            ) : qrCodeUrl ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="relative" ref={qrRef}>
                  <QRCodeSVG 
                    value={qrCodeUrl}
                    size={256}
                    level="H"
                    className="h-64 w-64 rounded-lg"
                    includeMargin={true}
                  />
                  {countdown > 0 && (
                    <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                      {countdown}
                    </div>
                  )}
                </div>
                <p className="text-center text-muted-foreground max-w-md">
                  {statusMessage}
                </p>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Smartphone className="h-4 w-4" />
                  <span>Buka aplikasi Telegram di perangkat Anda dan scan QR code ini</span>
                </div>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={generateQrCode}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh QR Code
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6 py-8">
                <div className="h-16 w-16 rounded-full bg-muted-foreground bg-opacity-10 flex items-center justify-center">
                  <QrCode className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium">Hubungkan Perangkat Desktop</h3>
                  <p className="text-muted-foreground max-w-md">
                    Scan QR code untuk menghubungkan perangkat desktop Anda dengan Telegram Web
                  </p>
                </div>
                <Button 
                  onClick={generateQrCode}
                  disabled={isGenerating}
                  className="mt-4"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating QR Code...
                    </>
                  ) : (
                    <>
                      <QrCode className="h-4 w-4 mr-2" />
                      Generate QR Code
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          <Card className="bg-muted">
            <CardContent className="p-4">
              <div className="flex items-start space-x-2 mb-3">
                <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                  Fitur ini menggunakan TDLib untuk menghubungkan aplikasi dengan akun Telegram Anda melalui QR code login.
                </p>
              </div>
              
              <h3 className="font-medium mb-2">Cara Menghubungkan Perangkat</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm">
                <li>Klik tombol "Generate QR Code" untuk membuat kode QR</li>
                <li>Buka aplikasi Telegram di smartphone Anda</li>
                <li>Ketuk ikon <strong>Pengaturan</strong> (⚙️) di pojok kanan bawah</li>
                <li>Pilih <strong>Perangkat</strong> atau <strong>Devices</strong></li>
                <li>Ketuk <strong>Scan QR Code</strong> atau <strong>Link Desktop Device</strong></li>
                <li>Arahkan kamera ke QR code yang ditampilkan di sini</li>
                <li>Setelah terhubung, Anda dapat menggunakan Telegram Web melalui aplikasi ini</li>
              </ol>
            </CardContent>
          </Card>

          {connectionStatus === "error" && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center">
              <XCircle className="h-5 w-5 mr-2" />
              <span>{statusMessage}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
