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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border">
        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-5 flex flex-row justify-between items-center gap-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">User Panel</h1>
          <Button 
            variant="destructive" 
            onClick={handleLogout}
            className="flex items-center gap-2 text-white text-sm"
            size="sm"
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-sm">Logout</span>
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 flex-grow">
        <Card className="mb-4 sm:mb-6">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="text-lg sm:text-xl md:text-2xl">Selamat datang, <span className="font-semibold">{user.name || user.username}</span></CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0 sm:pt-0">
            <p className="text-sm sm:text-base">
              Anda Telah Membeli Akses : Audio ({accessCounts.audio}), PDF ({accessCounts.pdf}), Video ({accessCounts.video})
            </p>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="audio" className="w-full">
          <TabsList className="mb-3 sm:mb-5 w-full flex">
            <TabsTrigger value="audio" className="flex-1 text-sm sm:text-base py-1.5 px-2">Audio</TabsTrigger>
            <TabsTrigger value="pdf" className="flex-1 text-sm sm:text-base py-1.5 px-2">PDF</TabsTrigger>
            <TabsTrigger value="video" className="flex-1 text-sm sm:text-base py-1.5 px-2">Video</TabsTrigger>
          </TabsList>
          
          <TabsContent value="audio">
            {accessCounts.audio > 0 ? (
              <AudioPreview filterCategoryIds={audioCategoryIds} />
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  <p className="text-sm sm:text-base">Anda belum memiliki akses ke konten Audio</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="pdf">
            {accessCounts.pdf > 0 ? (
              <PDFPreview filterCategoryIds={pdfCategoryIds} />
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  <p className="text-sm sm:text-base">Anda belum memiliki akses ke konten PDF</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="video">
            {accessCounts.video > 0 ? (
              <VideoPreview filterCategoryIds={videoCategoryIds} />
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-muted-foreground">
                  <p className="text-sm sm:text-base">Anda belum memiliki akses ke konten Video</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
