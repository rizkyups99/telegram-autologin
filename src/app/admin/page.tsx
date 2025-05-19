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
  const [admin, setAdmin] = useState<{ email: string; isAdmin: boolean; loginTime: string } | null>(null);
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Show login form if not logged in
  if (!admin) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">LANGIT DIGITAL</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto">Admin Panel</p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Langit Digital. All rights reserved.</p>
            <p className="mt-2">
              <Link href="/" className="hover:underline">
                ke beranda
              </Link>
            </p>
          </div>
        </footer>
      </div>
    );
  }
  
  return (
    admin ? (
      <AdminDashboard 
        admin={admin} 
        users={users} 
        error={error} 
        handleLogout={handleLogout} 
      />
    ) : (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container mx-auto px-4 py-4 sm:py-6 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">JALUR LANGIT DIGITAL</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2 max-w-2xl mx-auto">Admin Panel</p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          <AdminLoginForm />
        </main>
        
        <footer className="border-t border-border py-6 mt-auto">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Jalur Langit Digital. All rights reserved.</p>
            <p className="mt-2">
              <Link href="/" className="hover:underline">
                Kembali ke Beranda
              </Link>
            </p>
          </div>
        </footer>
      </div>
    )
  );
}
