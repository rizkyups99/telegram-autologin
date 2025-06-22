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
  return <Card className="w-full max-w-md mx-auto" data-unique-id="318534f6-732b-4132-bcca-7e20431b64f4" data-file-name="components/LoginForm.tsx">
      <CardHeader data-unique-id="04d0fb03-8ff5-46dc-a289-94c3badc46f0" data-file-name="components/LoginForm.tsx">
        <CardTitle className="text-xl sm:text-2xl text-center" data-unique-id="c3f51070-8a4b-4171-b3c8-9240eb90152f" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="9900f89b-5f5f-4107-9643-56bd14df8338" data-file-name="components/LoginForm.tsx">Login User</span></CardTitle>
        <CardDescription className="text-sm sm:text-base text-center"><span className="editable-text" data-unique-id="87e6def8-ff5f-4fa3-835e-e39b04c8d91c" data-file-name="components/LoginForm.tsx">
          Masukkan username dan kode akses Anda untuk mengakses konten
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="f0a81ec1-92ce-4f99-9209-507de8cc9d51" data-file-name="components/LoginForm.tsx">
        <form onSubmit={handleLogin} className="space-y-4" data-unique-id="dabe03c2-9629-4ae6-aff0-d74da00e1c0a" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
          <div className="space-y-2" data-unique-id="a2d5159f-68a3-4076-bf14-721a73686f52" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="username" data-unique-id="e26bc386-94e1-425d-9d7d-06e64eff523a" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="fee7f07a-db2c-45fa-8f3d-9baddc9aebde" data-file-name="components/LoginForm.tsx">Username</span></Label>
            <Input id="username" type="text" placeholder="Masukkan username" value={username} onChange={e => setUsername(e.target.value)} disabled={isLoading} data-unique-id="127e4065-a7fb-4206-80e1-83b5bbf0b513" data-file-name="components/LoginForm.tsx" />
          </div>
          
          <div className="space-y-2" data-unique-id="a4d549b3-af3d-4019-bdfb-edd696bba94a" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="access-code" data-unique-id="bc43a657-df9b-408c-ae86-c1751f6c277d" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="48ca575e-2a04-430d-a3e2-3515be8a1313" data-file-name="components/LoginForm.tsx">Kode Akses</span></Label>
            <Input id="access-code" type="password" placeholder="Masukkan kode akses" value={accessCode} onChange={e => setAccessCode(e.target.value)} disabled={isLoading} data-unique-id="dd9f2192-8c29-4297-9ba8-03fee7f65803" data-file-name="components/LoginForm.tsx" />
          </div>
          
          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="9ecaeaa4-ba38-4859-a23f-b3948cbb3205" data-file-name="components/LoginForm.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="733fbcb6-17ba-4e22-8c8f-f79e2e5f49cc" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">{error}</span>
            </div>}
          
          <Button type="submit" className="w-full bg-blue-200 hover:bg-blue-300 text-blue-800" disabled={isLoading} data-unique-id="4e5f82e7-ea18-44fc-b46b-4dc2a0d55c2e" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </> : "Login User"}
          </Button>
          
          <Button type="button" variant="outline" className="w-full mt-3 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => {
          const message = encodeURIComponent("Halo admin, saya lupa username dan kode akses saya. Mohon bantuannya.");
          window.open(`https://wa.me/${adminPhoneNumber}?text=${message}`, '_blank');
        }} data-unique-id="9b9bb854-151d-4c8a-91b0-d450d2be6bd0" data-file-name="components/LoginForm.tsx">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" data-unique-id="e40a9232-6a4e-4207-8bff-36957002e79f" data-file-name="components/LoginForm.tsx">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            <span className="editable-text" data-unique-id="48683d1d-3e55-4419-b3bb-e99518cd6be1" data-file-name="components/LoginForm.tsx">Chat CS Admin</span>
          </Button>
        </form>
      </CardContent>
    </Card>;
}