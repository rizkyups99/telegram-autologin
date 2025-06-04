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
  return <div className="space-y-6" data-unique-id="e911af12-17d3-4cf4-afcb-76ba9429d250" data-file-name="components/UserPDFViewer.tsx">
      <Card data-unique-id="9a230cac-cba7-48f6-b985-1d85fce3587a" data-file-name="components/UserPDFViewer.tsx">
        <CardHeader data-unique-id="7449d3f6-9262-470a-9fab-098a1af9f772" data-file-name="components/UserPDFViewer.tsx">
          <CardTitle data-unique-id="3c9d9570-739e-4ff4-953a-48ea2a872f86" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="757f1d19-5318-45bd-a27a-a3a6aa8071e5" data-file-name="components/UserPDFViewer.tsx">Ebook PDF Library</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="27192dda-535c-422c-991d-1de141bcbb00" data-file-name="components/UserPDFViewer.tsx">
            Browse and read available PDF ebooks
          </span></CardDescription>
        </CardHeader>
        <CardContent className="space-y-6" data-unique-id="61a39571-7f22-47ce-a42d-7fa71a00be8f" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
          {/* Search filters */}
          <div className="bg-muted p-4 rounded-md" data-unique-id="2de8cd6a-e07e-4e7f-abfd-730153e21186" data-file-name="components/UserPDFViewer.tsx">
            <h3 className="text-lg font-medium mb-4" data-unique-id="063823db-194a-4cf5-833b-6465b5fae3af" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="7b48ab96-0045-4a35-9037-80a15dbedf85" data-file-name="components/UserPDFViewer.tsx">Search PDFs</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-unique-id="6f0a1580-b9d5-4f97-a823-921c7d8127e3" data-file-name="components/UserPDFViewer.tsx">
              <div data-unique-id="16dce606-85b4-4e7a-9180-7fe137a9f21c" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchTitle" className="block text-sm font-medium mb-1" data-unique-id="9492f737-3400-4c8e-8d01-b48193c19b76" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="25fa5998-defb-4306-bf6d-3de8276d0ff0" data-file-name="components/UserPDFViewer.tsx">Title</span></Label>
                <Input id="searchTitle" value={searchTitle} onChange={e => setSearchTitle(e.target.value)} placeholder="Search by title" data-unique-id="32f19211-056a-40cb-979e-389630449add" data-file-name="components/UserPDFViewer.tsx" />
              </div>
              <div data-unique-id="0fbdca69-7f42-43a1-8a67-81235783df05" data-file-name="components/UserPDFViewer.tsx">
                <Label htmlFor="searchCategory" className="block text-sm font-medium mb-1" data-unique-id="55b37e04-2dd2-4710-81bd-e2ab69f3a6ee" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="519f07c8-1375-493c-9fa0-3866ba300814" data-file-name="components/UserPDFViewer.tsx">Category</span></Label>
                <select id="searchCategory" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" data-unique-id="2d00fda3-f8bd-459c-b332-1112866c57c4" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                  <option value="" data-unique-id="415cfc94-2733-4424-8e88-44600fa79b9a" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="21c466bf-c4ea-48fb-869a-55b0436e9718" data-file-name="components/UserPDFViewer.tsx">All Categories</span></option>
                  {categories.map(category => <option key={category.id} value={category.id} data-is-mapped="true" data-unique-id="29a481b6-3c82-4c4a-8ff3-d74c4f0a1b04" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {category.name}
                    </option>)}
                </select>
              </div>
              <div className="flex items-end space-x-2" data-unique-id="34780f84-8c6f-4273-b63d-c3a8e599d7f1" data-file-name="components/UserPDFViewer.tsx">
                <Button onClick={handleSearch} className="flex-1 flex items-center gap-2" data-unique-id="18e012bd-f7b7-4bee-a808-1082b99d16d1" data-file-name="components/UserPDFViewer.tsx">
                  <Search className="h-4 w-4" /><span className="editable-text" data-unique-id="1fe08fac-c971-461b-9ec4-bd13ecec3e6b" data-file-name="components/UserPDFViewer.tsx">
                  Search
                </span></Button>
                <Button variant="outline" onClick={resetSearch} data-unique-id="7667c420-92ca-4c08-997f-c1c0a14a9a33" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="592ff0ec-31ea-4582-9c79-c34d84acafad" data-file-name="components/UserPDFViewer.tsx">
                  Reset
                </span></Button>
              </div>
            </div>
          </div>

          {/* PDF Grid */}
          {isLoading ? <div className="flex justify-center py-12" data-unique-id="d171c406-5272-45d3-8c40-e1e24bf89ed3" data-file-name="components/UserPDFViewer.tsx">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div> : error ? <div className="text-center py-12 text-red-500" data-unique-id="ae7b6d87-8924-46f4-bdda-3789a2cd50ee" data-file-name="components/UserPDFViewer.tsx">
              <p data-unique-id="1be41ada-3146-4959-84e9-752f14433eb4" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{error}</p>
            </div> : pdfs.length === 0 ? <div className="text-center py-12 text-muted-foreground" data-unique-id="cc8ad258-89c0-488e-ae89-5f0e194b08d9" data-file-name="components/UserPDFViewer.tsx">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p data-unique-id="d532e71e-2970-4c28-8068-443fdf78e9e9" data-file-name="components/UserPDFViewer.tsx"><span className="editable-text" data-unique-id="d086e87b-9cce-4f0e-8bd2-f2ee01a7cb86" data-file-name="components/UserPDFViewer.tsx">No PDFs found. Try adjusting your search criteria.</span></p>
            </div> : <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" data-unique-id="40b6afda-3526-4045-bd05-9c73fd97d6eb" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
              {Array.isArray(pdfs) && pdfs.map(pdf => <Card key={pdf.id} className="overflow-hidden flex flex-col h-full" data-is-mapped="true" data-unique-id="f85375c0-86f9-49aa-9ac2-388b811698ef" data-file-name="components/UserPDFViewer.tsx">
                  <div className="aspect-[3/4] relative overflow-hidden" data-is-mapped="true" data-unique-id="d5632207-f14e-4477-a6b2-6c5356e92b7a" data-file-name="components/UserPDFViewer.tsx">
                    <img src={pdf.coverUrl} alt={pdf.title} className="object-cover w-full h-full" data-is-mapped="true" data-unique-id="86eaae7d-f63f-4a18-b986-2b32f925279e" data-file-name="components/UserPDFViewer.tsx" />
                  </div>
                  <CardContent className="p-4 flex flex-col flex-grow" data-is-mapped="true" data-unique-id="b54415b1-ff57-4d03-a46c-f97a83f8abe7" data-file-name="components/UserPDFViewer.tsx">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-1" data-is-mapped="true" data-unique-id="d51660bb-7ee8-4c85-994d-f29a29985987" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">{pdf.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4" data-is-mapped="true" data-unique-id="edf952c6-52de-4f23-aa1b-f9901d5dcf56" data-file-name="components/UserPDFViewer.tsx" data-dynamic-text="true">
                      {pdf.categoryName || "Uncategorized"}
                    </p>
                    <div className="mt-auto" data-is-mapped="true" data-unique-id="945351e9-7cea-40f4-a797-42b5f48bc68c" data-file-name="components/UserPDFViewer.tsx">
                      <Link href={`/pdf-viewer?id=${pdf.id}&t=${Date.now()}`} passHref data-is-mapped="true" data-unique-id="60f4d572-5ca7-41b9-9a7a-df78a6c0c4df" data-file-name="components/UserPDFViewer.tsx">
                        <Button className="w-full flex items-center gap-2" data-is-mapped="true" data-unique-id="61ab1eeb-d104-4c10-807a-5aa1abc70c8e" data-file-name="components/UserPDFViewer.tsx">
                          <FileText className="h-4 w-4" /><span className="editable-text" data-unique-id="e844df00-fd6a-4ccb-a786-1d47390df384" data-file-name="components/UserPDFViewer.tsx">
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