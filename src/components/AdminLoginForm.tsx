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
  return <Card className="w-full max-w-md mx-auto" data-unique-id="8de5d4ea-cf71-4a1d-94ee-61514a736fde" data-file-name="components/AdminLoginForm.tsx">
      <CardHeader data-unique-id="e4f6bfb5-1bb2-40ac-964f-1e1cbaef3dfb" data-file-name="components/AdminLoginForm.tsx">
        <CardTitle className="text-xl sm:text-2xl text-center" data-unique-id="b0297f94-6122-4127-8872-b585a4066a5d" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="ce6b2a50-78af-46c6-9e41-a7822db9bee6" data-file-name="components/AdminLoginForm.tsx">Login Sebagai Admin</span></CardTitle>
        <CardDescription className="text-sm sm:text-base text-center"><span className="editable-text" data-unique-id="fb9a88b6-0311-4939-9d7b-603bd0c6bce2" data-file-name="components/AdminLoginForm.tsx">
          Masukkan email dan kode akses admin Anda
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="36d24840-77eb-4ec3-bbaa-12284d90906c" data-file-name="components/AdminLoginForm.tsx">
        <form onSubmit={handleLogin} className="space-y-4" data-unique-id="5386f916-3d22-4176-9bce-19516623b6ff" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">
          <div className="space-y-2" data-unique-id="391bfacc-4db7-4cbc-af88-1fd7e5d9508a" data-file-name="components/AdminLoginForm.tsx">
            <Label htmlFor="email" data-unique-id="1d569eb8-4e56-41ff-9b1a-61ed23926f05" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="d27ceec3-ca1a-4778-b4e6-eda925b7ce58" data-file-name="components/AdminLoginForm.tsx">Email</span></Label>
            <Input id="email" type="email" placeholder="Masukkan email admin" value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} data-unique-id="fb53263c-b1ee-496f-8143-4a1f579b10ec" data-file-name="components/AdminLoginForm.tsx" />
          </div>
          
          <div className="space-y-2" data-unique-id="1eb8fa6c-721a-4a88-bc3e-ccfe7bde73eb" data-file-name="components/AdminLoginForm.tsx">
            <Label htmlFor="access-code" data-unique-id="428856c2-024a-477e-92a5-e4c9b4f4414f" data-file-name="components/AdminLoginForm.tsx"><span className="editable-text" data-unique-id="67e994c3-e5cd-415f-950e-f59758ea84d9" data-file-name="components/AdminLoginForm.tsx">Kode Akses</span></Label>
            <Input id="access-code" type="password" placeholder="Masukkan kode akses" value={accessCode} onChange={e => setAccessCode(e.target.value)} disabled={isLoading} data-unique-id="37baee47-7a44-4064-a13b-4789272df111" data-file-name="components/AdminLoginForm.tsx" />
          </div>
          
          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="f2066fe9-6b2e-455e-9fb3-38c16a515167" data-file-name="components/AdminLoginForm.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="33747c77-4ecf-4de2-8f1f-02fbedf5086a" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">{error}</span>
            </div>}
          
          <Button type="submit" className="w-full bg-green-200 hover:bg-green-300 text-green-800" disabled={isLoading} onClick={() => {
          console.log("Login button clicked");
        }} data-unique-id="9141e8fa-d7d9-46f7-b2ef-8090105252a2" data-file-name="components/AdminLoginForm.tsx" data-dynamic-text="true">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </> : "Login Admin"}
          </Button>
        </form>
      </CardContent>
    </Card>;
}