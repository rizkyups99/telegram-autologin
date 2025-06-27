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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="a52f0312-d413-4d0b-bb16-aef345c6c764" data-file-name="app/admin/page.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="b487c789-3a8a-46ce-8c9c-709c84043e41" data-file-name="app/admin/page.tsx"></div>
      </div>;
  }

  // Show login form if not logged in
  if (!admin) {
    return <div className="min-h-screen bg-background" data-unique-id="e82da59b-ec3e-4f63-a392-05601c85acc5" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="6b74aaac-db33-49ab-8de0-73f459e0ff78" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="17772fb3-e95a-4698-8184-e7600d871d54" data-file-name="app/admin/page.tsx">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="1d9aa7c3-e28e-48d1-b8b2-c32887d62a40" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="814e43c3-a466-45c7-b49d-0df40fd1cdf1" data-file-name="app/admin/page.tsx">LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="99311bae-5231-4e76-87f1-2e6ffa37f535" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="38dad0e2-244b-4f13-8567-b28cf88e700c" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="e09989a5-b18e-41df-bfdd-766812959b91" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="ac1b5611-4b11-4a26-b72f-3c2f1f1c55ac" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="a4be2e8c-69ff-498a-93a5-31d20db5954c" data-file-name="app/admin/page.tsx">
            <p data-unique-id="06a6fcda-e474-45ef-8c82-0aac0b9ca5a6" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="349522c6-ca30-4277-9436-64126a29b1e2" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="307f0960-4722-4b5d-8395-41bf57cec09d" data-file-name="app/admin/page.tsx"> Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="fe6de21a-8a85-4410-ba4c-f20aab3a98df" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="13ae013c-2be8-41ca-9f78-575f048c7d46" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="5dace631-44da-4bcb-974f-3da08e43acb1" data-file-name="app/admin/page.tsx">
                ke beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
  }
  return admin ? <AdminDashboard admin={admin} users={users} error={error} handleLogout={handleLogout} /> : <div className="min-h-screen bg-background" data-unique-id="4720f09f-e6ff-4205-9cec-090d7cfda28b" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="f4881e8a-9420-4580-bf80-913002d43483" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="d1fec138-4a68-43ad-9c03-69d7d06cea47" data-file-name="app/admin/page.tsx">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="56bd10a8-2f07-4ad9-a2b4-98f0e44f2c02" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="10d8803f-5312-4b48-b17a-cec7444054f0" data-file-name="app/admin/page.tsx">JALUR LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="568b2250-f9a4-4b1b-b356-541b082184be" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="60b63a72-258d-46ba-907b-287329107c86" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="8736e46d-ec01-4df5-adf0-ca4226e0a3e4" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="782dfbac-6e57-411c-b7e2-fde480042c8c" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="b39d2298-178c-4344-910f-acc9d55ed0d3" data-file-name="app/admin/page.tsx">
            <p data-unique-id="0de089e5-1e1f-4e56-b48d-ace8c10a4136" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f3b9c878-48ff-4592-b7a1-e3a55aac9a75" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="a085dc0c-72a6-4bfa-b3d3-25473bd2cdd1" data-file-name="app/admin/page.tsx"> Jalur Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="9d96bf83-36d6-4006-aee1-5a5bc2af19ce" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="012b971a-dd01-4b83-907e-c4f0b7f3a575" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="fd20f7a3-64db-48f8-9c51-d4ca7b2f78bb" data-file-name="app/admin/page.tsx">
                Kembali ke Beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
}