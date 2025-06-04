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
  return <Card className="w-full max-w-md mx-auto" data-unique-id="fd6448f7-7457-464b-849b-dba713d56228" data-file-name="components/AdminLoginForm.tsx">
      <CardHeader data-unique-id="ae972a3a-90f0-4cf9-97df-9446118fdb85" data-file-name="components/AdminLoginForm.tsx">
        <CardTitle className="text-xl sm:text-2xl text-center" data-unique-id="806ece52-c366-4a10-a08a-ade4bee6b63a" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="4e5625f4-1e67-49ed-9cef-d5ba439af5be" data-file-name="components/AdminLoginForm.tsx">Login Sebagai Admin</span></CardTitle>
        <CardDescription className="text-sm sm:text-base text-center"><span className="editable-text" data-unique-id="0e5ae89b-4374-4af4-8b8d-63c0d8a31131" data-file-name="components/AdminLoginForm.tsx">
          Masukkan email dan kode akses admin Anda
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="fa453827-f2cd-46b8-9a3f-22ce265c6241" data-file-name="components/AdminLoginForm.tsx">
        <form onSubmit={handleLogin} className="space-y-4" data-unique-id="10265097-577c-44ba-a409-82a477dbf6ea" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">
          <div className="space-y-2" data-unique-id="1496676b-9c0c-4f1e-9472-70926cc08a09" data-file-name="components/AdminLoginForm.tsx">
            <Label htmlFor="email" data-unique-id="8f66c0f5-a594-4f48-aa8d-a425005165e2" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="99786cf4-5862-42c8-adce-7de60400b06e" data-file-name="components/AdminLoginForm.tsx">Email</span></Label>
            <Input id="email" type="email" placeholder="Masukkan email admin" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} data-unique-id="773f623d-98ed-44ba-9e71-93f91a2d5a4a" data-file-name="components/AdminLoginForm.tsx" />
          </div>
          
          <div className="space-y-2" data-unique-id="350e0c9a-3f1e-4ee1-b1b8-000763465854" data-file-name="components/AdminLoginForm.tsx">
            <Label htmlFor="access-code" data-unique-id="9a270e85-01d3-4327-bb09-78e9926dac65" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="ca42098c-5db7-40e4-a615-ca220bee3077" data-file-name="components/AdminLoginForm.tsx">Kode Akses</span></Label>
            <Input id="access-code" type="password" placeholder="Masukkan kode akses" value={accessCode} onChange={e => setAccessCode(e.target.value)} disabled={isLoading} data-unique-id="576b5aa5-2abc-432b-8bf4-bd8178a6c905" data-file-name="components/AdminLoginForm.tsx" />
          </div>
          
          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="2c574fa2-a18e-491e-9ec7-1aba2fe713b0" data-file-name="components/AdminLoginForm.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="128feb77-6c54-41e2-a93d-20095a83dca1" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">{error}</span>
            </div>}
          
          <Button type="submit" className="w-full bg-green-200 hover:bg-green-300 text-green-800" disabled={isLoading} onClick={() => {
          console.log("Login button clicked");
        }} data-unique-id="e57adff2-4c16-4d91-8f6e-4e49269547db" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </> : "Login Admin"}
          </Button>
        </form>
      </CardContent>
    </Card>;
}