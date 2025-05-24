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
  return <Card className="w-full max-w-md mx-auto" data-unique-id="c634afc1-c9f6-47b3-9fa3-0bb2f91eb33e" data-file-name="components/LoginForm.tsx">
      <CardHeader data-unique-id="827ef7ea-e371-4e70-b22e-fb2a09b6c182" data-file-name="components/LoginForm.tsx">
        <CardTitle className="text-xl sm:text-2xl text-center" data-unique-id="b8d3b111-1536-49b3-b09a-74033af406fe" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="f705e626-2bba-4b44-9446-9b246322b74d" data-file-name="components/LoginForm.tsx">Login User</span></CardTitle>
        <CardDescription className="text-sm sm:text-base text-center"><span className="editable-text" data-unique-id="c7bf2d81-b6e0-4e39-ae95-615913ca2f5b" data-file-name="components/LoginForm.tsx">
          Masukkan username dan kode akses Anda untuk mengakses konten
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="737ab6f5-3ad6-4949-976a-dde62ad4e1b6" data-file-name="components/LoginForm.tsx">
        <form onSubmit={handleLogin} className="space-y-4" data-unique-id="c12108a9-7859-4d84-bdfe-5d40bb96e0d2" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
          <div className="space-y-2" data-unique-id="28f82a5e-53a9-4953-b229-fc931ec3ec04" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="username" data-unique-id="d9db0d25-3b45-4789-b79d-fc0ed2f77c37" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="a0ac4ee4-20c7-4c16-af3d-b567dadf2151" data-file-name="components/LoginForm.tsx">Username</span></Label>
            <Input id="username" type="text" placeholder="Masukkan username" value={username} onChange={e => setUsername(e.target.value)} disabled={isLoading} data-unique-id="2bbe9631-aa3d-40dc-ae49-7d4eb81f78de" data-file-name="components/LoginForm.tsx" />
          </div>
          
          <div className="space-y-2" data-unique-id="b97e1027-9b2f-4705-a159-54bcfb1bffd8" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="access-code" data-unique-id="53a2cce7-88e3-4bff-8f05-3459bcef08ae" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="1e5afd17-5103-4cf3-bdd6-49a216a9384f" data-file-name="components/LoginForm.tsx">Kode Akses</span></Label>
            <Input id="access-code" type="password" placeholder="Masukkan kode akses" value={accessCode} onChange={e => setAccessCode(e.target.value)} disabled={isLoading} data-unique-id="e7edbcb3-188c-41e6-9e55-51af1589e4d8" data-file-name="components/LoginForm.tsx" />
          </div>
          
          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="24878720-c345-432a-a1bd-6065cee77a1e" data-file-name="components/LoginForm.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="1f16ec88-82bd-406c-95b9-340d0e8b7881" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">{error}</span>
            </div>}
          
          <Button type="submit" className="w-full bg-blue-200 hover:bg-blue-300 text-blue-800" disabled={isLoading} data-unique-id="21137153-fc2f-4d9a-89c3-05de29a6871e" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </> : "Login User"}
          </Button>
        </form>
      </CardContent>
    </Card>;
}