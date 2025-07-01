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
  return <div className="space-y-6" data-unique-id="ab92daad-c19f-4f3c-8390-a5961d5ed80f" data-file-name="components/UserPDFViewer.tsx">
      <Card data-unique-id="f0899c99-9d45-4ea4-b87e-63106f33152f" data-file-name="components/UserPDFViewer.tsx">
        <CardHeader data-unique-id="9493899c-de55-4f3e-acac-050e2350c810" data-file-name="components/UserPDFViewer.tsx">
          <CardTitle data-unique-id="e471e536-9ab2-4e20-8c17-8c8500242d9e" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="1ca1c6f2-e1e0-4ec2-9f9f-e8ecbd8c1ada" data-file-name="components/UserPDFViewer.tsx">Ebook PDF Library</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="14646738-2766-49bd-adc6-8a25fb89ca98" data-file-name="components/UserPDFViewer.tsx">
            Browse and read available PDF ebooks
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="feb417ec-ece0-44a4-ad04-db0c4d8e5413" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="65a9e82b-f3bf-4e12-b0d6-a026810a3291" data-file-name="components/UserPDFViewer.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="137e1fea-ffcc-477b-8f74-aca24e13eae8" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="ee05e6bb-c333-46dc-8749-660862252f15" data-file-name="components/UserPDFViewer.tsx">Search PDFs</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="a057ef87-024a-43d8-80fd-780247d2d63c" data-file-name="components/UserPDFViewer.tsx">
              <div data-unique-id="fdc6b9a8-3899-428d-9df6-695763022165" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="91dc4509-2ed8-45af-bfab-da69dc08f476" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="a0d22b31-7745-44ab-9a05-a20305b6a10d" data-file-name="components/UserPDFViewer.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="1fdca6df-7230-444c-b393-894b580375db" data-file-name="components/UserPDFViewer.tsx" />
              </div>
              <div data-unique-id="15bb883c-86d5-49ab-a8f9-29353f4829f2" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="dc3b4744-7703-4d19-8808-2c6bb336dccc" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="d4742b2e-0bab-49cd-90bd-4aee61d14120" data-file-name="components/UserPDFViewer.tsx">Category</span></Label>
                <select id="searchCategory" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="086bc74f-0c3c-41ee-b2f9-3604dfd32177" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="c60e397a-af0c-42d3-b0f1-402d31644ee5" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="a3348f2b-7f88-4f8a-8b29-c9a0f450c5a4" data-file-name="components/UserPDFViewer.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="6757f02a-3964-4e64-bcb6-7ba6231cb619" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="c96eb54d-9df7-4785-bdcf-d2b4d37654a2" data-file-name="components/UserPDFViewer.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="22de1ca6-d5bd-4f5a-ba08-460c3c151a11" data-file-name="components/UserPDFViewer.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="24e36c50-d57b-42c9-a37b-8096d968ef51" data-file-name="components/UserPDFViewer.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="0c2b776e-097e-4680-8476-c529dd092a6b" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="7163df7c-7be9-42c9-ae43-0bb6a87422fc" data-file-name="components/UserPDFViewer.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF Grid */}
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="b358db08-910b-4e12-9814-9228a3d2320a" data-file-name="components/UserPDFViewer.tsx">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div> : error ? <div className="text-center py-12 text-red-500" data-unique-id="6b5c294b-d926-4941-a09a-5210dbb52a3f" data-file-name="components/UserPDFViewer.tsx">
              <p data-unique-id="e631a10d-fbaa-44d4-a8f2-d70a055dbaa4" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{error}</p>
            </div> : pdfs.length === 0 ? <div className="text-center py-12 text-muted-foreground" data-unique-id="14bd16ca-208d-4b5d-8d24-98434d35e4b0" data-file-name="components/UserPDFViewer.tsx">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p data-unique-id="2bc8b2b6-ae60-4e83-ada8-df9e2c03d144" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="8725a49e-d839-4c5d-ad55-3ea9680077ab" data-file-name="components/UserPDFViewer.tsx">No PDFs found. Try adjusting your search criteria.</span></p>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-unique-id="aa7788c1-29a4-431e-a7f7-41232da602bd" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
              {Array.isArray(pdfs) && pdfs.map(pdf => <Card key={pdf.id} className="overflow-hidden flex flex-col h-full" data-is-mapped="true" data-unique-id="aec941c3-6c77-4b0d-9b5e-1a884d5f5371" data-file-name="components/UserPDFViewer.tsx">
                  <div className="aspect-[3/4] relative overflow-hidden" data-is-mapped="true" data-unique-id="798691b5-b0c7-4e3e-9564-1d62327db134" data-file-name="components/UserPDFViewer.tsx">
                    <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-is-mapped="true" data-unique-id="22656efd-0862-4d1a-af4d-1d25ba292662" data-file-name="components/UserPDFViewer.tsx" />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow" data-is-mapped="true" data-unique-id="c87ea10f-8a14-45ad-9103-1e6a876dfca8" data-file-name="components/UserPDFViewer.tsx">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1" data-is-mapped="true" data-unique-id="d632b009-59fb-4642-b09c-a5b693171897" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{pdf.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4" data-is-mapped="true" data-unique-id="aa238006-93a7-47d2-8801-24fdb7809e60" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {pdf.categoryName || "Uncategorized"}
                    </p>
                    <div className="mt-auto" data-is-mapped="true" data-unique-id="6d7adf88-07ac-4754-aa53-b1ae2a5a1a01" data-file-name="components/UserPDFViewer.tsx">
                      <Link href={`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`} passHref data-is-mapped="true" data-unique-id="ee152d24-43e5-4be4-84d4-aac35161672e" data-file-name="components/UserPDFViewer.tsx">
                        <Button className="w-full flex items-center gap-2" data-is-mapped="true" data-unique-id="8c26e74a-30e9-46ba-afeb-42d22f6bfa9b" data-file-name="components/UserPDFViewer.tsx">
                          <FileText className="h-4 w-4" /><span className="editable-text" data-unique-id="6593af5e-ee3b-47be-8aa5-c13bd12b56f6" data-file-name="components/UserPDFViewer.tsx">
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