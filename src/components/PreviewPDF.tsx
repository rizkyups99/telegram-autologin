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
    return <div className="flex justify-center py-8" data-unique-id="21a26bd7-bff1-4970-8ab0-be6a418e6794" data-file-name="components/PreviewPDF.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="3cec0ddf-a152-4a2c-a3ae-eec27668c1ce" data-file-name="components/PreviewPDF.tsx"></div>
      </div>;
  }
  if (pdfsByCategory.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="3f2db079-143e-480d-8aa4-e938ee7655fa" data-file-name="components/PreviewPDF.tsx"><span className="editable-text" data-unique-id="6bafcd08-6c01-4e20-b4ba-ccdf1ab0cfa0" data-file-name="components/PreviewPDF.tsx">
        Tidak ada PDF yang tersedia.
      </span></p>;
  }
  if (selectedPDF) {
    return <div className="space-y-4" data-unique-id="afef18f5-06ee-4def-a561-62f7dad6d57d" data-file-name="components/PreviewPDF.tsx">
        <div className="flex items-center justify-between" data-unique-id="1328d6ab-fccf-4a2c-a263-2c70a7be59a6" data-file-name="components/PreviewPDF.tsx">
          <button onClick={() => setSelectedPDF(null)} className="text-blue-600 hover:text-blue-800 text-sm font-medium" data-unique-id="6ade830f-0c51-4a08-9344-4e62a0573e22" data-file-name="components/PreviewPDF.tsx"><span className="editable-text" data-unique-id="33a1f321-7d9c-441b-a29a-ac5663f1365f" data-file-name="components/PreviewPDF.tsx">
            ← Kembali ke daftar PDF
          </span></button>
        </div>
        
        <UniversalPDFViewerWrapper pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} onDownload={() => handleDownloadPDF(selectedPDF)} />
      </div>;
  }
  return <div className="border rounded-lg p-6" data-unique-id="3bfd4d31-74ae-41e8-98ab-0c10e8474d65" data-file-name="components/PreviewPDF.tsx">
      <div className="space-y-8" data-unique-id="0c4ad14a-e004-434c-b4f7-cde8eaa098b3" data-file-name="components/PreviewPDF.tsx" data-dynamic-text="true">
        {pdfsByCategory.map(category => <PDFCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} onDownloadPDF={handleDownloadPDF} onReadPDF={handleReadPDF} downloadStatus={downloadStatus} currentReadingPDF={selectedPDF} />)}
      </div>
    </div>;
}