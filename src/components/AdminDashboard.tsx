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
  return <div className="min-h-screen bg-background" data-unique-id="b8ae20e8-a20b-411c-b0f8-7aff19408ddc" data-file-name="components/AdminDashboard.tsx">
      <header className="border-b border-border" data-unique-id="39950df6-4ad1-46d5-8fcf-bf9c5f86bb14" data-file-name="components/AdminDashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-4" data-unique-id="e85d4756-c0b0-4d92-87e2-4cc233ece462" data-file-name="components/AdminDashboard.tsx">
          <h1 className="text-2xl sm:text-3xl font-bold" data-unique-id="281b7335-31f8-428c-9922-0556f7b9feb1" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="b22c61cb-66ae-4320-8055-9dd46a0e6285" data-file-name="components/AdminDashboard.tsx">Admin Panel</span></h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2" size="sm" data-unique-id="a432c836-c904-4285-9bc5-854b4943ff53" data-file-name="components/AdminDashboard.tsx">
            <LogOut className="h-4 w-4" /><span className="editable-text" data-unique-id="2d622224-e516-4486-87ed-398f419dc936" data-file-name="components/AdminDashboard.tsx">
            Logout
          </span></Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 sm:py-8" data-unique-id="cf1966c7-b14c-4625-ba8f-12d5aa448fac" data-file-name="components/AdminDashboard.tsx">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4" data-unique-id="d567de08-fe98-4d60-8905-0529c3bd7211" data-file-name="components/AdminDashboard.tsx">
          <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left" data-unique-id="c17b5196-ac39-4835-91c7-c9e7f9058273" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="e64bec91-300a-4fcc-bb70-5aaa628c7749" data-file-name="components/AdminDashboard.tsx">Selamat datang, </span><span className="font-semibold" data-unique-id="af756216-ed94-4748-abb9-fcb435fa8722" data-file-name="components/AdminDashboard.tsx" data-dynamic-text="true">{admin.email}</span><span className="editable-text" data-unique-id="293af0ed-ba07-4660-867e-a401b10d7a83" data-file-name="components/AdminDashboard.tsx">!</span></h2>
          <Link href="/forward" data-unique-id="5f1cf93d-eb41-4e58-a571-d1de93ef2338" data-file-name="components/AdminDashboard.tsx">
            <Button className="flex items-center gap-2 w-full sm:w-auto" size="sm" data-unique-id="9cb83526-ac17-44e2-9e64-23b68d461599" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="7fb657cf-800b-4be8-a079-f4ba95472970" data-file-name="components/AdminDashboard.tsx">
              Penerusan Pesan
              </span><ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="review" className="w-full" data-unique-id="204f1ed6-2bc3-4905-8c34-95ff5f30f635" data-file-name="components/AdminDashboard.tsx">
          <div className="overflow-x-auto" data-unique-id="bd66c7d3-3540-4319-9850-bcaa8043f2c4" data-file-name="components/AdminDashboard.tsx">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="review" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="26afcb29-676d-4d62-8d10-e8b57baa5b16" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg><span className="editable-text" data-unique-id="18986097-14df-4310-837c-41a00a62720d" data-file-name="components/AdminDashboard.tsx">
              REVIEW UJICOBA
            </span></TabsTrigger>
            <TabsTrigger value="user-registration" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="68d6cd89-4d71-440c-a900-6a792b0ef29d" data-file-name="components/AdminDashboard.tsx">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                <path d="M19 8h2"></path>
                <path d="M19 12h2"></path>
              </svg><span className="editable-text" data-unique-id="9c0dedc5-13df-4d29-a152-551dc55b0592" data-file-name="components/AdminDashboard.tsx">
              Daftar User
            </span></TabsTrigger>
            <TabsTrigger value="admin-mgmt" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="6a1f7d4b-4d37-473f-b437-6496d5e4a1c4" data-file-name="components/AdminDashboard.tsx">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg><span className="editable-text" data-unique-id="04361849-e568-41a7-8f30-0bad1500aa32" data-file-name="components/AdminDashboard.tsx">
              Daftar Admin
            </span></TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-1">
              <Settings className="h-4 w-4" /><span className="editable-text" data-unique-id="38704f53-3b8e-4c25-a2af-c5da4605e810" data-file-name="components/AdminDashboard.tsx">
              Atur Telegram
            </span></TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="e936980e-3bb3-4005-ae56-970fa43becf0" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 10v3"></path>
                <path d="M6 6v11"></path>
                <path d="M10 3v18"></path>
                <path d="M14 8v8"></path>
                <path d="M18 5v13"></path>
                <path d="M22 10v3"></path>
              </svg><span className="editable-text" data-unique-id="99824976-2fce-49cb-a885-ac5ae494b5a4" data-file-name="components/AdminDashboard.tsx">
              Audio
            </span></TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="c236bc2d-c789-44c8-9096-ec527bfd3f45" data-file-name="components/AdminDashboard.tsx">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg><span className="editable-text" data-unique-id="d3c4fd17-6024-4416-bdec-b5e2c068dbfc" data-file-name="components/AdminDashboard.tsx">
              PDF
            </span></TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="0d0600f3-13cd-4597-97fb-2d1ab6e38865" data-file-name="components/AdminDashboard.tsx">
                <path d="m22 8-6 4 6 4V8Z"></path>
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
              </svg><span className="editable-text" data-unique-id="b560711d-13e4-49d4-8fe3-dc2f366f415a" data-file-name="components/AdminDashboard.tsx">
              Video
            </span></TabsTrigger>
            <TabsTrigger value="category" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="6f4f4f58-6826-41fc-b2e4-417584522e69" data-file-name="components/AdminDashboard.tsx">
                <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                <rect width="7" height="7" x="3" y="14" rx="1"></rect>
              </svg><span className="editable-text" data-unique-id="0a39941c-96bc-4229-bf86-48e4c0d41485" data-file-name="components/AdminDashboard.tsx">
              Kategori
            </span></TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="f710a5d7-5dca-4fff-93fa-98bf3c1cba79" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg><span className="editable-text" data-unique-id="bd621556-9644-4255-802f-29203327c0d2" data-file-name="components/AdminDashboard.tsx">
              Preview User
            </span></TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="d1cc75b4-5adb-4176-b4a0-8b327e483d17" data-file-name="components/AdminDashboard.tsx">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg><span className="editable-text" data-unique-id="4a1fdf58-b6da-4c33-8fdb-b3172e18b21a" data-file-name="components/AdminDashboard.tsx">
              Statistik
            </span></TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="e548ab4c-ce16-4d18-b56e-0fb126c4c567" data-file-name="components/AdminDashboard.tsx">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg><span className="editable-text" data-unique-id="3af3c1b6-800a-4793-8299-2cbffa246831" data-file-name="components/AdminDashboard.tsx">
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
            <Tabs defaultValue="audio" className="w-full" data-unique-id="ab84c301-0468-4007-9374-2aecff60f257" data-file-name="components/AdminDashboard.tsx">
              <TabsList className="mb-6 flex flex-wrap w-full">
                <TabsTrigger value="audio"><span className="editable-text" data-unique-id="1dc923e1-5ef2-455f-909e-55db041f842f" data-file-name="components/AdminDashboard.tsx">Preview Audio</span></TabsTrigger>
                <TabsTrigger value="pdf"><span className="editable-text" data-unique-id="a6f2543e-796f-45eb-a911-666f1bae1634" data-file-name="components/AdminDashboard.tsx">Preview PDF</span></TabsTrigger>
                <TabsTrigger value="video"><span className="editable-text" data-unique-id="5ce65273-49eb-465c-8ec5-50dedb56ddf4" data-file-name="components/AdminDashboard.tsx">Preview Video</span></TabsTrigger>
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
            <div className="space-y-6" data-unique-id="55e84b54-7226-4b18-82a9-942fb1daed55" data-file-name="components/AdminDashboard.tsx" data-dynamic-text="true">
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