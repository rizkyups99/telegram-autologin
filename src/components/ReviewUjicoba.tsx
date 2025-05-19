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
      const user = Array.isArray(users) 
        ? users.find(u => u.username.toLowerCase() === username.trim().toLowerCase())
        : null;

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

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Review Ujicoba</h2>
          <p className="text-muted-foreground mb-6">
            Lihat konten yang tersedia untuk pengguna tertentu berdasarkan akses kategori mereka
          </p>

          <div className="bg-muted p-4 rounded-md mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <Label htmlFor="username" className="block text-sm font-medium mb-1">Username</Label>
                <Input
                  id="username"
                  placeholder="Masukkan username untuk melihat konten yang tersedia"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                />
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  className="w-full"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Mencari...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Cari User
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-800 p-3 rounded-md flex items-center mb-6">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {searchedUser && (
            <div className="bg-green-50 text-green-800 p-3 rounded-md mb-6">
              <h3 className="font-semibold">User ditemukan:</h3>
              <p>Username: {searchedUser.username}</p>
              <p>Nama: {searchedUser.name || '-'}</p>
              <p>Total Akses Kategori: 
                {' '}Audio ({searchedUser.audioCategoryIds?.length || 0}), 
                {' '}PDF ({searchedUser.pdfCategoryIds?.length || 0}), 
                {' '}Video ({searchedUser.videoCategoryIds?.length || 0})
              </p>
            </div>
          )}

          {(searchedUser || hasSearched) && (
            <Tabs defaultValue="audio" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="audio">Audio</TabsTrigger>
                <TabsTrigger value="pdf">PDF</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
              </TabsList>
              
              <TabsContent value="audio">
                {searchedUser ? (
                  searchedUser.audioCategoryIds && searchedUser.audioCategoryIds.length > 0 ? (
                    <AudioPreview filterCategoryIds={searchedUser.audioCategoryIds} />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg mb-2">Tidak ada akses kategori audio</p>
                      <p>User ini tidak memiliki akses ke kategori audio manapun</p>
                    </div>
                  )
                ) : hasSearched && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Silakan cari user terlebih dahulu</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="pdf">
                {searchedUser ? (
                  searchedUser.pdfCategoryIds && searchedUser.pdfCategoryIds.length > 0 ? (
                    <UserContentPreview 
                      type="pdf"
                      userId={searchedUser.id}
                      categoryIds={searchedUser.pdfCategoryIds}
                      categories={categories}
                    />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg mb-2">Tidak ada akses kategori PDF</p>
                      <p>User ini tidak memiliki akses ke kategori PDF manapun</p>
                    </div>
                  )
                ) : hasSearched && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Silakan cari user terlebih dahulu</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="video">
                {searchedUser ? (
                  searchedUser.videoCategoryIds && searchedUser.videoCategoryIds.length > 0 ? (
                    <UserContentPreview 
                      type="video"
                      userId={searchedUser.id}
                      categoryIds={searchedUser.videoCategoryIds}
                      categories={categories}
                    />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p className="text-lg mb-2">Tidak ada akses kategori video</p>
                      <p>User ini tidak memiliki akses ke kategori video manapun</p>
                    </div>
                  )
                ) : hasSearched && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p>Silakan cari user terlebih dahulu</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          {!hasSearched && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">Masukkan username untuk melihat konten</p>
              <p>Ketik username dan klik tombol "Cari User" untuk melihat konten yang tersedia untuk user tersebut</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface UserContentPreviewProps {
  type: 'audio' | 'pdf' | 'video';
  userId: number;
  categoryIds: number[];
  categories: Category[];
}

function UserContentPreview({ type, userId, categoryIds, categories }: UserContentPreviewProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Get category names for display
  const categoryNames = categories
    .filter(category => categoryIds.includes(category.id))
    .map(category => category.name)
    .join(', ');

  useEffect(() => {
    // Brief loading state for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="bg-blue-50 text-blue-800 p-3 mb-6 rounded-md">
        <p className="font-semibold mb-1">Kategori yang dapat diakses:</p>
        <p>{categoryNames || 'Tidak ada kategori akses'}</p>
      </div>

      {type === 'pdf' && <PDFPreview filterCategoryIds={categoryIds} />}
      {type === 'video' && <VideoPreview filterCategoryIds={categoryIds} />}
      {type === 'audio' && <AudioPreview filterCategoryIds={categoryIds} />}
    </div>
  );
}
