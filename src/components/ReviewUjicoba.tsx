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
  return <Card data-unique-id="d48838f6-13d6-45f7-98d2-7d2ba422e274" data-file-name="components/ReviewUjicoba.tsx">
      <CardContent className="pt-6" data-unique-id="1bea4643-7609-43a2-a490-be80963ad226" data-file-name="components/ReviewUjicoba.tsx">
        <div className="mb-6" data-unique-id="40fa6178-ae14-4f0b-b3e9-b678411fdcf3" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
          <h2 className="text-2xl font-semibold mb-2" data-unique-id="09bb4d1b-8224-4124-82fe-ab2b467383d3" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="7108c9d4-f55b-470b-b745-ff0e718d5980" data-file-name="components/ReviewUjicoba.tsx">Review Ujicoba</span></h2>
          <p className="text-muted-foreground mb-6" data-unique-id="5dc95887-169a-40ea-a91a-61e5b45e1d72" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="5ed5a463-11dd-45ac-90d7-2560aab8ce4c" data-file-name="components/ReviewUjicoba.tsx">
            Lihat konten yang tersedia untuk pengguna tertentu berdasarkan akses kategori mereka
          </span></p>

          <div className="bg-muted p-4 rounded-md mb-6" data-unique-id="0053d03c-ae21-4e40-b162-d6f9e4288cd0" data-file-name="components/ReviewUjicoba.tsx">
            <div className="grid grid-cols-3 gap-4" data-unique-id="5d8031db-8b6a-4f08-acf1-a712683cfd19" data-file-name="components/ReviewUjicoba.tsx">
              <div className="col-span-2" data-unique-id="b2b488a1-b475-46fa-919b-34385b0d8bea" data-file-name="components/ReviewUjicoba.tsx">
                <Label htmlFor="username" className="block text-sm font-medium mb-1" data-unique-id="d1bc246f-17ef-498d-92ab-06099fd7ce41" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="7a411119-dd99-4110-973a-0726a7a8f143" data-file-name="components/ReviewUjicoba.tsx">Username</span></Label>
                <Input id="username" placeholder="Masukkan username untuk melihat konten yang tersedia" value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }} data-unique-id="877a99b3-eb82-4673-bd64-ce7958a24ccc" data-file-name="components/ReviewUjicoba.tsx" />
              </div>
              <div className="flex items-end" data-unique-id="593dfa3b-02e2-49f6-bac8-3fe30ad6942a" data-file-name="components/ReviewUjicoba.tsx">
                <Button onClick={handleSearch} className="w-full" disabled={isSearching} data-unique-id="35efec60-68cb-40d4-ba50-35f2dfb02ef6" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
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

          {error && <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center mb-6" data-unique-id="34d4cab7-4706-47ed-b1c4-102ca094ca73" data-file-name="components/ReviewUjicoba.tsx">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span data-unique-id="572e9654-9aab-4c43-b88d-9ff3b278013b" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{error}</span>
            </div>}

          {searchedUser && <div className="bg-green-50 text-green-800 p-3 rounded-md mb-6" data-unique-id="56d68c2c-b0b4-4f86-9460-e0d366e73b8a" data-file-name="components/ReviewUjicoba.tsx">
              <h3 className="font-semibold" data-unique-id="96b3d232-1d28-42b7-988f-ee70fa6e57f2" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="6db22863-a0fa-4b56-8efc-cfa3ca0e8f22" data-file-name="components/ReviewUjicoba.tsx">User ditemukan:</span></h3>
              <p data-unique-id="11a6f290-c892-43a3-ad14-329e35c63e5d" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="7fec9bee-b36f-47f8-a5e7-850bd10f0fe6" data-file-name="components/ReviewUjicoba.tsx">Username: </span>{searchedUser.username}</p>
              <p data-unique-id="17d81e8f-f172-4a63-91eb-a786b1b41fd2" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="b1ac10a0-7a49-46b6-9636-ef1d6a5c3a82" data-file-name="components/ReviewUjicoba.tsx">Nama: </span>{searchedUser.name || '-'}</p>
              <p data-unique-id="c1d348dd-8237-4111-8e76-e714c52f7311" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="756e768b-3aa8-469a-b3df-d22049325bad" data-file-name="components/ReviewUjicoba.tsx">Total Akses Kategori: 
                </span>{' '}<span className="editable-text" data-unique-id="a6c3e493-6bb6-490d-ab08-08db3dd64174" data-file-name="components/ReviewUjicoba.tsx">Audio (</span>{searchedUser.audioCategoryIds?.length || 0}<span className="editable-text" data-unique-id="8fd281cc-c5e0-470e-abe8-f930209a4329" data-file-name="components/ReviewUjicoba.tsx">), 
                </span>{' '}<span className="editable-text" data-unique-id="c7ba2ed0-2cc6-4dfc-989c-466ae7f783e8" data-file-name="components/ReviewUjicoba.tsx">PDF (</span>{searchedUser.pdfCategoryIds?.length || 0}<span className="editable-text" data-unique-id="52cb9a04-48d8-49b3-936d-a9eb633cc8e5" data-file-name="components/ReviewUjicoba.tsx">), 
                </span>{' '}<span className="editable-text" data-unique-id="f128508e-1f5b-4b95-aa4e-fb15bd924b58" data-file-name="components/ReviewUjicoba.tsx">Video (</span>{searchedUser.videoCategoryIds?.length || 0}<span className="editable-text" data-unique-id="e525d7e6-72be-47e3-a148-7d765ab4ca9f" data-file-name="components/ReviewUjicoba.tsx">)
              </span></p>
            </div>}

          {(searchedUser || hasSearched) && <Tabs defaultValue="audio" className="w-full" data-unique-id="eadc421e-ae77-4966-8f94-5a505f668621" data-file-name="components/ReviewUjicoba.tsx">
              <TabsList className="mb-6">
                <TabsTrigger value="audio"><span className="editable-text" data-unique-id="e18a6361-bed5-46be-9101-d570cd0bc73e" data-file-name="components/ReviewUjicoba.tsx">Audio</span></TabsTrigger>
                <TabsTrigger value="pdf"><span className="editable-text" data-unique-id="e34de398-ea2b-4779-85fb-a61e44ce6f87" data-file-name="components/ReviewUjicoba.tsx">PDF</span></TabsTrigger>
                <TabsTrigger value="video"><span className="editable-text" data-unique-id="bd6b819f-38b8-4f3a-b588-8c324f6c5fc7" data-file-name="components/ReviewUjicoba.tsx">Video</span></TabsTrigger>
              </TabsList>
              
              <TabsContent value="audio">
                {searchedUser ? searchedUser.audioCategoryIds && searchedUser.audioCategoryIds.length > 0 ? <AudioPreview filterCategoryIds={searchedUser.audioCategoryIds} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="ba4f4772-ab7e-464b-8b2b-0bd16c223e57" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="eb4e6ee7-fb10-4052-8b65-9b56e459279d" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="9b563ee5-b8e1-4dc4-93a1-fcda6b2b5e4c" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori audio</span></p>
                      <p data-unique-id="befc743a-d10e-4d7c-b565-7da51623d994" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="5ce9b01c-946e-4eaf-b64c-5063da1cd263" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori audio manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="ce12e246-20a1-4343-bb05-a59fe571ab64" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="e16bd977-7f54-4f59-b019-76e9283e3ba9" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="150b521a-1c5d-4c66-8491-af9ff548e192" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
              
              <TabsContent value="pdf">
                {searchedUser ? searchedUser.pdfCategoryIds && searchedUser.pdfCategoryIds.length > 0 ? <UserContentPreview type="pdf" userId={searchedUser.id} categoryIds={searchedUser.pdfCategoryIds} categories={categories} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="69dc23ef-65af-48bf-9c55-bff485dd8ad7" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="3859795c-9af5-4d11-86f8-69980de2d4c5" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="bf60bcea-35c4-4f7a-a5d9-9b4e50d96734" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori PDF</span></p>
                      <p data-unique-id="63418f81-a093-410b-bac4-2851e0b527f9" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="fcb71b03-9d82-4280-a69f-3ee992f951d3" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori PDF manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="ded7098f-9dc6-4de5-a7e2-3c9552174027" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="ad9b66c5-f7e1-41d7-8de2-dbf82b8376cb" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="d3ee5754-cadb-411f-8e8d-539043ab8fe8" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
              
              <TabsContent value="video">
                {searchedUser ? searchedUser.videoCategoryIds && searchedUser.videoCategoryIds.length > 0 ? <UserContentPreview type="video" userId={searchedUser.id} categoryIds={searchedUser.videoCategoryIds} categories={categories} /> : <div className="text-center py-12 text-muted-foreground" data-unique-id="d625f31b-0d84-4290-8f41-ff9a026f6309" data-file-name="components/ReviewUjicoba.tsx">
                      <p className="text-lg mb-2" data-unique-id="1173ff13-b20b-404a-a686-3cb86ade566f" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="a3bc500b-643c-4a1a-a796-d6a2f00ad23a" data-file-name="components/ReviewUjicoba.tsx">Tidak ada akses kategori video</span></p>
                      <p data-unique-id="5ca373f8-aba3-44a3-9cda-0fca63331a78" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="b1db5de5-3c26-4c32-ba71-411256949440" data-file-name="components/ReviewUjicoba.tsx">User ini tidak memiliki akses ke kategori video manapun</span></p>
                    </div> : hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="db40746f-53bd-45ff-aa45-d889fbdc447c" data-file-name="components/ReviewUjicoba.tsx">
                    <p data-unique-id="83c6c018-14ff-4884-9efa-47b94611610c" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="7dad499e-63c5-4cf2-a9d3-a45122721e01" data-file-name="components/ReviewUjicoba.tsx">Silakan cari user terlebih dahulu</span></p>
                  </div>}
              </TabsContent>
            </Tabs>}

          {!hasSearched && <div className="text-center py-12 text-muted-foreground" data-unique-id="ef1b3939-a7dd-443d-b4dd-1445385cfb09" data-file-name="components/ReviewUjicoba.tsx">
              <p className="text-lg mb-2" data-unique-id="e81abd1d-fdaa-4ac6-8bfd-f85be4c2a54c" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="5b752393-32ec-461a-8ec3-76dd8ac0be2c" data-file-name="components/ReviewUjicoba.tsx">Masukkan username untuk melihat konten</span></p>
              <p data-unique-id="6cb28f79-06af-428b-8ecb-e4e712471ed4" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="a2b48393-5d6c-4201-8459-632f975b2bf3" data-file-name="components/ReviewUjicoba.tsx">Ketik username dan klik tombol "Cari User" untuk melihat konten yang tersedia untuk user tersebut</span></p>
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
    return <div className="flex justify-center py-8" data-unique-id="9b84db63-107b-4f0c-a1a7-f535b87ba0f8" data-file-name="components/ReviewUjicoba.tsx">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  return <div data-unique-id="5de95ffd-6687-4a11-a6b3-602b1fd595c8" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">
      <div className="bg-blue-50 text-blue-800 p-3 mb-6 rounded-md" data-unique-id="8baf2d66-5d2d-4eda-a0be-968c7c3e13bc" data-file-name="components/ReviewUjicoba.tsx">
        <p className="font-semibold mb-1" data-unique-id="4e5fed06-ed68-43cb-bdc2-ea8c42ccb37a" data-file-name="components/ReviewUjicoba.tsx"><span className="editable-text" data-unique-id="b2b618a1-3831-4ddd-8874-63c8ca6ec371" data-file-name="components/ReviewUjicoba.tsx">Kategori yang dapat diakses:</span></p>
        <p data-unique-id="44bea19b-1174-4c8f-9e46-79952e8d8269" data-file-name="components/ReviewUjicoba.tsx" data-dynamic-text="true">{categoryNames || 'Tidak ada kategori akses'}</p>
      </div>

      {type === 'pdf' && <PDFPreview filterCategoryIds={categoryIds} />}
      {type === 'video' && <VideoPreview filterCategoryIds={categoryIds} />}
      {type === 'audio' && <AudioPreview filterCategoryIds={categoryIds} />}
    </div>;
}