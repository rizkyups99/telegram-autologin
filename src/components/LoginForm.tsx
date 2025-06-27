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
  return <Card className="w-full max-w-md mx-auto" data-unique-id="d8b51995-69f8-48c5-9afd-6792c1375f1e" data-file-name="components/LoginForm.tsx">
      <CardHeader data-unique-id="f4eedc1d-0dce-4a3f-829b-9817e4e55302" data-file-name="components/LoginForm.tsx">
        <CardTitle className="text-xl sm:text-2xl text-center" data-unique-id="0062fdae-9584-4fc9-8a37-0e6da4f99ec4" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="f8b4f68a-e19e-49da-bed1-2b83c8157631" data-file-name="components/LoginForm.tsx">Login User</span></CardTitle>
        <CardDescription className="text-sm sm:text-base text-center"><span className="editable-text" data-unique-id="67bf078c-d8ca-4b82-a7cd-b69aca8a1ca3" data-file-name="components/LoginForm.tsx">
          Masukkan username dan kode akses Anda untuk mengakses konten
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="abe183f7-a437-4875-9cfb-4564cca8acec" data-file-name="components/LoginForm.tsx">
        <form onSubmit={handleLogin} className="space-y-4" data-unique-id="3a44e681-83db-48a8-bc57-b29f0787917d" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
          <div className="space-y-2" data-unique-id="b6e6b613-b376-4998-9c3c-6b4dbffa1638" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="username" data-unique-id="b72663ed-36f5-4069-b9f3-14789238d72f" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="7ab4a6fe-8a3d-4f3d-8545-a2ff87b12af1" data-file-name="components/LoginForm.tsx">Username</span></Label>
            <Input id="username" type="text" placeholder="Masukkan username" value={username} onChange={e => setUsername(e.target.value)} disabled={isLoading} data-unique-id="74726623-9db2-402d-a2e7-247584e5d06a" data-file-name="components/LoginForm.tsx" />
          </div>
          
          <div className="space-y-2" data-unique-id="19d77438-5527-4818-b20c-08eccb38cf23" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="access-code" data-unique-id="2ccaad08-16d2-40ed-a7fb-172f90630eed" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="9b89cf8e-35c7-43b8-ac4e-6f695659c8e5" data-file-name="components/LoginForm.tsx">Kode Akses</span></Label>
            <Input id="access-code" type="password" placeholder="Masukkan kode akses" value={accessCode} onChange={e => setAccessCode(e.target.value)} disabled={isLoading} data-unique-id="9b5d9ec3-8fa3-4a20-80aa-e88fcea11064" data-file-name="components/LoginForm.tsx" />
          </div>
          
          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="e1d9e842-d55b-442d-8151-67e931ecd212" data-file-name="components/LoginForm.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="5f9fa9ab-f0dd-43a2-ba9e-12ee8e811118" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">{error}</span>
            </div>}
          
          <Button type="submit" className="w-full bg-blue-200 hover:bg-blue-300 text-blue-800" disabled={isLoading} data-unique-id="6ae72521-69af-4e1e-b15e-635ab7555542" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </> : "Login User"}
          </Button>
          
          <Button type="button" variant="outline" className="w-full mt-3 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => {
          const message = encodeURIComponent("Halo admin, saya lupa username dan kode akses saya. Mohon bantuannya.");
          window.open(`https://wa.me/${adminPhoneNumber}?text=${message}`, '_blank');
        }} data-unique-id="66e1c72c-6f56-4650-b390-0dc9e22f156b" data-file-name="components/LoginForm.tsx">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" data-unique-id="de011280-ca2e-42d9-a83c-908aedfccf12" data-file-name="components/LoginForm.tsx">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            <span className="editable-text" data-unique-id="21c53d86-a4dd-409a-812e-63a1c6b3419e" data-file-name="components/LoginForm.tsx">Chat CS Admin</span>
          </Button>
        </form>
      </CardContent>
    </Card>;
}