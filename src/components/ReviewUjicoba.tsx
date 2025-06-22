'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, User, AudioLines, FileText, Video, Music, Cloud, HardDrive, Loader2 } from 'lucide-react';
import AudioPreview from './preview/audio/AudioPreview';
import PDFPreview from './preview/pdf/PDFPreview';
import VideoPreview from './preview/video/VideoPreview';
import AudioCloudPreview from './preview/cloud/AudioCloudPreview';
import PDFCloudPreview from './preview/cloud/PDFCloudPreview';
import FileCloudPreview from './preview/cloud/FileCloudPreview';
interface User {
  id: number;
  username: string;
  name?: string;
  audioCategoryIds?: number[];
  pdfCategoryIds?: number[];
  videoCategoryIds?: number[];
}
interface Category {
  id: number;
  name: string;
}
interface CategoryAccess {
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
}
export default function ReviewUjicoba() {
  const [searchUsername, setSearchUsername] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [categoryAccess, setCategoryAccess] = useState<CategoryAccess>({
    audio: [],
    pdf: [],
    video: [],
    audioCloud: [],
    pdfCloud: [],
    fileCloud: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSearch = async () => {
    if (!searchUsername.trim()) {
      setError('Harap masukkan username untuk mencari');
      return;
    }
    setIsSearching(true);
    setError(null);
    setHasSearched(true);
    try {
      // Search for the user by username
      const response = await fetch(`/api/users?username=${encodeURIComponent(searchUsername.trim())}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const users = await response.json();

      // Find the user with the matching username
      const user = Array.isArray(users) ? users.find(u => u.username.toLowerCase() === searchUsername.trim().toLowerCase()) : null;
      if (!user) {
        setError(`Tidak ditemukan user dengan username "${searchUsername}"`);
        setSearchedUser(null);
        setCategoryAccess({
          audio: [],
          pdf: [],
          video: [],
          audioCloud: [],
          pdfCloud: [],
          fileCloud: []
        });
      } else {
        setSearchedUser(user);
        setSelectedUser(user);
        setError(null);

        // Fetch user's category access
        try {
          const accessResponse = await fetch(`/api/users/categories?userId=${user.id}`);
          if (accessResponse.ok) {
            const accessData = await accessResponse.json();
            setCategoryAccess(accessData);
          }
        } catch (accessError) {
          console.error('Error fetching user access:', accessError);
        }
      }
    } catch (err) {
      console.error('Error searching for user:', err);
      setError('Terjadi kesalahan saat mencari user');
      setSearchedUser(null);
    } finally {
      setIsSearching(false);
    }
  };

  // Calculate access counts
  const accessCounts = {
    audio: categoryAccess.audio.length,
    pdf: categoryAccess.pdf.length,
    video: categoryAccess.video.length,
    audioCloud: categoryAccess.audioCloud.length,
    pdfCloud: categoryAccess.pdfCloud.length,
    fileCloud: categoryAccess.fileCloud.length
  };
  const hasAnyAccess = Object.values(accessCounts).some(count => count > 0);
  return <div className="space-y-6" data-unique-id="acc3cf02-d4f5-491f-bb9b-90142d565d6e" data-file-name="components/ReviewUjicoba.tsx">
      <Card data-unique-id="0c034cec-c72e-4a19-a13a-d9352a7273d1" data-file-name="components/ReviewUjicoba.tsx">
        <CardHeader data-unique-id="dbfcc278-0f97-4f9f-b7cc-622f1c0b3134" data-file-name="components/ReviewUjicoba.tsx">
          <CardTitle className="flex items-center space-x-2" data-unique-id="d2d3d153-294d-4415-ab70-e01b537c8d87" data-file-name="components/ReviewUjicoba.tsx">
            <User className="h-5 w-5" />
            <span data-unique-id="f4d6baa2-918b-482b-95bf-e1976a7f112a" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="e710ceff-aa8e-4902-a370-31bfe44f75a2" data-file-name="components/ReviewUjicoba.tsx">Review Ujicoba</span></span>
          </CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="8f32650d-743c-4b72-8f5b-b7480767a569" data-file-name="components/ReviewUjicoba.tsx">
            Lihat konten yang tersedia untuk pengguna tertentu berdasarkan akses kategori mereka
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="74f753cb-e999-4799-af70-a592da27cc67" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
          {/* Search Section */}
          <div className="flex space-x-4" data-unique-id="f5292739-6249-4633-b302-7dc0eb4215c0" data-file-name="components/ReviewUjicoba.tsx">
            <div className="flex-1" data-unique-id="e1b27f27-1a04-420e-88fc-76eb4029c200" data-file-name="components/ReviewUjicoba.tsx">
              <Label htmlFor="search-username" data-unique-id="73ca5b7e-f310-4217-92ad-594ada0b3e64" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="3d4e4861-1a90-4084-a106-6cac1fd22263" data-file-name="components/ReviewUjicoba.tsx">Username</span></Label>
              <Input id="search-username" value={searchUsername} onChange={e => setSearchUsername(e.target.value)} placeholder="Masukkan username (contoh: 628567899494)" onKeyPress={e => e.key === 'Enter' && handleSearch()} data-unique-id="c52638b6-cffa-43fe-ae36-9ae5a37b04fc" data-file-name="components/ReviewUjicoba.tsx" />
            </div>
            <div className="flex items-end" data-unique-id="e399fe9b-4543-4124-b301-c8af90a7baa1" data-file-name="components/ReviewUjicoba.tsx">
              <Button onClick={handleSearch} disabled={isLoading} className="flex items-center space-x-2" data-unique-id="79c8489b-6144-4fbf-ad85-5574a9d28bcd" data-file-name="components/ReviewUjicoba.tsx">
                <Search className="h-4 w-4" />
                <span data-unique-id="c1d8ec98-7907-47ee-bc75-a3e6da96a690" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{isLoading ? 'Mencari...' : 'Cari User'}</span>
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" data-unique-id="27edb044-e297-4b19-a419-e25f60c25422" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
              {error}
            </div>}

          {/* User Found Section */}
          {searchedUser && <>
              {/* User Info */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-md" data-unique-id="38fe22a2-7b06-4d30-981c-e56eecb950eb" data-file-name="components/ReviewUjicoba.tsx">
                <h3 className="font-semibold text-green-800 mb-2" data-unique-id="5f20fea4-22a0-4a59-a582-562dd522cd39" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="4e9f0bc4-bac6-49ae-976f-fdd95dd6a1d6" data-file-name="components/ReviewUjicoba.tsx">User ditemukan:</span></h3>
                <div className="space-y-1" data-unique-id="55d20ad0-e6ef-4c1b-8f50-e744558571c3" data-file-name="components/ReviewUjicoba.tsx">
                  <p data-unique-id="835cd4f8-ae3b-454d-9c8c-9b678c6706e7" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="font-medium" data-unique-id="73ef6282-981d-4e88-b865-1de8ae7eb199" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="27a6d296-df5b-4e07-95b8-af564041a962" data-file-name="components/ReviewUjicoba.tsx">Username:</span></span> {selectedUser.username}</p>
                  <p data-unique-id="fb397770-9592-4064-85d3-109e345383cb" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="font-medium" data-unique-id="8fc09dec-ea03-4bb1-84da-dc261007de3d" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="08313b1b-1fff-4ad1-9760-6184ad43e781" data-file-name="components/ReviewUjicoba.tsx">Nama:</span></span> {selectedUser.name}</p>
                  <p data-unique-id="17148ab6-8ab1-4b63-862b-36ffc8a65791" data-file-name="components/ReviewUjicoba.tsx">
                    <span className="font-medium" data-unique-id="2d5b473c-c63c-4d9c-ad4e-997b7de0f75c" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="c9dcf025-2a41-41d6-8b0b-5bde2da1eda8" data-file-name="components/ReviewUjicoba.tsx">Total Akses Kategori:</span></span> 
                    <span className="ml-2" data-unique-id="19490abf-3b70-4242-b073-83e0c89d4372" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="c92ada81-32d5-402b-8eb2-1ee1c73f657b" data-file-name="components/ReviewUjicoba.tsx">
                      Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="50a0d8db-2a4f-4f5f-9e5d-1a857a7b7e99" data-file-name="components/ReviewUjicoba.tsx">), 
                      PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="382c3f3b-6650-4fb2-bb97-d5fda5802a04" data-file-name="components/ReviewUjicoba.tsx">), 
                      Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="555b7d8a-6c85-4b0c-96df-724b01eff7c9" data-file-name="components/ReviewUjicoba.tsx">), 
                      Audio Cloud (</span>{accessCounts.audioCloud}<span className="editable-text" data-unique-id="ea90a7a1-07c2-45e6-bc1b-d75c79479f2d" data-file-name="components/ReviewUjicoba.tsx">), 
                      PDF Cloud (</span>{accessCounts.pdfCloud}<span className="editable-text" data-unique-id="b6f6b0d3-f17f-44b1-9f3b-76e3e606becc" data-file-name="components/ReviewUjicoba.tsx">), 
                      File Cloud (</span>{accessCounts.fileCloud}<span className="editable-text" data-unique-id="b21dd029-0355-465b-9feb-5d9aea1da10b" data-file-name="components/ReviewUjicoba.tsx">)
                    </span></span>
                  </p>
                </div>
              </div>

              {/* Access Information Card */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" data-unique-id="92bf6edf-bd75-400f-bd61-973b5491fdfe" data-file-name="components/ReviewUjicoba.tsx">
                <CardHeader data-unique-id="e3533641-a979-4276-9c1c-c1081ad7fc80" data-file-name="components/ReviewUjicoba.tsx">
                  <CardTitle className="text-blue-800 flex items-center space-x-2" data-unique-id="73e1e1e9-f9ff-4fff-9142-5c7c3196698b" data-file-name="components/ReviewUjicoba.tsx">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center" data-unique-id="62739d46-f5b4-4292-83d0-11861190de36" data-file-name="components/ReviewUjicoba.tsx">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span data-unique-id="fc34ca56-8f30-4653-a534-b7528bb4219c" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="7ce15069-d055-4ee0-bf13-e7e89539b6da" data-file-name="components/ReviewUjicoba.tsx">Akses Kategori User</span></span>
                  </CardTitle>
                  <CardDescription className="text-blue-700"><span className="editable-text" data-unique-id="b03aa1c5-16c4-43b6-85ee-1de4cb71f0b9" data-file-name="components/ReviewUjicoba.tsx">
                    Berikut adalah kategori konten yang dapat diakses oleh user ini
                  </span></CardDescription>
                </CardHeader>
                <CardContent data-unique-id="be80d7de-524f-46ce-9267-379dad8d8490" data-file-name="components/ReviewUjicoba.tsx">
                  <div className="bg-white p-4 rounded-lg border border-blue-200" data-unique-id="28e16384-531f-41f1-8673-5c199b0d5054" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                    <p className="text-lg font-semibold text-gray-800 mb-2" data-unique-id="681e5f36-d67b-41d3-94bf-14942fd95730" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="d1e0f9b3-8125-479a-b320-bffb65d6ca68" data-file-name="components/ReviewUjicoba.tsx">
                      User Memiliki Akses:
                    </span></p>
                    <div className="flex flex-wrap gap-3" data-unique-id="2eac33c5-d7a5-4f97-b4cc-38a515df93cd" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                      {accessCounts.audio > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800" data-unique-id="655ffbbb-0cfb-4048-acc4-cf5bf5d7db6f" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <AudioLines className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="886a2e32-e19d-417a-aaca-c3f10c5894a2" data-file-name="components/ReviewUjicoba.tsx">
                          Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="ed7b36ba-c72b-4458-b842-61a41a2d46dd" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.pdf > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800" data-unique-id="21b1fb8b-db5c-48d8-a6f7-8c46751d0b52" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <FileText className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="a1b33b53-34ff-42db-9408-08bab476c6af" data-file-name="components/ReviewUjicoba.tsx">
                          PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="d1ea78c3-7f74-4f71-bbec-a808862e9fa0" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.video > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800" data-unique-id="eb9610a6-0431-4a06-b2ba-e148d3e34ef1" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <Video className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="03c554b0-d8ea-40ae-9639-4c35d1fa71fa" data-file-name="components/ReviewUjicoba.tsx">
                          Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="00e419a7-1f80-452c-926f-d8a1d9bd612c" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.audioCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800" data-unique-id="99abc362-61ae-465b-9982-e0e79424dbe0" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <Music className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="dcf21063-ce75-4262-b19a-8214fddabc70" data-file-name="components/ReviewUjicoba.tsx">
                          Audio Cloud (</span>{accessCounts.audioCloud}<span className="editable-text" data-unique-id="8cfcdd37-2c41-4c9c-a944-186932d346a3" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.pdfCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800" data-unique-id="699274ad-023d-4022-a500-0680e9ff7f1a" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <Cloud className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="9661189c-44fd-4553-bf0d-a513e7a3f60d" data-file-name="components/ReviewUjicoba.tsx">
                          PDF Cloud (</span>{accessCounts.pdfCloud}<span className="editable-text" data-unique-id="3e29db05-eb55-4214-a9b4-efe7b27df51d" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.fileCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800" data-unique-id="343cc4b5-aad3-42ce-8753-93f3f68ab156" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <HardDrive className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="4fc99eae-c4fc-48ba-9c93-942812b184fe" data-file-name="components/ReviewUjicoba.tsx">
                          File Cloud (</span>{accessCounts.fileCloud}<span className="editable-text" data-unique-id="88a69c6f-6ad3-40d6-a5dd-ea73490a7996" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                    </div>
                    {!hasAnyAccess && <p className="text-gray-600 italic" data-unique-id="524b8c7d-ade7-4565-ac79-492e1e95e412" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="7d89abc9-edcb-460f-a7a5-37cf0a40766f" data-file-name="components/ReviewUjicoba.tsx">
                        User ini belum memiliki akses ke kategori apapun.
                      </span></p>}
                  </div>
                </CardContent>
              </Card>

              {/* Content Preview */}
              {hasAnyAccess && <Card data-unique-id="e868f57d-71cc-41a1-9da3-40569f493fa6" data-file-name="components/ReviewUjicoba.tsx">
                  <CardContent className="p-6" data-unique-id="7476c4f7-5fef-47b5-b073-63b686a1c6a3" data-file-name="components/ReviewUjicoba.tsx">
                    <Tabs defaultValue="audio" className="w-full" data-unique-id="87aa892a-1a9d-4049-9aaa-fe60819607cf" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                      {/* TabsList with all available tabs */}
                      <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-2 bg-gray-100">
                        {accessCounts.audio > 0 && <TabsTrigger value="audio" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                            <AudioLines className="h-4 w-4 mb-1" />
                            <span data-unique-id="6724c672-ad41-4698-ba0e-1522e74fbfaf" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="77ce7a5b-7754-4b95-85a2-e2cadb9b4982" data-file-name="components/ReviewUjicoba.tsx">Audio</span></span>
                          </TabsTrigger>}
                        {accessCounts.pdf > 0 && <TabsTrigger value="pdf" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <FileText className="h-4 w-4 mb-1" />
                            <span data-unique-id="497ab79e-13d2-447e-b578-696d7a31e5f0" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="77574afe-097f-4111-bf03-9c65f23df067" data-file-name="components/ReviewUjicoba.tsx">PDF</span></span>
                          </TabsTrigger>}
                        {accessCounts.video > 0 && <TabsTrigger value="video" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                            <Video className="h-4 w-4 mb-1" />
                            <span data-unique-id="611e57be-a371-4899-a3fe-87785099e237" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="39875b35-b6b9-4797-8268-b103c02d5d51" data-file-name="components/ReviewUjicoba.tsx">Video</span></span>
                          </TabsTrigger>}
                        {accessCounts.audioCloud > 0 && <TabsTrigger value="audioCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                            <Music className="h-4 w-4 mb-1" />
                            <span className="text-center" data-unique-id="e3c2f208-5d20-4d0c-8ca8-8585c46e51e4" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="7b40173e-4a5b-4790-845e-10bd72fdb8e4" data-file-name="components/ReviewUjicoba.tsx">Audio</span><br data-unique-id="a6196314-aff4-4537-bf94-f8373020462b" data-file-name="components/ReviewUjicoba.tsx" /><span className="editable-text" data-unique-id="ea116c78-2125-4c46-a0c7-fe417b3e807f" data-file-name="components/ReviewUjicoba.tsx">Cloud</span></span>
                          </TabsTrigger>}
                        {accessCounts.pdfCloud > 0 && <TabsTrigger value="pdfCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                            <Cloud className="h-4 w-4 mb-1" />
                            <span className="text-center" data-unique-id="2daf20f1-aeb4-41a1-970c-d6d256e73b2e" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="db09dd0a-9e2b-4549-8703-338c315abca6" data-file-name="components/ReviewUjicoba.tsx">PDF</span><br data-unique-id="9ed9d68e-90a2-4c50-9b65-c9fa2c1d2c35" data-file-name="components/ReviewUjicoba.tsx" /><span className="editable-text" data-unique-id="bac95618-c9f5-4b74-b716-0c02ef28da2a" data-file-name="components/ReviewUjicoba.tsx">Cloud</span></span>
                          </TabsTrigger>}
                        {accessCounts.fileCloud > 0 && <TabsTrigger value="fileCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-gray-500 data-[state=active]:text-white">
                            <HardDrive className="h-4 w-4 mb-1" />
                            <span className="text-center" data-unique-id="5b236717-fc83-45e3-a23f-f8c14bd54d5b" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="53b08b1b-b322-4699-8ef3-9d22693ce2ca" data-file-name="components/ReviewUjicoba.tsx">File</span><br data-unique-id="70c6bc77-9bee-48f4-a9ec-f763234adfb5" data-file-name="components/ReviewUjicoba.tsx" /><span className="editable-text" data-unique-id="e687c1fc-5e62-4db4-8544-7a70beb5e19c" data-file-name="components/ReviewUjicoba.tsx">Cloud</span></span>
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
            </>}
        </CardContent>
      </Card>
    </div>;
}
interface UserContentPreviewProps {
  type: 'audio' | 'pdf' | 'video';
  userId: number;
  categoryIds: number[];
  categories: Category[];
}
function UserContentPreview({
  type,
  userId,
  categoryIds,
  categories
}: UserContentPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Get category names for display
  const categoryNames = categories.filter(category => categoryIds.includes(category.id)).map(category => category.name).join(', ');
  useEffect(() => {
    // Brief loading state for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return <div className="flex justify-center py-8" data-unique-id="44917f98-14f2-48a6-9a95-7bbc181f56b1" data-file-name="components/ReviewUjicoba.tsx">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div data-unique-id="85f2f848-d12e-4e40-9836-1f0fc0d00ecb" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
      <div className="bg-blue-50 text-blue-800 p-3 mb-6 rounded-md" data-unique-id="107a4760-0137-4eff-bdbd-2ccdfcd240bd" data-file-name="components/ReviewUjicoba.tsx">
        <p className="font-semibold mb-1" data-unique-id="ebcaa6f0-c713-49ed-b535-c8dfa358dc2b" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="f2809787-6ac3-436d-8dcc-93b3c24577b5" data-file-name="components/ReviewUjicoba.tsx">Kategori yang dapat diakses:</span></p>
        <p data-unique-id="e0f86532-5767-4c9e-9143-7239c1bb7658" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{categoryNames || 'Tidak ada kategori akses'}</p>
      </div>

      {type === 'pdf' && <PDFPreview filterCategoryIds={categoryIds} />}
      {type === 'video' && <VideoPreview filterCategoryIds={categoryIds} />}
      {type === 'audio' && <AudioPreview filterCategoryIds={categoryIds} />}
    </div>;
}