'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from 'lucide-react';
import { PDFCategoryItem } from './PDFCategoryItem';
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
  description?: string;
  pdfs: PDF[];
}
interface PDFPreviewProps {
  filterCategoryIds?: number[];
}
export default function PDFPreview({
  filterCategoryIds
}: PDFPreviewProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  const [readPDF, setReadPDF] = useState<PDF | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<{
    id: number | null;
    status: 'downloading' | 'completed' | null;
  }>({
    id: null,
    status: null
  });
  useEffect(() => {
    fetchPDFsGroupedByCategory();
  }, [filterCategoryIds]);
  const fetchPDFsGroupedByCategory = async () => {
    try {
      setIsLoading(true);

      // Fetch categories
      const catResponse = await fetch('/api/categories');
      const categoriesData = await catResponse.json();

      // Filter categories if filterCategoryIds is provided
      const filteredCategories = filterCategoryIds ? categoriesData.filter((category: any) => filterCategoryIds.includes(category.id)) : categoriesData;

      // Fetch PDFs with sort parameter
      const pdfsResponse = await fetch('/api/pdfs?sort=asc');
      const pdfsData = await pdfsResponse.json();

      // Ensure PDFs are sorted by ID in ascending order
      if (Array.isArray(pdfsData)) {
        pdfsData.sort((a, b) => a.id - b.id);
      }

      // Group PDFs by category
      const pdfsByCategory = filteredCategories.map((category: any) => {
        const categoryPDFs = pdfsData.filter((pdf: PDF) => pdf.categoryId === category.id) || [];

        // Initialize all categories as expanded
        if (categoryPDFs.length > 0) {
          setExpandedCategories(prev => ({
            ...prev,
            [category.id]: true
          }));
        }
        return {
          ...category,
          pdfs: categoryPDFs
        };
      }).filter((category: Category) => category.pdfs.length > 0);
      setCategories(pdfsByCategory);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  const handleDownloadPDF = async (pdf: PDF) => {
    try {
      // Show downloading notification
      setDownloadStatus({
        id: pdf.id,
        status: 'downloading'
      });

      // Fetch the file as a blob to detect when download is complete
      const response = await fetch(pdf.fileUrl);
      const blob = await response.blob();

      // Create a local URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdf.title}.pdf`; // Set the download filename
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show completed notification
      setDownloadStatus({
        id: pdf.id,
        status: 'completed'
      });

      // Clear notification after 5 seconds
      setTimeout(() => {
        setDownloadStatus({
          id: null,
          status: null
        });
      }, 5000);
    } catch (error) {
      console.error('Download error:', error);
      setDownloadStatus({
        id: null,
        status: null
      });
      alert('Failed to download PDF. Please try again.');
    }
  };
  return <Card data-unique-id="7a463a02-abeb-4c83-a561-7ec62891f9ab" data-file-name="components/preview/pdf/PDFPreview.tsx">
      <Tabs defaultValue="browse" data-unique-id="4dea45f0-2a52-4ca4-a795-320d86e54b67" data-file-name="components/preview/pdf/PDFPreview.tsx">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="browse"><span className="editable-text" data-unique-id="47989fba-1316-424f-95aa-bcee6fbf0503" data-file-name="components/preview/pdf/PDFPreview.tsx">Browse PDFs</span></TabsTrigger>
          <TabsTrigger value="read" disabled={!readPDF}><span className="editable-text" data-unique-id="4f9dc5e3-8e2b-4cb5-946c-b135d17bcc2b" data-file-name="components/preview/pdf/PDFPreview.tsx">BACA PDF</span></TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <CardContent className="p-6" data-unique-id="d68b80d3-bce6-41bf-871a-5e0e9fce9403" data-file-name="components/preview/pdf/PDFPreview.tsx">
            <div className="w-full" data-unique-id="9ed9f65c-ee86-4803-8c6d-adc6db59e915" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
              {isLoading ? <div className="flex justify-center py-8" data-unique-id="9b16c425-849b-45e1-a92a-32e869251893" data-file-name="components/preview/pdf/PDFPreview.tsx">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div> : categories.length === 0 ? <p className="text-center py-8 text-muted-foreground" data-unique-id="bb985f90-ee79-4735-a832-c51e3404c8d2" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="7de9f58c-3399-43d9-8478-90dfd7f68c67" data-file-name="components/preview/pdf/PDFPreview.tsx">Tidak ada PDF yang tersedia.</span></p> : <div className="space-y-6" data-unique-id="250b02e4-53a8-420f-b2f9-871406862ebd" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
                  {categories.map(category => <PDFCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} onDownloadPDF={handleDownloadPDF} onReadPDF={pdf => setReadPDF(pdf)} downloadStatus={downloadStatus} />)}
                </div>}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="read">
          <CardContent className="px-4 py-4" data-unique-id="27888058-f7f9-44e0-adf2-d35dfc5ab49f" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
            {readPDF ? <div className="space-y-4" data-unique-id="c208ca01-ab38-48c1-afa0-e24fe60cec99" data-file-name="components/preview/pdf/PDFPreview.tsx">
                <div className="flex justify-between items-center mb-4" data-unique-id="7a44f091-8c58-4413-93c7-a12608ff9fb8" data-file-name="components/preview/pdf/PDFPreview.tsx">
                  <h2 className="text-xl font-semibold" data-unique-id="c65a2011-0375-4fad-99d0-3fcd08697af9" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">{readPDF.title}</h2>
                  <span className="text-sm text-muted-foreground" data-unique-id="f543a3e2-e93c-453a-a77a-2591759cbdda" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
                    {categories.find(c => c.id === readPDF.categoryId)?.name}
                  </span>
                </div>
                <div className="w-full h-[70vh] border rounded-lg overflow-hidden bg-white" data-unique-id="f920cdf4-cac0-401d-9aa5-e954d91b8fe1" data-file-name="components/preview/pdf/PDFPreview.tsx">
                  <iframe src={`${readPDF.fileUrl}#toolbar=1&navpanes=1`} className="w-full h-full" title={`PDF Viewer - ${readPDF.title}`} data-unique-id="07809189-f290-49c8-9db6-c415f458b25e" data-file-name="components/preview/pdf/PDFPreview.tsx" />
                </div>
              </div> : <div className="flex flex-col items-center justify-center py-12" data-unique-id="551c2909-7ea3-471d-bcca-0a7d3f473143" data-file-name="components/preview/pdf/PDFPreview.tsx">
                <p className="text-lg font-medium mb-2" data-unique-id="64767c1a-87cb-4831-8bad-8312ea912e73" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="5f5d349f-b470-4649-a8c1-c38890c09ccd" data-file-name="components/preview/pdf/PDFPreview.tsx">Tidak ada PDF yang dipilih</span></p>
                <p className="text-muted-foreground" data-unique-id="6b12de71-3eb2-458e-8ae9-162364947139" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="15524348-db3c-43ee-851b-5db6f3dc64e9" data-file-name="components/preview/pdf/PDFPreview.tsx">Silakan pilih PDF untuk dibaca dari daftar</span></p>
              </div>}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>;
}