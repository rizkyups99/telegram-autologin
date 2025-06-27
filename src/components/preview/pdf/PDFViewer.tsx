'use client';

import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PDFViewer component to avoid SSR issues
const PDFViewerComponent = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="ddff2c0b-e8bb-4af8-952c-e8f24a1562e6" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="cb0104c8-6592-43ce-baa9-5e6b2ee70943" data-file-name="components/preview/pdf/PDFViewer.tsx"></div>
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
  return <div data-unique-id="20a6774e-f38a-481d-b5b1-9e416b03bbc6" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="mb-4" data-unique-id="3ce60b3e-71b7-40a6-96db-e5732544e844" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <h2 className="text-2xl font-semibold" data-unique-id="fbb518c3-6029-4aee-9d24-ce21dbf8d010" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-muted-foreground" data-unique-id="12bb143b-9e47-41b9-bbc5-5bdec6355a74" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>
      
      <div className="h-[70vh] border rounded-lg overflow-hidden bg-white" data-unique-id="1036eabb-b35c-4c5b-acc6-9c220cbe981c" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <PDFViewerComponent pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} />
      </div>
      
      <div className="mt-4 flex justify-end gap-2" data-unique-id="067060ca-7949-4647-ab61-ce6eff90d3b5" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <Button onClick={openInNewTab} variant="outline" className="flex items-center gap-1" data-unique-id="181bf8b8-fd28-4080-adc3-8c0cf01da638" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <ExternalLink className="h-4 w-4" />
          <span className="editable-text" data-unique-id="eedfe378-2f86-4cf4-b3a6-808fc8dbf827" data-file-name="components/preview/pdf/PDFViewer.tsx">Open in New Tab</span>
        </Button>
        <Button onClick={() => onDownloadPDF(selectedPDF)} variant="outline" className="flex items-center gap-1" data-unique-id="15943083-2b22-4981-81e3-5568bb97ebd2" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <Download className="h-4 w-4" />
          <span className="editable-text" data-unique-id="c9ecf67e-e2ca-48db-a0f2-e81886804cfd" data-file-name="components/preview/pdf/PDFViewer.tsx">Download PDF</span>
        </Button>
      </div>
    </div>;
}