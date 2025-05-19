'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Search, FileText, Loader } from 'lucide-react';
import Link from 'next/link';

interface PDF {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}

interface Category {
  id: number;
  name: string;
}

export default function UserPDFViewer() {
  const [pdfs, setPDFs] = useState<PDF[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
    fetchPDFs();

    // Set up real-time subscription for PDF updates
    const subscription = supabase
      .channel('public:pdfs')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'pdfs'
        }, 
        () => {
          // Refresh PDFs when changes occur
          fetchPDFs(searchTitle, selectedCategory ? parseInt(selectedCategory) : undefined);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('Failed to load categories');
    }
  };

  const fetchPDFs = async (title?: string, categoryId?: number) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('pdfs')
        .select(`
          id, 
          title, 
          coverUrl, 
          fileUrl, 
          categoryId,
          categories(name)
        `);
      
      if (title) {
        query = query.ilike('title', `%${title}%`);
      }
      
      if (categoryId) {
        query = query.eq('categoryId', categoryId);
      }
      
      const { data, error } = await query.order('title');
      
      if (error) throw error;
      
      // Transform data to include categoryName
      const transformedData = data.map(item => ({
        id: item.id,
        title: item.title,
        coverUrl: item.coverUrl,
        fileUrl: item.fileUrl,
        categoryId: item.categoryId,
        categoryName: item.categories && typeof item.categories === 'object' && 'name' in item.categories ? item.categories.name as string : undefined
      }));
      
      setPDFs(transformedData);
    } catch (err) {
      console.error('Error fetching PDFs:', err);
      setError('Failed to load PDFs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchPDFs(
      searchTitle || undefined, 
      selectedCategory ? parseInt(selectedCategory) : undefined
    );
  };

  const resetSearch = () => {
    setSearchTitle('');
    setSelectedCategory('');
    fetchPDFs();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ebook PDF Library</CardTitle>
          <CardDescription>
            Browse and read available PDF ebooks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md">
            <h3 className="text-lg font-medium mb-4">Search PDFs</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1">Title</Label>
                <Input
                  id="searchTitle"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="Search by title"
                />
              </div>
              <div>
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1">Category</Label>
                <select
                  id="searchCategory"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end space-x-2">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search
                </Button>
                <Button variant="outline" onClick={resetSearch}>
                  Reset
                </Button>
              </div>
            </div>
          </div>

          {/* PDF Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <p>{error}</p>
            </div>
          ) : pdfs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No PDFs found. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.isArray(pdfs) && pdfs.map((pdf) => (
                <Card key={pdf.id} className="overflow-hidden flex flex-col h-full">
                  <div className="aspect-[3/4] relative overflow-hidden">
                    <img 
                      src={pdf.coverUrl} 
                      alt={pdf.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1">{pdf.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {pdf.categoryName || "Uncategorized"}
                    </p>
                    <div className="mt-auto">
                      <Link href={`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`} passHref>
                        <Button className="w-full flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Read PDF
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
