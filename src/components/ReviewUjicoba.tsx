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
  return <div className="space-y-6" data-unique-id="7cfee85d-00c3-4ad4-acb1-0af0f8a5c5f3" data-file-name="components/ReviewUjicoba.tsx">
      <Card data-unique-id="f47b5b03-0aa7-445f-8291-7de826fa0819" data-file-name="components/ReviewUjicoba.tsx">
        <CardHeader data-unique-id="28ef1349-2b19-414b-9ba1-84b576fefcad" data-file-name="components/ReviewUjicoba.tsx">
          <CardTitle className="flex items-center space-x-2" data-unique-id="5bf9bbcc-164a-4e35-928d-137bf10b0cc4" data-file-name="components/ReviewUjicoba.tsx">
            <User className="h-5 w-5" />
            <span data-unique-id="6bdb12d0-4e07-4336-9fd5-1b3109ab34af" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="923a7d2e-d400-40b6-a5fe-17ec0718662e" data-file-name="components/ReviewUjicoba.tsx">Review Ujicoba</span></span>
          </CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="f30e21b3-405c-481c-8a72-655a234bb35c" data-file-name="components/ReviewUjicoba.tsx">
            Lihat konten yang tersedia untuk pengguna tertentu berdasarkan akses kategori mereka
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="a6f4eabb-403e-4d71-b81d-bf477bc0407e" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
          {/* Search Section */}
          <div className="flex space-x-4" data-unique-id="03f8a29f-e549-4599-af60-e8e0ba02a5cb" data-file-name="components/ReviewUjicoba.tsx">
            <div className="flex-1" data-unique-id="81639d25-5680-414e-931f-ca26d982002f" data-file-name="components/ReviewUjicoba.tsx">
              <Label htmlFor="search-username" data-unique-id="782a4857-dcbd-4cfe-963e-c6924625d7f6" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="b2ba23c2-958e-4218-8e87-e19985bb03de" data-file-name="components/ReviewUjicoba.tsx">Username</span></Label>
              <Input id="search-username" value={searchUsername} onChange={e => setSearchUsername(e.target.value)} placeholder="Masukkan username (contoh: 628567899494)" onKeyPress={e => e.key === 'Enter' && handleSearch()} data-unique-id="a89c0770-4e45-4e22-b0c8-949032bd2484" data-file-name="components/ReviewUjicoba.tsx" />
            </div>
            <div className="flex items-end" data-unique-id="d29320b3-494c-4050-9afb-29907c589672" data-file-name="components/ReviewUjicoba.tsx">
              <Button onClick={handleSearch} disabled={isLoading} className="flex items-center space-x-2" data-unique-id="e7eda81d-3f5f-48f1-885c-65c5102c5927" data-file-name="components/ReviewUjicoba.tsx">
                <Search className="h-4 w-4" />
                <span data-unique-id="865acb27-511c-4104-bd8c-40f4fcfe100f" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{isLoading ? 'Mencari...' : 'Cari User'}</span>
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md" data-unique-id="399ca66a-57c3-4a85-98b0-1c8015fbd912" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
              {error}
            </div>}

          {/* User Found Section */}
          {searchedUser && <>
              {/* User Info */}
              <div className="bg-green-50 border border-green-200 p-4 rounded-md" data-unique-id="ad2f9148-df8c-4495-9b83-aa731f6825bb" data-file-name="components/ReviewUjicoba.tsx">
                <h3 className="font-semibold text-green-800 mb-2" data-unique-id="a2100f3a-d3b3-4e1e-a0f8-5ea390cc02bc" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="8195cb2d-3a9a-4401-b394-f8d72e81d4b6" data-file-name="components/ReviewUjicoba.tsx">User ditemukan:</span></h3>
                <div className="space-y-1" data-unique-id="87325cc7-7df3-4945-b04f-23056ccc1565" data-file-name="components/ReviewUjicoba.tsx">
                  <p data-unique-id="821eee8f-1226-4cdf-904c-601cbe50b004" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="font-medium" data-unique-id="c06bcabb-a78f-446c-b74f-f13e01a16a94" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="60578fbe-3324-46d8-9d3c-2c51260617fc" data-file-name="components/ReviewUjicoba.tsx">Username:</span></span> {selectedUser.username}</p>
                  <p data-unique-id="24809a2b-2958-4826-a27c-424f7cf983a5" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="font-medium" data-unique-id="3475596c-ff06-4058-8e9f-64d2e4ba8e94" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="17847711-0c8d-4760-9421-5b46e35309e2" data-file-name="components/ReviewUjicoba.tsx">Nama:</span></span> {selectedUser.name}</p>
                  <p data-unique-id="f0eb0232-97f9-412d-b25e-cd39a0ed0edb" data-file-name="components/ReviewUjicoba.tsx">
                    <span className="font-medium" data-unique-id="1fd7a203-b2ff-4679-b25e-4eab665f2429" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="62ac9168-c023-4818-a865-29c9cae4dae8" data-file-name="components/ReviewUjicoba.tsx">Total Akses Kategori:</span></span> 
                    <span className="ml-2" data-unique-id="4a809900-97c3-4f50-a503-299371138f9e" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6b9bb391-ddad-4aab-bd9f-82b4542fb951" data-file-name="components/ReviewUjicoba.tsx">
                      Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="d7c76555-cd43-4c03-81b6-c52ec0bbdb69" data-file-name="components/ReviewUjicoba.tsx">), 
                      PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="29f35f9d-790e-4836-bf40-5cdfeb41943b" data-file-name="components/ReviewUjicoba.tsx">), 
                      Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="71ff6fc2-154f-4573-8e3e-e4246700f91c" data-file-name="components/ReviewUjicoba.tsx">), 
                      Audio Cloud (</span>{accessCounts.audioCloud}<span className="editable-text" data-unique-id="09288091-2c8c-4a2a-918e-e77e0eefeb47" data-file-name="components/ReviewUjicoba.tsx">), 
                      PDF Cloud (</span>{accessCounts.pdfCloud}<span className="editable-text" data-unique-id="cfef763c-69e9-495f-a9d5-f66e7d835005" data-file-name="components/ReviewUjicoba.tsx">), 
                      File Cloud (</span>{accessCounts.fileCloud}<span className="editable-text" data-unique-id="6e5130b2-b3a1-45ba-899a-7094914c7b76" data-file-name="components/ReviewUjicoba.tsx">)
                    </span></span>
                  </p>
                </div>
              </div>

              {/* Access Information Card */}
              <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" data-unique-id="9e47a967-d228-451b-ac19-2e1dd61384d5" data-file-name="components/ReviewUjicoba.tsx">
                <CardHeader data-unique-id="c80e7148-7c09-4488-b0be-ac29a20185eb" data-file-name="components/ReviewUjicoba.tsx">
                  <CardTitle className="text-blue-800 flex items-center space-x-2" data-unique-id="c827ff83-5671-494a-a92d-6c46d437e756" data-file-name="components/ReviewUjicoba.tsx">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center" data-unique-id="7ce7bfef-eaf7-4358-b055-70662a8b17b3" data-file-name="components/ReviewUjicoba.tsx">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <span data-unique-id="a6ee0e1c-5658-451d-be5a-6fb834643724" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="f3a50f36-19fd-466d-89c2-f8afe8e34bed" data-file-name="components/ReviewUjicoba.tsx">Akses Kategori User</span></span>
                  </CardTitle>
                  <CardDescription className="text-blue-700"><span className="editable-text" data-unique-id="a7b32c01-61dd-4932-a6b9-546a30832293" data-file-name="components/ReviewUjicoba.tsx">
                    Berikut adalah kategori konten yang dapat diakses oleh user ini
                  </span></CardDescription>
                </CardHeader>
                <CardContent data-unique-id="e5f88aa3-b4a5-4cf0-bb06-fd03db254139" data-file-name="components/ReviewUjicoba.tsx">
                  <div className="bg-white p-4 rounded-lg border border-blue-200" data-unique-id="da1d90bd-213d-45fd-93ee-4afdd59ebb12" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                    <p className="text-lg font-semibold text-gray-800 mb-2" data-unique-id="5b92df73-9e51-4981-81db-7388ff92a779" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="039eaf8a-cad9-4772-968a-47c25cc523d4" data-file-name="components/ReviewUjicoba.tsx">
                      User Memiliki Akses:
                    </span></p>
                    <div className="flex flex-wrap gap-3" data-unique-id="68a84f89-aeaa-4678-bde1-cf88122bdeb0" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                      {accessCounts.audio > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800" data-unique-id="fb995933-c7dc-4770-a55b-473f93d77014" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <AudioLines className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="b58d3daf-bab8-4a97-a3f1-5f864678cd11" data-file-name="components/ReviewUjicoba.tsx">
                          Audio (</span>{accessCounts.audio}<span className="editable-text" data-unique-id="f4564cf4-54bd-484b-aad7-855718d7c062" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.pdf > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800" data-unique-id="d280eae7-24fa-4ab9-b26e-e6a3c7080e84" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <FileText className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="d2d63c14-f981-4954-b286-4203a6e401a7" data-file-name="components/ReviewUjicoba.tsx">
                          PDF (</span>{accessCounts.pdf}<span className="editable-text" data-unique-id="5bf1866d-8d90-4a3a-ba73-d862acfbfed7" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.video > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800" data-unique-id="205b039b-9879-4b59-9363-9752f6102336" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <Video className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="cdf93e2d-8f7d-4cff-8cf8-4b31246a59c3" data-file-name="components/ReviewUjicoba.tsx">
                          Video (</span>{accessCounts.video}<span className="editable-text" data-unique-id="dbd46c79-bbc9-43b5-b83e-342e809a07e2" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.audioCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-cyan-100 text-cyan-800" data-unique-id="29ea267b-f6cd-4346-b975-cbfb14f4513e" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <Music className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="9a2c94eb-a73c-4f7f-a760-7d19ee695368" data-file-name="components/ReviewUjicoba.tsx">
                          Audio Cloud (</span>{accessCounts.audioCloud}<span className="editable-text" data-unique-id="df0de1ab-ddb2-4488-82e9-c29cdc288759" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.pdfCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800" data-unique-id="1930c172-49a6-4f6d-9876-199f4872d71d" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <Cloud className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="aafb5de7-4470-4de4-b26d-e7c6ac4e170d" data-file-name="components/ReviewUjicoba.tsx">
                          PDF Cloud (</span>{accessCounts.pdfCloud}<span className="editable-text" data-unique-id="b21d6db7-eff3-4945-83da-5d6d92fc5c65" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                      {accessCounts.fileCloud > 0 && <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800" data-unique-id="22c7f5ee-d8d0-401c-af12-4686a80b2ac0" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                          <HardDrive className="h-4 w-4 mr-1" /><span className="editable-text" data-unique-id="80b6a7fa-78a4-4a89-93c9-63a38c96e2c1" data-file-name="components/ReviewUjicoba.tsx">
                          File Cloud (</span>{accessCounts.fileCloud}<span className="editable-text" data-unique-id="2c14c710-c323-4c33-a819-821d76e2e639" data-file-name="components/ReviewUjicoba.tsx">)
                        </span></span>}
                    </div>
                    {!hasAnyAccess && <p className="text-gray-600 italic" data-unique-id="35e443f7-6fed-4bde-b47e-001c72b6ba65" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="1d87a22a-4e17-4d25-8186-5ff0ddaea97e" data-file-name="components/ReviewUjicoba.tsx">
                        User ini belum memiliki akses ke kategori apapun.
                      </span></p>}
                  </div>
                </CardContent>
              </Card>

              {/* Content Preview */}
              {hasAnyAccess && <Card data-unique-id="d027f95f-ffe7-4d4d-8411-7c90de054c85" data-file-name="components/ReviewUjicoba.tsx">
                  <CardContent className="p-6" data-unique-id="584e9d94-e2bf-4a80-ac37-de275eb84b60" data-file-name="components/ReviewUjicoba.tsx">
                    <Tabs defaultValue="audio" className="w-full" data-unique-id="1dd3f6b7-c7bf-47dc-b482-707b8fc7c1b3" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                      {/* TabsList with all available tabs */}
                      <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-2 bg-gray-100">
                        {accessCounts.audio > 0 && <TabsTrigger value="audio" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-blue-500 data-[state=active]:text-white">
                            <AudioLines className="h-4 w-4 mb-1" />
                            <span data-unique-id="88e988b3-73ab-43db-a3bf-a867811773d2" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="35c57cf9-43a6-47a9-aa28-25c5290b34b7" data-file-name="components/ReviewUjicoba.tsx">Audio</span></span>
                          </TabsTrigger>}
                        {accessCounts.pdf > 0 && <TabsTrigger value="pdf" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-red-500 data-[state=active]:text-white">
                            <FileText className="h-4 w-4 mb-1" />
                            <span data-unique-id="39dad201-1a5c-4282-aa0b-020625566f82" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="91b97afa-03e8-4001-9c1d-2ce4e166e974" data-file-name="components/ReviewUjicoba.tsx">PDF</span></span>
                          </TabsTrigger>}
                        {accessCounts.video > 0 && <TabsTrigger value="video" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-purple-500 data-[state=active]:text-white">
                            <Video className="h-4 w-4 mb-1" />
                            <span data-unique-id="79b95d49-9b9b-41b5-8478-ced507255c8b" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="f3502dd7-7011-4255-8489-7887d4cfe86b" data-file-name="components/ReviewUjicoba.tsx">Video</span></span>
                          </TabsTrigger>}
                        {accessCounts.audioCloud > 0 && <TabsTrigger value="audioCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-cyan-500 data-[state=active]:text-white">
                            <Music className="h-4 w-4 mb-1" />
                            <span className="text-center" data-unique-id="ade09ce8-4a20-44df-870f-2ed2043683a6" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="47a01e02-52b3-4183-8470-c20a18ef32a2" data-file-name="components/ReviewUjicoba.tsx">Audio</span><br data-unique-id="c50aa9f9-c795-4147-9bf2-c674533ab67b" data-file-name="components/ReviewUjicoba.tsx" /><span className="editable-text" data-unique-id="91460db6-4d45-4bbd-96ee-602d013b4c32" data-file-name="components/ReviewUjicoba.tsx">Cloud</span></span>
                          </TabsTrigger>}
                        {accessCounts.pdfCloud > 0 && <TabsTrigger value="pdfCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-orange-500 data-[state=active]:text-white">
                            <Cloud className="h-4 w-4 mb-1" />
                            <span className="text-center" data-unique-id="c0e829a8-4672-4a09-ad1c-a447e6a49cf1" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="133cc0ab-25c2-4709-8363-300ecd6a96e9" data-file-name="components/ReviewUjicoba.tsx">PDF</span><br data-unique-id="23d495c0-312f-4203-a86e-ace165ab3bba" data-file-name="components/ReviewUjicoba.tsx" /><span className="editable-text" data-unique-id="5a2e9959-388a-4e7b-8be0-d5bdbe5a767a" data-file-name="components/ReviewUjicoba.tsx">Cloud</span></span>
                          </TabsTrigger>}
                        {accessCounts.fileCloud > 0 && <TabsTrigger value="fileCloud" className="flex flex-col items-center p-3 text-xs lg:text-sm data-[state=active]:bg-gray-500 data-[state=active]:text-white">
                            <HardDrive className="h-4 w-4 mb-1" />
                            <span className="text-center" data-unique-id="6c4a708a-9259-4cb6-a61c-bdb3c1aab60e" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="c07b99fe-416e-4aa6-b365-7824144d6f54" data-file-name="components/ReviewUjicoba.tsx">File</span><br data-unique-id="6e64dfa5-3cb3-4453-a832-f3d730abc0b1" data-file-name="components/ReviewUjicoba.tsx" /><span className="editable-text" data-unique-id="da6ed6bb-26df-4a3a-b96b-f4bc06569d88" data-file-name="components/ReviewUjicoba.tsx">Cloud</span></span>
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
    return <div className="flex justify-center py-8" data-unique-id="0dc57fb0-51e0-4e70-9978-a487fdc21138" data-file-name="components/ReviewUjicoba.tsx">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div data-unique-id="adcfc291-069b-4eca-83c8-f224419828f8" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
      <div className="bg-blue-50 text-blue-800 p-3 mb-6 rounded-md" data-unique-id="00985b7e-c8c0-439e-bb78-1fe8e4da2662" data-file-name="components/ReviewUjicoba.tsx">
        <p className="font-semibold mb-1" data-unique-id="78ff58ab-310f-4c85-a228-b144b6877413" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="e401da02-02f0-4d29-98b3-123000d081ff" data-file-name="components/ReviewUjicoba.tsx">Kategori yang dapat diakses:</span></p>
        <p data-unique-id="befa0062-fee1-4d2a-af82-80d16a8b9ae6" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{categoryNames || 'Tidak ada kategori akses'}</p>
      </div>

      {type === 'pdf' && <PDFPreview filterCategoryIds={categoryIds} />}
      {type === 'video' && <VideoPreview filterCategoryIds={categoryIds} />}
      {type === 'audio' && <AudioPreview filterCategoryIds={categoryIds} />}
    </div>;
}