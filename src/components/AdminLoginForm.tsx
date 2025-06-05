'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !accessCode) {
      setError("Email dan kode akses harus diisi");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // First try to authenticate against the admins database
      const response = await fetch("/api/admins/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          accessCode
        })
      });

      // If successful, store admin data and redirect
      if (response.ok) {
        const adminData = await response.json();

        // Store admin data in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem("admin", JSON.stringify({
            email: email,
            isAdmin: true,
            loginTime: new Date().toISOString()
          }));
        }

        // Redirect to admin page
        setTimeout(() => {
          router.push("/admin");
        }, 100);
        return;
      }

      // Fall back to hardcoded superadmin credentials
      if (email === "superadmin@admin.com" && accessCode === "8567899393") {
        try {
          // Try to register the superadmin account in the database first
          const registerResponse = await fetch("/api/admins", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email,
              accessCode
            })
          });
          console.log("Superadmin registration attempt result:", await registerResponse.json());
          // Continue regardless of registration result (it may fail if admin exists)
        } catch (err) {
          console.log("Superadmin auto-registration failed (continuing anyway):", err);
        }

        // Store admin data in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem("admin", JSON.stringify({
            email: email,
            isAdmin: true,
            loginTime: new Date().toISOString()
          }));
        }

        // Redirect to admin page with a slight delay to ensure localStorage is set
        setTimeout(() => {
          router.push("/admin");
        }, 100);
      } else {
        throw new Error("Email atau kode akses tidak valid");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };
  return <Card className="w-full max-w-md mx-auto" data-unique-id="3e9e0fa8-32ee-4b7d-a2ba-af8a309e94ba" data-file-name="components/AdminLoginForm.tsx">
      <CardHeader data-unique-id="586b69b3-4e27-4794-b5dc-5c8e92cce654" data-file-name="components/AdminLoginForm.tsx">
        <CardTitle className="text-xl sm:text-2xl text-center" data-unique-id="4f906adc-5ade-45f0-8cc7-fa7273c4ac85" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="fc7fbfac-edbe-4253-b6e3-d8b0a81a3cb5" data-file-name="components/AdminLoginForm.tsx">Login Sebagai Admin</span></CardTitle>
        <CardDescription className="text-sm sm:text-base text-center"><span className="editable-text" data-unique-id="b0ef5e47-766e-4cda-9574-9011aff38462" data-file-name="components/AdminLoginForm.tsx">
          Masukkan email dan kode akses admin Anda
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="caef3f90-8a13-43b8-9427-9c015e77dac2" data-file-name="components/AdminLoginForm.tsx">
        <form onSubmit={handleLogin} className="space-y-4" data-unique-id="1a7fecc3-580f-433f-8fd0-42930ac12a7f" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">
          <div className="space-y-2" data-unique-id="6db3e4f7-4fed-49f3-a19d-2aa4d8ed6296" data-file-name="components/AdminLoginForm.tsx">
            <Label htmlFor="email" data-unique-id="ce2eba3a-9f9d-4c50-89bc-eb6248e51ded" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="a7e54dd7-6377-4b52-ba83-601d15318c06" data-file-name="components/AdminLoginForm.tsx">Email</span></Label>
            <Input id="email" type="email" placeholder="Masukkan email admin" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} data-unique-id="d678f751-9b6f-43e1-baae-7a6af5aef18c" data-file-name="components/AdminLoginForm.tsx" />
          </div>
          
          <div className="space-y-2" data-unique-id="83f8feb2-58eb-4ba3-aa35-b87c656e5386" data-file-name="components/AdminLoginForm.tsx">
            <Label htmlFor="access-code" data-unique-id="49edfc60-1848-4fdd-b948-d6a44d2cf6fc" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="4b67b6c9-b3f3-482e-a4c0-9a7f3020f7f5" data-file-name="components/AdminLoginForm.tsx">Kode Akses</span></Label>
            <Input id="access-code" type="password" placeholder="Masukkan kode akses" value={accessCode} onChange={e => setAccessCode(e.target.value)} disabled={isLoading} data-unique-id="a2b89d0c-cf0f-4034-8193-d607437128b8" data-file-name="components/AdminLoginForm.tsx" />
          </div>
          
          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="4ca11064-c248-4987-95fd-43a0fbd43ba9" data-file-name="components/AdminLoginForm.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="9ce8fa88-297e-4b15-85b4-bd5d5454278b" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">{error}</span>
            </div>}
          
          <Button type="submit" className="w-full bg-green-200 hover:bg-green-300 text-green-800" disabled={isLoading} onClick={() => {
          console.log("Login button clicked");
        }} data-unique-id="8f07f742-81f7-4ff0-b5ac-0fc63284f778" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </> : "Login Admin"}
          </Button>
        </form>
      </CardContent>
    </Card>;
}