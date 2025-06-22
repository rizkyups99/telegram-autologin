'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, AudioLines, FileText, Video, Cloud, HardDrive, Music, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudioPreview from '@/components/preview/audio/AudioPreview';
import PDFPreview from '@/components/preview/pdf/PDFPreview';
import VideoPreview from '@/components/preview/video/VideoPreview';
import AudioCloudPreview from '@/components/preview/cloud/AudioCloudPreview';
import PDFCloudPreview from '@/components/preview/cloud/PDFCloudPreview';
import FileCloudPreview from '@/components/preview/cloud/FileCloudPreview';
export default function UserPage() {
  const [user, setUser] = useState<{
    username: string;
    name?: string;
    id?: number;
  } | null>(null);
  const [categoryAccess, setCategoryAccess] = useState<{
    audio: Array<{
      categoryId: number;
      categoryName: string;
    }>;
    pdf: Array<{
      categoryId: number;
      categoryName: string;
    }>;
    video: Array<{
      categoryId: number;
      categoryName: string;
    }>;
    audioCloud: Array<{
      categoryId: number;
      categoryName: string;
    }>;
    pdfCloud: Array<{
      categoryId: number;
      categoryName: string;
    }>;
    fileCloud: Array<{
      categoryId: number;
      categoryName: string;
    }>;
  }>({
    audio: [],
    pdf: [],
    video: [],
    audioCloud: [],
    pdfCloud: [],
    fileCloud: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    checkAuth();
  }, []);
  const checkAuth = async () => {
    try {
      if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
      let userData: string | null = null;
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        userData = localStorage.getItem('user');
      }
      if (!userData) {
        router.push('/');
        return;
      }
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      // Fetch user's category access
      const response = await fetch(`/api/users/categories?userId=${parsedUser.id}`);
      if (response.ok) {
        const accessData = await response.json();
        setCategoryAccess(accessData);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };
  const getAccessCounts = () => {
    return {
      audio: categoryAccess.audio.length,
      pdf: categoryAccess.pdf.length,
      video: categoryAccess.video.length,
      audioCloud: categoryAccess.audioCloud.length,
      pdfCloud: categoryAccess.pdfCloud.length,
      fileCloud: categoryAccess.fileCloud.length
    };
  };
  const handleLogout = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('user');
    }
    router.push('/');
  };
  const accessCounts = getAccessCounts();
  const hasAnyAccess = Object.values(accessCounts).some(count => count > 0);
  if (isLoading) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-unique-id="9d57c321-5dd4-4fed-aa29-3c3509e4b2df" data-file-name="app/user/page.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-unique-id="fcc029a9-fab1-4525-a1b1-424d6024e356" data-file-name="app/user/page.tsx"></div>
      </div>;
  }
  if (!user) {
    return null;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" data-unique-id="d3227fa9-0658-4391-a692-02b18951d902" data-file-name="app/user/page.tsx" data-dynamic-text="true">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm" data-unique-id="46c1b731-fc88-472d-b978-a82ed5b6887e" data-file-name="app/user/page.tsx">
        <div className="container mx-auto px-4 py-4" data-unique-id="963f87da-1193-405a-96a3-dd1db14a83e4" data-file-name="app/user/page.tsx">
          <div className="flex items-center justify-between" data-unique-id="6b2121c9-5831-4662-9cb4-7f8958fa8999" data-file-name="app/user/page.tsx">
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="3e7bd423-f01d-4a0f-ba59-b8e19403fa09" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="9153bbe9-29a9-4b12-903c-58693e517714" data-file-name="app/user/page.tsx">Langit Digital User</span></h1>
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600" data-unique-id="dffbb9bd-d174-41e3-97a9-6b1113feb583" data-file-name="app/user/page.tsx">
              <LogOut className="h-4 w-4" />
              <span data-unique-id="bc52c921-7754-4bce-bf90-b693aade39c2" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="d23dda81-a280-4b7c-af1e-7a30a0815aca" data-file-name="app/user/page.tsx">Logout</span></span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8" data-unique-id="28c4ad42-ef7b-42e0-b53c-513879da35bc" data-file-name="app/user/page.tsx" data-dynamic-text="true">
        {/* Access Information Card */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" data-unique-id="f2b5d8a7-c55a-4ef7-9e33-9af9741169db" data-file-name="app/user/page.tsx">
          <CardHeader data-unique-id="9723eca2-3a56-4d72-8248-7ebac6ccb764" data-file-name="app/user/page.tsx">
            <CardTitle className="text-green-800 flex items-center space-x-2" data-unique-id="cbe6eebd-eeae-4498-aea2-fca6490a98dd" data-file-name="app/user/page.tsx">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center" data-unique-id="ff05e901-162c-4b60-884c-1dc5aff5ee9e" data-file-name="app/user/page.tsx">
                <span className="text-white font-semibold text-sm" data-unique-id="6d6cb509-4de5-402e-abd6-f118831ef968" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span data-unique-id="d34f13ed-6a76-44ab-924c-e5f01c299d8b" data-file-name="app/user/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="53fd465c-cb2c-4bbf-a0eb-76ca0242ce57" data-file-name="app/user/page.tsx">Selamat Datang, </span>{user.name || user.username}</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="8d6b0d42-b1d8-4b28-ab1d-5eb4ca90487d" data-file-name="app/user/page.tsx">
            <div className="bg-white p-4 rounded-lg border border-green-200" data-unique-id="7254a587-2b7c-43c8-94d3-d9451fe1d1ee" data-file-name="app/user/page.tsx" data-dynamic-text="true">
              <p className="text-lg font-semibold text-gray-800 mb-2" data-unique-id="7cd3cfaf-9a11-4dd5-afa1-bc026b8eb3f6" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="ef5d95a9-31da-4048-b575-9d5eba5baf30" data-file-name="app/user/page.tsx">
                Anda Telah Membeli Akses:
              </span></p>
              <div className="flex flex-wrap gap-3" data-unique-id="b13b84fb-776f-4cc8-91e2-38bfb23b8fb1" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                {accessCounts.audio > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800" data-unique-id="e68e4d54-17cb-428e-af29-e02b4eacb880" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <AudioLines className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="53a59b10-00aa-4886-893b-6f21417ef0f6" data-file-name="app/user/page.tsx">
                    Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="f39960eb-9b36-42cb-a673-484f191939e4" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.pdf > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800" data-unique-id="b1a73dc9-133a-4d18-9acd-eb32c0a46627" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <FileText className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="eef3519d-a212-41be-bcad-7f34fc7c52d5" data-file-name="app/user/page.tsx">
                    PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="7beffa48-9539-477b-aaed-f5614d4e9cc3" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.video > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800" data-unique-id="869ea886-ae52-4211-a257-6f588216eb08" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <Video className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="3f3c6c3a-739e-4bd8-ba07-720da3b44bd2" data-file-name="app/user/page.tsx">
                    Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="8818834a-ad8e-429e-aa52-a26cc53b3197" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.audioCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800" data-unique-id="7aedd1b2-588d-4139-ba33-8b22a5c837f1" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <Music className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="78a5c82d-7ff9-4141-ac92-2732a276f42f" data-file-name="app/user/page.tsx">
                    Audio Cloud (</span>{accessCounts.audioCloud}<span className="editable-text" data-unique-id="67e9d0a9-fb4b-4710-87a4-d85de1f25e1e" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.pdfCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800" data-unique-id="d6a822a4-9254-4e96-a59a-63cd33ae8ff4" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <Cloud className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="895a0b5e-f93f-4693-8763-e347d2b73d33" data-file-name="app/user/page.tsx">
                    PDF Cloud (</span>{accessCounts.pdfCloud}<span className="editable-text" data-unique-id="96416615-1002-48fb-9db0-9e8b1867d0ee" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.fileCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800" data-unique-id="196832d9-1ef7-48ef-a513-b14229dc4a7d" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <HardDrive className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="744cd485-7ce2-4bda-b160-caa8b431ca2f" data-file-name="app/user/page.tsx">
                    File Cloud (</span>{accessCounts.fileCloud}<span className="editable-text" data-unique-id="1c6aec48-f7fb-4523-80cc-70411525143a" data-file-name="app/user/page.tsx">)
                  </span></span>}
              </div>
              {!hasAnyAccess && <p className="text-gray-600 italic" data-unique-id="899cc213-7611-4be9-807c-2e01d0bbecb3" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="c21800ab-6433-43ee-affb-00e5ae8226c3" data-file-name="app/user/page.tsx">
                  Anda belum memiliki akses ke kategori apapun. Silakan hubungi admin untuk mendapatkan akses.
                </span></p>}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        {hasAnyAccess && <Card className="bg-white shadow-lg" data-unique-id="c6d30c7f-9912-464e-ae60-cd2e7b109808" data-file-name="app/user/page.tsx">
            <CardContent className="p-6" data-unique-id="ec2188a6-05f1-4e8b-9828-4a3e8525c289" data-file-name="app/user/page.tsx">
              <Tabs defaultValue="audio" className="w-full" data-unique-id="9da5cbac-2046-4f3c-b17f-6d5474f9bbe4" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                {/* Mobile-friendly TabsList with improved layout */}
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-2 bg-gray-100">
                  {accessCounts.audio > 0 && <TabsTrigger value="audio" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <AudioLines className="h-4 w-4 mb-1" />
                      <span data-unique-id="dffc64f8-0da3-44e5-8be9-3ce86151568c" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="46d47b75-5d73-4b26-bc44-4365bfb1e193" data-file-name="app/user/page.tsx">Audio</span></span>
                    </TabsTrigger>}
                  {accessCounts.pdf > 0 && <TabsTrigger value="pdf" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-red-500 data-[state=active]:text-white">
                      <FileText className="h-4 w-4 mb-1" />
                      <span data-unique-id="313ea877-8b3f-4b16-8c29-108dc2fc4f8e" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="91cb0e39-8951-4859-8fc1-c917e7cd3bfc" data-file-name="app/user/page.tsx">PDF</span></span>
                    </TabsTrigger>}
                  {accessCounts.video > 0 && <TabsTrigger value="video" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                      <Video className="h-4 w-4 mb-1" />
                      <span data-unique-id="b6f58521-4958-4ca0-a8c3-445f2780b71d" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="8b2f61be-5739-4534-ba50-133b226c1c98" data-file-name="app/user/page.tsx">Video</span></span>
                    </TabsTrigger>}
                  {accessCounts.audioCloud > 0 && <TabsTrigger value="audioCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                      <Music className="h-4 w-4 mb-1" />
                      <span className="text-center" data-unique-id="97da9901-8dc5-4362-bebb-c16863f570ee" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="81a43569-fcec-4505-aee6-1e4f9caa7ece" data-file-name="app/user/page.tsx">Audio</span><br data-unique-id="e2aa9575-643d-47d8-b09b-8a933be3875a" data-file-name="app/user/page.tsx" /><span className="editable-text" data-unique-id="f53f8316-e159-48c2-871e-66732bf1b5bf" data-file-name="app/user/page.tsx">Cloud</span></span>
                    </TabsTrigger>}
                  {accessCounts.pdfCloud > 0 && <TabsTrigger value="pdfCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                      <Cloud className="h-4 w-4 mb-1" />
                      <span className="text-center" data-unique-id="7920e11d-d8a6-4a3f-ad8f-8f2b7350a61e" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="7747fc14-baeb-4ba1-8b0c-c349984b9ac4" data-file-name="app/user/page.tsx">PDF</span><br data-unique-id="87d8624a-1615-45d2-ae80-3834a3046eaa" data-file-name="app/user/page.tsx" /><span className="editable-text" data-unique-id="4f92fab8-d1bd-4b04-91ef-b3315cc981ef" data-file-name="app/user/page.tsx">Cloud</span></span>
                    </TabsTrigger>}
                  {accessCounts.fileCloud > 0 && <TabsTrigger value="fileCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-gray-500 data-[state=active]:text-white">
                      <HardDrive className="h-4 w-4 mb-1" />
                      <span className="text-center" data-unique-id="47f5ecfe-3fdf-4b2e-bd58-f310fc21cf48" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="dbc2ccce-d065-4a6f-bafd-cc797e153962" data-file-name="app/user/page.tsx">File</span><br data-unique-id="6fc0cc3f-ca36-4f8f-a02a-47e200ad3d68" data-file-name="app/user/page.tsx" /><span className="editable-text" data-unique-id="a7df09f8-b9ac-4a34-84d4-7a016e64b1e0" data-file-name="app/user/page.tsx">Cloud</span></span>
                    </TabsTrigger>}
                </TabsList>

                {/* Tab Contents */}
                {accessCounts.audio > 0 && <TabsContent value="audio" className="mt-6">
                    <AudioPreview filterCategoryIds={categoryAccess.audio.map(a => a.categoryId)} />
                  </TabsContent>}

                {accessCounts.pdf > 0 && <TabsContent value="pdf" className="mt-6">
                    <PDFPreview filterCategoryIds={categoryAccess.pdf.map(p => p.categoryId)} />
                  </TabsContent>}

                {accessCounts.video > 0 && <TabsContent value="video" className="mt-6">
                    <VideoPreview filterCategoryIds={categoryAccess.video.map(v => v.categoryId)} />
                  </TabsContent>}

                {accessCounts.audioCloud > 0 && <TabsContent value="audioCloud" className="mt-6">
                    <AudioCloudPreview filterCategoryIds={categoryAccess.audioCloud.map(a => a.categoryId)} />
                  </TabsContent>}

                {accessCounts.pdfCloud > 0 && <TabsContent value="pdfCloud" className="mt-6">
                    <PDFCloudPreview filterCategoryIds={categoryAccess.pdfCloud.map(p => p.categoryId)} />
                  </TabsContent>}

                {accessCounts.fileCloud > 0 && <TabsContent value="fileCloud" className="mt-6">
                    <FileCloudPreview filterCategoryIds={categoryAccess.fileCloud.map(f => f.categoryId)} />
                  </TabsContent>}
              </Tabs>
            </CardContent>
          </Card>}

        {!hasAnyAccess && <Card className="bg-white shadow-lg" data-unique-id="6b16c32b-c93d-4e16-80d6-c0d05d442606" data-file-name="app/user/page.tsx">
            <CardContent className="p-12 text-center" data-unique-id="697a6b70-409a-47d5-816a-8b3b3f3565ab" data-file-name="app/user/page.tsx">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" data-unique-id="bb2b8f40-7789-48ec-a565-c7dc883765ba" data-file-name="app/user/page.tsx">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="34f14649-73a0-4d9c-b6bc-79e520de626a" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="d7b5fab8-19c3-4a92-a1ba-ce655be28908" data-file-name="app/user/page.tsx">Belum Ada Akses</span></h3>
              <p className="text-gray-600" data-unique-id="8444159e-0ef9-41f5-91f8-479dd3af51b5" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="60693eaa-812b-4af6-8dea-9f0774b9ecb0" data-file-name="app/user/page.tsx">
                Anda belum memiliki akses ke konten apapun. Silakan hubungi admin untuk mendapatkan akses ke kategori yang diinginkan.
              </span></p>
            </CardContent>
          </Card>}
      </main>
    </div>;
}