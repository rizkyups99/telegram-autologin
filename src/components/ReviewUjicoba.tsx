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
  return <Card data-unique-id="6352302a-2b3b-43ba-a73b-c482e3e5b754" data-file-name="components/ReviewUjicoba.tsx">
      <CardContent className="pt-6" data-unique-id="9e83b707-e3ca-4a04-89b9-5abfd38dbcf7" data-file-name="components/ReviewUjicoba.tsx">
        <div className="mb-6" data-unique-id="7ad7c24d-96cd-49b6-b2a7-8cceca2de98b" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
          <h2 className="text-2xl font-semibold mb-2" data-unique-id="8ce72d92-a043-4d39-9bf8-1e50ab94d059" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="17774049-312f-43cf-aef7-ee9031ea050b" data-file-name="components/ReviewUjicoba.tsx">Review Ujicoba</span></h2>
          <p className="text-muted-foreground mb-6" data-unique-id="f6a207f4-1884-4864-9111-375654055c3d" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="6c3677af-fc86-4be3-be60-0ca9c4a13ef4" data-file-name="components/ReviewUjicoba.tsx">
            Lihat konten yang tersedia untuk pengguna tertentu berdasarkan akses kategori mereka
          </span></p>

          <div className="bg-muted p-4 rounded-md mb-6" data-unique-id="143de47e-2c09-4992-ad69-db63cedaa863" data-file-name="components/ReviewUjicoba.tsx">
            <div className="grid grid-cols-3 gap-4" data-unique-id="32728502-7c9c-4d0e-a365-3891c1fb6cf0" data-file-name="components/ReviewUjicoba.tsx">
              <div className="col-span-2" data-unique-id="213d2fbe-795b-44a1-9021-923ead4d4289" data-file-name="components/ReviewUjicoba.tsx">
                <Label htmlFor="username" className="block text-sm font-medium mb-1" data-unique-id="6032a125-2f5b-4dd8-926d-36797ec86477" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="dc968561-01f3-4838-b0dd-61b8d5e8873f" data-file-name="components/ReviewUjicoba.tsx">Username</span></Label>
                <Input id="username" placeholder="Masukkan username untuk melihat konten yang tersedia" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }} data-unique-id="1094a52a-c540-4e38-9892-83985a982685" data-file-name="components/ReviewUjicoba.tsx" />
              </div>
              <div className="flex items-end" data-unique-id="a3fa807a-7fa9-46cb-b09a-454934e7ffda" data-file-name="components/ReviewUjicoba.tsx">
                <Button onClick={handleSearch} className="w-full" disabled={isSearching} data-unique-id="be8bdb9a-dd2b-4330-8786-6e11a6cba4e2" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
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

          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center mb-6" data-unique-id="0ca83949-f288-43ad-a76e-ed6bb33d4041" data-file-name="components/ReviewUjicoba.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="ab3759e2-ccef-4373-9784-55c8520c00f7" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{error}</span>
            </div>}

          {searchedUser && <div className="bg-green-50 text-green-800 p-3 rounded-md mb-6" data-unique-id="4f7b5e2c-3cbe-4cc0-be68-d54696e24bf6" data-file-name="components/ReviewUjicoba.tsx">
              <h3 className="font-semibold" data-unique-id="a93c52fb-697c-441f-bd07-8560c31e0524" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="56335174-129f-4432-81e2-5d58b4556e2a" data-file-name="components/ReviewUjicoba.tsx">User ditemukan:</span></h3>
              <p data-unique-id="52ab2f36-3f40-4455-9948-0ef9a99bb4d6" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="edd2d379-c3ce-49c6-8eeb-b8a472c26152" data-file-name="components/ReviewUjicoba.tsx">Username: </span>{searchedUser.username}</p>
              <p data-unique-id="9c25db45-a558-4c85-8a43-f164676d7bd6" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="82a257ee-4e88-45bd-9521-526ffd4ae95f" data-file-name="components/ReviewUjicoba.tsx">Nama: </span>{searchedUser.name || '-'}</p>
              <p data-unique-id="9c78cd26-3c5e-4902-92ca-9a0245373d01" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="01b0a1e1-af56-4d2d-9505-674097d129d5" data-file-name="components/ReviewUjicoba.tsx">Total Akses Kategori: 
                </span>{' '}<span className="editable-text" data-unique-id="20a717d9-40e5-4c82-b815-49190bbc3ed2" data-file-name="components/ReviewUjicoba.tsx">Audio (</span>{searchedUser.audioCategoryIds?.length || 0}<span className="editable-text" data-unique-id="0a5bd960-4330-43f8-9299-63cd4e4b52bf" data-file-name="components/ReviewUjicoba.tsx">), 
                </span>{' '}<span className="editable-text" data-unique-id="ec2cd2da-0810-4e54-b144-36c8aa7456b6" data-file-name="components/ReviewUjicoba.tsx">PDF (</span>{searchedUser.pdfCategoryIds?.length || 0}<span className="editable-text" data-unique-id="3c6ab5c4-d524-43ad-8a8a-6f36a99e4b97" data-file-name="components/ReviewUjicoba.tsx">), 
                </span>{' '}<span className="editable-text" data-unique-id="0612985e-72c5-4312-ac50-15dc0f17e3dc" data-file-name="components/ReviewUjicoba.tsx">Video (</span>{searchedUser.videoCategoryIds?.length || 0}<span className="editable-text" data-unique-id="7de4733e-5817-4b73-b33b-6e8ebe910f97" data-file-name="components/ReviewUjicoba.tsx">)
              </span></p>
            </div>}

          {(searchedUser || hasSearched) && <Tabs defaultValue="audio" className="w-full" data-unique-id="8beb0db0-4ee9-4b14-b607-e67c9beb1a4f" data-file-name="components/ReviewUjicoba.tsx">
              <TabsList className="mb-6">
                <TabsTrigger value="audio"><span className="editable-text" data-unique-id="d804a994-d792-4d45-bc22-76cb64d3d0ad" data-file-name="components/ReviewUjicoba.tsx">Audio</span></TabsTrigger>
                <TabsTrigger value="pdf"><span className="editable-text" data-unique-id="c2e89737-019e-49f2-8af4-1ea1d1895155" data-file-name="components/ReviewUjicoba.tsx">PDF</span></TabsTrigger>
                <TabsTrigger value="video"><span className="editable-text" data-unique-id="bbfccbcd-a8d4-48ce-bfbd-71fc2c5d38a6" data-file-name="components/ReviewUjicoba.tsx">Video</span></TabsTrigger>
              </TabsList>
              
              <TabsContent value="audio">
                {searchedUser ? searchedUser.audioCategoryIds && searchedUser.audioCategoryIds.length > 0 ? <AudioPreview filterCategoryIds={searchedUser.audioCategoryIds} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="77022687-be5f-4e3c-b1f8-19988559219c" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="cfb91d56-ab2e-4a53-b443-1b8474866411" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="43752b48-a383-44fd-b27e-02477b9a66b5" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori audio</span></p>
                      <p data-unique-id="283f714a-7310-4568-b3ff-751a5fc3fcc5" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="86099d08-d442-48d8-b777-d24ee0720cc6" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori audio manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="47a405df-79d0-47e3-94e1-7b0b9532f20e" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="a6c10306-ef92-4702-9346-3ac861e99cdf" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="d67f47d4-2ca1-4ccd-bfe7-9dea296abcee" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
              
              <TabsContent value="pdf">
                {searchedUser ? searchedUser.pdfCategoryIds && searchedUser.pdfCategoryIds.length > 0 ? <UserContentPreview type="pdf" userId={searchedUser.id} categoryIds={searchedUser.pdfCategoryIds} categories={categories} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="4f33213b-395b-4103-85e9-67262a1616ce" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="844b50cb-a75a-49f2-91bb-839210d109bb" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="a3ad2a0a-a9ff-4f4b-bd09-a9173a62553c" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori PDF</span></p>
                      <p data-unique-id="51b3d147-a33a-40f3-9ead-184cc1023032" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="af98d1c4-dc18-4ca0-87ff-581628838e38" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori PDF manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="f108ba31-2c2f-472c-b17a-f0e98bac3ef3" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="d52d13b2-2b02-4e13-ba13-d024495d981c" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="15ceae49-5577-4b17-ba3e-4bf9250c089f" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
              
              <TabsContent value="video">
                {searchedUser ? searchedUser.videoCategoryIds && searchedUser.videoCategoryIds.length > 0 ? <UserContentPreview type="video" userId={searchedUser.id} categoryIds={searchedUser.videoCategoryIds} categories={categories} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="573ee87d-b23e-49d9-bdb2-cd0a012c490f" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="b192daf4-e6c8-441c-b83f-007c375d4205" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="29495f07-260f-4018-b8b0-76772e881351" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori video</span></p>
                      <p data-unique-id="1bd0b78d-6fef-43d0-9f06-d39f14c384e5" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="2a55b73a-64b7-4958-8f92-88fffd359aa3" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori video manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="d968656b-9f0a-4fef-8a01-bb0a364dd4c6" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="7d5507dd-6f9a-49f7-8f56-6cfbfb09d6a9" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="34cc1795-13fa-4144-a3a7-cfb25fd03180" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
            </Tabs>}

          {!hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="ffe3af87-516d-4381-84c9-072f123eb0ce" data-file-name="components/ReviewUjicoba.tsx">
              <p className="text-lg mb-2" data-unique-id="5a5ba0f9-c0a8-428a-afe2-d0f3eea59948" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="b7eab7a4-da3e-41c9-a07a-c6adec42615c" data-file-name="components/ReviewUjicoba.tsx">Masukkan username untuk melihat konten</span></p>
              <p data-unique-id="d7a3572a-faaf-401c-9ae8-c1741bcde28b" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="7636187a-5673-414e-aa1f-ea8fe16a86d6" data-file-name="components/ReviewUjicoba.tsx">Ketik username dan klik tombol "Cari User" untuk melihat konten yang tersedia untuk user tersebut</span></p>
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
    return <div className="flex justify-center py-8" data-unique-id="c3781fd1-c277-4738-8412-5069c6fcb1ea" data-file-name="components/ReviewUjicoba.tsx">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div data-unique-id="0f947693-6b8b-4584-9c4f-bf2fae132ffd" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
      <div className="bg-blue-50 text-blue-800 p-3 mb-6 rounded-md" data-unique-id="1004c098-711b-4fc2-92e4-851ae2e30fa2" data-file-name="components/ReviewUjicoba.tsx">
        <p className="font-semibold mb-1" data-unique-id="3808237c-e03e-4c09-a4c7-571eebbb81c7" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="b9da15fb-861f-42df-b111-4dfa83147567" data-file-name="components/ReviewUjicoba.tsx">Kategori yang dapat diakses:</span></p>
        <p data-unique-id="361c4895-d614-45e1-94ce-e4ef441bc5d1" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{categoryNames || 'Tidak ada kategori akses'}</p>
      </div>

      {type === 'pdf' && <PDFPreview filterCategoryIds={categoryIds} />}
      {type === 'video' && <VideoPreview filterCategoryIds={categoryIds} />}
      {type === 'audio' && <AudioPreview filterCategoryIds={categoryIds} />}
    </div>;
}