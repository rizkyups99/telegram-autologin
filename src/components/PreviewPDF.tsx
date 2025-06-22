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
    return <div className="flex justify-center py-8" data-unique-id="ac37d1cb-a542-4b32-bbbb-1e8b9840d6be" data-file-name="components/PreviewPDF.tsx">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="1901a548-39c3-4f06-a976-dccb8a1057a0" data-file-name="components/PreviewPDF.tsx"></div>
      </div>;
  }
  if (pdfsByCategory.length === 0) {
    return <p className="text-center py-8 text-muted-foreground" data-unique-id="ba14ce39-9cae-498b-821c-dcf287e4c538" data-file-name="components/PreviewPDF.tsx"><span className="editable-text" data-unique-id="a6e038f2-4c2b-49f6-b6a2-8838a225974b" data-file-name="components/PreviewPDF.tsx">
        Tidak ada PDF yang tersedia.
      </span></p>;
  }
  if (selectedPDF) {
    return <div className="space-y-4" data-unique-id="d434c8aa-15bf-4a52-a789-ac281941aab3" data-file-name="components/PreviewPDF.tsx">
        <div className="flex items-center justify-between" data-unique-id="8fd994a1-6678-432d-be62-0cf569a0acee" data-file-name="components/PreviewPDF.tsx">
          <button onClick={() => setSelectedPDF(null)} className="text-blue-600 hover:text-blue-800 text-sm font-medium" data-unique-id="c863299f-033d-46f9-a6e6-19d9425db6a7" data-file-name="components/PreviewPDF.tsx"><span className="editable-text" data-unique-id="969644d1-65c6-4c1d-bf8b-0f82002c065a" data-file-name="components/PreviewPDF.tsx">
            ← Kembali ke daftar PDF
          </span></button>
        </div>
        
        <UniversalPDFViewerWrapper pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} onDownload={() => handleDownloadPDF(selectedPDF)} />
      </div>;
  }
  return <div className="border rounded-lg p-6" data-unique-id="813824fb-cf47-47bd-bea4-6704e4bf1fc0" data-file-name="components/PreviewPDF.tsx">
      <div className="space-y-8" data-unique-id="babae27c-741e-4d1b-8255-5415638768bc" data-file-name="components/PreviewPDF.tsx" data-dynamic-text="true">
        {pdfsByCategory.map(category => <PDFCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} onDownloadPDF={handleDownloadPDF} onReadPDF={handleReadPDF} downloadStatus={downloadStatus} currentReadingPDF={selectedPDF} />)}
      </div>
    </div>;
}