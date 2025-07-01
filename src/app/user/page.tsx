'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, AudioLines, FileText, Video, Cloud, HardDrive, Music, User, Calendar, Clock } from 'lucide-react';
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
    createdAt?: string;
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
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number>(0);
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

      // Calculate expiration date - use createdAt if available, otherwise use current date
      const creationDate = parsedUser.createdAt || new Date().toISOString();
      calculateExpirationDate(creationDate);

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
  const calculateExpirationDate = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const expirationDate = new Date(createdDate);
    expirationDate.setDate(expirationDate.getDate() + 365); // Add 365 days

    const now = new Date();
    const timeDiff = expirationDate.getTime() - now.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    setDaysRemaining(daysLeft);
    setIsExpired(daysLeft <= 0);

    // Format date as dd-mm-yyyy
    const day = expirationDate.getDate().toString().padStart(2, '0');
    const month = (expirationDate.getMonth() + 1).toString().padStart(2, '0');
    const year = expirationDate.getFullYear();
    setExpirationDate(`${day}-${month}-${year}`);
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
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center" data-unique-id="5e52f10c-fa43-43c7-97ec-1b703648a7fa" data-file-name="app/user/page.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" data-unique-id="2b06cd4b-b239-4971-9461-69403d2d0de5" data-file-name="app/user/page.tsx"></div>
      </div>;
  }
  if (!user) {
    return null;
  }
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" data-unique-id="2630ff30-bd97-42e9-bbad-e8b3036668b8" data-file-name="app/user/page.tsx" data-dynamic-text="true">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm" data-unique-id="7229ad65-a568-4d61-a9e0-6865d978ec51" data-file-name="app/user/page.tsx">
        <div className="container mx-auto px-4 py-4" data-unique-id="4213fa0f-7d24-4d5c-a50e-968d0d446f60" data-file-name="app/user/page.tsx">
          <div className="flex items-center justify-between" data-unique-id="146fbf3a-5e86-42f5-b737-bdac0727aa56" data-file-name="app/user/page.tsx">
            <h1 className="text-xl font-bold text-gray-900" data-unique-id="94816cb3-3316-463e-bd59-d45802c6eb68" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="5dd1c5ea-3292-40ab-8ad7-d7ada66b1668" data-file-name="app/user/page.tsx">Langit Digital User</span></h1>
            <Button onClick={handleLogout} variant="outline" className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600" data-unique-id="a9c4a3b9-539d-4a8e-aa66-fe7cd9e01be1" data-file-name="app/user/page.tsx">
              <LogOut className="h-4 w-4" />
              <span data-unique-id="d84e5ab7-f720-4e88-bdd0-66b1960672d6" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="53311d8f-282d-4c01-ad5a-2eda2650f940" data-file-name="app/user/page.tsx">Logout</span></span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8" data-unique-id="f06d0e2e-d19f-4c14-a2ec-e83391f0a973" data-file-name="app/user/page.tsx" data-dynamic-text="true">
        {/* Access Information Card */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200" data-unique-id="ef2c0a56-a779-4851-a3c1-2ba693b7712a" data-file-name="app/user/page.tsx">
          <CardHeader data-unique-id="966a9ddd-3cf1-462a-bf87-698c20331829" data-file-name="app/user/page.tsx" data-dynamic-text="true">
            <CardTitle className="text-green-800 flex items-center space-x-2" data-unique-id="10c7a450-19e0-4791-8eae-2b543bb9b3d3" data-file-name="app/user/page.tsx">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center" data-unique-id="bfa2cc38-d17e-4559-bcfe-3cf9566023c7" data-file-name="app/user/page.tsx">
                <span className="text-white font-semibold text-sm" data-unique-id="e96cc0d5-d1cd-47cd-9753-b33b1ba8b2cc" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                  {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span data-unique-id="f2053ba2-0fad-46bb-8fa6-fc8a5212ac9a" data-file-name="app/user/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="2068b324-ad79-4dc5-9f19-e8c6b011e188" data-file-name="app/user/page.tsx">Selamat Datang, </span>{user.name || user.username}</span>
            </CardTitle>
            
            {/* Expiration Information */}
            <div className="mt-3" data-unique-id="39449058-bb6a-43e6-99e4-f40bfc388d3e" data-file-name="app/user/page.tsx" data-dynamic-text="true">
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${isExpired ? 'bg-red-100 text-red-800 border border-red-200' : daysRemaining <= 30 ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 'bg-green-100 text-green-800 border border-green-200'}`} data-unique-id="7add414a-eb3a-40ed-8f43-829df93109d1" data-file-name="app/user/page.tsx">
                <Calendar className="h-4 w-4" data-unique-id="925e403b-da60-4581-91fc-9c269918bb22" data-file-name="app/user/page.tsx" />
                <span data-unique-id="74b3d5c4-052d-44d5-851c-0f024206bc16" data-file-name="app/user/page.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="1d9d118f-03fb-4522-b1d7-dfea95fcb656" data-file-name="app/user/page.tsx">
                  masa aktif akses kamu sampai </span>{expirationDate || 'memuat...'}
                </span>
              </div>
              
              {!isExpired && daysRemaining > 0 && <div className="flex items-center gap-2 text-sm text-gray-600 mt-2" data-unique-id="eb2a3208-d28f-4bb4-ae9f-15092466ce1f" data-file-name="app/user/page.tsx">
                  <Clock className="h-4 w-4" />
                  <span data-unique-id="f977f3e5-d688-47d9-8807-e6a916c7d99b" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    {daysRemaining}<span className="editable-text" data-unique-id="fb2a3b60-9c55-4f63-99b3-a306d18610f5" data-file-name="app/user/page.tsx"> hari tersisa
                  </span></span>
                </div>}
            </div>
          </CardHeader>
          <CardContent data-unique-id="229f9f30-41e2-440a-a5fa-0dae614d719a" data-file-name="app/user/page.tsx">
            <div className="bg-white p-4 rounded-lg border border-green-200" data-unique-id="3f7a969f-84ef-4b63-8158-6fe48e8395e6" data-file-name="app/user/page.tsx" data-dynamic-text="true">
              <p className="text-lg font-semibold text-gray-800 mb-2" data-unique-id="5623fb88-861b-4616-b730-3d660a0cb995" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="73b12606-80fb-4212-bff1-027209101ae2" data-file-name="app/user/page.tsx">
                Anda Telah Membeli Akses:
              </span></p>
              <div className="flex flex-wrap gap-3" data-unique-id="fed36fb9-ac53-40a6-a336-4c6f409cb285" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                {accessCounts.audio > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800" data-unique-id="0bbb2112-102d-47d7-9a29-4bb3cfce5f7e" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <AudioLines className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="982f0290-215a-450f-8b21-d9002cec3fbe" data-file-name="app/user/page.tsx">
                    Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="d26b5f75-b323-4f19-8377-f57dad939ef4" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.pdf > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800" data-unique-id="25ea10e3-d5f6-4888-9144-a88e2b9cad74" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <FileText className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="811bf7d1-58c8-4272-b8a4-8ac11e1792f6" data-file-name="app/user/page.tsx">
                    PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="0fffa735-fac6-4fa0-b455-c1b6c2b71576" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.video > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800" data-unique-id="9ed0622e-2ac7-4e6c-bc78-a960e81254b1" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <Video className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="9ae8bf14-c081-414a-90df-e262aaa0a9bd" data-file-name="app/user/page.tsx">
                    Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="09520340-4c36-4e68-80c0-1c3e73ac6fb1" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.audioCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800" data-unique-id="45ff3cbb-8dc2-4c97-aa4e-82d8e367a413" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <Music className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="34c53b4c-6d80-43f1-ab69-6a6119f39cff" data-file-name="app/user/page.tsx">
                    Audio Cloud (</span>{accessCounts.audioCloud}<span className="editable-text" data-unique-id="1dbe480a-d01a-4930-add6-6a99b7b9581d" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.pdfCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800" data-unique-id="7b59a95b-ec26-46bb-83f2-42420486c9b5" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <Cloud className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="8d3ce8bf-6384-4515-b1e1-ae32e12cb900" data-file-name="app/user/page.tsx">
                    PDF Cloud (</span>{accessCounts.pdfCloud}<span className="editable-text" data-unique-id="90fff447-206a-4043-b2e0-2ba2193b16e3" data-file-name="app/user/page.tsx">)
                  </span></span>}
                {accessCounts.fileCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800" data-unique-id="1c69eee7-9b48-49df-84da-51b2e6c82606" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                    <HardDrive className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="438b8500-4076-4527-bc1a-2296bd41ac85" data-file-name="app/user/page.tsx">
                    File Cloud (</span>{accessCounts.fileCloud}<span className="editable-text" data-unique-id="b0389b60-5e4f-4f8a-a3f3-beb1b1f313f9" data-file-name="app/user/page.tsx">)
                  </span></span>}
              </div>
              {!hasAnyAccess && <p className="text-gray-600 italic" data-unique-id="a5b33f13-6186-476d-9551-7968abcf3bd4" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="115b0ed2-952e-4a34-9b1d-9fb94ac21a1f" data-file-name="app/user/page.tsx">
                  Anda belum memiliki akses ke kategori apapun. Silakan hubungi admin untuk mendapatkan akses.
                </span></p>}
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        {hasAnyAccess && <Card className="bg-white shadow-lg" data-unique-id="5c7bbee3-53bf-4140-8f54-075e53a0225b" data-file-name="app/user/page.tsx">
            <CardContent className="p-6" data-unique-id="198f1e79-d5b7-4664-a692-f7b99593314d" data-file-name="app/user/page.tsx">
              <Tabs defaultValue="audio" className="w-full" data-unique-id="90caa4bc-037d-4d59-a131-15a8541c797a" data-file-name="app/user/page.tsx" data-dynamic-text="true">
                {/* Mobile-friendly TabsList with improved layout */}
                <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-2 bg-gray-100">
                  {accessCounts.audio > 0 && <TabsTrigger value="audio" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                      <AudioLines className="h-4 w-4 mb-1" />
                      <span data-unique-id="17405a33-e8a9-4c68-8460-14fe1055a867" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="5dc46d4f-47d2-4270-810e-46f6b7826f5f" data-file-name="app/user/page.tsx">Audio</span></span>
                    </TabsTrigger>}
                  {accessCounts.pdf > 0 && <TabsTrigger value="pdf" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-red-500 data-[state=active]:text-white">
                      <FileText className="h-4 w-4 mb-1" />
                      <span data-unique-id="e9143015-25ba-456e-83f1-9a8301cf6d8e" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="7da0837c-b2ff-4077-9f6d-b77b7c2824a5" data-file-name="app/user/page.tsx">PDF</span></span>
                    </TabsTrigger>}
                  {accessCounts.video > 0 && <TabsTrigger value="video" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                      <Video className="h-4 w-4 mb-1" />
                      <span data-unique-id="e69c5caa-bee5-447f-b174-5fe4e4328aaa" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="f2a35fad-3e1e-455d-8531-8f738ce53364" data-file-name="app/user/page.tsx">Video</span></span>
                    </TabsTrigger>}
                  {accessCounts.audioCloud > 0 && <TabsTrigger value="audioCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                      <Music className="h-4 w-4 mb-1" />
                      <span className="text-center" data-unique-id="605a9261-d200-43d0-893d-d4a81d3e56d8" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="de5c9e74-ab4e-4785-9ff4-7807eb1b3dd5" data-file-name="app/user/page.tsx">Audio</span><br data-unique-id="5c09d3d9-7f93-4b99-a53b-4d24c3f6ba6f" data-file-name="app/user/page.tsx" /><span className="editable-text" data-unique-id="2d299618-a0a4-448a-b200-e35d3c23ed2f" data-file-name="app/user/page.tsx">Cloud</span></span>
                    </TabsTrigger>}
                  {accessCounts.pdfCloud > 0 && <TabsTrigger value="pdfCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                      <Cloud className="h-4 w-4 mb-1" />
                      <span className="text-center" data-unique-id="3f57e94b-9ec5-4795-8c5e-117f76e51b6e" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="b6dd5aba-e7ae-4be7-b889-fab344bf3ed1" data-file-name="app/user/page.tsx">PDF</span><br data-unique-id="e451423c-a5b0-4d75-af72-ab80bb1c08d7" data-file-name="app/user/page.tsx" /><span className="editable-text" data-unique-id="66ea6553-417d-4048-8952-717c40e89144" data-file-name="app/user/page.tsx">Cloud</span></span>
                    </TabsTrigger>}
                  {accessCounts.fileCloud > 0 && <TabsTrigger value="fileCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-gray-500 data-[state=active]:text-white">
                      <HardDrive className="h-4 w-4 mb-1" />
                      <span className="text-center" data-unique-id="61f3c9cd-f488-49e1-a101-828614ebdac7" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="e0d34080-aabc-4acc-892a-031bd09caf5e" data-file-name="app/user/page.tsx">File</span><br data-unique-id="bc9ceccf-0f43-4135-9efb-eb9034b4b3af" data-file-name="app/user/page.tsx" /><span className="editable-text" data-unique-id="7ce89912-7123-4cb9-9e09-e42f7d726f41" data-file-name="app/user/page.tsx">Cloud</span></span>
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

        {!hasAnyAccess && <Card className="bg-white shadow-lg" data-unique-id="27201029-2725-4b0f-9cc4-7333f8bd7273" data-file-name="app/user/page.tsx">
            <CardContent className="p-12 text-center" data-unique-id="da3eca4d-4273-4a1d-86a0-03a404acb5f3" data-file-name="app/user/page.tsx">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4" data-unique-id="d691fff7-a48c-4d99-8f93-4edeb801932f" data-file-name="app/user/page.tsx">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2" data-unique-id="aa1b1fa0-6916-426b-8a67-3581ad195ab7" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="3544f8be-44f7-4b2f-8f28-3bcdddc84449" data-file-name="app/user/page.tsx">Belum Ada Akses</span></h3>
              <p className="text-gray-600" data-unique-id="1187f80a-21ba-4369-b86e-95feca4bc9ee" data-file-name="app/user/page.tsx"><span className="editable-text" data-unique-id="82136329-14f8-4f80-9ba6-4081273b992c" data-file-name="app/user/page.tsx">
                Anda belum memiliki akses ke konten apapun. Silakan hubungi admin untuk mendapatkan akses ke kategori yang diinginkan.
              </span></p>
            </CardContent>
          </Card>}
      </main>
    </div>;
}