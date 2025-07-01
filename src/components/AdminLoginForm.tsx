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
  return <Card className="w-full max-w-md mx-auto" data-unique-id="cf62cd84-8ed3-4053-bc4f-375b02869de2" data-file-name="components/AdminLoginForm.tsx">
      <CardHeader data-unique-id="d3be21c5-b6bf-415c-a9e3-cf55058d503a" data-file-name="components/AdminLoginForm.tsx">
        <CardTitle className="text-xl sm:text-2xl text-center" data-unique-id="c63b74bd-a4e6-4f75-88cf-73dcd381bd9e" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="51d5fff0-51ae-44b5-a6b5-2f4a9916ef8b" data-file-name="components/AdminLoginForm.tsx">Login Sebagai Admin</span></CardTitle>
        <CardDescription className="text-sm sm:text-base text-center"><span className="editable-text" data-unique-id="dae7d54f-7227-4a02-85f9-9274b74b7f3e" data-file-name="components/AdminLoginForm.tsx">
          Masukkan email dan kode akses admin Anda
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="a1482516-91d2-4c4b-af72-531ec905c070" data-file-name="components/AdminLoginForm.tsx">
        <form onSubmit={handleLogin} className="space-y-4" data-unique-id="2090e463-e611-44be-9916-09ddb405e6b3" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">
          <div className="space-y-2" data-unique-id="4f4a89a7-7814-4b97-a85b-fe2414190497" data-file-name="components/AdminLoginForm.tsx">
            <Label htmlFor="email" data-unique-id="70fc55e4-03b8-4654-98e0-f7b279565f8d" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="305637a5-b2d8-4575-9c96-757daf19fb34" data-file-name="components/AdminLoginForm.tsx">Email</span></Label>
            <Input id="email" type="email" placeholder="Masukkan email admin" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} data-unique-id="af2a381f-840b-4e11-92b2-2d5a2ef33e30" data-file-name="components/AdminLoginForm.tsx" />
          </div>
          
          <div className="space-y-2" data-unique-id="85def9d1-77db-4cb9-902c-3de6ef7c88e8" data-file-name="components/AdminLoginForm.tsx">
            <Label htmlFor="access-code" data-unique-id="609dc969-1132-4e2e-a3c7-341acbdb743d" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="b1fcb6eb-6706-406c-a20e-f77e1459eb8d" data-file-name="components/AdminLoginForm.tsx">Kode Akses</span></Label>
            <Input id="access-code" type="password" placeholder="Masukkan kode akses" value={accessCode} onChange={e => setAccessCode(e.target.value)} disabled={isLoading} data-unique-id="b779f145-98c2-4a1d-816b-a4f28617bd38" data-file-name="components/AdminLoginForm.tsx" />
          </div>
          
          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="457b1773-9d49-409d-84cf-4707ff61cf58" data-file-name="components/AdminLoginForm.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="a1171d3c-ccfd-4805-b835-669e1c9e623d" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">{error}</span>
            </div>}
          
          <Button type="submit" className="w-full bg-green-200 hover:bg-green-300 text-green-800" disabled={isLoading} onClick={() => {
          console.log("Login button clicked");
        }} data-unique-id="05c59b5e-a038-4ec5-be3e-d2f2e4f6a4c4" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </> : "Login Admin"}
          </Button>
        </form>
      </CardContent>
    </Card>;
}