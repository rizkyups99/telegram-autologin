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
  return <div className="space-y-6" data-unique-id="0ab85f66-f50e-4f9c-b67a-d434ae6bca5d" data-file-name="components/UserPDFViewer.tsx">
      <Card data-unique-id="51254c37-baae-4b50-9e89-9016c29a3fe6" data-file-name="components/UserPDFViewer.tsx">
        <CardHeader data-unique-id="1354d7ee-12ed-4cd9-8a37-2f06d3c1b373" data-file-name="components/UserPDFViewer.tsx">
          <CardTitle data-unique-id="32c11169-ac8e-464a-83a4-6d49ca793d74" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="655bb3a8-6fea-464f-af3e-3f23c08c471e" data-file-name="components/UserPDFViewer.tsx">Ebook PDF Library</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="54d1585f-b5ce-41a2-88ac-2fb1c472b750" data-file-name="components/UserPDFViewer.tsx">
            Browse and read available PDF ebooks
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="8d975feb-6748-4d23-bed2-13c606c5e695" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="4ee89c7f-4015-43e9-b150-2a169c70e983" data-file-name="components/UserPDFViewer.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="eaee712b-6c6a-4518-9880-03f7d30d8aa3" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="71588418-deb5-4546-83f8-cdf44dab7880" data-file-name="components/UserPDFViewer.tsx">Search PDFs</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="ec9f62e5-10f5-44e6-9b73-f128200993d5" data-file-name="components/UserPDFViewer.tsx">
              <div data-unique-id="0307cf5f-7135-4b82-bf01-7c9059e749cf" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="be5d2bd3-a109-4628-8d0e-71e28a78f89d" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="dda5e875-5a8d-493f-b830-0bf61cc6af84" data-file-name="components/UserPDFViewer.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="d66ee857-96ea-4526-9351-8c7626a25d60" data-file-name="components/UserPDFViewer.tsx" />
              </div>
              <div data-unique-id="3872055e-e5c4-4ebe-99f0-8ee8782e92e7" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="7e4783dd-33fa-428a-a48e-fe926b7598e3" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="4b6e663d-0f63-4d3d-9a00-66b9223dcde2" data-file-name="components/UserPDFViewer.tsx">Category</span></Label>
                <select id="searchCategory" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="64d82c05-ebd9-495e-bf2f-0cf36d1af41d" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="5b996a5a-ff3d-4fa6-aeef-95928c1b3253" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="aea9f9b3-1455-4efe-8dfb-a04395655ebc" data-file-name="components/UserPDFViewer.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="6cfb2fc1-8981-4bd3-88c5-d44679d8a76e" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="38776bbd-f391-4a5a-ae01-82c941b1fd52" data-file-name="components/UserPDFViewer.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="d2ca1edd-8006-4283-a8a8-51977bfe376c" data-file-name="components/UserPDFViewer.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="613adaf4-34c9-4b7a-a460-64c8285694fd" data-file-name="components/UserPDFViewer.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="fc4c44b2-7fad-44ec-8ae5-ea0dbe1f44d0" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="70031994-4bd0-4a8c-9046-82d883e3b237" data-file-name="components/UserPDFViewer.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF Grid */}
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="6b2679bc-ccce-4971-bdea-79a6b25a2498" data-file-name="components/UserPDFViewer.tsx">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div> : error ? <div className="text-center py-12 text-red-500" data-unique-id="abe8eb35-9d19-4563-acfc-679fe23228e2" data-file-name="components/UserPDFViewer.tsx">
              <p data-unique-id="cfce38ce-4fb1-4da8-8a47-cba45c7b20df" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{error}</p>
            </div> : pdfs.length === 0 ? <div className="text-center py-12 text-muted-foreground" data-unique-id="c0db4b98-9db8-4c36-862d-c86c63cb2327" data-file-name="components/UserPDFViewer.tsx">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p data-unique-id="7ee8a04b-4c3c-4dc5-a6c6-9e39939bbb25" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="e86f6014-126b-449a-9ae2-d8cd36dcef0d" data-file-name="components/UserPDFViewer.tsx">No PDFs found. Try adjusting your search criteria.</span></p>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-unique-id="a5f48c40-6968-45c0-98f1-f6df43b071cf" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
              {Array.isArray(pdfs) && pdfs.map(pdf => <Card key={pdf.id} className="overflow-hidden flex flex-col h-full" data-is-mapped="true" data-unique-id="8d97b74c-20fe-48d2-b50a-fd5918d6bd5e" data-file-name="components/UserPDFViewer.tsx">
                  <div className="aspect-[3/4] relative overflow-hidden" data-is-mapped="true" data-unique-id="f43ad4d4-29a0-426c-82d0-3d2675bd0283" data-file-name="components/UserPDFViewer.tsx">
                    <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-is-mapped="true" data-unique-id="931a71b3-c357-41a6-9f0d-1396abe5890b" data-file-name="components/UserPDFViewer.tsx" />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow" data-is-mapped="true" data-unique-id="a728ed42-3bee-412d-ac79-97a3a7831906" data-file-name="components/UserPDFViewer.tsx">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1" data-is-mapped="true" data-unique-id="ac8c9a55-52d9-401f-a524-5018227ed5ad" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{pdf.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4" data-is-mapped="true" data-unique-id="d7c3544a-1046-4deb-ba47-2355a905be36" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {pdf.categoryName || "Uncategorized"}
                    </p>
                    <div className="mt-auto" data-is-mapped="true" data-unique-id="3c40b941-eac3-4716-bc2e-2d1316b584a9" data-file-name="components/UserPDFViewer.tsx">
                      <Link href={`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`} passHref data-is-mapped="true" data-unique-id="5aa88acb-7de0-47c0-b996-a98544fd34ca" data-file-name="components/UserPDFViewer.tsx">
                        <Button className="w-full flex items-center gap-2" data-is-mapped="true" data-unique-id="adb7fe5a-f0df-4cae-b285-0da89674ab3d" data-file-name="components/UserPDFViewer.tsx">
                          <FileText className="h-4 w-4" /><span className="editable-text" data-unique-id="700bebd1-576d-4e1d-b255-935887316ee1" data-file-name="components/UserPDFViewer.tsx">
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