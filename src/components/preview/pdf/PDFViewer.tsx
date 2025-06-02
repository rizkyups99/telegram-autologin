'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PDFViewer component to avoid SSR issues
const PDFViewerComponent = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="c55bc08a-ae92-4440-894c-fcdcceedd853" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="56d8b0b9-0e76-4431-b9fd-ca715b049671" data-file-name="components/preview/pdf/PDFViewer.tsx"></div>
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
  return <div data-unique-id="478c6bc6-b520-4cf2-8e80-576547196dee" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="mb-4" data-unique-id="2cd61ba9-5343-4d61-86c4-38d53bc26d76" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <h2 className="text-2xl font-semibold" data-unique-id="75bb0969-b9dd-452d-a5b7-5bff2129c612" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-muted-foreground" data-unique-id="db0bca72-57d8-4641-9483-b977eeeaf255" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>
      
      <div className="h-[70vh] border rounded-lg overflow-hidden" data-unique-id="2a19bb6d-c26c-416e-b8b6-9d6119f22607" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <PDFViewerComponent pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} />
      </div>
      
      <div className="mt-4 flex justify-end" data-unique-id="8f94eeb0-3dd0-4649-b532-580658aeba29" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <Button onClick={() => onDownloadPDF(selectedPDF)} variant="outline" className="flex items-center gap-1" data-unique-id="d5f23bce-ff9c-4c56-a756-8f1a152027e7" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <Download className="h-4 w-4" /><span className="editable-text" data-unique-id="3dadf3ff-2da2-4d36-9a2c-d0957b65e919" data-file-name="components/preview/pdf/PDFViewer.tsx">
          Download PDF
        </span></Button>
      </div>
    </div>;
}