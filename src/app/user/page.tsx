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
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-unique-id="ef0d55d8-0f91-4b7b-800a-42cb34785f75" data-file-name="app/user/page.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-unique-id="f9d53b33-2cae-42c7-b4b3-d1a152943cd5" data-file-name="app/user/page.tsx"></div>
      </div>;
  }
  if (!user) {
    return null;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" data-unique-id="945f9fc2-1caf-498e-bb7c-221ff4dcf5a8" data-file-name="app/user/page.tsx" data-dynamic-text="true">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm" data-unique-id="50956ed1-5e94-4573-aa94-64e9d5353a40" data-file-name="app/user/page.tsx">
        <div className="container mx-auto px-4 py-4" data-unique-id="a964f5d4-d900-46db-9e18-c8d0656d2f67" data-file-name="app/user/page.tsx">
          <div className="flex items-center justify-between" data-unique-id="d4aeb1d1-23bf-460e-9333-e460891442a2" data-file-name="app/user/page.tsx">
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="29937811-7cbc-4b7f-8f86-8629b81be52d" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="01076291-ecbd-4c02-8c09-c0ca56b84b8d" data-file-name="app/user/page.tsx">Langit Digital User</span></h1>
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600" data-unique-id="57166e6d-0ada-4b4d-8ecf-20290c8bfb3d" data-file-name="app/user/page.tsx">
              <LogOut className="h-4 w-4" />
              <span data-unique-id="22148250-97a3-47ff-a4e5-601003f7e109" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="6c7f00c5-279b-4e71-8cc8-0c227cb7e3e7" data-file-name="app/user/page.tsx">Logout</span></span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8" data-unique-id="1e9ef5f6-a853-4726-96ec-86dba7c8a9dc" data-file-name="app/user/page.tsx" data-dynamic-text="true">
        {/* Access Information Card */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" data-unique-id="d3062f1f-1261-4d24-8207-3aea00fafecf" data-file-name="app/user/page.tsx">
          <CardHeader data-unique-id="6ed19df5-c82a-4ab4-9e80-634c9f2d81ce" data-file-name="app/user/page.tsx">
            <CardTitle className="text-green-800 flex items-center space-x-2" data-unique-id="da6a993f-0e07-462e-921c-55ad0879237f" data-file-name="app/user/page.tsx">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center" data-unique-id="0e0ed423-b106-46c0-9740-951a6557c062" data-file-name="app/user/page.tsx">
                <span className="text-white font-semibold text-sm" data-unique-id="8fd68fc7-92e2-4459-81fd-918f52495046" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span data-unique-id="5f40394f-1a8c-4e29-8143-f7e9d9d457ff" data-file-name="app/user/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="d9cd1853-fab2-4af0-b4aa-6805c700399e" data-file-name="app/user/page.tsx">Selamat Datang, </span>{user.name || user.username}</span>
            </CardTitle>
          </CardHeader>
          <CardContent data-unique-id="159f4518-724c-448a-9867-204829919769" data-file-name="app/user/page.tsx">
            <div className="bg-white p-4 rounded-lg border border-green-200" data-unique-id="341050cc-ea97-4d8b-a301-a0edf6c4eb8b" data-file-name="app/user/page.tsx" data-dynamic-text="true">
              <p className="text-lg font-semibold text-gray-800 mb-2" data-unique-id="0448fa99-4abd-42fa-97a3-a70c4ec61cec" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="e25fc613-6f92-4736-93b3-ea187c29540a" data-file-name="app/user/page.tsx">
                Anda Telah Membeli Akses:
              </span></p>
              <div className="flex flex-wrap gap-3" data-unique-id="173534dd-c992-492d-be8a-9b0cd3401d09" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                {accessCounts.audio > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800" data-unique-id="3ebbc66b-5179-44cc-9aa4-938b3fb7448a" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <AudioLines className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="32766a9b-b7b5-4fdd-847d-34f8e812a7d6" data-file-name="app/user/page.tsx">
                    Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="a9f949d9-a9bf-4b57-811b-68748cff57a9" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.pdf > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800" data-unique-id="91cbe888-26dc-4c83-941b-26ceaa6a9051" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <FileText className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="06274bb3-78b8-467e-abbd-f12a38a75036" data-file-name="app/user/page.tsx">
                    PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="6901fda0-d1c7-4eda-bf99-8d1050ce5163" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.video > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800" data-unique-id="e6100b79-18b1-40f0-9c94-e2e114a3f2e2" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <Video className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="9e590e53-8f98-4af7-a03b-744a91c19690" data-file-name="app/user/page.tsx">
                    Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="e2e723c2-206c-4c38-9275-86077a6255f6" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.audioCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800" data-unique-id="7340a046-ca20-4e2d-ad43-e61c6b9d0a56" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <Music className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="82b334a5-ddc5-4292-9a6b-760409dcd397" data-file-name="app/user/page.tsx">
                    Audio Cloud (</span>{accessCounts.audioCloud}<span className="editable-text" data-unique-id="554596cc-c42d-42f2-99ce-074cceafcc51" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.pdfCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800" data-unique-id="052515ef-bde4-458d-be22-c3a9dd5f314c" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <Cloud className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="7f5a44e3-8524-4e52-a79b-e97bb111af7a" data-file-name="app/user/page.tsx">
                    PDF Cloud (</span>{accessCounts.pdfCloud}<span className="editable-text" data-unique-id="89d077ba-17fd-48f9-b164-4ebe06a1f968" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.fileCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800" data-unique-id="814eff8e-1af8-4436-b217-d530646230e7" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <HardDrive className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="1697ed05-2ead-4ba6-9345-3aa8db6cae9a" data-file-name="app/user/page.tsx">
                    File Cloud (</span>{accessCounts.fileCloud}<span className="editable-text" data-unique-id="8e80afbf-7d27-4fd4-bcea-7366ed897936" data-file-name="app/user/page.tsx">)
                  </span></span>}
              </div>
              {!hasAnyAccess && <p className="text-gray-600 italic" data-unique-id="401dc73d-697c-4cf1-a8a0-4b75dac835af" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="d01a0916-789a-413b-a053-a3308e1a06fa" data-file-name="app/user/page.tsx">
                  Anda belum memiliki akses ke kategori apapun. Silakan hubungi admin untuk mendapatkan akses.
                </span></p>}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        {hasAnyAccess && <Card className="bg-white shadow-lg" data-unique-id="b4de8d21-fc32-444a-a3aa-4ba0ef05d389" data-file-name="app/user/page.tsx">
            <CardContent className="p-6" data-unique-id="ec87fa40-9f80-4275-a380-e535de0bac0e" data-file-name="app/user/page.tsx">
              <Tabs defaultValue="audio" className="w-full" data-unique-id="ce7b8cf8-de80-4c96-a7a9-5a41696d69e7" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                {/* Mobile-friendly TabsList with improved layout */}
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-2 bg-gray-100">
                  {accessCounts.audio > 0 && <TabsTrigger value="audio" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <AudioLines className="h-4 w-4 mb-1" />
                      <span data-unique-id="9c89fb87-1746-4f0f-b8d7-442b080f1348" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="e16bbcb9-2ca3-48b9-99e5-1fed8155bd68" data-file-name="app/user/page.tsx">Audio</span></span>
                    </TabsTrigger>}
                  {accessCounts.pdf > 0 && <TabsTrigger value="pdf" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-red-500 data-[state=active]:text-white">
                      <FileText className="h-4 w-4 mb-1" />
                      <span data-unique-id="fdd7e246-636e-4f7a-9e71-75416634b0a9" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="29eca7a9-5d70-45b3-a3a5-382218403042" data-file-name="app/user/page.tsx">PDF</span></span>
                    </TabsTrigger>}
                  {accessCounts.video > 0 && <TabsTrigger value="video" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                      <Video className="h-4 w-4 mb-1" />
                      <span data-unique-id="da9be5bd-95b1-4ee9-a458-232270d6d189" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="7a9fef8c-b21b-4dba-aa8a-298c0bccb583" data-file-name="app/user/page.tsx">Video</span></span>
                    </TabsTrigger>}
                  {accessCounts.audioCloud > 0 && <TabsTrigger value="audioCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                      <Music className="h-4 w-4 mb-1" />
                      <span className="text-center" data-unique-id="bf9cdee1-a3f8-4a14-97b7-14b16904193a" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="7dd240f5-c9d4-4ecd-be68-5e84a2a057e3" data-file-name="app/user/page.tsx">Audio</span><br data-unique-id="9dab68e3-2418-437b-8913-71560a3c0572" data-file-name="app/user/page.tsx" /><span className="editable-text" data-unique-id="949f825d-9b65-4a1c-8883-6762217ec926" data-file-name="app/user/page.tsx">Cloud</span></span>
                    </TabsTrigger>}
                  {accessCounts.pdfCloud > 0 && <TabsTrigger value="pdfCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                      <Cloud className="h-4 w-4 mb-1" />
                      <span className="text-center" data-unique-id="13b6f48d-0690-4469-aed2-91d1613144bf" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="45ab4750-258b-4614-84db-ba0d1c80ed9a" data-file-name="app/user/page.tsx">PDF</span><br data-unique-id="a3528e39-17c1-4b07-9b14-12a6b9770b6c" data-file-name="app/user/page.tsx" /><span className="editable-text" data-unique-id="6e5c67ea-1bba-4669-b4c6-fd8f09e7b20e" data-file-name="app/user/page.tsx">Cloud</span></span>
                    </TabsTrigger>}
                  {accessCounts.fileCloud > 0 && <TabsTrigger value="fileCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-gray-500 data-[state=active]:text-white">
                      <HardDrive className="h-4 w-4 mb-1" />
                      <span className="text-center" data-unique-id="ce4c7df8-1730-45d2-b792-7e154fe62fc4" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="6c013c90-5d8e-4ff3-bdb5-76fad9149456" data-file-name="app/user/page.tsx">File</span><br data-unique-id="0bb456c5-df46-4834-b594-0ec0b17ca96d" data-file-name="app/user/page.tsx" /><span className="editable-text" data-unique-id="20edd990-c856-4e6b-b025-37d4738e0fdc" data-file-name="app/user/page.tsx">Cloud</span></span>
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

        {!hasAnyAccess && <Card className="bg-white shadow-lg" data-unique-id="d0e1f6d0-da80-4a9d-99a3-fca8f4dec331" data-file-name="app/user/page.tsx">
            <CardContent className="p-12 text-center" data-unique-id="497cb728-3172-4f6a-a7ca-8f17531b9928" data-file-name="app/user/page.tsx">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" data-unique-id="5a222787-f8a2-41e5-a6a5-b5bc37f90cac" data-file-name="app/user/page.tsx">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="fe665ab2-bf9c-4166-a9ac-2cf8f3e93e70" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="ad43bdff-4bf3-4ada-9014-898129720228" data-file-name="app/user/page.tsx">Belum Ada Akses</span></h3>
              <p className="text-gray-600" data-unique-id="5ba877ea-47ac-4d4b-8c2f-4e825e7c1e4e" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="3b745e26-e557-49b8-937e-41aebb66d4f1" data-file-name="app/user/page.tsx">
                Anda belum memiliki akses ke konten apapun. Silakan hubungi admin untuk mendapatkan akses ke kategori yang diinginkan.
              </span></p>
            </CardContent>
          </Card>}
      </main>
    </div>;
}