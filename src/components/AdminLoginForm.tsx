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
  return <Card className="w-full max-w-md mx-auto" data-unique-id="669377d5-2f22-4fec-9024-807caf80e4da" data-file-name="components/AdminLoginForm.tsx">
      <CardHeader data-unique-id="1949c12d-f9ac-4fb5-9899-fc29342e5ca2" data-file-name="components/AdminLoginForm.tsx">
        <CardTitle className="text-xl sm:text-2xl text-center" data-unique-id="ebd52e91-a087-48b5-97f0-6b940f2ded0d" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="af969aa1-2987-446b-acd6-d44baaf1bfb8" data-file-name="components/AdminLoginForm.tsx">Login Sebagai Admin</span></CardTitle>
        <CardDescription className="text-sm sm:text-base text-center"><span className="editable-text" data-unique-id="e121fdec-1bf5-4a38-a2e0-eb807a294fc9" data-file-name="components/AdminLoginForm.tsx">
          Masukkan email dan kode akses admin Anda
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="49ea1019-2832-415a-ad2d-0e7a4fabdfe4" data-file-name="components/AdminLoginForm.tsx">
        <form onSubmit={handleLogin} className="space-y-4" data-unique-id="d42948a5-e461-4617-9433-e5943f5e99a1" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">
          <div className="space-y-2" data-unique-id="ed219fbf-6cbc-48e6-8e33-e698925863c9" data-file-name="components/AdminLoginForm.tsx">
            <Label htmlFor="email" data-unique-id="9bdd21ec-94b5-4689-b668-986d64011d9a" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="ff606fb7-ed72-46a9-8f33-809451550355" data-file-name="components/AdminLoginForm.tsx">Email</span></Label>
            <Input id="email" type="email" placeholder="Masukkan email admin" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} data-unique-id="1f871a77-92fc-4284-8677-77f8255bef2d" data-file-name="components/AdminLoginForm.tsx" />
          </div>
          
          <div className="space-y-2" data-unique-id="aabcf46a-abcf-47d8-a6af-f8e07b96f087" data-file-name="components/AdminLoginForm.tsx">
            <Label htmlFor="access-code" data-unique-id="9f5be20f-0511-4c94-8c83-6c9bacaff7a5" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="082294ad-875c-48c9-88ed-9b87aa509f18" data-file-name="components/AdminLoginForm.tsx">Kode Akses</span></Label>
            <Input id="access-code" type="password" placeholder="Masukkan kode akses" value={accessCode} onChange={e => setAccessCode(e.target.value)} disabled={isLoading} data-unique-id="6e280dcc-b2c7-4717-b28c-c0cf54b30721" data-file-name="components/AdminLoginForm.tsx" />
          </div>
          
          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="b70ba836-8da7-4b01-9958-4e8e460838c5" data-file-name="components/AdminLoginForm.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="3d4658ef-44f6-4843-83e2-2a21a4a2edcb" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">{error}</span>
            </div>}
          
          <Button type="submit" className="w-full bg-green-200 hover:bg-green-300 text-green-800" disabled={isLoading} onClick={() => {
          console.log("Login button clicked");
        }} data-unique-id="180cf46f-3ada-4fa0-a936-536c7adfa620" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </> : "Login Admin"}
          </Button>
        </form>
      </CardContent>
    </Card>;
}