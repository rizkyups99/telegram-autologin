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
  return <Card data-unique-id="32f56f71-e851-4ad7-917c-8f2a99e74a6a" data-file-name="components/preview/pdf/PDFPreview.tsx">
      <Tabs defaultValue="browse" data-unique-id="aae7673c-7a26-4b15-bbeb-fd8ca28851b1" data-file-name="components/preview/pdf/PDFPreview.tsx">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="browse"><span className="editable-text" data-unique-id="7a2d739f-5dfd-466d-9c17-23c61513c614" data-file-name="components/preview/pdf/PDFPreview.tsx">Browse PDFs</span></TabsTrigger>
          <TabsTrigger value="read" disabled={!readPDF} className={readPDF ? 'pdf-read-tab-active' : ''}>
            <span className="editable-text" data-unique-id="5851421f-38f2-4a7e-9664-831569efd407" data-file-name="components/preview/pdf/PDFPreview.tsx">BACA PDF</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <CardContent className="p-6" data-unique-id="0355b881-961c-4b69-bacd-c190bb9825e2" data-file-name="components/preview/pdf/PDFPreview.tsx">
            <div className="w-full" data-unique-id="74ee890b-7c71-4392-89dc-cd1e29ed4261" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
              {isLoading ? <div className="flex justify-center py-8" data-unique-id="47d15140-6a2c-446d-baf7-b4aa37e3910b" data-file-name="components/preview/pdf/PDFPreview.tsx">
                  <Loader className="h-8 w-8 animate-spin text-primary" />
                </div> : categories.length === 0 ? <p className="text-center py-8 text-muted-foreground" data-unique-id="e08483f2-4049-4efe-a18c-c7f927a10c79" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="ae97e11f-e7c8-4cbc-8192-2b1f66b6f26c" data-file-name="components/preview/pdf/PDFPreview.tsx">Tidak ada PDF yang tersedia.</span></p> : <div className="space-y-6" data-unique-id="45eab8f8-a1d4-4d30-ab71-cbc30aafc28d" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
                  {categories.map(category => <PDFCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} onDownloadPDF={handleDownloadPDF} onReadPDF={handleReadPDF} downloadStatus={downloadStatus} currentReadingPDF={readPDF} />)}
                </div>}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="read">
          <CardContent className="px-4 py-4" data-unique-id="2f078cdc-dbae-4047-93bb-c8ecd64009cb" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
            {readPDF ? isMobile ? <MobilePDFReader selectedPDF={readPDF} onDownloadPDF={handleDownloadPDF} categoryName={categories.find(c => c.id === readPDF.categoryId)?.name} /> : <div className="space-y-4" data-unique-id="5378ffbb-0203-46c2-84ce-ac1e315d136e" data-file-name="components/preview/pdf/PDFPreview.tsx">
                  <div className="flex justify-between items-center mb-4" data-unique-id="43ca8524-99cf-467f-a76f-5614201b4f8e" data-file-name="components/preview/pdf/PDFPreview.tsx">
                    <h2 className="text-xl font-semibold" data-unique-id="ddb50129-2627-4cc6-9749-172cd8e9b22c" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">{readPDF.title}</h2>
                    <span className="text-sm text-muted-foreground" data-unique-id="d8654ade-f2d7-4a2e-ab2f-1c79003bddb6" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
                      {categories.find(c => c.id === readPDF.categoryId)?.name}
                    </span>
                  </div>
                  <div className="w-full h-[70vh] border rounded-lg overflow-hidden bg-white" data-unique-id="5f339f8a-6452-4a63-b00c-7f94e039ba1b" data-file-name="components/preview/pdf/PDFPreview.tsx">
                    <iframe src={`${readPDF.fileUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`} className="w-full h-full" title={`PDF Viewer - ${readPDF.title}`} style={{
                border: 'none'
              }} data-unique-id="0f8b2f3e-c6b6-4b98-ad46-04aa3d05320d" data-file-name="components/preview/pdf/PDFPreview.tsx" />
                  </div>
                </div> : <div className="flex flex-col items-center justify-center py-12" data-unique-id="d8268fa1-5571-49d7-a9e7-e870fab12405" data-file-name="components/preview/pdf/PDFPreview.tsx">
                <p className="text-lg font-medium mb-2" data-unique-id="a93e6014-a800-4be1-94b4-b43cdadc587e" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="5313ed08-c079-41df-8e65-50b5fca1f37f" data-file-name="components/preview/pdf/PDFPreview.tsx">Tidak ada PDF yang dipilih</span></p>
                <p className="text-muted-foreground" data-unique-id="67fa10a7-f131-4b00-8d13-ac651f0e885a" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="1b3086eb-8b95-4692-a5e9-47e3fa6c2c89" data-file-name="components/preview/pdf/PDFPreview.tsx">Silakan pilih PDF untuk dibaca dari daftar</span></p>
              </div>}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>;
}