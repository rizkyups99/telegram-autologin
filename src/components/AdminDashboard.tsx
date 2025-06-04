'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { LogOut, Users, Settings, ArrowRight } from 'lucide-react';
import CategoryManager from './CategoryManager';
import PDFManager from './PDFManager';
import AudioManager from './AudioManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import UserTable from './UserTable';
import UserRegistration from './UserRegistration';
import TelegramSetup from './TelegramSetup';
import AdminRegistration from './AdminRegistration';
import VideoManager from './VideoManager';
import PreviewAudio from './PreviewAudio';
import PreviewPDF from './PreviewPDF';
import PreviewVideo from './PreviewVideo';
import ReviewUjicoba from './ReviewUjicoba';
import StatisticsPanel from './StatisticsPanel';
import WhatsappSettings from './WhatsappSettings';
import Link from 'next/link';
import { User } from '@/db/schema';
import { DailyRegistrations } from './statistics/DailyRegistrations';
interface AdminDashboardProps {
  admin: {
    email: string;
    isAdmin: boolean;
    loginTime: string;
  };
  users: User[];
  error: string | null;
  handleLogout: () => void;
}
export default function AdminDashboard({
  admin,
  users,
  error,
  handleLogout
}: AdminDashboardProps) {
  return <div className="min-h-screen bg-background" data-unique-id="9b78896a-f1c7-4974-b36c-5339dbffb296" data-file-name="components/AdminDashboard.tsx">
      <header className="border-b border-border" data-unique-id="ae81f552-ccc5-4c67-b8ba-ec5761e0d67c" data-file-name="components/AdminDashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-4" data-unique-id="299e5997-60bb-41e4-baa6-57ff38bd1d2a" data-file-name="components/AdminDashboard.tsx">
          <h1 className="text-2xl sm:text-3xl font-bold" data-unique-id="540bf81c-b095-43da-9441-bb7f9e79e37f" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="34b5617d-7b2b-481d-bcd0-ee4fd0044b74" data-file-name="components/AdminDashboard.tsx">Admin Panel</span></h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2" size="sm" data-unique-id="2e319106-3df3-4a8c-b8d1-56d48bfcdd55" data-file-name="components/AdminDashboard.tsx">
            <LogOut className="h-4 w-4" /><span className="editable-text" data-unique-id="6c6095b9-2ab4-47c7-916b-398c73eaa944" data-file-name="components/AdminDashboard.tsx">
            Logout
          </span></Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 sm:py-8" data-unique-id="336bca51-051a-451f-8583-163e1145e60b" data-file-name="components/AdminDashboard.tsx">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4" data-unique-id="c52be2e7-5945-4e5d-a5a7-f783b9804094" data-file-name="components/AdminDashboard.tsx">
          <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left" data-unique-id="0c9d079e-cae0-458d-a0d8-b45bc2e303e7" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="034f7bb3-64be-48fb-a0db-f0c5322a084c" data-file-name="components/AdminDashboard.tsx">Selamat datang, </span><span className="font-semibold" data-unique-id="cb0bc046-bc4d-408b-9071-4f5895b51886" data-file-name="components/AdminDashboard.tsx" data-dynamic-text="true">{admin.email}</span><span className="editable-text" data-unique-id="cae40fe4-dfbd-406a-bf0f-c59fdce8f586" data-file-name="components/AdminDashboard.tsx">!</span></h2>
          <Link href="/forward" data-unique-id="67fd04e8-b29e-4f64-ba7e-09eea00b57cf" data-file-name="components/AdminDashboard.tsx">
            <Button className="flex items-center gap-2 w-full sm:w-auto" size="sm" data-unique-id="17f33cfa-b3c7-41f9-9c1b-d044f06e6758" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="2d713dfb-e3c6-4285-b2b1-46cb6b779487" data-file-name="components/AdminDashboard.tsx">
              Penerusan Pesan
              </span><ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="review" className="w-full" data-unique-id="41614102-88e8-423c-b86e-60deb771156e" data-file-name="components/AdminDashboard.tsx">
          <div className="overflow-x-auto" data-unique-id="880dbb73-0ba9-4da8-8c98-6e684541d8a1" data-file-name="components/AdminDashboard.tsx">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="review" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="1cf465f1-4037-4b43-b0ba-d4e76652ac24" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg><span className="editable-text" data-unique-id="dfcbaffd-8cf3-4e89-9fa6-b88a9581a1d7" data-file-name="components/AdminDashboard.tsx">
              REVIEW UJICOBA
            </span></TabsTrigger>
            <TabsTrigger value="user-registration" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="e7f2aa41-e870-475e-9cce-658f3e59ffe9" data-file-name="components/AdminDashboard.tsx">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                <path d="M19 8h2"></path>
                <path d="M19 12h2"></path>
              </svg><span className="editable-text" data-unique-id="dc15cd95-340b-431d-80e4-5cbeb19ba2d1" data-file-name="components/AdminDashboard.tsx">
              Daftar User
            </span></TabsTrigger>
            <TabsTrigger value="admin-mgmt" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="fad2c504-88c4-40c9-a44f-c5e5ad45f84b" data-file-name="components/AdminDashboard.tsx">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg><span className="editable-text" data-unique-id="c08ba542-4b05-4992-90e5-820af04220f9" data-file-name="components/AdminDashboard.tsx">
              Daftar Admin
            </span></TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-1">
              <Settings className="h-4 w-4" /><span className="editable-text" data-unique-id="244f15cf-87b0-4fe7-9da1-82b3f62556c4" data-file-name="components/AdminDashboard.tsx">
              Atur Telegram
            </span></TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="22bbf1fe-d9e8-4f48-abdc-443043210805" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 10v3"></path>
                <path d="M6 6v11"></path>
                <path d="M10 3v18"></path>
                <path d="M14 8v8"></path>
                <path d="M18 5v13"></path>
                <path d="M22 10v3"></path>
              </svg><span className="editable-text" data-unique-id="3a5d5bfb-9dd4-43bf-8994-89acb8edfef6" data-file-name="components/AdminDashboard.tsx">
              Audio
            </span></TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="4372d862-e52b-4310-877d-624fb21ad7a5" data-file-name="components/AdminDashboard.tsx">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg><span className="editable-text" data-unique-id="04a6ed63-b61b-45d3-9b48-50ed77b8d6a3" data-file-name="components/AdminDashboard.tsx">
              PDF
            </span></TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="b712280a-de36-4669-a2e9-ba71795bd7a4" data-file-name="components/AdminDashboard.tsx">
                <path d="m22 8-6 4 6 4V8Z"></path>
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
              </svg><span className="editable-text" data-unique-id="3c0199d9-d3c8-45a0-8a28-b4434a962967" data-file-name="components/AdminDashboard.tsx">
              Video
            </span></TabsTrigger>
            <TabsTrigger value="category" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="0cc12974-3f62-4cd6-98a8-001013298ff7" data-file-name="components/AdminDashboard.tsx">
                <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                <rect width="7" height="7" x="3" y="14" rx="1"></rect>
              </svg><span className="editable-text" data-unique-id="057866a2-85a9-4478-9538-6a28a62f6b95" data-file-name="components/AdminDashboard.tsx">
              Kategori
            </span></TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="e4c40504-eeb5-465c-8357-28ae0730e1f2" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg><span className="editable-text" data-unique-id="6af4f722-9e3d-4b35-b8b3-90daf450c8a3" data-file-name="components/AdminDashboard.tsx">
              Preview User
            </span></TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="5d43e484-6f4f-4873-a549-7c08d36b68ad" data-file-name="components/AdminDashboard.tsx">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg><span className="editable-text" data-unique-id="c8578aa0-da9c-4064-909d-6eb501086f1b" data-file-name="components/AdminDashboard.tsx">
              Statistik
            </span></TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="7c98721b-75d5-4cd3-9dd0-080be6e7d2ae" data-file-name="components/AdminDashboard.tsx">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg><span className="editable-text" data-unique-id="e92100a3-107e-49bb-b64d-e4e73bf37e8a" data-file-name="components/AdminDashboard.tsx">
              WhatsApp
            </span></TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="review">
            <ReviewUjicoba />
          </TabsContent>
          
          <TabsContent value="user-registration">
            <UserRegistration />
          </TabsContent>
          
          <TabsContent value="admin-mgmt">
            <AdminRegistration />
          </TabsContent>
          
          <TabsContent value="setup">
            <TelegramSetup />
          </TabsContent>
          
          <TabsContent value="audio">
            <AudioManager />
          </TabsContent>
          
          <TabsContent value="pdf">
            <PDFManager />
          </TabsContent>
          
          <TabsContent value="video">
            <VideoManager />
          </TabsContent>
          
          <TabsContent value="category">
            <CategoryManager />
          </TabsContent>
          
          <TabsContent value="preview">
            <Tabs defaultValue="audio" className="w-full" data-unique-id="a223fd47-6abe-4c2d-ab4f-d0f4e60e9bbb" data-file-name="components/AdminDashboard.tsx">
              <TabsList className="mb-6 flex flex-wrap w-full">
                <TabsTrigger value="audio"><span className="editable-text" data-unique-id="3621759b-fa9d-4d80-be4f-8bb3ae853d4a" data-file-name="components/AdminDashboard.tsx">Preview Audio</span></TabsTrigger>
                <TabsTrigger value="pdf"><span className="editable-text" data-unique-id="ac5850b5-80bc-4c09-bb25-ef61df5b2195" data-file-name="components/AdminDashboard.tsx">Preview PDF</span></TabsTrigger>
                <TabsTrigger value="video"><span className="editable-text" data-unique-id="891efbe2-36bb-420d-8384-03a69235c563" data-file-name="components/AdminDashboard.tsx">Preview Video</span></TabsTrigger>
              </TabsList>
              
              <TabsContent value="audio">
                <PreviewAudio />
              </TabsContent>
              
              <TabsContent value="pdf">
                <PreviewPDF />
              </TabsContent>
              
              <TabsContent value="video">
                <PreviewVideo />
              </TabsContent>
            </Tabs>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="space-y-6" data-unique-id="e8fe5f94-8f30-441a-8021-a24fd5adc3df" data-file-name="components/AdminDashboard.tsx" data-dynamic-text="true">
              <StatisticsPanel />
              
              {/* Daily User Registrations */}
              <DailyRegistrations year={new Date().getFullYear()} month={new Date().getMonth() + 1} />
            </div>
          </TabsContent>
          
          <TabsContent value="whatsapp">
            <WhatsappSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}