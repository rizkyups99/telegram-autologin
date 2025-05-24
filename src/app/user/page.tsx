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
    return <div className="flex justify-center items-center min-h-screen" data-unique-id="6a5e114f-d544-4a30-a36b-f4e4883f2b9c" data-file-name="app/user/page.tsx">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" data-unique-id="31f8aacd-b85b-42be-a004-a78a1c8a691c" data-file-name="app/user/page.tsx"></div>
      </div>;
  }
  return <div className="min-h-screen bg-background flex flex-col" data-unique-id="7a98e432-25cf-4468-8ecc-affb26ad3227" data-file-name="app/user/page.tsx">
      <header className="border-b border-border" data-unique-id="8f514550-fef0-4a74-aa38-e1965bea6ba9" data-file-name="app/user/page.tsx">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-5 flex flex-row justify-between items-center gap-2" data-unique-id="a76c0da5-9bb1-4cae-b670-af32432dffbc" data-file-name="app/user/page.tsx">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" data-unique-id="f2896a13-4783-4366-a6b8-85e0a3780793" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="d4b9f35a-27e6-499d-953b-16be6865271c" data-file-name="app/user/page.tsx">User Panel</span></h1>
          <Button variant="destructive" onClick={handleLogout} className="flex items-center gap-2 text-white text-sm" size="sm" data-unique-id="80882a38-4d42-4d62-8cbd-06ecde93eebc" data-file-name="app/user/page.tsx">
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm" data-unique-id="8210d055-f0f3-4fa5-af1b-960224577468" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="1b1f076e-52a9-41ff-aafb-63165bac3edc" data-file-name="app/user/page.tsx">Logout</span></span>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 flex-grow" data-unique-id="70fa671d-2b4d-4e44-9f7d-55300d8fb624" data-file-name="app/user/page.tsx">
        <Card className="mb-4 sm:mb-6" data-unique-id="0699209f-7b48-414a-aefd-096ca7c01dde" data-file-name="app/user/page.tsx">
          <CardHeader className="p-3 sm:p-4" data-unique-id="f59e10be-4f82-40f3-ada9-671409ab325b" data-file-name="app/user/page.tsx">
            <CardTitle className="text-lg sm:text-xl md:text-2xl" data-unique-id="6a421115-1f65-4292-b0ed-3c0813738adf" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="41f7ac3d-0752-4613-b7bf-145b1b8a1984" data-file-name="app/user/page.tsx">Selamat datang, </span><span className="font-semibold" data-unique-id="ce11b45a-982f-46df-9285-7b2846ff9399" data-file-name="app/user/page.tsx" data-dynamic-text="true">{user.name || user.username}</span></CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0" data-unique-id="58bc6036-106f-4bb1-8dd4-76658391701a" data-file-name="app/user/page.tsx">
            <p className="text-sm sm:text-base" data-unique-id="979d52a4-a5a3-4ecf-a5f3-1c8176c3dac7" data-file-name="app/user/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="22978321-454b-4a58-bd05-b45485de47a5" data-file-name="app/user/page.tsx">
              Anda Telah Membeli Akses : Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="deabb5be-f9d4-4bb9-8b19-f5989ab8cfe6" data-file-name="app/user/page.tsx">), PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="aa1b3273-4330-4569-9d6a-880700cc57b6" data-file-name="app/user/page.tsx">), Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="739783a5-aaf9-46b1-adca-f2a9dc739fcc" data-file-name="app/user/page.tsx">)
            </span></p>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="audio" className="w-full" data-unique-id="c51d056d-1855-4de8-a137-f4a451047e4c" data-file-name="app/user/page.tsx">
          <TabsList className="mb-3 sm:mb-5 w-full flex">
            <TabsTrigger value="audio" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="713d7d93-e687-4a9f-a07b-439d5439eba3" data-file-name="app/user/page.tsx">Audio</span></TabsTrigger>
            <TabsTrigger value="pdf" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="9e1ce12d-5259-4e8b-a520-b80496dedd2b" data-file-name="app/user/page.tsx">PDF</span></TabsTrigger>
            <TabsTrigger value="video" className="flex-1 text-sm sm:text-base py-1.5 px-2"><span className="editable-text" data-unique-id="2f2111b0-77f2-4f63-9b2a-6712fc59b3f7" data-file-name="app/user/page.tsx">Video</span></TabsTrigger>
          </TabsList>
          
          <TabsContent value="audio">
            {accessCounts.audio > 0 ? <AudioPreview filterCategoryIds={audioCategoryIds} /> : <Card data-unique-id="b8ab3feb-7a5d-4a08-af32-47598d70dae8" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="06b85b15-29e6-4b37-8256-e2b72cb7a07c" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="25a8a290-bc27-4ebb-972e-00e58ecbdd5f" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="925143f9-d0c2-46fb-8f5a-f53fbeabe160" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten Audio</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
          
          <TabsContent value="pdf">
            {accessCounts.pdf > 0 ? <PDFPreview filterCategoryIds={pdfCategoryIds} /> : <Card data-unique-id="b23f6d79-c63c-4a05-83dd-24fa1abe54a9" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="cd330fea-9741-475a-9b71-d108649f6509" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="c6c2d239-ca38-4cc2-8a83-8b063d1577ea" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="2dbf8c9a-45ad-49a1-b2f6-8a4b32d0b593" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten PDF</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
          
          <TabsContent value="video">
            {accessCounts.video > 0 ? <VideoPreview filterCategoryIds={videoCategoryIds} /> : <Card data-unique-id="489a86b3-d48b-498d-be36-4edac26d44dd" data-file-name="app/user/page.tsx">
                <CardContent className="py-6 text-center text-muted-foreground" data-unique-id="4680aaf0-3edd-43af-9484-98993dba1394" data-file-name="app/user/page.tsx">
                  <p className="text-sm sm:text-base" data-unique-id="ca6cb60a-db23-4444-85f8-79dcc2076e8c" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="e872c0c6-fc2f-409e-ae4f-808749d3db29" data-file-name="app/user/page.tsx">Anda belum memiliki akses ke konten Video</span></p>
                </CardContent>
              </Card>}
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}