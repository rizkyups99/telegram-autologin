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
  return <div className="space-y-6" data-unique-id="6adc791e-d838-47b1-9423-5b6054035370" data-file-name="components/UserPDFViewer.tsx">
      <Card data-unique-id="c3838193-d01a-4694-b15c-f744aee7fa44" data-file-name="components/UserPDFViewer.tsx">
        <CardHeader data-unique-id="14a4f480-3338-4ba2-b813-4b33926d8e1d" data-file-name="components/UserPDFViewer.tsx">
          <CardTitle data-unique-id="991c452d-be5c-42f5-b2c1-f10d55662bcb" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="55dcc6f2-ca02-4c4b-add7-440b21259ccd" data-file-name="components/UserPDFViewer.tsx">Ebook PDF Library</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="b0a5cb38-f843-42f3-946a-aa2633f0ef6a" data-file-name="components/UserPDFViewer.tsx">
            Browse and read available PDF ebooks
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="00e44423-1e3c-4aeb-a863-afc53d521ba3" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="e364783e-f424-4e44-a9d3-6a1543e78908" data-file-name="components/UserPDFViewer.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="bcb4ba1a-2982-411e-b997-1da61ee210d4" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="00c6bedb-7498-40b3-a31f-463234b351da" data-file-name="components/UserPDFViewer.tsx">Search PDFs</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="10ac7ac7-415d-408d-9d5b-7011f66d685e" data-file-name="components/UserPDFViewer.tsx">
              <div data-unique-id="7cfba7a1-a4a3-4acc-91c8-e07eed500e5f" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="731f01ce-f5a0-4b56-99d0-8de1d4199dee" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="6ae3f263-ab94-4092-a94f-7d2d74a79bf9" data-file-name="components/UserPDFViewer.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="0da1b4ac-54cb-4316-8696-af6387b1a9d5" data-file-name="components/UserPDFViewer.tsx" />
              </div>
              <div data-unique-id="d5d6cc34-a0d6-4221-a3ee-040b79cab25b" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="2f243da3-32e9-4c27-a389-0d3f44a33156" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="6e70a108-e435-43d0-b56e-4da14da53fe4" data-file-name="components/UserPDFViewer.tsx">Category</span></Label>
                <select id="searchCategory" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="006a456a-54a8-4cd0-b2c6-a5f620190d76" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="20240492-bd55-4b80-8082-0a7b00639c6d" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="27bb5b32-4e34-4b00-b303-1f45d9214620" data-file-name="components/UserPDFViewer.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="8ece526b-f42c-4e53-88ca-47bde5ffbf6c" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="83912fcf-8e7d-458f-80e9-57642c66c801" data-file-name="components/UserPDFViewer.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="653f4c05-c93d-4da1-8a20-b4f6ca577461" data-file-name="components/UserPDFViewer.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="556d37a3-bbb5-4d20-b041-2cf25df75146" data-file-name="components/UserPDFViewer.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="52279e44-25e7-47a9-8807-4eafc751d32b" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="adbb775d-12e0-4ff3-9612-0db5db2b514c" data-file-name="components/UserPDFViewer.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF Grid */}
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="c3aa52d7-018b-4a67-897f-50cdb31a8d36" data-file-name="components/UserPDFViewer.tsx">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div> : error ? <div className="text-center py-12 text-red-500" data-unique-id="0d4f8a41-090b-48ed-a1dd-c991118d1ead" data-file-name="components/UserPDFViewer.tsx">
              <p data-unique-id="393c4156-6ed8-4d6e-aa2c-a1f6fcfdfce0" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{error}</p>
            </div> : pdfs.length === 0 ? <div className="text-center py-12 text-muted-foreground" data-unique-id="f248bc3b-e1eb-4f87-8193-999b00695d05" data-file-name="components/UserPDFViewer.tsx">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p data-unique-id="64b92ccc-8652-4130-8112-fce5735cf72f" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="0a5e6070-c59a-479d-8f74-ee177de6b511" data-file-name="components/UserPDFViewer.tsx">No PDFs found. Try adjusting your search criteria.</span></p>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-unique-id="54561d60-8a5e-4d72-bcb4-bc7f4679c09a" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
              {Array.isArray(pdfs) && pdfs.map(pdf => <Card key={pdf.id} className="overflow-hidden flex flex-col h-full" data-is-mapped="true" data-unique-id="9415309d-141b-4a4e-9c2a-b4feef591a4c" data-file-name="components/UserPDFViewer.tsx">
                  <div className="aspect-[3/4] relative overflow-hidden" data-is-mapped="true" data-unique-id="9df14b35-c473-40a3-bf11-ebe9f3d3e0a2" data-file-name="components/UserPDFViewer.tsx">
                    <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-is-mapped="true" data-unique-id="f1caec82-7ffa-413b-b511-253736e54cef" data-file-name="components/UserPDFViewer.tsx" />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow" data-is-mapped="true" data-unique-id="491aa902-ba98-417c-ad55-8b0e1a89c9f6" data-file-name="components/UserPDFViewer.tsx">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1" data-is-mapped="true" data-unique-id="61e2d6aa-c242-4f4a-874c-58ef0eb44b52" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{pdf.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4" data-is-mapped="true" data-unique-id="086ee6bf-5806-417b-9223-18528e98bc6e" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {pdf.categoryName || "Uncategorized"}
                    </p>
                    <div className="mt-auto" data-is-mapped="true" data-unique-id="95dc5309-c185-415f-b7b1-042bea382246" data-file-name="components/UserPDFViewer.tsx">
                      <Link href={`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`} passHref data-is-mapped="true" data-unique-id="83ffeed2-fcf2-4663-b161-dcbbd451d9f3" data-file-name="components/UserPDFViewer.tsx">
                        <Button className="w-full flex items-center gap-2" data-is-mapped="true" data-unique-id="07b68e9d-766a-467c-8b39-0a080779428a" data-file-name="components/UserPDFViewer.tsx">
                          <FileText className="h-4 w-4" /><span className="editable-text" data-unique-id="e6cba68e-9106-459a-b113-3c983532ced4" data-file-name="components/UserPDFViewer.tsx">
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