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
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, accessCode }),
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
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, accessCode }),
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

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl text-center">Login Sebagai Admin</CardTitle>
        <CardDescription className="text-sm sm:text-base text-center">
          Masukkan email dan kode akses admin Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Masukkan email admin"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="access-code">Kode Akses</Label>
            <Input
              id="access-code"
              type="password"
              placeholder="Masukkan kode akses"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full bg-green-200 hover:bg-green-300 text-green-800"
            disabled={isLoading}
            onClick={() => {
              console.log("Login button clicked");
            }}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Memproses...
              </>
            ) : "Login Admin"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
