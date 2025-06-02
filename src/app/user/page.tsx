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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="d1d45fa3-fa14-49c4-a36d-3e6420dceac7" data-file-name="app/user/page.tsx">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" data-unique-id="ece33530-f980-4bfe-bc76-5581ae9a0fed" data-file-name="app/user/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="07bb4993-33ae-44c7-b6cc-278985ecf6b4" data-file-name="app/user/page.tsx">
      <header className="border-b border-border" data-unique-id="125e2673-150a-41eb-896f-783526ac615e" data-file-name="app/user/page.tsx">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-5 flex flex-row justify-between items-center gap-2" data-unique-id="3a863b52-fdc4-4d3f-914a-ff3ae88d9a46" data-file-name="app/user/page.tsx">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="2df7c2e1-7c4d-4822-9453-4f2d0c37c274" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="76c3cbd2-0f5c-49f6-88ca-fb56603b2324" data-file-name="app/user/page.tsx">User Panel</span></h1>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2 text-white text-sm" size="sm" data-unique-id="f594d73c-fd33-4cec-9a49-43b18b60b9ee" data-file-name="app/user/page.tsx">
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm" data-unique-id="c71ba46a-f9c2-4ca2-8921-731370188c67" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="4fecf58b-783a-4919-a86f-0ec659a2bb8e" data-file-name="app/user/page.tsx">Logout</span></span>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 flex-grow" data-unique-id="5227e10b-2816-43b4-a25e-0d08c89dd446" data-file-name="app/user/page.tsx">
        <Card className="mb-4 sm:mb-6" data-unique-id="fb8e5e8d-d47f-4b81-9990-81f9e69cb791" data-file-name="app/user/page.tsx">
          <CardHeader className="p-3 sm:p-4" data-unique-id="1954f963-99fa-4a36-86a0-5094c3460952" data-file-name="app/user/page.tsx">
            <CardTitle className="text-lg sm:text-xl md:text-2xl" data-unique-id="d6b620e6-f6f1-4a0d-8cdd-0e70fd5cffbf" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="45b3b377-e8dd-450d-adea-0efa30a3e246" data-file-name="app/user/page.tsx">Selamat datang, </span><span className="font-semibold" data-unique-id="8b8ef85c-3b13-4871-876a-eb0a1700ab60" data-file-name="app/user/page.tsx" data-dynamic-text="true">{user.name || user.username}</span></CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0" data-unique-id="cc29bb74-449b-4d4e-839b-f9b280151814" data-file-name="app/user/page.tsx">
            <p className="text-sm sm:text-base" data-unique-id="89b12166-4b8c-4e90-bc6e-1b5794ee529e" data-file-name="app/user/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b498aff5-8713-4fb1-adbd-772219c2d844" data-file-name="app/user/page.tsx">
              Anda Telah Membeli Akses : Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="014b5975-1a5e-498c-a341-ba4747b72cb2" data-file-name="app/user/page.tsx">), PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="5611390f-ab65-49c8-ad15-0861aab647f3" data-file-name="app/user/page.tsx">), Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="31b1a04a-bacb-446c-974c-eb21b01fc8ea" data-file-name="app/user/page.tsx">)
            </span></p>
          </CardContent>
        </Card>

        <Tabs defaultValue="audio" className="w-full" data-unique-id="ab065040-cfbb-4a44-9235-1a5f37934c74" data-file-name="app/user/page.tsx">
          <TabsList className="mb-3 sm:mb-5 w-full flex">
            <TabsTrigger value="audio" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="8874a483-e221-402f-8400-f05976f0f3a2" data-file-name="app/user/page.tsx">Audio</span></TabsTrigger>
            <TabsTrigger value="pdf" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="99b05186-db2b-4636-8ddf-ed0e0d2fdd23" data-file-name="app/user/page.tsx">PDF</span></TabsTrigger>
            <TabsTrigger value="video" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="48bfb866-0b59-41f2-9155-860c3ef60221" data-file-name="app/user/page.tsx">Video</span></TabsTrigger>
          </TabsList>
          
          <TabsContent value="audio">
            {accessCounts.audio > 0 ? <AudioPreview filterCategoryIds={audioCategoryIds} /> : <Card data-unique-id="0520e106-43f2-4a77-be03-313861b229d7" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="73d1868f-71ae-4e6a-a812-4b8b6007ce83" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="b48f3ff5-66dc-4719-baab-d1366f46350d" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="4723d15b-6dca-4c5b-9778-cc83a70eee1c" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten Audio</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
          
          <TabsContent value="pdf">
            {accessCounts.pdf > 0 ? <PDFPreview filterCategoryIds={pdfCategoryIds} /> : <Card data-unique-id="d7ba58dd-9a61-496f-b45e-7a49def86269" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="1b69acca-fdd6-4c6d-a40b-bdf80356d60e" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="0695842d-067b-48b4-a84c-6c7f8e4d3620" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="a9cf14e3-c158-4b8c-b9ee-bd884ed803d4" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten PDF</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
          
          <TabsContent value="video">
            {accessCounts.video > 0 ? <VideoPreview filterCategoryIds={videoCategoryIds} /> : <Card data-unique-id="6172ccf2-ee44-4f41-bd3b-56c6c58c7959" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="bb9dfa6e-a970-44b8-992d-93284482cfc8" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="78578519-e7d4-42f7-9f18-bb713bbd4404" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="d165cd59-8444-4243-b531-54fb44ca1256" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten Video</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}