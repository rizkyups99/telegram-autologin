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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="8ba9fbb6-510e-476b-b173-9f07ae8fda76" data-file-name="app/admin/page.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="043b36d3-a784-48fb-a86f-9b405d5f1be8" data-file-name="app/admin/page.tsx"></div>
      </div>;
  }

  // Show login form if not logged in
  if (!admin) {
    return <div className="min-h-screen bg-background" data-unique-id="8a852229-309b-47c2-b7a1-6a72ec5ab558" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="d47667e6-dc84-49ee-b649-b4f2a5421ef3" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="31cef9e7-3e8c-414b-9486-5c83b6dc07e7" data-file-name="app/admin/page.tsx">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="00f8ad4e-12fc-4c82-b3d6-8ccdf6d63603" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="13d8ea08-390d-4162-90a8-27c2244b8161" data-file-name="app/admin/page.tsx">LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="9ff042e6-1ff9-44bb-b069-b6d3f785444c" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="80a27ee2-b317-44a3-859b-ae54595c55af" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="ed03747d-4762-4018-891f-a4b6301831d7" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="6c150e06-f5f5-40b9-835b-ac2cbce35696" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="02673772-d46e-4c82-8cb9-9f60859af064" data-file-name="app/admin/page.tsx">
            <p data-unique-id="17588734-adfb-493a-840c-649111caaf7d" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f4162dda-dba8-421d-837d-70ae7b72701c" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="95eac7ab-0ffa-477c-b690-3a17d62a632d" data-file-name="app/admin/page.tsx"> Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="2a6ba1d4-c607-4ce1-8567-557627057051" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="f075d220-4052-4c89-b023-1fcae302295c" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="f4197ba4-0cb1-4f43-8b85-e9915804de68" data-file-name="app/admin/page.tsx">
                ke beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
  }
  return admin ? <AdminDashboard admin={admin} users={users} error={error} handleLogout={handleLogout} /> : <div className="min-h-screen bg-background" data-unique-id="b074f18f-4ff0-463b-b912-e47035b3589e" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="df70656b-dbbe-4af9-8493-a6130cc8cd99" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="014ab832-573d-43e3-ae4e-4a96de1d028c" data-file-name="app/admin/page.tsx">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="b43028fb-3b33-46a6-ac75-dd8e18262f08" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="eb83d843-aff5-4921-b3d0-15519b56eca9" data-file-name="app/admin/page.tsx">JALUR LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="45c05e91-ce00-44e6-8331-efb6fe2e219c" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="6eb5c315-51de-4b2c-86e9-bed11196d21d" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="649fd9b1-164d-402f-a26c-a444399992ec" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="9884da6d-d1b8-4a97-be2c-80e4c18f9694" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="81be83ff-8792-42ef-b97d-99ecefc876d1" data-file-name="app/admin/page.tsx">
            <p data-unique-id="d90a8058-4859-482b-a57a-9acc01cb4620" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1b5095f8-9324-40dd-a394-f4238c715cd7" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="a0832b41-0145-45d9-9e0b-397716867daf" data-file-name="app/admin/page.tsx"> Jalur Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="7e0a00b3-07fa-470c-9dbc-f3ff6711b3dc" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="8ee6cc96-8108-4870-ac68-c176ca5b4144" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="dcde7d6b-81d5-4991-86c4-7ad3010bd23d" data-file-name="app/admin/page.tsx">
                Kembali ke Beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
}