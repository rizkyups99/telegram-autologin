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
  return <div className="space-y-6" data-unique-id="410e1b81-d9a6-443c-a9d3-ad286d9d4b91" data-file-name="components/UserPDFViewer.tsx">
      <Card data-unique-id="dc4e725f-895f-450d-abdb-6b6b8135cdce" data-file-name="components/UserPDFViewer.tsx">
        <CardHeader data-unique-id="f09f4ca4-c006-4d74-b0a7-59fe07d002ce" data-file-name="components/UserPDFViewer.tsx">
          <CardTitle data-unique-id="719f7a86-2fb7-4ee6-b060-23fbdbf3006e" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="019598f2-2332-4cad-9e7e-713857c173d4" data-file-name="components/UserPDFViewer.tsx">Ebook PDF Library</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="78766c3c-0967-454b-ac3f-0637a0c0e509" data-file-name="components/UserPDFViewer.tsx">
            Browse and read available PDF ebooks
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="b2fa6e22-31ac-435d-833d-d3dcea9ac556" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="7f201808-c765-4d99-8033-6121045e4e83" data-file-name="components/UserPDFViewer.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="e545557b-9326-4df5-81f8-35d3ebcea1b8" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="75915daf-61f9-4577-bfef-541bca7660db" data-file-name="components/UserPDFViewer.tsx">Search PDFs</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="9f9cd615-57d3-45ba-ac2b-7a601e9a5745" data-file-name="components/UserPDFViewer.tsx">
              <div data-unique-id="f4665836-5123-4331-9e37-3227d03ef545" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="1e16529a-e81e-44f5-8010-1a46b2bfb8ae" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="a9bd3087-5b0d-4caf-9dbb-e3b3d81fdd74" data-file-name="components/UserPDFViewer.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="97563eda-5505-41b9-868f-566dccf1f732" data-file-name="components/UserPDFViewer.tsx" />
              </div>
              <div data-unique-id="0db97111-e693-482f-bc87-a708335a0b6c" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="ef3c02a6-968c-4dfa-a4de-7d24bba13cdc" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="fede3cb9-5db8-4cdc-9705-e226d600a875" data-file-name="components/UserPDFViewer.tsx">Category</span></Label>
                <select id="searchCategory" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="505fcd6f-dc35-4ce6-b9e5-2b3ad16536c9" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="2f29983f-7317-49bd-bbdb-78bc1b988eeb" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="58e77b26-6cfe-4f37-b708-adcba6d93043" data-file-name="components/UserPDFViewer.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="2e939531-2e39-465b-8840-7ff814799b3b" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="4de459aa-6f03-4a25-b48e-097e93c6bcfb" data-file-name="components/UserPDFViewer.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="ed0926d8-3f88-4e8b-929d-5901e4d1b207" data-file-name="components/UserPDFViewer.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="cfedad65-8892-4081-96f1-f53b86c2d185" data-file-name="components/UserPDFViewer.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="aa333d69-7bd3-422e-8293-8d01ff10e9cb" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="c9f98ead-8834-4687-a247-76d1a015cfcc" data-file-name="components/UserPDFViewer.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF Grid */}
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="23a880e4-9192-4011-a7ef-3bb9300db4ab" data-file-name="components/UserPDFViewer.tsx">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div> : error ? <div className="text-center py-12 text-red-500" data-unique-id="a0a8a45b-6010-47a3-af66-2488208700ff" data-file-name="components/UserPDFViewer.tsx">
              <p data-unique-id="4a2d6035-9324-4308-9233-4ad2abd9ff6e" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{error}</p>
            </div> : pdfs.length === 0 ? <div className="text-center py-12 text-muted-foreground" data-unique-id="5aa7706e-6bcb-4c5b-94e8-eea7120a35a2" data-file-name="components/UserPDFViewer.tsx">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p data-unique-id="74712f21-77b6-4010-a771-454a486656ed" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="d2698210-1e06-4ed2-93a6-9a20928771d8" data-file-name="components/UserPDFViewer.tsx">No PDFs found. Try adjusting your search criteria.</span></p>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-unique-id="6da2e9b4-ee00-4fe1-8e7a-3b273e32d8ca" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
              {Array.isArray(pdfs) && pdfs.map(pdf => <Card key={pdf.id} className="overflow-hidden flex flex-col h-full" data-is-mapped="true" data-unique-id="6f030012-c950-4aeb-8348-7093b38dccd9" data-file-name="components/UserPDFViewer.tsx">
                  <div className="aspect-[3/4] relative overflow-hidden" data-is-mapped="true" data-unique-id="5fe387a9-01f1-4d8f-b8be-764d274bae8d" data-file-name="components/UserPDFViewer.tsx">
                    <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-is-mapped="true" data-unique-id="7bd10b1b-8a50-40b8-8202-4c9a951bcfe6" data-file-name="components/UserPDFViewer.tsx" />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow" data-is-mapped="true" data-unique-id="9442c2f5-4123-4cc0-b89d-5501aeb476fd" data-file-name="components/UserPDFViewer.tsx">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1" data-is-mapped="true" data-unique-id="2bcfdd3d-32b7-4ae7-a701-efa61e027cb4" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{pdf.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4" data-is-mapped="true" data-unique-id="e731de8e-5d3c-46fb-9276-6022f1d9219d" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {pdf.categoryName || "Uncategorized"}
                    </p>
                    <div className="mt-auto" data-is-mapped="true" data-unique-id="bd18fb63-0109-4f99-b540-c6133e78b421" data-file-name="components/UserPDFViewer.tsx">
                      <Link href={`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`} passHref data-is-mapped="true" data-unique-id="5f7d129d-2e04-449c-8d30-1035204cc9a4" data-file-name="components/UserPDFViewer.tsx">
                        <Button className="w-full flex items-center gap-2" data-is-mapped="true" data-unique-id="16631148-3fbe-456f-9299-d5d1a44dc1ec" data-file-name="components/UserPDFViewer.tsx">
                          <FileText className="h-4 w-4" /><span className="editable-text" data-unique-id="a77f9eb7-1ab6-4041-a5c0-6c03044d6eb7" data-file-name="components/UserPDFViewer.tsx">
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