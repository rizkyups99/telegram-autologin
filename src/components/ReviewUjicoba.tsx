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
  return <div className="space-y-6" data-unique-id="61374300-6743-45a6-b4a7-6f39b1d778b1" data-file-name="components/ReviewUjicoba.tsx">
      <Card data-unique-id="42713907-88d9-40bd-a733-e49ddb674e4f" data-file-name="components/ReviewUjicoba.tsx">
        <CardHeader data-unique-id="809dafc4-4ab8-4caa-8554-5ebe0c74b9a0" data-file-name="components/ReviewUjicoba.tsx">
          <CardTitle className="flex items-center space-x-2" data-unique-id="eb4fd3b4-77cb-4ac1-956f-a45c0b94c2fe" data-file-name="components/ReviewUjicoba.tsx">
            <User className="h-5 w-5" />
            <span data-unique-id="296a8dae-6dfa-4d4e-9ed4-9ffc35bf1acd" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="44b94e80-2689-46ad-9ee6-e42d79d7c3e4" data-file-name="components/ReviewUjicoba.tsx">Review Ujicoba</span></span>
          </CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="9ca54577-053d-4c9e-8c4c-e14a2d699c07" data-file-name="components/ReviewUjicoba.tsx">
            Lihat konten yang tersedia untuk pengguna tertentu berdasarkan akses kategori mereka
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="7b7d0377-29b4-4b63-91a0-20bb46dc378f" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
          {/* Search Section */}
          <div className="flex space-x-4" data-unique-id="755f4777-ecec-417f-b492-629762c57dc4" data-file-name="components/ReviewUjicoba.tsx">
            <div className="flex-1" data-unique-id="b213d24c-1c7c-40e5-b044-a89e506c1cad" data-file-name="components/ReviewUjicoba.tsx">
              <Label htmlFor="search-username" data-unique-id="2f9da397-61e2-44dd-94f9-b96d31fc8a8b" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="ccf6d7db-838e-469b-bdd1-1cdc69678b99" data-file-name="components/ReviewUjicoba.tsx">Username</span></Label>
              <Input id="search-username" value={searchUsername} onChange={e => setSearchUsername(e.target.value)} placeholder="Masukkan username (contoh: 628567899494)" onKeyPress={e => e.key === 'Enter' && handleSearch()} data-unique-id="8e1f64ce-60f3-44ee-a1c4-43005fc41462" data-file-name="components/ReviewUjicoba.tsx" />
            </div>
            <div className="flex items-end" data-unique-id="f83d366b-28f6-4424-afd2-c2e3f6224172" data-file-name="components/ReviewUjicoba.tsx">
              <Button onClick={handleSearch} disabled={isLoading} className="flex items-center space-x-2" data-unique-id="ff8b2f72-a842-40b7-b0da-01f8861360a7" data-file-name="components/ReviewUjicoba.tsx">
                <Search className="h-4 w-4" />
                <span data-unique-id="f970887a-7bb1-48da-aa88-f1d324a822ae" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{isLoading ? 'Mencari...' : 'Cari User'}</span>
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" data-unique-id="d67b1a5e-4d35-4db6-876a-c88a97da52e1" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
              {error}
            </div>}

          {/* User Found Section */}
          {searchedUser && <>
              {/* User Info */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-md" data-unique-id="afb45448-85ad-475a-bf80-cfc8ec9bd904" data-file-name="components/ReviewUjicoba.tsx">
                <h3 className="font-semibold text-green-800 mb-2" data-unique-id="1ac7e781-4697-4d00-8d81-754565dd024c" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="9408b771-da38-4fc3-821a-b65d40ee1ac3" data-file-name="components/ReviewUjicoba.tsx">User ditemukan:</span></h3>
                <div className="space-y-1" data-unique-id="bdc3b909-5871-4beb-bbad-b81d20655cdb" data-file-name="components/ReviewUjicoba.tsx">
                  <p data-unique-id="d3b22764-a3cb-4f2d-8a19-60fe16daf6c5" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="font-medium" data-unique-id="9509af55-9c60-467c-8d57-0728a589226c" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="1abb13d7-f93d-4d32-afbd-92b2a5a03a7c" data-file-name="components/ReviewUjicoba.tsx">Username:</span></span> {selectedUser.username}</p>
                  <p data-unique-id="2a1421d5-0d03-4875-9952-3a2b5b3555fc" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="font-medium" data-unique-id="7a2a79e6-28b0-495d-8b9f-fed946febc72" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="08692131-cfd0-4479-a7d6-bb361841d5ef" data-file-name="components/ReviewUjicoba.tsx">Nama:</span></span> {selectedUser.name}</p>
                  <p data-unique-id="23a7ff19-55a2-483b-9024-f4de1ea45758" data-file-name="components/ReviewUjicoba.tsx">
                    <span className="font-medium" data-unique-id="9b1fb439-f670-4203-a81e-51e2dcd3e867" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="0e6b7927-1e9a-4523-aaf4-3f7c47ca649a" data-file-name="components/ReviewUjicoba.tsx">Total Akses Kategori:</span></span> 
                    <span className="ml-2" data-unique-id="28e9ad8d-5d90-4cdf-bb18-725c68dd0c4a" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="dcbad1f4-74d9-4e36-874a-c4602a25eb4a" data-file-name="components/ReviewUjicoba.tsx">
                      Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="3b8fc52f-f0bf-419b-9159-a6709324112d" data-file-name="components/ReviewUjicoba.tsx">), 
                      PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="d51eb5c4-5da8-45dd-ba79-ec753f500b40" data-file-name="components/ReviewUjicoba.tsx">), 
                      Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="555d1330-229a-42e0-ada5-f8ca21ed675c" data-file-name="components/ReviewUjicoba.tsx">), 
                      Audio Cloud (</span>{accessCounts.audioCloud}<span className="editable-text" data-unique-id="4840ef8a-58ed-4ab1-8311-d285b2c8b681" data-file-name="components/ReviewUjicoba.tsx">), 
                      PDF Cloud (</span>{accessCounts.pdfCloud}<span className="editable-text" data-unique-id="d4b9ab56-ed3a-4bb1-b9e7-adcaed2a9d82" data-file-name="components/ReviewUjicoba.tsx">), 
                      File Cloud (</span>{accessCounts.fileCloud}<span className="editable-text" data-unique-id="1b402b3e-56cb-483c-9af6-4a1c0fab6659" data-file-name="components/ReviewUjicoba.tsx">)
                    </span></span>
                  </p>
                </div>
              </div>

              {/* Access Information Card */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" data-unique-id="394e536c-34eb-46ad-9e61-fbd7d47196cc" data-file-name="components/ReviewUjicoba.tsx">
                <CardHeader data-unique-id="8a8c717d-96d2-48f1-a084-0c6a7063c6cf" data-file-name="components/ReviewUjicoba.tsx">
                  <CardTitle className="text-blue-800 flex items-center space-x-2" data-unique-id="e3c98ab1-0fb4-4912-ba7e-06c36ce5ceeb" data-file-name="components/ReviewUjicoba.tsx">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center" data-unique-id="a28ea108-11dd-432d-a169-15014273ed7b" data-file-name="components/ReviewUjicoba.tsx">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span data-unique-id="be8fd5aa-d5bd-4af6-9afa-07faafe88f22" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="870a0556-ef62-4260-96ea-5a06f87e74c0" data-file-name="components/ReviewUjicoba.tsx">Akses Kategori User</span></span>
                  </CardTitle>
                  <CardDescription className="text-blue-700"><span className="editable-text" data-unique-id="015ecf33-e6c2-4c0c-8bb7-7f89234e12fc" data-file-name="components/ReviewUjicoba.tsx">
                    Berikut adalah kategori konten yang dapat diakses oleh user ini
                  </span></CardDescription>
                </CardHeader>
                <CardContent data-unique-id="0b9298d5-fe01-4786-901a-f521da9df2ff" data-file-name="components/ReviewUjicoba.tsx">
                  <div className="bg-white p-4 rounded-lg border border-blue-200" data-unique-id="873e98a8-3786-47a6-85a4-0e668193849c" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                    <p className="text-lg font-semibold text-gray-800 mb-2" data-unique-id="b05dbaaf-f8f1-4d39-a879-50b2b2824196" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="4b380da4-b7f0-40c7-a10e-c70f96ad0fc1" data-file-name="components/ReviewUjicoba.tsx">
                      User Memiliki Akses:
                    </span></p>
                    <div className="flex flex-wrap gap-3" data-unique-id="490b506b-7bd8-46e4-93ac-4bd7316c76a0" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                      {accessCounts.audio > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800" data-unique-id="38921796-ba9a-4e66-93a6-2e3581d0bf24" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <AudioLines className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="a36ff295-0704-4e6b-afaa-f669c7f01a5c" data-file-name="components/ReviewUjicoba.tsx">
                          Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="1bbd5b0d-f509-4c62-abdb-e462daa53313" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.pdf > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800" data-unique-id="16dd7590-595a-4909-b362-0d26f647b22d" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <FileText className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="13d1f4fc-d528-46ca-a821-8490431e54ea" data-file-name="components/ReviewUjicoba.tsx">
                          PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="35763143-515f-46fe-b2c2-f6ac74a08244" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.video > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800" data-unique-id="cf01c3ed-2ca6-4988-9529-7533b9ee39b8" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <Video className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="a6215db4-617f-4058-8860-c2cce6f023e3" data-file-name="components/ReviewUjicoba.tsx">
                          Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="ba54da56-697e-410a-bbd7-19d485f1dea5" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.audioCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800" data-unique-id="f9b55f1c-1180-4942-b3dd-8a4c2cb28442" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <Music className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="c3af2d8c-3a2e-4547-b15c-fcb9c40496e0" data-file-name="components/ReviewUjicoba.tsx">
                          Audio Cloud (</span>{accessCounts.audioCloud}<span className="editable-text" data-unique-id="031f78db-aa6d-4646-8ee0-b7605b6d797b" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.pdfCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800" data-unique-id="14e2c8f3-120f-4b00-a151-ca910fb9a992" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <Cloud className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="0e0f951d-76aa-4629-b18f-c0ce6fd290dd" data-file-name="components/ReviewUjicoba.tsx">
                          PDF Cloud (</span>{accessCounts.pdfCloud}<span className="editable-text" data-unique-id="fcafbb78-df76-4e63-a6ba-69d359cf2db7" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.fileCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800" data-unique-id="0540937c-0eb8-482d-ae77-d8620369c6a4" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <HardDrive className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="474de98d-2a16-4c1e-a898-a215e4dc1b4d" data-file-name="components/ReviewUjicoba.tsx">
                          File Cloud (</span>{accessCounts.fileCloud}<span className="editable-text" data-unique-id="3045b539-2a17-4baf-8e85-ff2b288c8917" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                    </div>
                    {!hasAnyAccess && <p className="text-gray-600 italic" data-unique-id="0a00e46a-30e8-494f-b8d3-0271d8351daf" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="0078da49-275a-43a4-a509-109d7d122f8a" data-file-name="components/ReviewUjicoba.tsx">
                        User ini belum memiliki akses ke kategori apapun.
                      </span></p>}
                  </div>
                </CardContent>
              </Card>

              {/* Content Preview */}
              {hasAnyAccess && <Card data-unique-id="96a1a301-61f1-4e77-b2fd-d1a82563fd70" data-file-name="components/ReviewUjicoba.tsx">
                  <CardContent className="p-6" data-unique-id="8fd7dc9c-43b0-4f2a-bf37-452aaced0ae5" data-file-name="components/ReviewUjicoba.tsx">
                    <Tabs defaultValue="audio" className="w-full" data-unique-id="8c631657-5b70-41c9-a2e1-0bc375047e61" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                      {/* TabsList with all available tabs */}
                      <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-2 bg-gray-100">
                        {accessCounts.audio > 0 && <TabsTrigger value="audio" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                            <AudioLines className="h-4 w-4 mb-1" />
                            <span data-unique-id="051d8441-ac01-4c46-8ecc-e99001c26b7a" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="dba37d9d-d4bc-4145-be39-f405e9a6b8c4" data-file-name="components/ReviewUjicoba.tsx">Audio</span></span>
                          </TabsTrigger>}
                        {accessCounts.pdf > 0 && <TabsTrigger value="pdf" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <FileText className="h-4 w-4 mb-1" />
                            <span data-unique-id="758b393d-f749-46ae-8e04-06f149849dd9" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="23080c31-e274-44e4-ac70-7754d27d5117" data-file-name="components/ReviewUjicoba.tsx">PDF</span></span>
                          </TabsTrigger>}
                        {accessCounts.video > 0 && <TabsTrigger value="video" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                            <Video className="h-4 w-4 mb-1" />
                            <span data-unique-id="d3c16fbc-a516-46b3-a9b5-4cd02c49d5c3" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="821929c1-d985-4fe7-a578-89b94d8a0609" data-file-name="components/ReviewUjicoba.tsx">Video</span></span>
                          </TabsTrigger>}
                        {accessCounts.audioCloud > 0 && <TabsTrigger value="audioCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                            <Music className="h-4 w-4 mb-1" />
                            <span className="text-center" data-unique-id="205ef995-c813-407c-8948-3b03489cdce5" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="45dd2127-c7ee-4c79-9b10-b8025c2c4aa0" data-file-name="components/ReviewUjicoba.tsx">Audio</span><br data-unique-id="51f490bb-f578-42b6-aaf9-f508a677c8a7" data-file-name="components/ReviewUjicoba.tsx" /><span className="editable-text" data-unique-id="0888cb33-365b-4313-bb84-a34fac1441e9" data-file-name="components/ReviewUjicoba.tsx">Cloud</span></span>
                          </TabsTrigger>}
                        {accessCounts.pdfCloud > 0 && <TabsTrigger value="pdfCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                            <Cloud className="h-4 w-4 mb-1" />
                            <span className="text-center" data-unique-id="3ac74808-6f00-4887-817a-cfb809af1a8f" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="a4d343d5-cf9c-4f60-a766-967d133101fa" data-file-name="components/ReviewUjicoba.tsx">PDF</span><br data-unique-id="5df0cb9c-0c1b-4c30-82a4-1a52bc03badb" data-file-name="components/ReviewUjicoba.tsx" /><span className="editable-text" data-unique-id="2fe15d93-4d4e-4321-924b-a6718ffc8713" data-file-name="components/ReviewUjicoba.tsx">Cloud</span></span>
                          </TabsTrigger>}
                        {accessCounts.fileCloud > 0 && <TabsTrigger value="fileCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-gray-500 data-[state=active]:text-white">
                            <HardDrive className="h-4 w-4 mb-1" />
                            <span className="text-center" data-unique-id="2b9784cc-d959-4159-9aaa-3ae5cf3537ae" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="709ff8b5-3f14-4179-9d1c-9362b05439c7" data-file-name="components/ReviewUjicoba.tsx">File</span><br data-unique-id="f4120530-bdb5-4b20-85f1-263898494b3f" data-file-name="components/ReviewUjicoba.tsx" /><span className="editable-text" data-unique-id="fab31907-ffcf-4324-8693-1db82d0da307" data-file-name="components/ReviewUjicoba.tsx">Cloud</span></span>
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
    return <div className="flex justify-center py-8" data-unique-id="9fa1cbea-0494-4d6a-ac92-2edfd327f87b" data-file-name="components/ReviewUjicoba.tsx">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div data-unique-id="8924c789-4da0-420f-be5a-3aa57ceadac4" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
      <div className="bg-blue-50 text-blue-800 p-3 mb-6 rounded-md" data-unique-id="53e49756-9f58-4869-b3d2-69c109d56e6d" data-file-name="components/ReviewUjicoba.tsx">
        <p className="font-semibold mb-1" data-unique-id="6d42b72a-5884-4c05-9d8b-49cbb183639c" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="c7b0a0d1-9dc4-4a0f-8881-7bee8e895687" data-file-name="components/ReviewUjicoba.tsx">Kategori yang dapat diakses:</span></p>
        <p data-unique-id="55aa326f-379a-4883-9e3b-fb652c563f63" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{categoryNames || 'Tidak ada kategori akses'}</p>
      </div>

      {type === 'pdf' && <PDFPreview filterCategoryIds={categoryIds} />}
      {type === 'video' && <VideoPreview filterCategoryIds={categoryIds} />}
      {type === 'audio' && <AudioPreview filterCategoryIds={categoryIds} />}
    </div>;
}