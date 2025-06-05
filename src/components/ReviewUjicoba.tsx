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
  return <Card data-unique-id="a8cdd083-51c0-4a2c-b344-7b96843b922a" data-file-name="components/ReviewUjicoba.tsx">
      <CardContent className="pt-6" data-unique-id="a2a49351-86ca-48e8-91c8-17186bd1a8cd" data-file-name="components/ReviewUjicoba.tsx">
        <div className="mb-6" data-unique-id="86fc4522-fbe9-4dbf-82f4-0edf33819b93" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
          <h2 className="text-2xl font-semibold mb-2" data-unique-id="cc9e2ba7-c696-4044-8e2f-43aa49150471" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="0a7efc5b-b42b-4dde-94f1-6db2e56b6a5d" data-file-name="components/ReviewUjicoba.tsx">Review Ujicoba</span></h2>
          <p className="text-muted-foreground mb-6" data-unique-id="c4497745-2ddc-4644-b6db-8b54e35a239a" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="37b1df3c-f2dd-48cc-84e6-0d0754da2a89" data-file-name="components/ReviewUjicoba.tsx">
            Lihat konten yang tersedia untuk pengguna tertentu berdasarkan akses kategori mereka
          </span></p>

          <div className="bg-muted p-4 rounded-md mb-6" data-unique-id="7544f7c7-d233-4fa6-aaa1-748b7d343d15" data-file-name="components/ReviewUjicoba.tsx">
            <div className="grid grid-cols-3 gap-4" data-unique-id="7b81337c-9ab2-47e5-a2f4-a2aa2b71fa3c" data-file-name="components/ReviewUjicoba.tsx">
              <div className="col-span-2" data-unique-id="222d3b7b-10b6-4e36-850c-bbfd5d80e642" data-file-name="components/ReviewUjicoba.tsx">
                <Label htmlFor="username" className="block text-sm font-medium mb-1" data-unique-id="56ed5696-e353-464a-b4ae-1ba15d2e0e92" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="d0ce0514-b808-435e-9bd7-2e5ac2a0a21b" data-file-name="components/ReviewUjicoba.tsx">Username</span></Label>
                <Input id="username" placeholder="Masukkan username untuk melihat konten yang tersedia" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }} data-unique-id="18ddc6fb-7246-44cd-99a6-de0ef8157496" data-file-name="components/ReviewUjicoba.tsx" />
              </div>
              <div className="flex items-end" data-unique-id="ebe3e678-0779-463f-808b-23a029431643" data-file-name="components/ReviewUjicoba.tsx">
                <Button onClick={handleSearch} className="w-full" disabled={isSearching} data-unique-id="5244224e-3658-4fe9-8fc5-36f8d7e97296" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
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

          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center mb-6" data-unique-id="510192a9-c8bc-42ae-93e8-fe6139a5bb46" data-file-name="components/ReviewUjicoba.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="8acd8dec-7432-4a1a-a9b8-13ec5a96fc0c" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{error}</span>
            </div>}

          {searchedUser && <div className="bg-green-50 text-green-800 p-3 rounded-md mb-6" data-unique-id="246d357b-6e7c-49ab-afa1-dd96a373588b" data-file-name="components/ReviewUjicoba.tsx">
              <h3 className="font-semibold" data-unique-id="850a89c7-a042-49d0-93d8-d473f4dc2cc9" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="8c14a41b-2765-4c2c-a96b-a4ae244aab8a" data-file-name="components/ReviewUjicoba.tsx">User ditemukan:</span></h3>
              <p data-unique-id="f8656865-0dbe-4598-9b5f-8b71681c17f0" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="cd66d8d2-56d4-4625-8e91-2661e7df6540" data-file-name="components/ReviewUjicoba.tsx">Username: </span>{searchedUser.username}</p>
              <p data-unique-id="86100b45-c7d4-4ed3-939d-4836ecece101" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="115fb072-8a5c-4705-9cb8-e0fcb0684e1e" data-file-name="components/ReviewUjicoba.tsx">Nama: </span>{searchedUser.name || '-'}</p>
              <p data-unique-id="e5d5e175-6c84-4d60-a470-a1de62469b7f" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="fd755261-1763-4227-ab50-369135d535b5" data-file-name="components/ReviewUjicoba.tsx">Total Akses Kategori: 
                </span>{' '}<span className="editable-text" data-unique-id="b9898676-4e08-46cb-b1fe-3a08400656a4" data-file-name="components/ReviewUjicoba.tsx">Audio (</span>{searchedUser.audioCategoryIds?.length || 0}<span className="editable-text" data-unique-id="0f397d3c-f295-48b1-a2e5-18a696fb849c" data-file-name="components/ReviewUjicoba.tsx">), 
                </span>{' '}<span className="editable-text" data-unique-id="ab7ad3c7-a959-42a0-9dfd-727834e86f1d" data-file-name="components/ReviewUjicoba.tsx">PDF (</span>{searchedUser.pdfCategoryIds?.length || 0}<span className="editable-text" data-unique-id="3d2d36ca-a53d-480f-8aef-47fba89dab5a" data-file-name="components/ReviewUjicoba.tsx">), 
                </span>{' '}<span className="editable-text" data-unique-id="b9d95827-65d2-47ca-9708-c9578be7a643" data-file-name="components/ReviewUjicoba.tsx">Video (</span>{searchedUser.videoCategoryIds?.length || 0}<span className="editable-text" data-unique-id="a6605b42-512d-4d4b-b558-34dd05d0dce9" data-file-name="components/ReviewUjicoba.tsx">)
              </span></p>
            </div>}

          {(searchedUser || hasSearched) && <Tabs defaultValue="audio" className="w-full" data-unique-id="bf14dd15-ff9e-41cd-a9cf-ff17020bb10a" data-file-name="components/ReviewUjicoba.tsx">
              <TabsList className="mb-6">
                <TabsTrigger value="audio"><span className="editable-text" data-unique-id="216d4092-3909-4f69-9b66-89511015d25c" data-file-name="components/ReviewUjicoba.tsx">Audio</span></TabsTrigger>
                <TabsTrigger value="pdf"><span className="editable-text" data-unique-id="0d0cb5c2-769b-4730-bcdd-3d60b335a5aa" data-file-name="components/ReviewUjicoba.tsx">PDF</span></TabsTrigger>
                <TabsTrigger value="video"><span className="editable-text" data-unique-id="fb4e3ee6-fbf6-4d2a-a72b-e3cad01d6aac" data-file-name="components/ReviewUjicoba.tsx">Video</span></TabsTrigger>
              </TabsList>
              
              <TabsContent value="audio">
                {searchedUser ? searchedUser.audioCategoryIds && searchedUser.audioCategoryIds.length > 0 ? <AudioPreview filterCategoryIds={searchedUser.audioCategoryIds} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="15666cbe-3e1e-4592-b6d7-5e239d12a52a" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="9201c4d1-bc4e-42a8-9a21-ad97aa8d37fa" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="504900f4-c2a4-4add-a60b-52cd24120856" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori audio</span></p>
                      <p data-unique-id="a0d48cb0-58d2-4f24-ac59-50cd224b1157" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="b4a9a569-2569-45bb-8a99-13f7d081e81e" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori audio manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="c91360bf-0df4-40a2-877d-5674f6c57bd9" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="e3009ad1-1a81-4dde-98b1-5f6cf09cc65a" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="54c10437-162b-42fb-968d-1f1564c6e247" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
              
              <TabsContent value="pdf">
                {searchedUser ? searchedUser.pdfCategoryIds && searchedUser.pdfCategoryIds.length > 0 ? <UserContentPreview type="pdf" userId={searchedUser.id} categoryIds={searchedUser.pdfCategoryIds} categories={categories} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="b84ac6b0-103a-4b4b-b20b-5c7f9cf13acf" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="edd2ecf8-cf6d-438f-bb3e-dae38d03a167" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="f318b980-4e71-4c24-865b-90908a5d8763" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori PDF</span></p>
                      <p data-unique-id="3b8390a9-6f4d-49ef-8dbe-8565a9cfe63e" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="daffa0ab-c7b0-48dd-9384-35a740f927cf" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori PDF manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="b9b02e0a-1900-4ddd-8c06-4376382a4bc0" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="cc370dc2-c616-470e-8884-3c13d30978cf" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="9c8f53d0-1681-44f4-9440-8ebdba1d7bf0" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
              
              <TabsContent value="video">
                {searchedUser ? searchedUser.videoCategoryIds && searchedUser.videoCategoryIds.length > 0 ? <UserContentPreview type="video" userId={searchedUser.id} categoryIds={searchedUser.videoCategoryIds} categories={categories} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="0ae59f24-910a-48c4-8b7c-2b6c9dd4d8a1" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="362d05fe-825e-4027-a537-646f2e67bd48" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="a4eec85e-8cd1-4a5e-b5cf-0f73ad2bab35" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori video</span></p>
                      <p data-unique-id="6c30e267-68dd-4778-a8ad-4b4efb618f0d" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="31749383-f005-44aa-be9d-aa7c3273736a" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori video manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="3dc9d9c7-a50a-4fa5-b32a-dc0ea5f8a3ac" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="c99dc4da-0eaf-4e90-ac5b-0e61086ccee5" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="af3cc02a-c603-46cd-8934-c8980ac30f64" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
            </Tabs>}

          {!hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="f07ebdd0-48bc-4f70-8dc6-d0fdb0aff413" data-file-name="components/ReviewUjicoba.tsx">
              <p className="text-lg mb-2" data-unique-id="f6ddf2d6-4594-44b1-aff8-17d8b7c6db21" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="47db85df-4458-4bce-9a99-d85f2f25681c" data-file-name="components/ReviewUjicoba.tsx">Masukkan username untuk melihat konten</span></p>
              <p data-unique-id="e68dfc3d-f05c-4d12-a705-6c3ef242a772" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="d4b8bc92-b37f-40f2-b36b-251bb249b7b7" data-file-name="components/ReviewUjicoba.tsx">Ketik username dan klik tombol "Cari User" untuk melihat konten yang tersedia untuk user tersebut</span></p>
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
    return <div className="flex justify-center py-8" data-unique-id="4070740a-2aca-4c3c-8896-dfc225163e43" data-file-name="components/ReviewUjicoba.tsx">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div data-unique-id="236d4e3f-0b26-403c-aa37-737fd70fa735" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
      <div className="bg-blue-50 text-blue-800 p-3 mb-6 rounded-md" data-unique-id="506f8c2a-2b8d-488a-bdbe-472af504f4bc" data-file-name="components/ReviewUjicoba.tsx">
        <p className="font-semibold mb-1" data-unique-id="ae4d5e88-76d0-4b87-9a31-23fb75d1183d" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="9203991f-a0d6-437f-84e9-519a55bfd775" data-file-name="components/ReviewUjicoba.tsx">Kategori yang dapat diakses:</span></p>
        <p data-unique-id="4dfa8b4e-e035-4af0-b967-9e53867ecc8d" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{categoryNames || 'Tidak ada kategori akses'}</p>
      </div>

      {type === 'pdf' && <PDFPreview filterCategoryIds={categoryIds} />}
      {type === 'video' && <VideoPreview filterCategoryIds={categoryIds} />}
      {type === 'audio' && <AudioPreview filterCategoryIds={categoryIds} />}
    </div>;
}