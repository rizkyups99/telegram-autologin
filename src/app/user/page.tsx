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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="21a576b7-ccff-4494-98c1-33302c55cb86" data-file-name="app/user/page.tsx">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" data-unique-id="2dc36f1b-b10b-46de-91a3-cb25f7e11b3e" data-file-name="app/user/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="5e86077e-1f27-4d7d-8414-0330f023ffc5" data-file-name="app/user/page.tsx">
      <header className="border-b border-border" data-unique-id="889bb9eb-1d5b-401b-b5fc-49a385d9283a" data-file-name="app/user/page.tsx">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-5 flex flex-row justify-between items-center gap-2" data-unique-id="9dff6235-fcf4-48b6-a606-f5c1980aab45" data-file-name="app/user/page.tsx">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="06ee2350-4524-4a97-933b-7c2a262a9102" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="7f844f0f-81b8-4ac4-b962-1464d71171e9" data-file-name="app/user/page.tsx">Langit Digital User</span></h1>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2 text-white text-sm" size="sm" data-unique-id="4b2b6687-3f93-4128-9ecf-651e886dac6e" data-file-name="app/user/page.tsx">
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm" data-unique-id="38e429e4-e32b-458c-9c26-45a80c56780e" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="3d631dc6-70f2-4c4c-a64a-7c0c67b4cfe9" data-file-name="app/user/page.tsx">Logout</span></span>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 flex-grow" data-unique-id="edd35b79-2a9b-4209-a9e4-ba9ff315bcdd" data-file-name="app/user/page.tsx">
        <Card className="mb-4 sm:mb-6" data-unique-id="d726cb77-4d5a-45cb-aa63-dc1af3586baa" data-file-name="app/user/page.tsx">
          <CardHeader className="p-3 sm:p-4" data-unique-id="8482384d-6c53-4d6c-9fbe-a9a80830cf38" data-file-name="app/user/page.tsx">
            <CardTitle className="text-lg sm:text-xl md:text-2xl" data-unique-id="c133e956-10e4-45ff-9d3c-345e53129256" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="34b6732e-322f-46e9-97ea-e2e5293cdf42" data-file-name="app/user/page.tsx">Selamat datang, </span><span className="font-semibold text-red-600" data-unique-id="a0c68b22-b24f-4552-bfc6-18cbe40310f9" data-file-name="app/user/page.tsx" data-dynamic-text="true">{user.name || user.username}</span></CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0" data-unique-id="f3580d41-b4d9-4fa8-bef6-ee2505a7d16d" data-file-name="app/user/page.tsx">
            <p className="text-sm sm:text-base" data-unique-id="ee9fc906-e08f-494e-942d-8d511ea789e8" data-file-name="app/user/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b8f58b53-f9dd-404e-9465-847de7ac8233" data-file-name="app/user/page.tsx">
              Anda Telah Membeli Akses : Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="df7f84bf-039c-4683-aaa3-c53dcdc467e4" data-file-name="app/user/page.tsx">), PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="061672f2-6212-436b-a478-d374f60f4755" data-file-name="app/user/page.tsx">), Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="ddca633a-57e3-43e1-b790-58a4b47d60eb" data-file-name="app/user/page.tsx">)
            </span></p>
          </CardContent>
        </Card>

        <Tabs defaultValue="audio" className="w-full" data-unique-id="695e9537-8796-4bd9-8a45-e952258104c6" data-file-name="app/user/page.tsx">
          <TabsList className="mb-3 sm:mb-5 w-full flex">
            <TabsTrigger value="audio" className="flex-1 text-sm sm:text-base py-1.5 px-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"><span className="editable-text" data-unique-id="f8a901b7-e936-4b51-a852-f0521334ecac" data-file-name="app/user/page.tsx">Audio</span></TabsTrigger>
            <TabsTrigger value="pdf" className="flex-1 text-sm sm:text-base py-1.5 px-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"><span className="editable-text" data-unique-id="46dd497f-9772-4a51-ad03-7d012a200cf3" data-file-name="app/user/page.tsx">PDF</span></TabsTrigger>
            <TabsTrigger value="video" className="flex-1 text-sm sm:text-base py-1.5 px-2 data-[state=active]:bg-green-600 data-[state=active]:text-white"><span className="editable-text" data-unique-id="66ceb34a-3947-4a95-ac40-2776cde620d3" data-file-name="app/user/page.tsx">Video</span></TabsTrigger>
          </TabsList>
          
          <TabsContent value="audio">
            {accessCounts.audio > 0 ? <AudioPreview filterCategoryIds={audioCategoryIds} /> : <Card data-unique-id="b294d2b6-3bf8-4c34-b9dc-b50a0bbe4730" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="5c977a99-f9d2-492b-ab33-b887423eb6cc" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="ec8d9c40-a0f5-434e-a856-019473651071" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="8d585f7f-69b4-4ef9-a953-9f2e7d70df38" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten Audio</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
          
          <TabsContent value="pdf">
            {accessCounts.pdf > 0 ? <PDFPreview filterCategoryIds={pdfCategoryIds} /> : <Card data-unique-id="5024f3ec-d73e-4675-9c32-f6adf1ff7bc7" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="8239a1d5-b01e-4131-801d-805898876f45" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="5d624bfc-4267-4cb3-8b4e-38323b33f1d1" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="3bc6810c-0671-4315-8ea5-6e8658ae916b" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten PDF</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
          
          <TabsContent value="video">
            {accessCounts.video > 0 ? <VideoPreview filterCategoryIds={videoCategoryIds} /> : <Card data-unique-id="a33b03c9-8582-4f95-981d-f2207dbdb5cb" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="d61ec552-7e03-43eb-a7e1-ad37f31a4f44" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="5d3e086c-dfcb-4f80-b31d-16a382d6c9bb" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="fc90bad8-bfc7-4d0f-96af-4ea1cb0ca199" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten Video</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}