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
  return <Card data-unique-id="567b22fd-6262-4f98-85ee-132a16513553" data-file-name="components/ReviewUjicoba.tsx">
      <CardContent className="pt-6" data-unique-id="7e7c455c-4d06-4d2f-82d4-a702d53d4e9f" data-file-name="components/ReviewUjicoba.tsx">
        <div className="mb-6" data-unique-id="26654778-3ce2-4aa2-8012-35d1229754d0" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
          <h2 className="text-2xl font-semibold mb-2" data-unique-id="4f09222a-62c5-4fa5-9ab2-68931755b3f5" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="06b30467-c40d-4fa1-a3a5-59d181b31fbd" data-file-name="components/ReviewUjicoba.tsx">Review Ujicoba</span></h2>
          <p className="text-muted-foreground mb-6" data-unique-id="a7c359ea-437c-467b-8ec5-c6dcbf62a225" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="7e27cfa8-57ef-41c5-98ff-68d77d38736b" data-file-name="components/ReviewUjicoba.tsx">
            Lihat konten yang tersedia untuk pengguna tertentu berdasarkan akses kategori mereka
          </span></p>

          <div className="bg-muted p-4 rounded-md mb-6" data-unique-id="16210d6b-95b7-4103-8589-c6dcba92f52f" data-file-name="components/ReviewUjicoba.tsx">
            <div className="grid grid-cols-3 gap-4" data-unique-id="abc4a275-40f7-4c3a-87bc-efa8acade90f" data-file-name="components/ReviewUjicoba.tsx">
              <div className="col-span-2" data-unique-id="9c20ef6e-1499-4477-bd9a-755fb0293e8b" data-file-name="components/ReviewUjicoba.tsx">
                <Label htmlFor="username" className="block text-sm font-medium mb-1" data-unique-id="c9a70226-96d0-4899-82fc-9ec47f8e0083" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="62316431-669b-4116-96ad-17756f27337e" data-file-name="components/ReviewUjicoba.tsx">Username</span></Label>
                <Input id="username" placeholder="Masukkan username untuk melihat konten yang tersedia" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }} data-unique-id="1a9948b5-3756-4ea0-b5a3-f2939c868a4a" data-file-name="components/ReviewUjicoba.tsx" />
              </div>
              <div className="flex items-end" data-unique-id="d65c4aad-27a6-4170-b4d2-7a04598d8a04" data-file-name="components/ReviewUjicoba.tsx">
                <Button onClick={handleSearch} className="w-full" disabled={isSearching} data-unique-id="b04d5dd5-afd5-477b-adde-98505bdf6e6f" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
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

          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center mb-6" data-unique-id="ed4af908-d8bb-4364-bf19-c3d2014c2c98" data-file-name="components/ReviewUjicoba.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="33771d8a-c286-4ac5-ae4d-489f473950d5" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{error}</span>
            </div>}

          {searchedUser && <div className="bg-green-50 text-green-800 p-3 rounded-md mb-6" data-unique-id="5e752561-7c02-4e42-bdca-dfb418f8cf00" data-file-name="components/ReviewUjicoba.tsx">
              <h3 className="font-semibold" data-unique-id="3b28bb49-e3eb-4f10-920f-919e61a08052" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="d54fca1b-bc50-4651-bce4-fbbc70816ce8" data-file-name="components/ReviewUjicoba.tsx">User ditemukan:</span></h3>
              <p data-unique-id="0bc00a12-c8f3-4db0-bbeb-14a400dc195b" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="26380aef-85bd-4414-94fa-2767b53ff814" data-file-name="components/ReviewUjicoba.tsx">Username: </span>{searchedUser.username}</p>
              <p data-unique-id="1b3ec2ea-32ac-42e0-a67f-9e0b91ca06cd" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6f8e2004-a5ea-4fba-838b-838ac89b1b6c" data-file-name="components/ReviewUjicoba.tsx">Nama: </span>{searchedUser.name || '-'}</p>
              <p data-unique-id="4e24a018-cb4d-47dc-b46f-16280f8e2a35" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="482a0d3d-9609-4285-b0bd-08c27432c5f6" data-file-name="components/ReviewUjicoba.tsx">Total Akses Kategori: 
                </span>{' '}<span className="editable-text" data-unique-id="4d83b49f-d009-4d0e-984b-20795533da77" data-file-name="components/ReviewUjicoba.tsx">Audio (</span>{searchedUser.audioCategoryIds?.length || 0}<span className="editable-text" data-unique-id="31732db6-8c54-4d95-8e85-74312888cdaf" data-file-name="components/ReviewUjicoba.tsx">), 
                </span>{' '}<span className="editable-text" data-unique-id="644be918-95bf-46cc-804b-826ac1f59346" data-file-name="components/ReviewUjicoba.tsx">PDF (</span>{searchedUser.pdfCategoryIds?.length || 0}<span className="editable-text" data-unique-id="2b7b1fb2-c6e1-49c4-b81b-d3a88e1c8384" data-file-name="components/ReviewUjicoba.tsx">), 
                </span>{' '}<span className="editable-text" data-unique-id="48ee6fc7-7f46-4a17-84e1-2bba5bb98a62" data-file-name="components/ReviewUjicoba.tsx">Video (</span>{searchedUser.videoCategoryIds?.length || 0}<span className="editable-text" data-unique-id="6aadafcc-b979-4d71-b6bf-9c015bf22385" data-file-name="components/ReviewUjicoba.tsx">)
              </span></p>
            </div>}

          {(searchedUser || hasSearched) && <Tabs defaultValue="audio" className="w-full" data-unique-id="3e4f8c62-6258-47a9-8bde-9751313ee99d" data-file-name="components/ReviewUjicoba.tsx">
              <TabsList className="mb-6">
                <TabsTrigger value="audio"><span className="editable-text" data-unique-id="42325f66-6b26-4170-a1b0-23e5a5162234" data-file-name="components/ReviewUjicoba.tsx">Audio</span></TabsTrigger>
                <TabsTrigger value="pdf"><span className="editable-text" data-unique-id="fe853f6e-e317-4798-924f-00a99f2172c1" data-file-name="components/ReviewUjicoba.tsx">PDF</span></TabsTrigger>
                <TabsTrigger value="video"><span className="editable-text" data-unique-id="04f0231d-7467-4f98-bfe5-683317b8d997" data-file-name="components/ReviewUjicoba.tsx">Video</span></TabsTrigger>
              </TabsList>
              
              <TabsContent value="audio">
                {searchedUser ? searchedUser.audioCategoryIds && searchedUser.audioCategoryIds.length > 0 ? <AudioPreview filterCategoryIds={searchedUser.audioCategoryIds} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="8dd7900e-08cd-403a-8699-0799f738cd61" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="da8eaae4-1530-4df1-a487-fd42e4c01a0f" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="079408af-09b3-4a42-8016-4fdc5283db19" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori audio</span></p>
                      <p data-unique-id="70ffbcd4-d719-488f-91ce-e7360faa5b5d" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="f06e98f5-7063-4b8f-891d-f1189b20316a" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori audio manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="a1ea4317-037d-4202-a45c-e35c9788f1da" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="2d67a886-cd66-48bd-9988-92e4ee7da853" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="e24ce4f2-0c40-4ab0-91d1-4b47a620ff1f" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
              
              <TabsContent value="pdf">
                {searchedUser ? searchedUser.pdfCategoryIds && searchedUser.pdfCategoryIds.length > 0 ? <UserContentPreview type="pdf" userId={searchedUser.id} categoryIds={searchedUser.pdfCategoryIds} categories={categories} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="41015d80-6225-4335-a7f2-8b60121a2244" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="533d7611-a79e-4105-b750-43f09c32b176" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="bcff30b3-edb4-4b76-8174-5e812388a160" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori PDF</span></p>
                      <p data-unique-id="cf656f14-5934-4480-86f7-92aea08415c5" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="b736ef1a-a686-4843-b447-8cfcb453c579" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori PDF manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="e2aeea52-5d8a-4834-923c-ad94b6256d7a" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="f14360ad-776b-473a-96e7-99f486f21521" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="611ba5d6-bdc0-4748-a137-483fcc9850e5" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
              
              <TabsContent value="video">
                {searchedUser ? searchedUser.videoCategoryIds && searchedUser.videoCategoryIds.length > 0 ? <UserContentPreview type="video" userId={searchedUser.id} categoryIds={searchedUser.videoCategoryIds} categories={categories} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="ec97211a-2799-4fb7-9a81-2e5d3bc65f7b" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="0ebfd1c5-55b6-4048-8b9d-c3d47457284c" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="583aca2f-34c6-4e2b-9670-29a68e12796b" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori video</span></p>
                      <p data-unique-id="22caac06-5251-46f0-b782-2eac80f6eace" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="7fe01739-a2e9-4b2c-8014-54e583c8df20" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori video manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="4e343d60-0a04-4dad-8422-b99ac3d338bd" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="73a7c99e-67f2-4e2e-9f20-9a9a4f9b4b2a" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="ded0a749-ea47-4de7-b7fb-5343d847956f" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
            </Tabs>}

          {!hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="b61780aa-d57c-4ac7-99ff-6130bd0ab7b1" data-file-name="components/ReviewUjicoba.tsx">
              <p className="text-lg mb-2" data-unique-id="66eecca7-48af-4e95-b6e5-1f4bae684a01" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="20cb6784-cf38-4e4d-80ab-af76ceac8dd2" data-file-name="components/ReviewUjicoba.tsx">Masukkan username untuk melihat konten</span></p>
              <p data-unique-id="b0a5bcfa-b6e2-45a2-a18a-d01e948273dd" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="8dc46e17-06ef-4357-8c75-f736a186ca88" data-file-name="components/ReviewUjicoba.tsx">Ketik username dan klik tombol "Cari User" untuk melihat konten yang tersedia untuk user tersebut</span></p>
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
    return <div className="flex justify-center py-8" data-unique-id="c1e221db-e883-4a2e-b7f3-5ffc3843f9e7" data-file-name="components/ReviewUjicoba.tsx">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div data-unique-id="d4992f17-61a2-43ad-b17e-06d2141c43b0" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
      <div className="bg-blue-50 text-blue-800 p-3 mb-6 rounded-md" data-unique-id="159651b2-0445-45d0-b899-e570230f1687" data-file-name="components/ReviewUjicoba.tsx">
        <p className="font-semibold mb-1" data-unique-id="fdf1e657-7e89-4a24-a786-32eefe584662" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="60cc7a71-6ddc-4138-8247-cc9418df2c3e" data-file-name="components/ReviewUjicoba.tsx">Kategori yang dapat diakses:</span></p>
        <p data-unique-id="7c52f95c-1b97-47e0-8920-0ac4cd02d811" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{categoryNames || 'Tidak ada kategori akses'}</p>
      </div>

      {type === 'pdf' && <PDFPreview filterCategoryIds={categoryIds} />}
      {type === 'video' && <VideoPreview filterCategoryIds={categoryIds} />}
      {type === 'audio' && <AudioPreview filterCategoryIds={categoryIds} />}
    </div>;
}