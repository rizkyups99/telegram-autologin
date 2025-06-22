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
  return <div className="space-y-6" data-unique-id="fb8d68d2-92dc-40fd-91fb-c44639b8be26" data-file-name="components/UserPDFViewer.tsx">
      <Card data-unique-id="12c8ee8d-c2ed-49e8-986e-652a1c15dab0" data-file-name="components/UserPDFViewer.tsx">
        <CardHeader data-unique-id="61a76e5a-5e6f-4145-9c8d-e3139c01b2f8" data-file-name="components/UserPDFViewer.tsx">
          <CardTitle data-unique-id="864fe5b8-21c8-4356-be8e-bd410c008159" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="0ab039f2-f95a-49b0-afb5-632aa38e927b" data-file-name="components/UserPDFViewer.tsx">Ebook PDF Library</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="ad845ba6-33b4-4044-86f8-1c10f90c31df" data-file-name="components/UserPDFViewer.tsx">
            Browse and read available PDF ebooks
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="d48fafec-d4bd-4c9a-8068-19a18298b224" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="c11b4d46-638d-461e-9bcd-1ca28bce0be0" data-file-name="components/UserPDFViewer.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="63789aac-8cb0-447f-8dc1-a42a1186b670" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="9d35789e-089b-4704-809e-dcc0795bb10e" data-file-name="components/UserPDFViewer.tsx">Search PDFs</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="cec8bf40-6d11-463c-bf37-8dace83d31f3" data-file-name="components/UserPDFViewer.tsx">
              <div data-unique-id="2b1f9215-bf79-4de2-9c9d-c27b1ab29c5e" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="3151d7f7-3850-43b1-89a7-1ebc92886662" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="c1c579e5-d2b8-4de6-92a5-e03389f6d508" data-file-name="components/UserPDFViewer.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="94af3c22-08b2-4910-9c2d-b24cd2f0b712" data-file-name="components/UserPDFViewer.tsx" />
              </div>
              <div data-unique-id="cbd2a115-6263-4853-9915-bbf3234ed1e3" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="4d729624-7204-4d2b-b7bc-083bda98de3a" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="2422c593-d61f-43f5-b0fe-23b188522904" data-file-name="components/UserPDFViewer.tsx">Category</span></Label>
                <select id="searchCategory" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="4a74b63c-913e-473f-9288-7b8e9cd09f53" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="69354a55-f799-4b1b-add7-31d8d1d1f7f4" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="7e44e430-0a59-4220-98aa-1d67fdb725ba" data-file-name="components/UserPDFViewer.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="b2a05051-dce6-4822-955e-d3b599045867" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="b52a5977-d880-46e3-927b-d0f2fdce866d" data-file-name="components/UserPDFViewer.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="dce669e5-5d04-42f5-a492-ba0caae78d75" data-file-name="components/UserPDFViewer.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="19584b87-8233-42b2-8a01-56b8802e8a82" data-file-name="components/UserPDFViewer.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="c307c61a-b5df-4dcb-a0c6-8c9bffe5c3b8" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="6e30674e-e00d-4868-8d6a-85fec4b21bee" data-file-name="components/UserPDFViewer.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF Grid */}
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="7115a4e1-d573-4896-9fc1-56da7b9f1759" data-file-name="components/UserPDFViewer.tsx">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div> : error ? <div className="text-center py-12 text-red-500" data-unique-id="5bbfee28-4c6c-483a-8f72-824c51db09d4" data-file-name="components/UserPDFViewer.tsx">
              <p data-unique-id="eadb2e1c-d0e3-416f-943a-37480efb1b8f" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{error}</p>
            </div> : pdfs.length === 0 ? <div className="text-center py-12 text-muted-foreground" data-unique-id="782b2eb5-4688-47cf-99e5-dc766b53b074" data-file-name="components/UserPDFViewer.tsx">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p data-unique-id="0e39a021-57bd-4c12-957a-c354537ab2fc" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="1c1fb7ee-ba81-4c29-ad3f-ca96df2dab86" data-file-name="components/UserPDFViewer.tsx">No PDFs found. Try adjusting your search criteria.</span></p>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-unique-id="53bb9688-fe6a-48e2-a19d-afcd30594cea" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
              {Array.isArray(pdfs) && pdfs.map(pdf => <Card key={pdf.id} className="overflow-hidden flex flex-col h-full" data-is-mapped="true" data-unique-id="9075d39b-8b44-45fc-8b44-7472b9440c06" data-file-name="components/UserPDFViewer.tsx">
                  <div className="aspect-[3/4] relative overflow-hidden" data-is-mapped="true" data-unique-id="d9c6e98b-0213-450c-b8ac-c1a285b557b7" data-file-name="components/UserPDFViewer.tsx">
                    <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-is-mapped="true" data-unique-id="34dd98bc-14b3-4b23-a7e1-8620399b30eb" data-file-name="components/UserPDFViewer.tsx" />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow" data-is-mapped="true" data-unique-id="4f96b066-540b-4598-bb7c-c1e488d35fbf" data-file-name="components/UserPDFViewer.tsx">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1" data-is-mapped="true" data-unique-id="0233a894-46bb-4b4a-9e67-9fc55f578314" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{pdf.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4" data-is-mapped="true" data-unique-id="18d0330b-5190-4de6-a10d-6ee15bd514d3" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {pdf.categoryName || "Uncategorized"}
                    </p>
                    <div className="mt-auto" data-is-mapped="true" data-unique-id="69d070d0-66f9-4cc3-bc8e-533660ef1b92" data-file-name="components/UserPDFViewer.tsx">
                      <Link href={`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`} passHref data-is-mapped="true" data-unique-id="7a960d6c-e727-43b8-a327-d0f8f10b409d" data-file-name="components/UserPDFViewer.tsx">
                        <Button className="w-full flex items-center gap-2" data-is-mapped="true" data-unique-id="0dd85825-f53a-49b9-8bda-96f379a90d00" data-file-name="components/UserPDFViewer.tsx">
                          <FileText className="h-4 w-4" /><span className="editable-text" data-unique-id="ff038843-7935-4ef7-a14e-69bda423e50b" data-file-name="components/UserPDFViewer.tsx">
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