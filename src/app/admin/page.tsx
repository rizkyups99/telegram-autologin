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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="afd56e85-08ab-4889-9ca2-086333517917" data-file-name="app/admin/page.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="8b0002c6-a94f-4828-a9d7-e5d9586074ed" data-file-name="app/admin/page.tsx"></div>
      </div>;
  }

  // Show login form if not logged in
  if (!admin) {
    return <div className="min-h-screen bg-background" data-unique-id="94ea6769-2838-454b-9c8c-390be2d65445" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="7312b951-2c9e-4d07-94dc-48a5c4fd66b8" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="d6946ec6-0136-45db-a393-3bb45cb5e248" data-file-name="app/admin/page.tsx">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="a3cc12c1-6f11-4cda-b02a-a598033cf1b8" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="b212b0db-6196-4827-b375-9381dfa3d45c" data-file-name="app/admin/page.tsx">LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="3bf95d26-aac1-4620-b0d2-f7af2c99ff93" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="57295f42-e61f-42b7-a4b2-9f4b47b82f92" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="dd0c2b53-139e-47da-af77-4f18a6a2cd9e" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="ad8dfd06-835d-48ee-b5b0-f53c0de9a47f" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="594ab15b-b7aa-4b9a-aab2-99a45f065c36" data-file-name="app/admin/page.tsx">
            <p data-unique-id="d69a7adf-7f0b-4d41-aaea-be66d23d8066" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="22818db8-d6e9-4c13-8a51-da53f6937095" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="edb6f122-1677-496d-8aee-bacfe3c67d79" data-file-name="app/admin/page.tsx"> Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="1f7f3db7-e8a2-46f7-808f-2b8dbf83b4f4" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="ca7377c9-c196-4787-984b-0611a9f39bdc" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="8f3836f5-f433-4d2c-ab15-b935c197986f" data-file-name="app/admin/page.tsx">
                ke beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
  }
  return admin ? <AdminDashboard admin={admin} users={users} error={error} handleLogout={handleLogout} /> : <div className="min-h-screen bg-background" data-unique-id="5b0fede3-0cde-4c14-a51c-7341876154ad" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="58490e80-9724-4554-bf66-fb56a8ee67a9" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="c6d4d0f4-b45b-4807-8030-12d28e717114" data-file-name="app/admin/page.tsx">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="f44f7452-8553-4706-98ef-b9ee5546a129" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="36d87ff2-b491-4433-8615-3ecf3e62d062" data-file-name="app/admin/page.tsx">JALUR LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="ac4ddfe2-c406-4527-959b-7626bf457332" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="77c40e57-6905-4064-b699-1eb361de27b2" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="c9943500-7e07-4450-af31-3b375bbd31b9" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="930111c8-04f4-4d69-8a8d-435bd842f845" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="048427f7-3918-43b2-bbb0-88ff12e1740e" data-file-name="app/admin/page.tsx">
            <p data-unique-id="9a915d8f-1266-4f0b-bb4b-75c86218220e" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1f6b53ac-228d-4332-9564-6546c67ddc09" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="9125ecc5-ffa2-40be-8fc5-75b6c7b85ac0" data-file-name="app/admin/page.tsx"> Jalur Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="1101baae-fe66-4b79-8dbc-36f0958d388d" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="acb0a22c-55e8-4e5f-a3bd-f4a226e83fab" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="bc6ede85-7bba-40cd-b602-e33544149910" data-file-name="app/admin/page.tsx">
                Kembali ke Beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
}