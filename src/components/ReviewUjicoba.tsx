'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, AlertCircle, Loader } from 'lucide-react';

// Import preview components
import PDFPreview from './preview/pdf/PDFPreview';
import VideoPreview from './preview/video/VideoPreview';
import AudioPreview from './preview/audio/AudioPreview';
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
export default function ReviewUjicoba() {
  const [username, setUsername] = useState('');
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);
  const handleSearch = async () => {
    if (!username.trim()) {
      setError('Harap masukkan username untuk mencari');
      return;
    }
    setIsSearching(true);
    setError(null);
    setHasSearched(true);
    try {
      // Search for the user by username
      const response = await fetch(`/api/users?username=${encodeURIComponent(username.trim())}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      const users = await response.json();

      // Find the user with the matching username
      const user = Array.isArray(users) ? users.find(u => u.username.toLowerCase() === username.trim().toLowerCase()) : null;
      if (!user) {
        setError(`Tidak ditemukan user dengan username "${username}"`);
        setSearchedUser(null);
      } else {
        setSearchedUser(user);
        setError(null);
      }
    } catch (err) {
      console.error('Error searching for user:', err);
      setError('Terjadi kesalahan saat mencari user');
      setSearchedUser(null);
    } finally {
      setIsSearching(false);
    }
  };
  return <Card data-unique-id="29253517-82c4-473f-a471-f2a157ac968d" data-file-name="components/ReviewUjicoba.tsx">
      <CardContent className="pt-6" data-unique-id="2bcd75fe-4a4b-4095-abf4-c80983a4ff58" data-file-name="components/ReviewUjicoba.tsx">
        <div className="mb-6" data-unique-id="2fad4ee5-0019-4893-908b-78c7bc4d6175" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
          <h2 className="text-2xl font-semibold mb-2" data-unique-id="534a3bf2-5502-47f6-aacf-847e609c9a93" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="f72463e1-f379-427b-a039-479d7c0ff802" data-file-name="components/ReviewUjicoba.tsx">Review Ujicoba</span></h2>
          <p className="text-muted-foreground mb-6" data-unique-id="52dab185-6443-47d1-be02-cf0aa498264b" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="c6164963-28a2-4414-854c-6d47439fdb6b" data-file-name="components/ReviewUjicoba.tsx">
            Lihat konten yang tersedia untuk pengguna tertentu berdasarkan akses kategori mereka
          </span></p>

          <div className="bg-muted p-4 rounded-md mb-6" data-unique-id="3c543de0-a490-4497-8ea0-2e9c4f538e62" data-file-name="components/ReviewUjicoba.tsx">
            <div className="grid grid-cols-3 gap-4" data-unique-id="ba2dd070-32d8-4cba-84c4-c6af9510f4d5" data-file-name="components/ReviewUjicoba.tsx">
              <div className="col-span-2" data-unique-id="1bf56045-75c5-4025-aa32-062edd935fd2" data-file-name="components/ReviewUjicoba.tsx">
                <Label htmlFor="username" className="block text-sm font-medium mb-1" data-unique-id="8db1190f-fc0a-4336-bb12-ee7d26b35f65" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="d23d71b7-1791-4025-a73e-8b274ebe5cd8" data-file-name="components/ReviewUjicoba.tsx">Username</span></Label>
                <Input id="username" placeholder="Masukkan username untuk melihat konten yang tersedia" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }} data-unique-id="5dc647f0-cff8-4c85-962d-51424b3950c1" data-file-name="components/ReviewUjicoba.tsx" />
              </div>
              <div className="flex items-end" data-unique-id="17b44ecd-f32f-48a0-aa3e-93bd28793034" data-file-name="components/ReviewUjicoba.tsx">
                <Button onClick={handleSearch} className="w-full" disabled={isSearching} data-unique-id="255271cb-50b2-454b-955a-ffb95ce0c2a4" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
                  {isSearching ? <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Mencari...
                    </> : <>
                      <Search className="h-4 w-4 mr-2" />
                      Cari User
                    </>}
                </Button>
              </div>
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center mb-6" data-unique-id="400e91db-2874-4d87-a871-66eb8e7c8e4e" data-file-name="components/ReviewUjicoba.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="2a2a8125-52fb-4c46-922e-d9c2206ab9c3" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{error}</span>
            </div>}

          {searchedUser && <div className="bg-green-50 text-green-800 p-3 rounded-md mb-6" data-unique-id="c788a1c4-2abe-4056-8d0d-ff1f0fed3cd8" data-file-name="components/ReviewUjicoba.tsx">
              <h3 className="font-semibold" data-unique-id="a6f154e3-3a23-4b63-8da5-e64f4474d2cf" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="f8cb4700-4224-4ecb-b2b0-23604cbe1f9b" data-file-name="components/ReviewUjicoba.tsx">User ditemukan:</span></h3>
              <p data-unique-id="9289403d-dc55-48b3-bb34-9d07f74069d4" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="558c3d29-a9a0-4240-b95f-6039fd493285" data-file-name="components/ReviewUjicoba.tsx">Username: </span>{searchedUser.username}</p>
              <p data-unique-id="e5a9e0ea-9335-4260-b6d2-6f53a065a536" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="42fcabd5-d66b-485b-93ff-92744c09288a" data-file-name="components/ReviewUjicoba.tsx">Nama: </span>{searchedUser.name || '-'}</p>
              <p data-unique-id="7b66e8f1-411a-4e88-a8c6-7b44ad0cf2e7" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b38d9f4d-8a65-4979-8ea9-e379471191f2" data-file-name="components/ReviewUjicoba.tsx">Total Akses Kategori: 
                </span>{' '}<span className="editable-text" data-unique-id="9894cff4-790c-45ed-8976-aeb3eb162f61" data-file-name="components/ReviewUjicoba.tsx">Audio (</span>{searchedUser.audioCategoryIds?.length || 0}<span className="editable-text" data-unique-id="ed668054-45f3-4cba-b129-224a09abdfdf" data-file-name="components/ReviewUjicoba.tsx">), 
                </span>{' '}<span className="editable-text" data-unique-id="c74d4378-6cfd-420a-99cc-8052d69c0202" data-file-name="components/ReviewUjicoba.tsx">PDF (</span>{searchedUser.pdfCategoryIds?.length || 0}<span className="editable-text" data-unique-id="d3b09890-0628-44c3-8af9-551c682facf1" data-file-name="components/ReviewUjicoba.tsx">), 
                </span>{' '}<span className="editable-text" data-unique-id="39935483-6655-4ae7-8ae5-ec17c4accb09" data-file-name="components/ReviewUjicoba.tsx">Video (</span>{searchedUser.videoCategoryIds?.length || 0}<span className="editable-text" data-unique-id="ae5c6a91-5f98-4b0f-8936-87bbf5b53bc5" data-file-name="components/ReviewUjicoba.tsx">)
              </span></p>
            </div>}

          {(searchedUser || hasSearched) && <Tabs defaultValue="audio" className="w-full" data-unique-id="2613c877-2108-44a8-af26-0c53a2e5e124" data-file-name="components/ReviewUjicoba.tsx">
              <TabsList className="mb-6">
                <TabsTrigger value="audio"><span className="editable-text" data-unique-id="3dff0494-61a3-41d9-947b-b907b491f5b0" data-file-name="components/ReviewUjicoba.tsx">Audio</span></TabsTrigger>
                <TabsTrigger value="pdf"><span className="editable-text" data-unique-id="08994825-a9be-48b9-aaee-b8a560e9cac2" data-file-name="components/ReviewUjicoba.tsx">PDF</span></TabsTrigger>
                <TabsTrigger value="video"><span className="editable-text" data-unique-id="6dd6ea93-8f52-43a5-abf7-32070ec0151d" data-file-name="components/ReviewUjicoba.tsx">Video</span></TabsTrigger>
              </TabsList>
              
              <TabsContent value="audio">
                {searchedUser ? searchedUser.audioCategoryIds && searchedUser.audioCategoryIds.length > 0 ? <AudioPreview filterCategoryIds={searchedUser.audioCategoryIds} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="c3175f09-4052-4d83-b0a7-d34df0d4199f" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="1351efaa-9fa9-4aa2-8a51-0f56769a70d1" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="36657400-125e-48e8-9e99-4eba18fba976" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori audio</span></p>
                      <p data-unique-id="126f5e25-d11b-4df7-a69c-0b454363110a" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="77a78de5-233a-4263-9ee8-7f9afc461015" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori audio manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="a1a60c02-ef64-48b5-aad1-875a54ef48e0" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="a6e6c06f-f75e-4c08-87ef-f7fc7d204c62" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="6d1657c9-2d70-43ad-9c62-ea48405f9169" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
              
              <TabsContent value="pdf">
                {searchedUser ? searchedUser.pdfCategoryIds && searchedUser.pdfCategoryIds.length > 0 ? <UserContentPreview type="pdf" userId={searchedUser.id} categoryIds={searchedUser.pdfCategoryIds} categories={categories} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="b01078c4-311e-46ab-ad69-be70dd13ac47" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="48610650-7cdf-4dd9-8389-565885c7557c" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="1557a097-0af4-4a03-ba04-a3bfc64ebb7f" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori PDF</span></p>
                      <p data-unique-id="bf65d2cf-3311-4b1a-b482-3e68aba5a824" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="6fb18cc4-c1e2-451b-98ef-e39a9232b2c6" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori PDF manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="f422c55c-6ec4-4dd6-99cf-ab6a52acc481" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="01f6ec98-cfa2-4cc2-a942-1a42b2357953" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="d4bc0f38-9bb8-4ba9-b5ae-4bb93da3ebcd" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
              
              <TabsContent value="video">
                {searchedUser ? searchedUser.videoCategoryIds && searchedUser.videoCategoryIds.length > 0 ? <UserContentPreview type="video" userId={searchedUser.id} categoryIds={searchedUser.videoCategoryIds} categories={categories} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="d5d6543b-b69e-4359-b9c3-ab8348c39326" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="57f0c17f-3013-496e-b670-6ec795b1843d" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="2dbd07de-4f11-4cf4-b2e4-969d7ec480f4" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori video</span></p>
                      <p data-unique-id="e0dff186-f10d-4a95-9674-2ea71906ee46" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="9eb96502-405e-48a2-98ac-908cc1550cc7" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori video manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="1a6f5252-4451-4497-8c8f-6f21a893e6cb" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="571d79d2-37fb-4863-bc94-e1030c48d081" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="99f7e607-9776-48ad-b67f-ea04f2c1564a" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
            </Tabs>}

          {!hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="8dac700b-1383-4a9f-9a04-78e03f126500" data-file-name="components/ReviewUjicoba.tsx">
              <p className="text-lg mb-2" data-unique-id="e83d2e1e-ef19-49df-b283-c15c4f086cb3" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="f45ff5fa-bbf5-435b-a5c1-7e29018f7840" data-file-name="components/ReviewUjicoba.tsx">Masukkan username untuk melihat konten</span></p>
              <p data-unique-id="fd43ca09-a71e-44f8-8336-83b0b4224bf4" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="e8cd4efc-e8ff-45ea-a25e-1cac03364c5b" data-file-name="components/ReviewUjicoba.tsx">Ketik username dan klik tombol "Cari User" untuk melihat konten yang tersedia untuk user tersebut</span></p>
            </div>}
        </div>
      </CardContent>
    </Card>;
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
    return <div className="flex justify-center py-8" data-unique-id="343a8d0b-c86a-4261-ac72-0eb5ada53993" data-file-name="components/ReviewUjicoba.tsx">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div data-unique-id="dc08ab78-3a6c-4882-8e0d-58aece10cb8b" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
      <div className="bg-blue-50 text-blue-800 p-3 mb-6 rounded-md" data-unique-id="af87a319-8ae7-4a65-b151-cb806d3ab304" data-file-name="components/ReviewUjicoba.tsx">
        <p className="font-semibold mb-1" data-unique-id="ab020023-357f-4079-ab91-d5ccbfab3328" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="df8de9af-8571-4401-be8b-7e8be7390edb" data-file-name="components/ReviewUjicoba.tsx">Kategori yang dapat diakses:</span></p>
        <p data-unique-id="e98bf9be-207a-43a9-aa9f-8ed9c70a86e2" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{categoryNames || 'Tidak ada kategori akses'}</p>
      </div>

      {type === 'pdf' && <PDFPreview filterCategoryIds={categoryIds} />}
      {type === 'video' && <VideoPreview filterCategoryIds={categoryIds} />}
      {type === 'audio' && <AudioPreview filterCategoryIds={categoryIds} />}
    </div>;
}