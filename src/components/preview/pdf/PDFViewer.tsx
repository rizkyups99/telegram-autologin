'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PDFViewer component to avoid SSR issues
const PDFViewerComponent = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center p-6">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
});

interface PDF {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}

interface PDFViewerProps {
  selectedPDF: PDF;
  onDownloadPDF: (pdf: PDF) => void;
  categoryName?: string;
}

export function PDFViewerPane({ 
  selectedPDF, 
  onDownloadPDF,
  categoryName
}: PDFViewerProps) {
  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">{selectedPDF.title}</h2>
        <p className="text-muted-foreground">{categoryName}</p>
      </div>
      
      <div className="h-[70vh] border rounded-lg overflow-hidden">
        <PDFViewerComponent pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} />
      </div>
      
      <div className="mt-4 flex justify-end">
        <Button 
          onClick={() => onDownloadPDF(selectedPDF)}
          variant="outline"
          className="flex items-center gap-1"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}
