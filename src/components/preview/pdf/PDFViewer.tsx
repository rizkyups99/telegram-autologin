'use client';

import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PDFViewer component to avoid SSR issues
const PDFViewerComponent = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="ec6e7ba4-9a14-48dd-9abf-1e2a98ae2d3c" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="ecc97b8d-965e-4e75-9e05-e40587175503" data-file-name="components/preview/pdf/PDFViewer.tsx"></div>
    </div>
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
  const openInNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(selectedPDF.fileUrl, '_blank');
    }
  };
  return <div data-unique-id="006c0bbe-cef0-42cf-95ac-b968f3c7dcb9" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="mb-4" data-unique-id="fc864e28-7ac6-4024-a95b-9fe1e358051f" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <h2 className="text-2xl font-semibold" data-unique-id="c18ba4a3-6cf8-4c23-a6a5-443d72001722" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-muted-foreground" data-unique-id="8c8824ae-82a8-481d-b05b-93f61c1d1873" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>
      
      <div className="h-[70vh] border rounded-lg overflow-hidden bg-white" data-unique-id="6520f766-f2cc-4eb1-a5e7-2466265271a7" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <PDFViewerComponent pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} />
      </div>
      
      <div className="mt-4 flex justify-end gap-2" data-unique-id="b25d5587-d05f-4890-94ac-dbda4f568eac" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <Button onClick={openInNewTab} variant="outline" className="flex items-center gap-1" data-unique-id="7b14e592-6c54-4317-a9e5-fd68990979a6" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <ExternalLink className="h-4 w-4" />
          <span className="editable-text" data-unique-id="f2d959eb-a2aa-4194-b59b-d0b31e5d2625" data-file-name="components/preview/pdf/PDFViewer.tsx">Open in New Tab</span>
        </Button>
        <Button onClick={() => onDownloadPDF(selectedPDF)} variant="outline" className="flex items-center gap-1" data-unique-id="36f09a64-48d9-42e3-ba87-6c3fa3ca2839" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <Download className="h-4 w-4" />
          <span className="editable-text" data-unique-id="50283cac-3f6b-4bee-a84d-945caafdc4c8" data-file-name="components/preview/pdf/PDFViewer.tsx">Download PDF</span>
        </Button>
      </div>
    </div>;
}