'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader } from 'lucide-react';
import { PDFCategoryItem } from './PDFCategoryItem';
import { MobilePDFReader } from './MobilePDFReader';
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
  const [isMobile, setIsMobile] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState<{
    id: number | null;
    status: 'downloading' | 'completed' | null;
  }>({
    id: null,
    status: null
  });
  useEffect(() => {
    fetchPDFsGroupedByCategory();

    // Detect mobile device
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobile(mobile);
    }
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
  const handleReadPDF = (pdf: PDF) => {
    setReadPDF(pdf);
    // Auto switch to read tab when PDF is selected
    const readTabTrigger = document.querySelector('[data-value="read"]') as HTMLElement;
    if (readTabTrigger) {
      readTabTrigger.click();
    }
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
  return <Card data-unique-id="e2cf83f5-70bd-4895-823a-30eca17e140e" data-file-name="components/preview/pdf/PDFPreview.tsx">
      <Tabs defaultValue="browse" data-unique-id="b07350fc-de1d-408f-a99b-3162d798be58" data-file-name="components/preview/pdf/PDFPreview.tsx">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="browse"><span className="editable-text" data-unique-id="12694433-10f3-4347-9878-63e188804eae" data-file-name="components/preview/pdf/PDFPreview.tsx">Browse PDFs</span></TabsTrigger>
          <TabsTrigger value="read" disabled={!readPDF} className={readPDF ? 'pdf-read-tab-active' : ''}>
            <span className="editable-text" data-unique-id="85df8b55-a787-4516-b47e-7b2a4bda1b84" data-file-name="components/preview/pdf/PDFPreview.tsx">BACA PDF</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <CardContent className="p-6" data-unique-id="4396add7-82d7-4180-b9e9-d8740919d941" data-file-name="components/preview/pdf/PDFPreview.tsx">
            <div className="w-full" data-unique-id="d52f5d03-6bce-4f37-9c30-55f7ac7659e9" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
              {isLoading ? <div className="flex justify-center py-8" data-unique-id="5d908a0a-58cd-43a0-8509-adc9d0e09968" data-file-name="components/preview/pdf/PDFPreview.tsx">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div> : categories.length === 0 ? <p className="text-center py-8 text-muted-foreground" data-unique-id="0c883fba-a82f-4c4f-a930-05511e4b46b2" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="b3694feb-f88c-4795-9939-fa949809c293" data-file-name="components/preview/pdf/PDFPreview.tsx">Tidak ada PDF yang tersedia.</span></p> : <div className="space-y-6" data-unique-id="ea76fa37-edfc-4a46-9eac-1846f6e05e53" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
                  {categories.map(category => <PDFCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} onDownloadPDF={handleDownloadPDF} onReadPDF={handleReadPDF} downloadStatus={downloadStatus} currentReadingPDF={readPDF} />)}
                </div>}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="read">
          <CardContent className="px-4 py-4" data-unique-id="cc0fe7af-3daf-40e5-9c32-a2cb3fe796c0" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
            {readPDF ? isMobile ? <MobilePDFReader selectedPDF={readPDF} onDownloadPDF={handleDownloadPDF} categoryName={categories.find(c => c.id === readPDF.categoryId)?.name} /> : <div className="space-y-4" data-unique-id="c046d199-b880-4a3c-8d02-bece82f97acf" data-file-name="components/preview/pdf/PDFPreview.tsx">
                  <div className="flex justify-between items-center mb-4" data-unique-id="620053f5-e836-4e91-b52b-2f9d15622d20" data-file-name="components/preview/pdf/PDFPreview.tsx">
                    <h2 className="text-xl font-semibold" data-unique-id="6c05edbf-6300-4cdb-ad9b-89ca68bb736c" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">{readPDF.title}</h2>
                    <span className="text-sm text-muted-foreground" data-unique-id="ca9ff698-0bed-49ce-a2c4-69aacfe22e29" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
                      {categories.find(c => c.id === readPDF.categoryId)?.name}
                    </span>
                  </div>
                  <div className="w-full h-[70vh] border rounded-lg overflow-hidden bg-white" data-unique-id="be3d6d67-c0da-4c8a-9add-6fe427dd5ddd" data-file-name="components/preview/pdf/PDFPreview.tsx">
                    <iframe src={`${readPDF.fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`} className="w-full h-full" title={`PDF Viewer - ${readPDF.title}`} style={{
                border: 'none'
              }} data-unique-id="56727bd8-cfb5-47ec-9437-d02a6eb3e082" data-file-name="components/preview/pdf/PDFPreview.tsx" />
                  </div>
                </div> : <div className="flex flex-col items-center justify-center py-12" data-unique-id="3272c1c8-df51-4f0f-8438-87a47eb882d9" data-file-name="components/preview/pdf/PDFPreview.tsx">
                <p className="text-lg font-medium mb-2" data-unique-id="bec64f95-f433-4dc1-b4a7-b5cdfe3e5416" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="858d2c17-1cef-4049-afac-c3759bde20db" data-file-name="components/preview/pdf/PDFPreview.tsx">Tidak ada PDF yang dipilih</span></p>
                <p className="text-muted-foreground" data-unique-id="1170382c-7b56-49bd-b186-78b4b55c1c6d" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="49627034-4d3a-40b0-8dbd-97d78eee6de1" data-file-name="components/preview/pdf/PDFPreview.tsx">Silakan pilih PDF untuk dibaca dari daftar</span></p>
              </div>}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>;
}