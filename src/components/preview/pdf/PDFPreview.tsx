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
  return <Card data-unique-id="7df4c8b5-4d41-412f-8654-fe58ef220f99" data-file-name="components/preview/pdf/PDFPreview.tsx">
      <Tabs defaultValue="browse" data-unique-id="00cb0d14-9797-41d1-999a-392a0ce2147a" data-file-name="components/preview/pdf/PDFPreview.tsx">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="browse"><span className="editable-text" data-unique-id="fdbda3c8-f306-4961-92ae-27e64a3f545a" data-file-name="components/preview/pdf/PDFPreview.tsx">Browse PDFs</span></TabsTrigger>
          <TabsTrigger value="read" disabled={!readPDF}><span className="editable-text" data-unique-id="118bbd48-2ded-4129-b3bd-cd4198e31e16" data-file-name="components/preview/pdf/PDFPreview.tsx">BACA PDF</span></TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <CardContent className="p-6" data-unique-id="55b440ad-3389-4c94-8119-1a452d477fb1" data-file-name="components/preview/pdf/PDFPreview.tsx">
            <div className="w-full" data-unique-id="58387543-1dbe-4886-aac5-eefdd611d4c6" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
              {isLoading ? <div className="flex justify-center py-8" data-unique-id="48d4e811-c81b-4618-979b-7073d39afa03" data-file-name="components/preview/pdf/PDFPreview.tsx">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div> : categories.length === 0 ? <p className="text-center py-8 text-muted-foreground" data-unique-id="c69cb29a-6385-42dc-91f5-32a459de59ea" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="e2d38bf9-b455-4d7b-be39-8cf447f62e2c" data-file-name="components/preview/pdf/PDFPreview.tsx">Tidak ada PDF yang tersedia.</span></p> : <div className="space-y-6" data-unique-id="afb94b8e-9e46-469b-b1e7-eb3fb45cc2bb" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
                  {categories.map(category => <PDFCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} onDownloadPDF={handleDownloadPDF} onReadPDF={pdf => setReadPDF(pdf)} downloadStatus={downloadStatus} />)}
                </div>}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="read">
          <CardContent className="px-4 py-4" data-unique-id="739cc198-a782-4d7a-8f5f-b1f8e9f27b1a" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
            {readPDF ? <div className="space-y-4" data-unique-id="0666c297-9951-470a-a4d6-e85c06d878f5" data-file-name="components/preview/pdf/PDFPreview.tsx">
                <div className="flex justify-between items-center mb-4" data-unique-id="610a346c-fca1-4ae4-9a1f-8a2ced996c91" data-file-name="components/preview/pdf/PDFPreview.tsx">
                  <h2 className="text-xl font-semibold" data-unique-id="6838bc74-bc33-4bc1-98d6-da9c658cc8e7" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">{readPDF.title}</h2>
                  <span className="text-sm text-muted-foreground" data-unique-id="9480e18d-a8c8-4c70-ab36-c23d6dd09603" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
                    {categories.find(c => c.id === readPDF.categoryId)?.name}
                  </span>
                </div>
                <div className="w-full h-[70vh] border rounded-lg overflow-hidden bg-white" data-unique-id="2f157e06-ac59-49a8-bcb4-5652e57870fd" data-file-name="components/preview/pdf/PDFPreview.tsx">
                  <iframe src={`${readPDF.fileUrl}#toolbar=1&navpanes=1`} className="w-full h-full" title={`PDF Viewer - ${readPDF.title}`} data-unique-id="dc4cd243-f0f3-4c22-b24c-60a6bb00561b" data-file-name="components/preview/pdf/PDFPreview.tsx" />
                </div>
              </div> : <div className="flex flex-col items-center justify-center py-12" data-unique-id="d578121a-e2d2-497a-8783-d40d4d63877b" data-file-name="components/preview/pdf/PDFPreview.tsx">
                <p className="text-lg font-medium mb-2" data-unique-id="6f0ad36e-f7d3-43f7-92b4-7bd27d66a254" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="7a801859-ed1e-48c8-af6a-64fc7772bc17" data-file-name="components/preview/pdf/PDFPreview.tsx">Tidak ada PDF yang dipilih</span></p>
                <p className="text-muted-foreground" data-unique-id="222d2084-3620-4126-94fd-12a3098cff11" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="aceee4a0-53fd-4aeb-bee1-4868cbd0e1d9" data-file-name="components/preview/pdf/PDFPreview.tsx">Silakan pilih PDF untuk dibaca dari daftar</span></p>
              </div>}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>;
}