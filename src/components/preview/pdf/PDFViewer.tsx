'use client';

import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PDFViewer component to avoid SSR issues
const PDFViewerComponent = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="4d38912d-ab61-41e1-8af6-5d3b6978e353" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="d5dddffe-f3b8-44c7-891b-fea592e19249" data-file-name="components/preview/pdf/PDFViewer.tsx"></div>
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
  return <div data-unique-id="5378f2b6-0ce8-4eb5-a49e-c1043411ba65" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="mb-4" data-unique-id="d2a8b3b9-f7b7-49a2-9e1c-bd68c69577c2" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <h2 className="text-2xl font-semibold" data-unique-id="81d3d2ed-47c0-45f0-95ee-9411651d4626" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-muted-foreground" data-unique-id="5b02f37d-b6a8-48b3-aad9-007a80457d25" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>
      
      <div className="h-[70vh] border rounded-lg overflow-hidden bg-white" data-unique-id="2d9b9757-d3ee-4e62-b611-987a1778cc53" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <PDFViewerComponent pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} />
      </div>
      
      <div className="mt-4 flex justify-end gap-2" data-unique-id="3dcd3144-8d19-4174-93c3-b479795df2b3" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <Button onClick={openInNewTab} variant="outline" className="flex items-center gap-1" data-unique-id="af1b07e6-6452-4f4b-8cfd-c9bd8585a783" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <ExternalLink className="h-4 w-4" />
          <span className="editable-text" data-unique-id="0e8260de-3642-4626-9464-96332ec5e810" data-file-name="components/preview/pdf/PDFViewer.tsx">Open in New Tab</span>
        </Button>
        <Button onClick={() => onDownloadPDF(selectedPDF)} variant="outline" className="flex items-center gap-1" data-unique-id="c97b4f3a-4dda-4655-a10f-d4b684185d3d" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <Download className="h-4 w-4" />
          <span className="editable-text" data-unique-id="6769d33f-cefe-44cb-9da6-07fdd0a55caa" data-file-name="components/preview/pdf/PDFViewer.tsx">Download PDF</span>
        </Button>
      </div>
    </div>;
}