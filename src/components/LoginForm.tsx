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
  return <Card className="w-full max-w-md mx-auto" data-unique-id="e22064e4-0396-472a-8a41-077a9323cf61" data-file-name="components/LoginForm.tsx">
      <CardHeader data-unique-id="d242d8e1-c462-4859-bbe5-5e97e4bb00f9" data-file-name="components/LoginForm.tsx">
        <CardTitle className="text-xl sm:text-2xl text-center" data-unique-id="f17e66ca-00d0-4a4c-9a12-895b0f19600f" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="a5567dff-07e4-44cf-9401-6c2819e84632" data-file-name="components/LoginForm.tsx">Login User</span></CardTitle>
        <CardDescription className="text-sm sm:text-base text-center"><span className="editable-text" data-unique-id="5aa271e9-d42e-4baf-95f5-5344f3658764" data-file-name="components/LoginForm.tsx">
          Masukkan username dan kode akses Anda untuk mengakses konten
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="f4094b3a-55fb-4b5f-9e6d-c4796224889f" data-file-name="components/LoginForm.tsx">
        <form onSubmit={handleLogin} className="space-y-4" data-unique-id="2a60ac26-0f82-43bd-9d76-c1db3661eb97" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
          <div className="space-y-2" data-unique-id="4721e3c8-3b0c-4f33-9899-676dcc10bcd0" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="username" data-unique-id="f3dec2d6-bbb1-4f53-9906-05642b6f6131" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="74256371-66fe-44cb-ae62-4fbc1e444fc8" data-file-name="components/LoginForm.tsx">Username</span></Label>
            <Input id="username" type="text" placeholder="Masukkan username" value={username} onChange={e => setUsername(e.target.value)} disabled={isLoading} data-unique-id="b4e3d2df-e5b9-424a-84de-0a08b96b76b7" data-file-name="components/LoginForm.tsx" />
          </div>
          
          <div className="space-y-2" data-unique-id="dd14b892-ec31-4ac6-9419-699e8659e30f" data-file-name="components/LoginForm.tsx">
            <Label htmlFor="access-code" data-unique-id="9b1ba414-91b3-4d3c-8cb1-1d0f64a724b2" data-file-name="components/LoginForm.tsx"><span className="editable-text" data-unique-id="32474322-f259-496c-8de4-86d97a13805e" data-file-name="components/LoginForm.tsx">Kode Akses</span></Label>
            <Input id="access-code" type="password" placeholder="Masukkan kode akses" value={accessCode} onChange={e => setAccessCode(e.target.value)} disabled={isLoading} data-unique-id="631ca171-9bbb-4b31-b547-109b8b16ae13" data-file-name="components/LoginForm.tsx" />
          </div>
          
          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center" data-unique-id="72cf1c91-3d42-4c54-879d-9bddf8af0964" data-file-name="components/LoginForm.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="687ab2c5-67a2-42aa-86e4-ecbb4ec5f34e" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">{error}</span>
            </div>}
          
          <Button type="submit" className="w-full bg-blue-200 hover:bg-blue-300 text-blue-800" disabled={isLoading} data-unique-id="8d7f70d6-0b07-4664-9d73-f6d8595de9e7" data-file-name="components/LoginForm.tsx" data-dynamic-text="true">
            {isLoading ? <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </> : "Login User"}
          </Button>
          
          <Button type="button" variant="outline" className="w-full mt-3 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700" onClick={() => {
          const message = encodeURIComponent("Halo admin, saya lupa username dan kode akses saya. Mohon bantuannya.");
          window.open(`https://wa.me/${adminPhoneNumber}?text=${message}`, '_blank');
        }} data-unique-id="d74d3005-b61f-478d-8215-d76612481307" data-file-name="components/LoginForm.tsx">
            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24" data-unique-id="ce223b8e-d918-445b-94f8-7f874d80105b" data-file-name="components/LoginForm.tsx">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
            </svg>
            <span className="editable-text" data-unique-id="8e56f9de-78f5-493d-ad5a-60f41d7fbb3c" data-file-name="components/LoginForm.tsx">Chat CS Admin</span>
          </Button>
        </form>
      </CardContent>
    </Card>;
}