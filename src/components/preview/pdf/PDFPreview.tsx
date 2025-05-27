'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  return <Card data-unique-id="5ce81826-7c35-4c29-b6c8-3482fc8fa7f3" data-file-name="components/preview/pdf/PDFPreview.tsx">
      <CardContent className="p-6" data-unique-id="6213641f-7f0c-4dfb-a348-d9f790896a7d" data-file-name="components/preview/pdf/PDFPreview.tsx">
        <div className="w-full" data-unique-id="e2ec2260-f6f0-4b0f-aa1a-66ded75f9d9c" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
          {isLoading ? <div className="flex justify-center py-8" data-unique-id="81b1db5e-a07c-4165-8b40-164554332b0c" data-file-name="components/preview/pdf/PDFPreview.tsx">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div> : categories.length === 0 ? <p className="text-center py-8 text-muted-foreground" data-unique-id="cd84c9e5-1458-4d5c-bf67-b3cbc4b202d4" data-file-name="components/preview/pdf/PDFPreview.tsx"><span className="editable-text" data-unique-id="14706621-23f6-48e4-80cd-16a37a28df59" data-file-name="components/preview/pdf/PDFPreview.tsx">Tidak ada PDF yang tersedia.</span></p> : <div className="space-y-6" data-unique-id="035383ed-4901-4ab4-a1fe-1e9e36c2f0c7" data-file-name="components/preview/pdf/PDFPreview.tsx" data-dynamic-text="true">
              {categories.map(category => <PDFCategoryItem key={category.id} category={category} isExpanded={!!expandedCategories[category.id]} toggleCategory={toggleCategory} onDownloadPDF={handleDownloadPDF} downloadStatus={downloadStatus} />)}
            </div>}
        </div>
      </CardContent>
    </Card>;
}