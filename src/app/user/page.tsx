'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudioPreview from '@/components/preview/audio/AudioPreview';
import PDFPreview from '@/components/preview/pdf/PDFPreview';
import VideoPreview from '@/components/preview/video/VideoPreview';
export default function UserPage() {
  const [user, setUser] = useState<{
    username: string;
    name?: string;
    id?: number;
  } | null>(null);
  const [accessCounts, setAccessCounts] = useState({
    audio: 0,
    pdf: 0,
    video: 0
  });
  const [audioCategoryIds, setAudioCategoryIds] = useState<number[]>([]);
  const [pdfCategoryIds, setPdfCategoryIds] = useState<number[]>([]);
  const [videoCategoryIds, setVideoCategoryIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [whatsappPhone, setWhatsappPhone] = useState('6285716665995'); // Default fallback
  const router = useRouter();
  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/');
      return;
    }
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Fetch user access data if we have a user ID
      if (parsedUser.id) {
        fetchUserAccess(parsedUser.id);
      }

      // Fetch WhatsApp phone number
      fetchWhatsappPhone();
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      router.push('/');
    }
  }, [router]);
  const fetchUserAccess = async (userId: number) => {
    try {
      const response = await fetch(`/api/users/categories?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user access categories');
      }
      const data = await response.json();

      // Extract category IDs
      const audioIds = data.audio?.map((item: any) => item.categoryId) || [];
      const pdfIds = data.pdf?.map((item: any) => item.categoryId) || [];
      const videoIds = data.video?.map((item: any) => item.categoryId) || [];

      // Set state
      setAudioCategoryIds(audioIds);
      setPdfCategoryIds(pdfIds);
      setVideoCategoryIds(videoIds);

      // Update access counts
      setAccessCounts({
        audio: audioIds.length,
        pdf: pdfIds.length,
        video: videoIds.length
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user access:', error);
      setIsLoading(false);
    }
  };
  const fetchWhatsappPhone = async () => {
    try {
      const response = await fetch('/api/whatsapp-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.phoneNumber) {
          setWhatsappPhone(data.phoneNumber);
        }
      }
    } catch (error) {
      console.error('Error fetching WhatsApp phone:', error);
      // Keep the default phone number if fetch fails
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };
  if (!user || isLoading) {
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="456b4998-a734-4c99-8099-321f3049ebe5" data-file-name="app/user/page.tsx">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" data-unique-id="d53982b6-0153-46dc-a6f1-3127cdd349ce" data-file-name="app/user/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="d39b0d90-7b46-4f40-8e8f-e860cf203685" data-file-name="app/user/page.tsx">
      <header className="border-b border-border" data-unique-id="2176d6f5-1321-4423-9a8d-54bb70855d3b" data-file-name="app/user/page.tsx">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-5 flex flex-row justify-between items-center gap-2" data-unique-id="dec4cfd8-c7db-4781-833d-82132a17d3af" data-file-name="app/user/page.tsx">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="01db64b6-4762-4609-8e4f-d08871089814" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="760e64e2-4bf1-456a-ae54-6c0663d0cf02" data-file-name="app/user/page.tsx">User Panel</span></h1>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2 text-white text-sm" size="sm" data-unique-id="fa245274-2b7f-4d64-ae2a-b22823461e2c" data-file-name="app/user/page.tsx">
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm" data-unique-id="ea129092-3ab8-4c25-b95e-157db5cb3660" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="bcc99c4c-4f65-4029-a973-eaab087c3b54" data-file-name="app/user/page.tsx">Logout</span></span>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 flex-grow" data-unique-id="6dd11ad3-666a-4471-86eb-d40623ac2792" data-file-name="app/user/page.tsx">
        <Card className="mb-4 sm:mb-6" data-unique-id="5cc012f6-8e63-4d7d-83ca-42002cb6ed46" data-file-name="app/user/page.tsx">
          <CardHeader className="p-3 sm:p-4" data-unique-id="34e7ad6d-973b-4a9a-91f0-da34105aaf90" data-file-name="app/user/page.tsx">
            <CardTitle className="text-lg sm:text-xl md:text-2xl" data-unique-id="ed9b240a-1279-4481-a0f7-801a1850ba9e" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="cef749d4-ca54-4084-9078-461a919823f6" data-file-name="app/user/page.tsx">Selamat datang, </span><span className="font-semibold" data-unique-id="93489693-dcad-4efb-9219-f591946c0520" data-file-name="app/user/page.tsx" data-dynamic-text="true">{user.name || user.username}</span></CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0" data-unique-id="dfa13ef5-8888-4e3b-8547-4f60cd298950" data-file-name="app/user/page.tsx">
            <p className="text-sm sm:text-base" data-unique-id="147ee1a7-fdf7-43f6-9520-3d095971bb89" data-file-name="app/user/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="3bb3e7e1-7117-4d64-a6f7-d5f6f80c92c7" data-file-name="app/user/page.tsx">
              Anda Telah Membeli Akses : Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="8735ca06-4758-4d55-a83b-05a9ee8b54f4" data-file-name="app/user/page.tsx">), PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="a9bb0157-0662-4d8f-93f3-b6ebc9cb08cd" data-file-name="app/user/page.tsx">), Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="5e2aad98-9317-437a-8ed9-91d7cc37edd2" data-file-name="app/user/page.tsx">)
            </span></p>
          </CardContent>
        </Card>

        <Tabs defaultValue="audio" className="w-full" data-unique-id="8f3c9c6d-2882-4249-ada4-b60f596c83b8" data-file-name="app/user/page.tsx">
          <TabsList className="mb-3 sm:mb-5 w-full flex">
            <TabsTrigger value="audio" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="d82de826-003e-46b1-9661-fa7fb657bb01" data-file-name="app/user/page.tsx">Audio</span></TabsTrigger>
            <TabsTrigger value="pdf" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="b929fbac-bc0a-4aa7-bb82-3d43c389e48d" data-file-name="app/user/page.tsx">PDF</span></TabsTrigger>
            <TabsTrigger value="video" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="e35bcabc-3f17-48c9-9eb8-6354b3ff82bc" data-file-name="app/user/page.tsx">Video</span></TabsTrigger>
          </TabsList>
          
          <TabsContent value="audio">
            {accessCounts.audio > 0 ? <AudioPreview filterCategoryIds={audioCategoryIds} /> : <Card data-unique-id="7e03316d-255b-478b-a145-a8741d9506f1" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="d58a48bd-155e-44a4-88b7-1345ed16d299" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="9d9bb095-c0d1-411d-8e17-1f27c5f7c410" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="3cca863b-0321-4537-b608-1b1400889fed" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten Audio</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
          
          <TabsContent value="pdf">
            {accessCounts.pdf > 0 ? <PDFPreview filterCategoryIds={pdfCategoryIds} /> : <Card data-unique-id="29a77eaa-e472-49b5-80cd-0e8caf9c88b2" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="63818b43-abb7-4124-9e30-9ef505918193" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="bb5cf506-77e7-44f7-aed8-8e1bd1c820cc" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="e90410e8-b167-4985-b3bc-a199bb400120" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten PDF</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
          
          <TabsContent value="video">
            {accessCounts.video > 0 ? <VideoPreview filterCategoryIds={videoCategoryIds} /> : <Card data-unique-id="652b03a0-9d8d-407a-bbdf-0bdb12a80387" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="2dafdab6-94a3-45f7-b20a-7c38a60c34f8" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="1894581e-3c63-4b20-b640-53e8cbaf1969" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="02bed64a-c172-4ce2-b4eb-30f0ed749fbc" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten Video</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}