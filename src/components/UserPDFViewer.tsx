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
    const subscription = supabase.channel('public:pdfs').on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'pdfs'
    }, () => {
      // Refresh PDFs when changes occur
      fetchPDFs(searchTitle, selectedCategory ? parseInt(selectedCategory) : undefined);
    }).subscribe();
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const fetchCategories = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('categories').select('id, name').order('name');
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
      let query = supabase.from('pdfs').select(`
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
      const {
        data,
        error
      } = await query.order('title');
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
    fetchPDFs(searchTitle || undefined, selectedCategory ? parseInt(selectedCategory) : undefined);
  };
  const resetSearch = () => {
    setSearchTitle('');
    setSelectedCategory('');
    fetchPDFs();
  };
  return <div className="space-y-6" data-unique-id="743c84a4-89bf-498f-9b8d-7c1d3717b727" data-file-name="components/UserPDFViewer.tsx">
      <Card data-unique-id="a3827d92-2c36-4340-acf9-69db47d9f35b" data-file-name="components/UserPDFViewer.tsx">
        <CardHeader data-unique-id="dfa87435-4cde-4c9d-8e76-b77388ab8b41" data-file-name="components/UserPDFViewer.tsx">
          <CardTitle data-unique-id="ae8747d3-d03f-4f40-b42e-e432a146c0a7" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="6bfa7882-7c6e-486a-98fb-c7f1f373558b" data-file-name="components/UserPDFViewer.tsx">Ebook PDF Library</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="4d7ea364-9b60-4bfe-91fd-6499ed00b5f9" data-file-name="components/UserPDFViewer.tsx">
            Browse and read available PDF ebooks
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="bca0f06f-2be0-4bd0-9048-1f2dabb63731" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="88b60213-01e9-40e4-8f44-01cf9d91680c" data-file-name="components/UserPDFViewer.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="cafd07a3-e95c-41fc-ac71-f8e88e644c6b" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="a28beebb-3279-49e3-9255-f5d5785302c0" data-file-name="components/UserPDFViewer.tsx">Search PDFs</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="4d571192-cf88-4daa-a98a-3a1c053e541b" data-file-name="components/UserPDFViewer.tsx">
              <div data-unique-id="07e95532-e984-4eb4-af69-f662ade5eb24" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="8c666b54-21dd-4b46-9095-9445cf4a585b" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="e2b8ba20-adcc-43b1-afcf-22fae254000a" data-file-name="components/UserPDFViewer.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="15af90c4-e96f-4b7e-9c5a-de7aaa6a03c7" data-file-name="components/UserPDFViewer.tsx" />
              </div>
              <div data-unique-id="fe642720-79e0-4ff8-aa5e-2c6cc75c8472" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="fb8f602e-cc19-4262-8f98-c8ff102042db" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="7b3a6812-9264-4c3d-9cb8-68699fc1cfc3" data-file-name="components/UserPDFViewer.tsx">Category</span></Label>
                <select id="searchCategory" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="6d3e1315-36ad-4141-9f7e-feefa9bb62dc" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="a6cb683c-f2ad-4ca8-a1cd-13e8505f2953" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="aaa4a1a0-458f-48c1-9cf3-1c494fe0c2e3" data-file-name="components/UserPDFViewer.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="7b522b45-1d71-4c06-8c15-d5aede981b52" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="072942b5-bb1a-4f5a-baea-a23b9ee5008d" data-file-name="components/UserPDFViewer.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="1b709b1a-9b00-44af-acf3-702952a04ee8" data-file-name="components/UserPDFViewer.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="1e70d8e4-5e39-45f1-8b9a-6315f0b0cddf" data-file-name="components/UserPDFViewer.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="e7aaf4c3-3aa8-4c94-a242-b0771caeb627" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="fab6d771-d437-419a-86d7-f80cf2d962ff" data-file-name="components/UserPDFViewer.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF Grid */}
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="4eceffc2-2d5a-4786-a067-f6a8b2f71e02" data-file-name="components/UserPDFViewer.tsx">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div> : error ? <div className="text-center py-12 text-red-500" data-unique-id="a2944b55-4d50-4ebf-9882-37575f6ce94d" data-file-name="components/UserPDFViewer.tsx">
              <p data-unique-id="952c7aa7-50b9-4f91-80da-c6f25588a3cc" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{error}</p>
            </div> : pdfs.length === 0 ? <div className="text-center py-12 text-muted-foreground" data-unique-id="761e2797-c62f-4af9-b5fc-70b1c3cce09a" data-file-name="components/UserPDFViewer.tsx">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p data-unique-id="0f3d8de6-3e37-4d33-81f8-cc631f7f5315" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="d6c0a5f9-8d16-4e08-8468-f8d106dd8c3e" data-file-name="components/UserPDFViewer.tsx">No PDFs found. Try adjusting your search criteria.</span></p>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-unique-id="444baa27-6daf-4673-91e1-f8f87b61f6b6" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
              {Array.isArray(pdfs) && pdfs.map(pdf => <Card key={pdf.id} className="overflow-hidden flex flex-col h-full" data-is-mapped="true" data-unique-id="4d539162-1bb2-4bcd-913c-a3b0f743e2e2" data-file-name="components/UserPDFViewer.tsx">
                  <div className="aspect-[3/4] relative overflow-hidden" data-is-mapped="true" data-unique-id="76ab89d4-130a-4cdd-a928-2af1f968087a" data-file-name="components/UserPDFViewer.tsx">
                    <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-is-mapped="true" data-unique-id="87c64811-159a-4d9e-97a4-1cbb1229f0f7" data-file-name="components/UserPDFViewer.tsx" />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow" data-is-mapped="true" data-unique-id="2eb750ac-ce79-4909-9999-01c75eb57678" data-file-name="components/UserPDFViewer.tsx">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1" data-is-mapped="true" data-unique-id="a771dce0-953e-4204-994e-a8e6b4c6b626" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{pdf.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4" data-is-mapped="true" data-unique-id="e7d4ccf6-869d-4d15-898d-4ad3406dd255" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {pdf.categoryName || "Uncategorized"}
                    </p>
                    <div className="mt-auto" data-is-mapped="true" data-unique-id="25283665-0f7e-4e2e-8573-5ae8836cf732" data-file-name="components/UserPDFViewer.tsx">
                      <Link href={`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`} passHref data-is-mapped="true" data-unique-id="f25bdcf7-737c-4956-9a44-df2e25f87e10" data-file-name="components/UserPDFViewer.tsx">
                        <Button className="w-full flex items-center gap-2" data-is-mapped="true" data-unique-id="7bbe893c-09cf-4975-8b36-924b7a037577" data-file-name="components/UserPDFViewer.tsx">
                          <FileText className="h-4 w-4" /><span className="editable-text" data-unique-id="26bedd3e-a045-4712-9429-dd892fbdc34c" data-file-name="components/UserPDFViewer.tsx">
                          Read PDF
                        </span></Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>)}
            </div>}
        </CardContent>
      </Card>
    </div>;
}