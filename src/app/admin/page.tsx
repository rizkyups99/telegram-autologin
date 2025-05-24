'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Users, Settings, ArrowRight } from 'lucide-react';
import CategoryManager from '@/components/CategoryManager';
import PDFManager from '@/components/PDFManager';
import AudioManager from '@/components/AudioManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserTable from '@/components/UserTable';
import UserRegistration from '@/components/UserRegistration';
import TelegramSetup from '@/components/TelegramSetup';
import AdminRegistration from '@/components/AdminRegistration';
import VideoManager from '@/components/VideoManager';
import PreviewAudio from '@/components/PreviewAudio';
import PreviewPDF from '@/components/PreviewPDF';
import PreviewVideo from '@/components/PreviewVideo';
import Link from 'next/link';
import { User } from '@/db/schema';
import AdminLoginForm from '@/components/AdminLoginForm';
import AdminDashboard from '@/components/AdminDashboard';
export default function AdminPage() {
  const [admin, setAdmin] = useState<{
    email: string;
    isAdmin: boolean;
    loginTime: string;
  } | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    // Check if admin is logged in
    if (typeof window !== 'undefined') {
      const adminData = localStorage.getItem('admin');
      if (!adminData) {
        // Show login form instead of redirecting
        setLoading(false);
        return;
      }
      try {
        const parsedAdmin = JSON.parse(adminData);
        if (!parsedAdmin.isAdmin) {
          localStorage.removeItem('admin');
          setLoading(false);
          return;
        }
        setAdmin(parsedAdmin);

        // Fetch users data
        fetchUsers();
      } catch (error) {
        console.error('Error parsing admin data:', error);
        localStorage.removeItem('admin');
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Gagal mengambil data pengguna");
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError("Error memuat data pengguna. Silakan coba lagi nanti.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('admin');
    router.push('/');
  };
  if (loading) {
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="5c825baa-d2fd-46cf-95d0-cc95f0f1b2c7" data-file-name="app/admin/page.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="a1ed07f0-0f50-4ccb-b850-1d3fcd262911" data-file-name="app/admin/page.tsx"></div>
      </div>;
  }

  // Show login form if not logged in
  if (!admin) {
    return <div className="min-h-screen bg-background" data-unique-id="cbd3995b-a112-4ebe-ade5-b080cf857a69" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="66c4d4e3-2e51-4cfd-bf7d-a364c23ad797" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="0b1e03e3-3969-418d-99b5-9f34d62378c5" data-file-name="app/admin/page.tsx">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="b9e049ea-f9f9-48ac-8aaf-a018b709e90c" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="bd6f8eb3-01a2-43aa-a02f-3f01f19ebd47" data-file-name="app/admin/page.tsx">LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="22d4b3ba-f39a-42bf-84d6-5027522ed081" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="2efb5727-e4c0-43e4-8eb9-44f75bbdd72a" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="2fbf1a07-6bae-474b-8f08-9d2f72415a9e" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="bbcc89a9-9ded-439e-a72a-143250995925" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="f733a521-6276-43ec-9df3-e523ebc3588f" data-file-name="app/admin/page.tsx">
            <p data-unique-id="6d52e115-9d7b-4415-92d6-f1e5dda83099" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="06a0bb3e-417b-4d68-b42e-f5801fcef979" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="f99ae0c3-5b67-4934-bc6e-4c9651f2b217" data-file-name="app/admin/page.tsx"> Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="92184168-01d5-4037-ab1d-beadf427d0d7" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="fb742f03-6ac5-4233-a69a-1422b9c7f07b" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="f5286013-f10c-4edb-98d1-b501d5c59985" data-file-name="app/admin/page.tsx">
                ke beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
  }
  return admin ? <AdminDashboard admin={admin} users={users} error={error} handleLogout={handleLogout} /> : <div className="min-h-screen bg-background" data-unique-id="10f354e4-5bad-42e7-98e2-3f2fcb599d8b" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="470d3693-bb93-4cca-9d1d-15ea1f02198a" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="525f62a2-a933-44f8-a520-8204c08746b0" data-file-name="app/admin/page.tsx">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="8ad62a4d-f0d8-4cc8-82ed-f3d4af8f860c" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="82203bc9-2d19-4e0b-8fb0-740815c61681" data-file-name="app/admin/page.tsx">JALUR LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="43ec715e-83a6-41da-91ba-0738513065f6" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="2d8e9a26-cb4d-46e4-8ba1-035adce995e8" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="f69e1223-a03b-4395-a962-3c80632959be" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="2fb0f736-ba50-480d-888f-8196845c8976" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="7bb50142-159a-4104-84d6-f028c50c2e8a" data-file-name="app/admin/page.tsx">
            <p data-unique-id="4c7cd807-864e-45dd-803c-063cae3180bf" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6879a681-c13b-47ea-ab75-3685188311c9" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="d1da6c8c-a469-4766-850c-308de3b7af82" data-file-name="app/admin/page.tsx"> Jalur Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="d0f50823-eb0c-4e0f-b594-13a9e11f3330" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="121d4706-ad83-4ce3-b529-b66c8f835b9c" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="a8de2495-2f10-4d46-8d33-01846be1dc9a" data-file-name="app/admin/page.tsx">
                Kembali ke Beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
}