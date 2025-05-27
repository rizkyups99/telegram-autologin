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
  return <div className="space-y-6" data-unique-id="f73a0e8f-b635-4326-a0de-18b36efcd417" data-file-name="components/UserPDFViewer.tsx">
      <Card data-unique-id="9a432cda-4673-44e5-ba9d-c7afaa07faab" data-file-name="components/UserPDFViewer.tsx">
        <CardHeader data-unique-id="12d996d6-dc04-4669-a88e-3f5630fab900" data-file-name="components/UserPDFViewer.tsx">
          <CardTitle data-unique-id="1b73d741-f9aa-41bd-9bd1-1549da593699" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="2fe52af2-03fe-4bc6-8e4a-0ed465e3a66d" data-file-name="components/UserPDFViewer.tsx">Ebook PDF Library</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="d758b857-6573-4925-9869-48591b8e7a2f" data-file-name="components/UserPDFViewer.tsx">
            Browse and read available PDF ebooks
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="3c295223-3cce-44ad-bc94-6dd6991c9ee1" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="8cbea252-c085-45e8-aa9e-0067c4729a1f" data-file-name="components/UserPDFViewer.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="5ed3325b-fb13-43e0-8834-8dd07a375b5f" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="225c4d81-21cc-4e6f-a62d-05e088748590" data-file-name="components/UserPDFViewer.tsx">Search PDFs</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="d9aabc7b-cd7e-411e-b200-de3251c310d1" data-file-name="components/UserPDFViewer.tsx">
              <div data-unique-id="874a4493-2884-4aca-84a5-7313a788f869" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="5bd00074-e1df-483b-94c4-e2f133be392c" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="39812c61-dd95-4c79-9c4d-7515a3f0a55c" data-file-name="components/UserPDFViewer.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="5deda0e0-b1e8-446e-ad7c-dfe278e87cee" data-file-name="components/UserPDFViewer.tsx" />
              </div>
              <div data-unique-id="ff315d13-9ba9-46f7-b20b-65943050d48b" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="88fd0101-765a-49a7-bacd-6bc8716d731d" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="3d9e48e4-d280-4030-b020-ab5ebc332c45" data-file-name="components/UserPDFViewer.tsx">Category</span></Label>
                <select id="searchCategory" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="e19b459d-c71d-4f46-94ae-c2f3d9e5ce30" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="307b6bdf-9369-416f-92d2-87c4ea958813" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="9c950add-d11c-48a8-8907-98d60d451250" data-file-name="components/UserPDFViewer.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="bdf4c0cf-4f46-4e1f-8557-8f6a93768336" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="577c4982-bfb7-4391-88c3-a098536882a0" data-file-name="components/UserPDFViewer.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="45793040-0784-4b69-b9c8-edb782d5e6d1" data-file-name="components/UserPDFViewer.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="f4afed37-d784-4352-b2aa-b79fbc5c5b32" data-file-name="components/UserPDFViewer.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="06409a4b-3ac8-4b53-8ee9-8ed45a4109e8" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="4bfe4924-55be-4f98-8f75-4b5069e9127b" data-file-name="components/UserPDFViewer.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF Grid */}
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="7a964bf6-84ca-48bc-ac12-14368029c30b" data-file-name="components/UserPDFViewer.tsx">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div> : error ? <div className="text-center py-12 text-red-500" data-unique-id="b79339b8-c6c8-4a62-8adb-1d01837f57b9" data-file-name="components/UserPDFViewer.tsx">
              <p data-unique-id="b559a66a-9a29-4baa-bd34-db4cd1f75b1e" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{error}</p>
            </div> : pdfs.length === 0 ? <div className="text-center py-12 text-muted-foreground" data-unique-id="cf8d52cf-7e70-4638-96c3-fb14a8d36e43" data-file-name="components/UserPDFViewer.tsx">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p data-unique-id="a160f206-6439-47be-8419-c7a0cf7571de" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="191aa89a-fe41-441c-95e5-c861839f821f" data-file-name="components/UserPDFViewer.tsx">No PDFs found. Try adjusting your search criteria.</span></p>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-unique-id="c6a9c608-69cc-479c-bb56-037f7782635f" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
              {Array.isArray(pdfs) && pdfs.map(pdf => <Card key={pdf.id} className="overflow-hidden flex flex-col h-full" data-is-mapped="true" data-unique-id="bb57f5fd-c21b-46be-abc2-191c653a9554" data-file-name="components/UserPDFViewer.tsx">
                  <div className="aspect-[3/4] relative overflow-hidden" data-is-mapped="true" data-unique-id="95e7dacf-6a0c-4b84-b192-3bbf36cf145c" data-file-name="components/UserPDFViewer.tsx">
                    <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-is-mapped="true" data-unique-id="5152662d-5f17-4ce5-9b47-e965772c2e80" data-file-name="components/UserPDFViewer.tsx" />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow" data-is-mapped="true" data-unique-id="075de27e-4485-42bd-a2af-85f3844bfcd1" data-file-name="components/UserPDFViewer.tsx">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1" data-is-mapped="true" data-unique-id="5aea59d1-7693-4ecd-90e6-9ad69a915b00" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{pdf.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4" data-is-mapped="true" data-unique-id="1c6bca98-f017-41dc-90b3-e7acd5dcfe19" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {pdf.categoryName || "Uncategorized"}
                    </p>
                    <div className="mt-auto" data-is-mapped="true" data-unique-id="792a32ea-6935-4ce5-92b3-01b26a21e6b4" data-file-name="components/UserPDFViewer.tsx">
                      <Link href={`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`} passHref data-is-mapped="true" data-unique-id="4d709a37-64f5-4600-8d2d-c8840d5e225b" data-file-name="components/UserPDFViewer.tsx">
                        <Button className="w-full flex items-center gap-2" data-is-mapped="true" data-unique-id="3025ef9f-1aa3-4a53-b8a6-f5178995b3b2" data-file-name="components/UserPDFViewer.tsx">
                          <FileText className="h-4 w-4" /><span className="editable-text" data-unique-id="a001e17e-6b52-4b93-928c-016875913f21" data-file-name="components/UserPDFViewer.tsx">
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