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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="5f84e194-06ef-4933-a51f-1a5989872b8f" data-file-name="app/admin/page.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="bbc3015d-5589-469f-ad93-17c603b6097b" data-file-name="app/admin/page.tsx"></div>
      </div>;
  }

  // Show login form if not logged in
  if (!admin) {
    return <div className="min-h-screen bg-background" data-unique-id="95f5d996-1e72-435f-bac3-f89bb4b1f807" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="b48e9530-a78f-4dfa-8159-301831256d57" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="e6560ebe-4155-453c-8685-394c49503781" data-file-name="app/admin/page.tsx">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="907c8022-e736-4475-a715-0202501361d4" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="0111a0cb-95b8-409d-a000-6453a5f026d2" data-file-name="app/admin/page.tsx">LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="fb6ffaea-79bb-4b7e-8e9f-8d134d87b8a0" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="a6085db0-258b-411f-b6cc-21312db80d8e" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="8c02dfb9-4eb1-4dc4-bf03-39f77c96e4d0" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="bc820b30-53e0-471e-aa31-f9ca925aa4f6" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="c235ded5-6292-406b-bc02-d51309e138c7" data-file-name="app/admin/page.tsx">
            <p data-unique-id="eddb598a-d97b-4b87-b0c3-eadb41c3d251" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c30302d5-a192-449e-82cf-d13ec3d94e7f" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="7eac86f0-c8bb-4132-9409-cfe05f8a13d2" data-file-name="app/admin/page.tsx"> Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="0c35800f-8cb2-435a-a3a8-af3d2bcdf543" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="88445e01-1d66-48ed-9bf6-34d073178584" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="67b10891-9ace-4834-845d-6555a0e08409" data-file-name="app/admin/page.tsx">
                ke beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
  }
  return admin ? <AdminDashboard admin={admin} users={users} error={error} handleLogout={handleLogout} /> : <div className="min-h-screen bg-background" data-unique-id="9d676b45-deea-4fad-a4a0-605caebcf11c" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="1856a0a2-8a6e-4268-9374-2451f6f3ebd7" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="bbab4196-89f7-4cb0-ae0d-a02943a162cc" data-file-name="app/admin/page.tsx">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="55fd0e18-b2c9-414c-a143-e4b85d47bfbf" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="3af06fb8-4aa2-4320-b327-c26a8ef799ee" data-file-name="app/admin/page.tsx">JALUR LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="eeee319c-1ab1-43e9-b915-6bdf36e25e1b" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="07091197-dba6-4d30-b9d3-94359e99bcb8" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="b3900a26-aea4-4d62-a44d-822acfb1e0bc" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="51f7d27d-7ccf-41d5-9e34-1855612c92de" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="aaa0c2d6-17f9-4c86-bc3d-44a30b271994" data-file-name="app/admin/page.tsx">
            <p data-unique-id="685e0f92-92cd-4bcf-a630-f1d808235bc7" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3ca50f05-bec8-48b4-900d-f5a7e780c592" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="1004f384-63b5-46e4-9eb4-5ae301461dc7" data-file-name="app/admin/page.tsx"> Jalur Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="b259d311-0909-4e91-8c5a-7f49d7a46006" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="bd7b2568-1ad6-48d4-930e-2179820c357c" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="7522b743-d33c-43e5-9769-7eec35162461" data-file-name="app/admin/page.tsx">
                Kembali ke Beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
}