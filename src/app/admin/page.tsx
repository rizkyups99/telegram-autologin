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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="57a5b09e-fd33-473d-a432-fe7fcf6ee985" data-file-name="app/admin/page.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="99bbe923-d469-4e80-8522-f1b5f57bbffb" data-file-name="app/admin/page.tsx"></div>
      </div>;
  }

  // Show login form if not logged in
  if (!admin) {
    return <div className="min-h-screen bg-background" data-unique-id="0625de72-0e64-4f60-a243-cdc7afe89f55" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="b1e86272-1834-4751-9f9b-45099a78f6be" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="51c95711-9986-4691-b982-06fef97c600f" data-file-name="app/admin/page.tsx">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="e1707da3-a9b5-4ec8-83bf-debee9b6bacb" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="865b93c1-16fa-4c7c-9fcb-9153dff6dd9b" data-file-name="app/admin/page.tsx">LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="f865de16-712c-494c-9b1f-6d68baecd56a" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="b06e8935-9d45-4edb-815a-ce89d64f28c4" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="6f082767-b6b5-4ff4-93e9-1eeeb5a3b47a" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="267a6707-2a03-46ca-8635-38ebc9c7a045" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="08b14357-2bf6-4b4b-a45f-b79acc758c95" data-file-name="app/admin/page.tsx">
            <p data-unique-id="ad6ca17a-1964-429f-893c-17243ede50d9" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="70ff8f2a-e478-4a44-82ad-5b9db98a004a" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="f8583502-cb66-4dbb-9f86-4f6b7eb62f38" data-file-name="app/admin/page.tsx"> Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="14b5c5df-7b92-4b06-a0ae-2b952a45fbb7" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="4eb23c6d-2a82-4186-a46c-c3135d84c07c" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="b63089d4-16c1-444b-834c-bfe77aca976a" data-file-name="app/admin/page.tsx">
                ke beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
  }
  return admin ? <AdminDashboard admin={admin} users={users} error={error} handleLogout={handleLogout} /> : <div className="min-h-screen bg-background" data-unique-id="95261706-ed69-4b46-ae81-71994fc3c494" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="b69dcbec-db9b-4bd7-8dc4-7ec067056b86" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="34e3dd40-3461-4609-913c-b196c4227534" data-file-name="app/admin/page.tsx">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="c2fcbcce-44c5-4278-aafa-45bce387a090" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="8e43af1e-3285-4a8e-85f0-f4e6fc3c4d8f" data-file-name="app/admin/page.tsx">JALUR LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="ffca5c15-b5ab-4fdd-9281-fdef7f934385" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="5f866238-b49c-4f36-a5dc-e20e2fdd9430" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="ad93a459-dc16-4569-84f2-d568d20e264e" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="8db6fa21-10c0-4131-accb-73addbd09c42" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="11f27862-6b3b-475b-853e-193bfc5ceeab" data-file-name="app/admin/page.tsx">
            <p data-unique-id="99c0903f-6ec9-40aa-97e5-54496c9dbf2b" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="ac6034b2-caea-4710-936d-219dd8277bd7" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="a2314338-18a9-4d5f-8f7c-7f52251c27bd" data-file-name="app/admin/page.tsx"> Jalur Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="57850f68-7b34-41f1-bf01-320ad6c106b8" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="c75e0627-59a4-404a-90a2-5f9126dafc3e" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="abeb6d5d-96b9-48ad-a96a-1f921d4f8df8" data-file-name="app/admin/page.tsx">
                Kembali ke Beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
}