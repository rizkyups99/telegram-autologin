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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="46c6ec01-9351-484e-86d9-808a94bd2fcd" data-file-name="app/admin/page.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="081fd515-b8a2-453b-9502-2849a712f8c8" data-file-name="app/admin/page.tsx"></div>
      </div>;
  }

  // Show login form if not logged in
  if (!admin) {
    return <div className="min-h-screen bg-background" data-unique-id="1ad38f42-2f96-4faf-a7a6-1283dad827ff" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="b1369c64-90c9-4a93-99fa-f94760af8fc5" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="4fc8bbe2-ec7d-4430-86a8-9d8ecf64e739" data-file-name="app/admin/page.tsx">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="e7c9f4d1-9b60-43c2-81d3-c4efa6215a64" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="bb874a32-4fe7-4a75-8c9a-d38bded176cb" data-file-name="app/admin/page.tsx">LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="d5dc70bf-8ac3-4bf8-92cf-bec3bff6aef4" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="1e3ae84f-192d-47e1-9f64-f687ae8ee326" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="3a8b0bd0-8dc3-453e-b77a-bfd7670f43f3" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="7f01dfa0-82fb-47c7-93cc-463b5b2f2984" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="a99f0edb-e90c-4d7e-9622-c81b2881e119" data-file-name="app/admin/page.tsx">
            <p data-unique-id="5a9fa837-9566-4973-b4ac-969b2cbb4bb7" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="e803c85d-692d-426e-b006-f05db8607b19" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="a82ce7d0-454f-459c-9e6a-10b8495d1a45" data-file-name="app/admin/page.tsx"> Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="2fe32122-64c3-413a-a8db-fdadb2f9c30d" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="32a6fa2c-404b-41fe-ab1e-206cc707f9cc" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="c32db7e5-9320-4461-90eb-f3056224a7c3" data-file-name="app/admin/page.tsx">
                ke beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
  }
  return admin ? <AdminDashboard admin={admin} users={users} error={error} handleLogout={handleLogout} /> : <div className="min-h-screen bg-background" data-unique-id="5f405c25-06ec-4100-810a-b4767ed37786" data-file-name="app/admin/page.tsx">
        <header className="border-b border-border" data-unique-id="12e1f28c-2116-4be1-a171-5dd3e924ffb7" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center" data-unique-id="83d09d0d-cc23-4fce-b44c-321cc9d970a4" data-file-name="app/admin/page.tsx">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold" data-unique-id="4a165ff9-a5be-40e8-aa1e-d21e2056c2dc" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="119f0277-8038-4228-93b2-15f888b38c13" data-file-name="app/admin/page.tsx">JALUR LANGIT DIGITAL</span></h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto" data-unique-id="ca0914bd-cdda-4599-acaa-5bdbc0fd12c7" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="a1a996f2-3b42-4b85-bc8b-9a62cebf335b" data-file-name="app/admin/page.tsx">Admin Panel</span></p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8" data-unique-id="62579b23-96b7-497f-8031-9815c114b7ab" data-file-name="app/admin/page.tsx">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto" data-unique-id="537bb2d7-6c62-406e-8182-ac97f585a533" data-file-name="app/admin/page.tsx">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground" data-unique-id="3b3193c9-8911-48a9-96ee-e45bf193061a" data-file-name="app/admin/page.tsx">
            <p data-unique-id="9ee732b1-68c5-4351-a664-68608380a275" data-file-name="app/admin/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="effaa724-04a6-4bdb-8e81-5feeb8d33e15" data-file-name="app/admin/page.tsx">© </span>{new Date().getFullYear()}<span className="editable-text" data-unique-id="bd4590d2-be56-4e48-960b-a81c132cb291" data-file-name="app/admin/page.tsx"> Jalur Langit Digital. All rights reserved.</span></p>
            <p className="mt-2" data-unique-id="7e78ca20-8439-408e-b369-d60b8e87d225" data-file-name="app/admin/page.tsx">
              <Link href="/" className="hover:underline" data-unique-id="f2108d59-f4eb-44c0-8cff-cf65c24c401a" data-file-name="app/admin/page.tsx"><span className="editable-text" data-unique-id="1bbe768c-0e5c-45b4-b825-338f02cb0722" data-file-name="app/admin/page.tsx">
                Kembali ke Beranda
              </span></Link>
            </p>
          </div>
        </footer>
      </div>;
}