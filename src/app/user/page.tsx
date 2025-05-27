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
  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };
  if (!user || isLoading) {
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="52ab5136-97a3-4f1a-b05a-97fcfbb82616" data-file-name="app/user/page.tsx">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" data-unique-id="727d573e-ecbd-4e4c-b5ee-ffe8b9770419" data-file-name="app/user/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="6b493867-6207-4024-a2de-d3fb58e1f273" data-file-name="app/user/page.tsx">
      <header className="border-b border-border" data-unique-id="d8db6031-918f-4e1e-97b0-93d97a511fc9" data-file-name="app/user/page.tsx">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-5 flex flex-row justify-between items-center gap-2" data-unique-id="043c9361-7da6-4f6b-9d79-6020b06736f4" data-file-name="app/user/page.tsx">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="185e434b-1488-4104-95e4-307c42a2c085" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="b6035160-7763-4bca-aaa6-20da2552845e" data-file-name="app/user/page.tsx">User Panel</span></h1>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2 text-white text-sm" size="sm" data-unique-id="7dd35086-7757-4f50-94d4-b69c1d4e8961" data-file-name="app/user/page.tsx">
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm" data-unique-id="7db036fd-30d3-44e3-8677-0cab4daef2fe" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="912149f2-8604-48aa-b1b2-198b69449f5c" data-file-name="app/user/page.tsx">Logout</span></span>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 flex-grow" data-unique-id="774172b4-32cb-47aa-b3d6-ffa685efae1d" data-file-name="app/user/page.tsx">
        <Card className="mb-4 sm:mb-6" data-unique-id="22835e41-021f-404e-b2f5-b1e0de395c81" data-file-name="app/user/page.tsx">
          <CardHeader className="p-3 sm:p-4" data-unique-id="aed9bbb2-b77b-4ef0-b044-4294b9cc2d1e" data-file-name="app/user/page.tsx">
            <CardTitle className="text-lg sm:text-xl md:text-2xl" data-unique-id="4b62ba4b-a71a-4cc2-8e4c-938145a0da00" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="b0a39a97-75cd-40d6-a00d-6dd72abc91ba" data-file-name="app/user/page.tsx">Selamat datang, </span><span className="font-semibold" data-unique-id="e4c4c9f3-3342-453c-9547-8c67a75a527f" data-file-name="app/user/page.tsx" data-dynamic-text="true">{user.name || user.username}</span></CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0" data-unique-id="17815f5d-4964-486b-af98-cfc3eec40fc1" data-file-name="app/user/page.tsx">
            <p className="text-sm sm:text-base" data-unique-id="be4368e7-8614-4ba3-bcbd-92dd862151e4" data-file-name="app/user/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="a7e64e87-e9e1-4803-800f-23319993f5e7" data-file-name="app/user/page.tsx">
              Anda Telah Membeli Akses : Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="e0a89d1e-fea8-4792-a19d-719e4e03d1ff" data-file-name="app/user/page.tsx">), PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="cc46c0aa-2427-4a30-a3fe-23ec46f835b0" data-file-name="app/user/page.tsx">), Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="8483065b-ff86-4f72-8d6a-b8e4b7b24507" data-file-name="app/user/page.tsx">)
            </span></p>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="audio" className="w-full" data-unique-id="d7da2fec-a11e-4ab3-b035-7e0ddef91811" data-file-name="app/user/page.tsx">
          <TabsList className="mb-3 sm:mb-5 w-full flex">
            <TabsTrigger value="audio" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="3f8f3532-3db5-40d6-8808-95f07fac607a" data-file-name="app/user/page.tsx">Audio</span></TabsTrigger>
            <TabsTrigger value="pdf" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="14751a22-201b-452a-aed9-441ace5f99ce" data-file-name="app/user/page.tsx">PDF</span></TabsTrigger>
            <TabsTrigger value="video" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="1c32ac34-916b-4533-aa57-ce86d5bfcead" data-file-name="app/user/page.tsx">Video</span></TabsTrigger>
          </TabsList>
          
          <TabsContent value="audio">
            {accessCounts.audio > 0 ? <AudioPreview filterCategoryIds={audioCategoryIds} /> : <Card data-unique-id="b7f462d1-6fea-487e-95ab-df313e92020b" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="d09480e1-7685-4e42-b208-4f8f190b4ba4" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="3a14a8c0-453e-4fcc-8f49-97f0350e74e7" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="646753b6-b471-4c07-8bd3-0a8346d09669" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten Audio</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
          
          <TabsContent value="pdf">
            {accessCounts.pdf > 0 ? <PDFPreview filterCategoryIds={pdfCategoryIds} /> : <Card data-unique-id="ef749d79-e0cd-4510-8387-df097595ebe1" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="2736c91f-653c-41bc-ab3c-dc343bb23bd2" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="1e32c03e-dcb8-4f98-a48f-4ae16d423b2e" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="327e5cfd-cbd5-4267-9f0e-7a355aa79a32" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten PDF</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
          
          <TabsContent value="video">
            {accessCounts.video > 0 ? <VideoPreview filterCategoryIds={videoCategoryIds} /> : <Card data-unique-id="420a137c-68fa-4bee-9650-df836db729de" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="80af551f-8761-4aaf-963c-aac2bb7279c8" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="c6f803ad-8911-4209-9e40-f520a8997f5c" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="ab8e7390-f730-4ec6-8795-98ccbdb7206e" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten Video</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}