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
import Link from 'next/link';
import { User } from '@/db/schema';
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
  return <div className="min-h-screen bg-background" data-unique-id="83d4af26-e75c-44b1-b849-bff468fc325d" data-file-name="components/AdminDashboard.tsx">
      <header className="border-b border-border" data-unique-id="fef06965-8c84-4350-bcc3-405fe83cbc7b" data-file-name="components/AdminDashboard.tsx">
        <div className="container mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row justify-between items-center gap-4" data-unique-id="e7b7b1ba-5ad0-48c1-b9fa-2a367310f294" data-file-name="components/AdminDashboard.tsx">
          <h1 className="text-2xl sm:text-3xl font-bold" data-unique-id="8da263b5-5776-4074-85c6-b1e6f69ca973" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="8da3b356-8417-4eee-a75a-2744962754f5" data-file-name="components/AdminDashboard.tsx">Admin Panel</span></h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2" size="sm" data-unique-id="a5d24b6c-5d7d-4387-81c1-44563545b7fb" data-file-name="components/AdminDashboard.tsx">
            <LogOut className="h-4 w-4" /><span className="editable-text" data-unique-id="210e416f-7f96-454c-a4a6-4464059b5630" data-file-name="components/AdminDashboard.tsx">
            Logout
          </span></Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-6 sm:py-8" data-unique-id="1e7e220c-7926-4fcb-aad5-cc80ea478812" data-file-name="components/AdminDashboard.tsx">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4" data-unique-id="01b61c14-5107-4a33-836d-ec1c2467c2f3" data-file-name="components/AdminDashboard.tsx">
          <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left" data-unique-id="af82b423-f8e4-4291-8bd7-c6a326f7a45f" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="894f2985-0b43-4bb8-9eb8-684fcec6b36c" data-file-name="components/AdminDashboard.tsx">Selamat datang, </span><span className="font-semibold" data-unique-id="6d91f04c-7e3b-49a8-be0b-ca103066aaaa" data-file-name="components/AdminDashboard.tsx" data-dynamic-text="true">{admin.email}</span><span className="editable-text" data-unique-id="2b091309-9008-42a0-a170-3bad523a7fd4" data-file-name="components/AdminDashboard.tsx">!</span></h2>
          <Link href="/forward" data-unique-id="b44df596-8321-4e94-aa53-81272552c345" data-file-name="components/AdminDashboard.tsx">
            <Button className="flex items-center gap-2 w-full sm:w-auto" size="sm" data-unique-id="ef38a99e-6990-4f6c-a714-a7d773c7e139" data-file-name="components/AdminDashboard.tsx"><span className="editable-text" data-unique-id="c7328a85-0b52-450a-b92f-bb5ba2f79778" data-file-name="components/AdminDashboard.tsx">
              Penerusan Pesan
              </span><ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="review" className="w-full" data-unique-id="67c0b53f-35a5-4e30-8a70-2b8bc16d0d0f" data-file-name="components/AdminDashboard.tsx">
          <div className="overflow-x-auto" data-unique-id="71e34059-f22b-4453-b8d6-0711b21316c0" data-file-name="components/AdminDashboard.tsx">
            <TabsList className="mb-6 sm:mb-8 flex flex-nowrap min-w-max">
            <TabsTrigger value="review" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="af079ea0-1c07-424e-814e-d3ea8bca43c9" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg><span className="editable-text" data-unique-id="7d9553b4-89b3-42bd-8ac9-782574ae8713" data-file-name="components/AdminDashboard.tsx">
              REVIEW UJICOBA
            </span></TabsTrigger>
            <TabsTrigger value="user-registration" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="c6eec471-b8d4-4152-9722-0aa6ae6750a5" data-file-name="components/AdminDashboard.tsx">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                <path d="M19 8h2"></path>
                <path d="M19 12h2"></path>
              </svg><span className="editable-text" data-unique-id="e80a71d6-2600-4c12-82d4-79e5901f6642" data-file-name="components/AdminDashboard.tsx">
              Daftar User
            </span></TabsTrigger>
            <TabsTrigger value="admin-mgmt" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="6948e31e-ea8a-4193-a5e4-0b4e015a186e" data-file-name="components/AdminDashboard.tsx">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg><span className="editable-text" data-unique-id="817f6d7e-bc5b-4bf9-9cb8-5656152eda2d" data-file-name="components/AdminDashboard.tsx">
              Daftar Admin
            </span></TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-1">
              <Settings className="h-4 w-4" /><span className="editable-text" data-unique-id="dd1d00ae-58e2-4396-a6ae-c5516501ae72" data-file-name="components/AdminDashboard.tsx">
              Atur Telegram
            </span></TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="a33610fe-48a6-44ca-b35f-18796f0f90b9" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 10v3"></path>
                <path d="M6 6v11"></path>
                <path d="M10 3v18"></path>
                <path d="M14 8v8"></path>
                <path d="M18 5v13"></path>
                <path d="M22 10v3"></path>
              </svg><span className="editable-text" data-unique-id="6dc0812e-4842-4681-ab4b-72a413ad04c4" data-file-name="components/AdminDashboard.tsx">
              Audio
            </span></TabsTrigger>
            <TabsTrigger value="pdf" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="fc10ebda-0d6e-41c6-99ed-fddf365c1b86" data-file-name="components/AdminDashboard.tsx">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg><span className="editable-text" data-unique-id="46e66600-1531-4b5b-9ce2-eebc0660526f" data-file-name="components/AdminDashboard.tsx">
              PDF
            </span></TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="ca650e49-0154-4e56-b834-690b56ce447c" data-file-name="components/AdminDashboard.tsx">
                <path d="m22 8-6 4 6 4V8Z"></path>
                <rect width="14" height="12" x="2" y="6" rx="2" ry="2"></rect>
              </svg><span className="editable-text" data-unique-id="1646724c-66b0-41b8-8840-ee8dae9344dd" data-file-name="components/AdminDashboard.tsx">
              Video
            </span></TabsTrigger>
            <TabsTrigger value="category" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="43d3daf3-2097-4fa3-a7eb-6d83b6f805dc" data-file-name="components/AdminDashboard.tsx">
                <rect width="7" height="7" x="3" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="3" rx="1"></rect>
                <rect width="7" height="7" x="14" y="14" rx="1"></rect>
                <rect width="7" height="7" x="3" y="14" rx="1"></rect>
              </svg><span className="editable-text" data-unique-id="3e655727-cac3-4fac-90c5-597f1db36f7f" data-file-name="components/AdminDashboard.tsx">
              Kategori
            </span></TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="fd036538-3296-4877-a590-e1ae0e59810a" data-file-name="components/AdminDashboard.tsx">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg><span className="editable-text" data-unique-id="9786a792-9b5a-4e64-ad62-5b903cb72931" data-file-name="components/AdminDashboard.tsx">
              Preview User
            </span></TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" data-unique-id="de4f2eff-a3a5-4705-ac65-0e5424545c34" data-file-name="components/AdminDashboard.tsx">
                <path d="M3 3v18h18"></path>
                <path d="m19 9-5 5-4-4-3 3"></path>
              </svg><span className="editable-text" data-unique-id="a10bb9a4-1d79-4a68-9403-5230ee1c3ecb" data-file-name="components/AdminDashboard.tsx">
              Statistik
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
            <Tabs defaultValue="audio" className="w-full" data-unique-id="92f123de-f3c3-4cc4-b0ee-8b5536f3ae80" data-file-name="components/AdminDashboard.tsx">
              <TabsList className="mb-6 flex flex-wrap w-full">
                <TabsTrigger value="audio"><span className="editable-text" data-unique-id="a912d03f-a296-4e5f-9352-6856175f1234" data-file-name="components/AdminDashboard.tsx">Preview Audio</span></TabsTrigger>
                <TabsTrigger value="pdf"><span className="editable-text" data-unique-id="ab9856ae-6cd5-4e95-b554-307ee7d029ca" data-file-name="components/AdminDashboard.tsx">Preview PDF</span></TabsTrigger>
                <TabsTrigger value="video"><span className="editable-text" data-unique-id="0cb34b70-f51c-4dc4-8013-5e23c9fc0ea7" data-file-name="components/AdminDashboard.tsx">Preview Video</span></TabsTrigger>
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
            <StatisticsPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}