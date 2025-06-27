'use client';

import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { UniversalPDFViewerWrapper } from './ClientWrappers';
import { PDFCategoryItem } from './preview/pdf/PDFCategoryItem';
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
interface PreviewPDFProps {
  filterCategoryIds?: number[];
}
export default function PreviewPDF({
  filterCategoryIds
}: PreviewPDFProps) {
  const [pdfsByCategory, setPdfsByCategory] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null);
  const [downloadStatus, setDownloadStatus] = useState<{
    id: number | null;
    status: 'downloading' | 'completed' | null;
  }>({
    id: null,
    status: null
  });
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>({});
  useEffect(() => {
    fetchPDFs();
  }, [filterCategoryIds]);
  const fetchPDFs = async () => {
    try {
      setIsLoading(true);

      // Request all PDF files
      const response = await fetch('/api/pdfs?sort=asc');
      const pdfList: PDF[] = await response.json();

      // Ensure sorting by ID in ascending order
      pdfList.sort((a, b) => a.id - b.id);

      // Fetch categories for grouping
      const catResponse = await fetch('/api/categories');
      const categoriesData = await catResponse.json();

      // Filter categories if filterCategoryIds is provided
      const filteredCategories = filterCategoryIds ? categoriesData.filter((category: any) => filterCategoryIds.includes(category.id)) : categoriesData;

      // Group PDFs by category
      const groupedData = filteredCategories.map((category: any) => {
        const categoryPdfs = pdfList.filter(pdf => pdf.categoryId === category.id) || [];
        return {
          id: category.id,
          name: category.name,
          description: category.description,
          pdfs: categoryPdfs
        };
      }).filter((category: Category) => category.pdfs.length > 0);

      // Initialize all categories as expanded
      const initialExpandedState: Record<number, boolean> = {};
      groupedData.forEach((category: Category) => {
        initialExpandedState[category.id] = true;
      });
      setExpandedCategories(initialExpandedState);
      setPdfsByCategory(groupedData);
    } catch (error) {
      console.error('Error fetching PDFs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDownloadPDF = async (pdf: PDF) => {
    setDownloadStatus({
      id: pdf.id,
      status: 'downloading'
    });
    try {
      const response = await fetch(pdf.fileUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${pdf.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setDownloadStatus({
        id: pdf.id,
        status: 'completed'
      });
      setTimeout(() => {
        setDownloadStatus({
          id: null,
          status: null
        });
      }, 3000);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setDownloadStatus({
        id: null,
        status: null
      });
      // Fallback: open in new tab
      window.open(pdf.fileUrl, '_blank');
    }
  };
  const handleReadPDF = (pdf: PDF) => {
    setSelectedPDF(pdf);
  };
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  if (isLoading) {
    return <div className="flex justify-center py-8" data-unique-id="feb174bf-b405-492e-97e2-04272427d9a6" data-file-name="components/PreviewPDF.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="c4eb6201-72eb-4f17-8339-ede1ff963bb1" data-file-name="components/PreviewPDF.tsx"></div>
      </div>;
  }
  if (pdfsByCategory.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="68999626-357a-4b62-bd0a-91c02de55483" data-file-name="components/PreviewPDF.tsx"><span className="editable-text" data-unique-id="50c70258-bd76-421e-b961-4b6d321e52fd" data-file-name="components/PreviewPDF.tsx">
        Tidak ada PDF yang tersedia.
      </span></p>;
  }
  if (selectedPDF) {
    return <div className="space-y-4" data-unique-id="3403c69a-746b-4320-b412-2f3853941b07" data-file-name="components/PreviewPDF.tsx">
        <div className="flex items-center justify-between" data-unique-id="21064722-e142-4551-befd-86eaad1c3ba4" data-file-name="components/PreviewPDF.tsx">
          <button onClick={() => setSelectedPDF(null)} className="text-blue-600 hover:text-blue-800 text-sm font-medium" data-unique-id="fc50eb0b-f05f-409a-9630-85ac51ec5f23" data-file-name="components/PreviewPDF.tsx"><span className="editable-text" data-unique-id="51b405a0-349c-4528-bd6b-6b191529f869" data-file-name="components/PreviewPDF.tsx">
            ← Kembali ke daftar PDF
          </span></button>
        </div>
        
        <UniversalPDFViewerWrapper pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} onDownload={() => handleDownloadPDF(selectedPDF)} />
      </div>;
  }
  return <div className="border rounded-lg p-6" data-unique-id="000b2b4c-4cd0-4b01-95fe-a79db8944051" data-file-name="components/PreviewPDF.tsx">
      <div className="space-y-8" data-unique-id="a46031b0-14b4-417c-8c5d-14309b6a2515" data-file-name="components/PreviewPDF.tsx" data-dynamic-text="true">
        {pdfsByCategory.map(category => <PDFCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} onDownloadPDF={handleDownloadPDF} onReadPDF={handleReadPDF} downloadStatus={downloadStatus} currentReadingPDF={selectedPDF} />)}
      </div>
    </div>;
}