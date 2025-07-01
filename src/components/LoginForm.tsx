'use client';

import { useState, useEffect } from "react";
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
  const [adminPhoneNumber, setAdminPhoneNumber] = useState("6285716665995");
  const router = useRouter();

  // Fetch admin phone number from WhatsApp settings
  useEffect(() => {
    const fetchAdminPhone = async () => {
      try {
        const response = await fetch('/api/whatsapp-settings');
        if (response.ok) {
          const data = await response.json();
          if (data.phoneNumber) {
            setAdminPhoneNumber(data.phoneNumber);
          }
        }
      } catch (error) {
        console.error('Error fetching admin phone:', error);
      }
    };
    fetchAdminPhone();
  }, []);
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
  return <Card className="w-full max-w-md mx-auto" data-unique-id="d3ede8c3-5eb5-4221-95b1-34334674b226" data-file-name="components/LoginForm.tsx">
      <CardHeader data-unique-id="ce7ec70f-a960-4cd8-b128-94d6c896e4b5" data-file-name="components/LoginForm.tsx">
        <CardTitle className="text-xl sm:text-2xl text-center" data-unique-id="964da82f-3592-4491-830f-41028db19d14" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="74fa8b7c-bd0d-43b9-b2e8-6353db6ea3b4" data-file-name="components/LoginForm.tsx">Login User</span></CardTitle>
        <CardDescription className="text-sm sm:text-base text-center"><span className="editable-text" data-unique-id="a54d7743-939b-4076-8436-5b2c3eddcb09" data-file-name="components/LoginForm.tsx">
          Masukkan username dan kode akses Anda untuk mengakses konten
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="301609f4-ab3c-4af7-a0a9-cf857053267f" data-file-name="components/LoginForm.tsx">
        <form onSubmit={handleLogin} className="space-y-4" data-unique-id="6a090dfa-0173-4809-beb8-5cc60480057e" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
          <div className="space-y-2" data-unique-id="31f996c2-f81e-4f30-8cac-b00251b17f60" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="username" data-unique-id="fea69886-a2f8-4a0d-b1f5-61314e729341" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="434dabbd-4292-49bb-bb41-5cda1574758d" data-file-name="components/LoginForm.tsx">Username</span></Label>
            <Input id="username" type="text" placeholder="Masukkan username" value={username} onChange={e => setUsername(e.target.value)} disabled={isLoading} data-unique-id="5b05c089-d57e-4f6f-bf84-686c47a5cd58" data-file-name="components/LoginForm.tsx" />
          </div>
          
          <div className="space-y-2" data-unique-id="1ceefb22-8d3c-4a30-8602-ae12021a0d03" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="access-code" data-unique-id="7fce8169-2598-4384-a5b0-cfa24c2460e1" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="413a41e7-eca7-4cc3-99f8-8a0bdf82f087" data-file-name="components/LoginForm.tsx">Kode Akses</span></Label>
            <Input id="access-code" type="password" placeholder="Masukkan kode akses" value={accessCode} onChange={e => setAccessCode(e.target.value)} disabled={isLoading} data-unique-id="679dd610-db20-4ee2-a889-48239f9011a2" data-file-name="components/LoginForm.tsx" />
          </div>
          
          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="e58e93fd-4e1c-4be0-887d-f1ddab81c4db" data-file-name="components/LoginForm.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="f5674ae8-6a23-4cff-b9c9-603e671d42c3" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">{error}</span>
            </div>}
          
          <Button type="submit" className="w-full bg-blue-200 hover:bg-blue-300 text-blue-800" disabled={isLoading} data-unique-id="ef787597-b727-4054-82d9-c31118448516" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </> : "Login User"}
          </Button>
          
          <Button type="button" variant="outline" className="w-full mt-3 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => {
          const message = encodeURIComponent("Halo admin, saya lupa username dan kode akses saya. Mohon bantuannya.");
          window.open(`https://wa.me/${adminPhoneNumber}?text=${message}`, '_blank');
        }} data-unique-id="fa6b9a8a-0d14-4ae5-9262-92e853ddd6a2" data-file-name="components/LoginForm.tsx">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" data-unique-id="38f9b472-36cf-4b3c-baca-47d5abd37636" data-file-name="components/LoginForm.tsx">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            <span className="editable-text" data-unique-id="54a62317-9fe0-4886-a015-f7797df57c58" data-file-name="components/LoginForm.tsx">Chat CS Admin</span>
          </Button>
        </form>
      </CardContent>
    </Card>;
}