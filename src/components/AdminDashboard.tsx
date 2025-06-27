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
import AudioCloudManager from './AudioCloudManager';
import PDFCloudManager from './PDFCloudManager';
import FileCloudManager from './FileCloudManager';
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
  return <div className="min-h-screen bg-background" data-unique-id="3940fec8-2561-46f2-9622-2198417f036f" data-file-name="components/AdminDashboard.tsx">
      <header className="border-b border-border" data-unique-id="babbd764-bf84-4e8d-a53a-ad4704dcf5a5" data-file-name="components/AdminDashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-4" data-unique-id="64ef965a-e8b6-4c8c-87e7-1e761bfb88e5" data-file-name="components/AdminDashboard.tsx">
          <h1 className="text-2xl sm:text-3xl font-bold" data-unique-id="5c082c62-fcd5-482f-bfb4-3aa3ea02e9c6" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="cdab8d43-fdca-4472-ad23-03e75ffb68c6" data-file-name="components/AdminDashboard.tsx">Admin Panel</span></h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2" size="sm" data-unique-id="b499acea-a9bc-4d64-8651-61ca15371788" data-file-name="components/AdminDashboard.tsx">
            <LogOut className="h-4 w-4" /><span className="editable-text" data-unique-id="1c28ddcc-3196-4991-bf7b-5dfa3995e26a" data-file-name="components/AdminDashboard.tsx">
            Logout
          </span></Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 sm:py-8" data-unique-id="5ee08829-f519-4b9f-91ae-157168760ee0" data-file-name="components/AdminDashboard.tsx">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4" data-unique-id="31f1e7ee-46ab-44d4-a126-e65c1d126264" data-file-name="components/AdminDashboard.tsx">
          <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left" data-unique-id="b8f5ebe8-730e-4b8b-8edf-8827754f870e" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="8c36b30c-c663-4484-8898-a5604736cea8" data-file-name="components/AdminDashboard.tsx">Selamat datang, </span><span className="font-semibold" data-unique-id="fdb01ca0-f07a-48cd-ac1a-c99f9ffca4b4" data-file-name="components/AdminDashboard.tsx" data-dynamic-text="true">{admin.email}</span><span className="editable-text" data-unique-id="2f17f3a6-99ec-41a0-8bd5-692429b50ce5" data-file-name="components/AdminDashboard.tsx">!</span></h2>
          <Link href="/forward" data-unique-id="4dccbfd8-002f-4b95-8c4d-1467eb029860" data-file-name="components/AdminDashboard.tsx">
            <Button className="flex items-center gap-2 w-full sm:w-auto" size="sm" data-unique-id="8fa4a486-0554-4e76-a268-5d908998caa8" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="762df47c-3837-4351-bd7d-1967ff0607ca" data-file-name="components/AdminDashboard.tsx">
              Penerusan Pesan
              </span><ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="review" className="w-full" data-unique-id="3a717446-e1c7-4436-b4b6-0b276484e39b" data-file-name="components/AdminDashboard.tsx">
          <div className="overflow-x-auto" data-unique-id="09682209-41b1-45f5-b063-b763645a4dd0" data-file-name="components/AdminDashboard.tsx">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="review" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="358d2f72-dafc-4665-a464-7f597087df3b" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg><span className="editable-text" data-unique-id="f1e93548-35df-4998-97d1-3cd836b9d4b8" data-file-name="components/AdminDashboard.tsx">
              REVIEW UJICOBA
            </span></TabsTrigger>
            <TabsTrigger value="user-registration" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="ce1c5828-8af7-4e2e-b169-a0f8c65ee48f" data-file-name="components/AdminDashboard.tsx">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                <path d="M19 8h2"></path>
                <path d="M19 12h2"></path>
              </svg><span className="editable-text" data-unique-id="b8fd8f93-ae14-426b-8322-016e95fa5198" data-file-name="components/AdminDashboard.tsx">
              Daftar User
            </span></TabsTrigger>
            <TabsTrigger value="admin-mgmt" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="f50384ea-95b7-457c-b54b-8c9408c8cecd" data-file-name="components/AdminDashboard.tsx">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg><span className="editable-text" data-unique-id="16404ae2-2713-4efb-a27c-999cd0fe4f05" data-file-name="components/AdminDashboard.tsx">
              Daftar Admin
            </span></TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-1">
              <Settings className="h-4 w-4" /><span className="editable-text" data-unique-id="ea18edfb-7bc5-43b5-98d5-7ee3e7dc33a0" data-file-name="components/AdminDashboard.tsx">
              Atur Telegram
            </span></TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="dd2f7566-be1e-4b3e-9d16-9e66a693ea95" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 10v3"></path>
                <path d="M6 6v11"></path>
                <path d="M10 3v18"></path>
                <path d="M14 8v8"></path>
                <path d="M18 5v13"></path>
                <path d="M22 10v3"></path>
              </svg><span className="editable-text" data-unique-id="898ed10e-3b9a-4171-a65e-df3dcaa937bf" data-file-name="components/AdminDashboard.tsx">
              Audio
            </span></TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="2d35222f-b201-43ef-8898-8970cbb29715" data-file-name="components/AdminDashboard.tsx">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg><span className="editable-text" data-unique-id="d6eef487-393c-4ee6-89d8-a2c77ecd1449" data-file-name="components/AdminDashboard.tsx">
              PDF
            </span></TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="8c445571-a3dc-409a-acf5-6e88defdd640" data-file-name="components/AdminDashboard.tsx">
                <path d="m22 8-6 4 6 4V8Z"></path>
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
              </svg><span className="editable-text" data-unique-id="96d9044d-0653-49bd-b689-97cba45b316c" data-file-name="components/AdminDashboard.tsx">
              Video
            </span></TabsTrigger>
            <TabsTrigger value="category" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="cea76dfd-6ca1-4bc0-9d10-616e4067e765" data-file-name="components/AdminDashboard.tsx">
                <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                <rect width="7" height="7" x="3" y="14" rx="1"></rect>
              </svg><span className="editable-text" data-unique-id="2727e8e6-2b5a-48fd-8799-07da8934919d" data-file-name="components/AdminDashboard.tsx">
              Kategori
            </span></TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="9902500f-3496-44e8-bf81-4e4d7f07ff07" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg><span className="editable-text" data-unique-id="826e8280-213c-421f-a895-e7aac8bae85b" data-file-name="components/AdminDashboard.tsx">
              Preview User
            </span></TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="a949fd05-1f58-46fe-abc5-e49945e6c1a5" data-file-name="components/AdminDashboard.tsx">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg><span className="editable-text" data-unique-id="50af43df-62e6-4f82-8263-dc9d7451f1b8" data-file-name="components/AdminDashboard.tsx">
              Statistik
            </span></TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="6b273b01-8fc9-4d28-abb9-1bc3118ba9ab" data-file-name="components/AdminDashboard.tsx">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg><span className="editable-text" data-unique-id="2829fdad-9d1a-4bbb-a7e4-53d01290fe77" data-file-name="components/AdminDashboard.tsx">
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
            <Tabs defaultValue="audio" className="w-full" data-unique-id="c5993b04-b4ac-4d84-925d-53d5ecdab8a1" data-file-name="components/AdminDashboard.tsx">
              <TabsList className="mb-6 flex flex-wrap w-full">
                <TabsTrigger value="audio"><span className="editable-text" data-unique-id="ef0e252f-cee7-4d44-8372-1bdd16d5b20b" data-file-name="components/AdminDashboard.tsx">Preview Audio</span></TabsTrigger>
                <TabsTrigger value="pdf"><span className="editable-text" data-unique-id="1995e73c-5766-4f3f-b7dc-3fc70258d214" data-file-name="components/AdminDashboard.tsx">Preview PDF</span></TabsTrigger>
                <TabsTrigger value="video"><span className="editable-text" data-unique-id="f6b7330c-cfb5-4b97-ba0b-4e40d411ca1c" data-file-name="components/AdminDashboard.tsx">Preview Video</span></TabsTrigger>
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
            <div className="space-y-6" data-unique-id="822ad9c6-0f4d-4a9f-a1c3-69a773cb9539" data-file-name="components/AdminDashboard.tsx" data-dynamic-text="true">
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