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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="22b769d5-a669-418a-97a6-8b3d384e57f8" data-file-name="app/admin/page.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="6594f1f9-5a51-45a7-b15b-d8024586c38e" data-file-name="app/admin/page.tsx"></div>
      </div>;
  }

  // Show login form if not logged in
  if (!admin) {
    return <div className="min-h-screen bg-background" data-unique-id="9fe45d26-eea0-4e65-8264-fd5e312238c2" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="4da57b84-f2a5-443d-8659-c5d9560cb40e" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="9e1ae587-f265-4e74-8f7c-a685b3bb7d34" data-file-name="app/admin/page.tsx">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="91f71c4b-5802-48c5-9c45-03531509e2e2" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="b98a8edf-c038-4fea-b3b5-a55c352aace4" data-file-name="app/admin/page.tsx">LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="6a76dfe1-4f97-42f2-b3f0-863c7b7a2f96" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="9199acf7-fce7-4582-9041-a1c7d2045a90" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="1a8ef612-7802-4eca-90e5-f46e4ada41c6" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="176b0642-e264-4f11-86fd-048fd5f9e887" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="e6278a92-3396-4a92-a867-be6c8d6c757d" data-file-name="app/admin/page.tsx">
            <p data-unique-id="2cbf5bf7-8aa1-45f8-b1e1-42db37832856" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="13f4dcd6-6f26-48a0-858c-7117c71a6c80" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="635a5b9c-f40c-44e2-9551-ab76c50c73da" data-file-name="app/admin/page.tsx"> Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="000ba9f9-c544-4229-9092-2586056e97e4" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="14782fe1-536a-402a-9db0-3d974cd7ff14" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="25b6ed5c-e856-49b5-8be8-d07b209e4992" data-file-name="app/admin/page.tsx">
                ke beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
  }
  return admin ? <AdminDashboard admin={admin} users={users} error={error} handleLogout={handleLogout} /> : <div className="min-h-screen bg-background" data-unique-id="e7c02da1-2aa4-49fe-845c-453289ff1539" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="10322bca-23e5-4403-aa9f-ded0f27f94d3" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="6a31eff4-1031-4f1d-8222-6e99efcc23b6" data-file-name="app/admin/page.tsx">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="daad57e1-3a27-4859-bbf6-5cc446a05821" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="a14fbe88-52e5-481b-a9c5-9bfb3296bd83" data-file-name="app/admin/page.tsx">JALUR LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="3fa343e5-d134-4264-900f-dc56b481b082" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="c251803f-dda8-46e0-8fb4-aa3ab062557e" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="ad82b33c-0153-4aa4-baa3-26ec88689a07" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="bf1fbf50-54a1-4bf2-bb16-55348f3a163b" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="5c5da036-9aef-4c63-811f-d10ff53d30bb" data-file-name="app/admin/page.tsx">
            <p data-unique-id="8acf9fa1-cfc3-4ff1-94ea-2995f57b9ff0" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3de3bc99-6b11-4811-81f5-4f7cd99e0529" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="c34b8ac6-4f4d-4963-b098-6fe3a66c6080" data-file-name="app/admin/page.tsx"> Jalur Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="2beb9d20-4ee5-4296-90eb-9c9d4c174d05" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="625e46e9-75c3-43a6-915a-c9877b5892ad" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="287a0150-7111-456d-8ab9-fde6e4321020" data-file-name="app/admin/page.tsx">
                Kembali ke Beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
}