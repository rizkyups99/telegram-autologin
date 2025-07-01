'use client';

import { useState } from "react";
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { LogOut, Users, Settings, ArrowRight, Store, ShoppingBag, ExternalLink } from 'lucide-react';
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
  return <div className="min-h-screen bg-background" data-unique-id="a3dfc155-866d-49e0-9b61-66a554aafcb8" data-file-name="components/AdminDashboard.tsx">
      <header className="border-b border-border" data-unique-id="ffdb8312-ce69-494f-b125-d5473a6bda4f" data-file-name="components/AdminDashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-4" data-unique-id="9c8668cc-dc61-47cd-bf7b-9989365e4962" data-file-name="components/AdminDashboard.tsx">
          <h1 className="text-2xl sm:text-3xl font-bold" data-unique-id="2b622a42-b87a-47cd-adc8-d93c0aebb9ec" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="4d1192ce-dd87-46a0-9fe8-a392365d21f4" data-file-name="components/AdminDashboard.tsx">Admin Panel</span></h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2" size="sm" data-unique-id="e8740e3c-3fe0-46f7-bf7f-0bc44ceacd34" data-file-name="components/AdminDashboard.tsx">
            <LogOut className="h-4 w-4" /><span className="editable-text" data-unique-id="dd167878-108f-4ace-8a9f-0e47fe237a3b" data-file-name="components/AdminDashboard.tsx">
            Logout
          </span></Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 sm:py-8" data-unique-id="58fe5597-29e4-4b0b-b03f-10a4fc7dbf06" data-file-name="components/AdminDashboard.tsx">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4" data-unique-id="ff8cac5f-a4cf-440f-a27c-69432349c23d" data-file-name="components/AdminDashboard.tsx">
          <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left" data-unique-id="a94973b0-b65c-4c5b-9fc5-8bffde7325aa" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="87069ad6-0dd5-479e-8533-e5b8b08dac77" data-file-name="components/AdminDashboard.tsx">Selamat datang, </span><span className="font-semibold" data-unique-id="bf8c68b6-4e3d-4c1e-ad47-43d189f99410" data-file-name="components/AdminDashboard.tsx" data-dynamic-text="true">{admin.email}</span><span className="editable-text" data-unique-id="8102dd0d-15cb-4732-aabd-bd6c94c31fd6" data-file-name="components/AdminDashboard.tsx">!</span></h2>
          <div className="flex items-center gap-3" data-unique-id="148cefd7-4767-4b4e-bc7b-8f4c63e72479" data-file-name="components/AdminDashboard.tsx">
            <a href="/etalase" target="_blank" rel="noopener noreferrer" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm" data-unique-id="c6bce1be-bf43-472b-a606-17a038b3b4c9" data-file-name="components/AdminDashboard.tsx">
              <Store className="h-4 w-4" />
              <span className="editable-text" data-unique-id="c92c6ce1-93bb-4bce-a19c-f63e3bbaec96" data-file-name="components/AdminDashboard.tsx">Etalase</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            
            <a href="/admin/seller" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm" data-unique-id="d37cdb50-63f4-4002-8353-5478981b3adf" data-file-name="components/AdminDashboard.tsx">
              <ShoppingBag className="h-4 w-4" />
              <span className="editable-text" data-unique-id="50f3370a-d3e7-4d16-9b8a-50516dc4f65d" data-file-name="components/AdminDashboard.tsx">Seller</span>
            </a>
            
            <Link href="/forward" data-unique-id="b749c686-e448-4a05-b3d6-e5c972378859" data-file-name="components/AdminDashboard.tsx">
              <Button className="flex items-center gap-2" size="sm" data-unique-id="d9bd121c-8621-4e3e-b510-68a9d0bc2251" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="37afc0da-9a57-45da-b2da-f2ad5c452a88" data-file-name="components/AdminDashboard.tsx">
                Penerusan Pesan
                </span><ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        
        <Tabs defaultValue="review" className="w-full" data-unique-id="9656704f-20f3-4a67-b06a-b4b4a200acf3" data-file-name="components/AdminDashboard.tsx">
          <div className="overflow-x-auto" data-unique-id="c353e66e-ab79-4b60-8c96-ded76037a7c7" data-file-name="components/AdminDashboard.tsx">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="review" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="1ace44c7-87f9-45fa-899f-e2a3cdcba53e" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg><span className="editable-text" data-unique-id="382c3cdc-00cb-4592-8976-6cfe8ed7b268" data-file-name="components/AdminDashboard.tsx">
              REVIEW UJICOBA
            </span></TabsTrigger>
            <TabsTrigger value="user-registration" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="e6715395-4eb7-4a13-abd5-c6f958a88237" data-file-name="components/AdminDashboard.tsx">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                <path d="M19 8h2"></path>
                <path d="M19 12h2"></path>
              </svg><span className="editable-text" data-unique-id="60ad6f87-29c6-4036-abaa-ab7b346e41d8" data-file-name="components/AdminDashboard.tsx">
              Daftar User
            </span></TabsTrigger>
            <TabsTrigger value="admin-mgmt" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="0a57cc12-9636-46fe-b8c0-5c10488adb9c" data-file-name="components/AdminDashboard.tsx">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg><span className="editable-text" data-unique-id="9337d6f0-378a-4273-8f2c-438015da2ec2" data-file-name="components/AdminDashboard.tsx">
              Daftar Admin
            </span></TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-1">
              <Settings className="h-4 w-4" /><span className="editable-text" data-unique-id="f8ead96f-07dd-4b14-bf29-31fdea3ec3e7" data-file-name="components/AdminDashboard.tsx">
              Atur Telegram
            </span></TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="441aaf1c-cefa-43f0-b063-0ddd00cf8c34" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 10v3"></path>
                <path d="M6 6v11"></path>
                <path d="M10 3v18"></path>
                <path d="M14 8v8"></path>
                <path d="M18 5v13"></path>
                <path d="M22 10v3"></path>
              </svg><span className="editable-text" data-unique-id="00d42493-2e6d-4d82-8e8c-453512e46dc3" data-file-name="components/AdminDashboard.tsx">
              Audio
            </span></TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="e5db7fc0-995b-411d-8ade-b2051265fbec" data-file-name="components/AdminDashboard.tsx">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg><span className="editable-text" data-unique-id="1e31cbb2-0999-4c33-bd0e-a5bd46177b4b" data-file-name="components/AdminDashboard.tsx">
              PDF
            </span></TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="e397000c-ab1f-47c6-8fe0-266086312972" data-file-name="components/AdminDashboard.tsx">
                <path d="m22 8-6 4 6 4V8Z"></path>
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
              </svg><span className="editable-text" data-unique-id="ed08eabe-50e0-49fe-80e3-057b05e21110" data-file-name="components/AdminDashboard.tsx">
              Video
            </span></TabsTrigger>
            <TabsTrigger value="category" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="82eab4c5-3bea-425d-8486-a3fb008014f2" data-file-name="components/AdminDashboard.tsx">
                <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                <rect width="7" height="7" x="3" y="14" rx="1"></rect>
              </svg><span className="editable-text" data-unique-id="8674dafb-9c45-46c7-8d9c-76c47ee9770a" data-file-name="components/AdminDashboard.tsx">
              Kategori
            </span></TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="6ecdede2-08a2-4fd2-9c37-09ec96c491ad" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg><span className="editable-text" data-unique-id="fedd350a-12c2-4f87-8e94-f6a266099b22" data-file-name="components/AdminDashboard.tsx">
              Preview User
            </span></TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="84276bb6-0ffe-4c8a-b37c-2378e20d88a2" data-file-name="components/AdminDashboard.tsx">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg><span className="editable-text" data-unique-id="f7a76d4d-44b2-4a87-a27a-a5e9d949aa62" data-file-name="components/AdminDashboard.tsx">
              Statistik
            </span></TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="ac6f67ea-0878-4b4b-b226-6f480fec8aca" data-file-name="components/AdminDashboard.tsx">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg><span className="editable-text" data-unique-id="907294d8-3e9c-4827-984f-913e646db0d3" data-file-name="components/AdminDashboard.tsx">
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
            <Tabs defaultValue="audio" className="w-full" data-unique-id="7d2e0551-91bb-4736-833c-645cad748e6a" data-file-name="components/AdminDashboard.tsx">
              <TabsList className="mb-6 flex flex-wrap w-full">
                <TabsTrigger value="audio"><span className="editable-text" data-unique-id="1eeb537b-a0d9-4f00-b018-e17838186b8c" data-file-name="components/AdminDashboard.tsx">Preview Audio</span></TabsTrigger>
                <TabsTrigger value="pdf"><span className="editable-text" data-unique-id="83cd06ae-2a62-45b3-9ba9-5e30399fa002" data-file-name="components/AdminDashboard.tsx">Preview PDF</span></TabsTrigger>
                <TabsTrigger value="video"><span className="editable-text" data-unique-id="da16bb4d-9428-4d81-9668-a01a9122f4ac" data-file-name="components/AdminDashboard.tsx">Preview Video</span></TabsTrigger>
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
            <div className="space-y-6" data-unique-id="b1e8f46c-3d54-42f2-8da8-e4d1423c03c4" data-file-name="components/AdminDashboard.tsx" data-dynamic-text="true">
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