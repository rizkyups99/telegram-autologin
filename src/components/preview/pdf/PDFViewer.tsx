'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PDFViewer component to avoid SSR issues
const PDFViewerComponent = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="ee21f62f-0996-497c-a288-b885ce133598" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="5a1e07c5-7360-4f35-bed7-12b988c1db8b" data-file-name="components/preview/pdf/PDFViewer.tsx"></div>
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
  return <div data-unique-id="6886eca4-a293-4b02-a4f3-e862de212f71" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="mb-4" data-unique-id="80a5de63-ab90-435b-863a-56db28f28587" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <h2 className="text-2xl font-semibold" data-unique-id="9b4f13c7-7197-479b-92c6-bdcf8e30a608" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-muted-foreground" data-unique-id="34031627-1e13-4894-a0ab-b2bde74ab98c" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>
      
      <div className="h-[70vh] border rounded-lg overflow-hidden" data-unique-id="52f67773-4625-478d-92df-bf71667ec481" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <PDFViewerComponent pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} />
      </div>
      
      <div className="mt-4 flex justify-end" data-unique-id="808da055-3b2f-42d8-b232-5286b0da8d30" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <Button onClick={() => onDownloadPDF(selectedPDF)} variant="outline" className="flex items-center gap-1" data-unique-id="ca5407fd-f84e-4bc7-a712-57f014e1f36e" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <Download className="h-4 w-4" /><span className="editable-text" data-unique-id="76bacb58-62f5-4352-89e7-87b03d4f9f07" data-file-name="components/preview/pdf/PDFViewer.tsx">
          Download PDF
        </span></Button>
      </div>
    </div>;
}