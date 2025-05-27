'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !accessCode) {
      setError("Username dan kode akses harus diisi");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          accessCode
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Login gagal");
      }

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to user page
      router.push("/user");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };
  return <Card className="w-full max-w-md mx-auto" data-unique-id="aa024b31-125c-4229-8de2-bccf2b18e87b" data-file-name="components/LoginForm.tsx">
      <CardHeader data-unique-id="aa23e8f3-f8f9-4e4a-82ca-1140fed469c5" data-file-name="components/LoginForm.tsx">
        <CardTitle className="text-xl sm:text-2xl text-center" data-unique-id="1353be7b-c96b-440d-bb14-641a726fef2a" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="927150a1-8912-4971-9aee-5210f1faebc5" data-file-name="components/LoginForm.tsx">Login User</span></CardTitle>
        <CardDescription className="text-sm sm:text-base text-center"><span className="editable-text" data-unique-id="028e9da4-e6d0-47e9-a8df-3f5fe7f91773" data-file-name="components/LoginForm.tsx">
          Masukkan username dan kode akses Anda untuk mengakses konten
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="a683e537-8542-459c-a9d5-800c37af4f9f" data-file-name="components/LoginForm.tsx">
        <form onSubmit={handleLogin} className="space-y-4" data-unique-id="87724356-a107-4f09-b4d2-6093cf66e75d" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
          <div className="space-y-2" data-unique-id="e48a65b8-8018-4597-b26b-309b87d7ad4a" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="username" data-unique-id="8cf932e9-1c1d-4cda-8727-73037cc9d981" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="485c1e74-7081-44bc-8654-9875767c0563" data-file-name="components/LoginForm.tsx">Username</span></Label>
            <Input id="username" type="text" placeholder="Masukkan username" value={username} onChange={e => setUsername(e.target.value)} disabled={isLoading} data-unique-id="e0d58347-7c44-4fd5-b418-e8e16b3a480a" data-file-name="components/LoginForm.tsx" />
          </div>
          
          <div className="space-y-2" data-unique-id="9f18d18d-428b-4401-afff-1990fc71f8cd" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="access-code" data-unique-id="e38f0c77-475a-4fae-8451-e07cc78d8654" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="056f51b3-f0f2-45e4-a4ee-cb008981c019" data-file-name="components/LoginForm.tsx">Kode Akses</span></Label>
            <Input id="access-code" type="password" placeholder="Masukkan kode akses" value={accessCode} onChange={e => setAccessCode(e.target.value)} disabled={isLoading} data-unique-id="0d0c47cb-40e2-4600-9919-272c6ad663af" data-file-name="components/LoginForm.tsx" />
          </div>
          
          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="a47e6b39-7b11-4151-a18f-b11c7bd9f951" data-file-name="components/LoginForm.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="e80e3944-ccdf-432e-b4bd-d1e8521b0bb4" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">{error}</span>
            </div>}
          
          <Button type="submit" className="w-full bg-blue-200 hover:bg-blue-300 text-blue-800" disabled={isLoading} data-unique-id="f9bcc86e-2ab7-49ad-b10b-dd075315e947" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </> : "Login User"}
          </Button>
        </form>
      </CardContent>
    </Card>;
}