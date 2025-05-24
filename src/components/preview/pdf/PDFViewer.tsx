'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PDFViewer component to avoid SSR issues
const PDFViewerComponent = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="401cbfc4-96ba-4e0f-9d0e-2e6d384fedcc" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="82795715-c65c-4285-bf34-4cea114c6522" data-file-name="components/preview/pdf/PDFViewer.tsx"></div>
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
  return <div data-unique-id="d15acf2f-64dc-4dba-8895-420ac5a41445" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="mb-4" data-unique-id="a9a3d660-c562-4f2d-b377-cc9a609bfd39" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <h2 className="text-2xl font-semibold" data-unique-id="f589f91b-df7a-4cb1-8572-cf8e20142d19" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-muted-foreground" data-unique-id="ccac2c02-6c16-4a3c-a34e-e6a3eba897fd" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>
      
      <div className="h-[70vh] border rounded-lg overflow-hidden" data-unique-id="46f92dd4-030c-402e-afee-8efa1015e8b0" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <PDFViewerComponent pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} />
      </div>
      
      <div className="mt-4 flex justify-end" data-unique-id="b7272548-5ad4-438b-835b-6620c8393ccb" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <Button onClick={() => onDownloadPDF(selectedPDF)} variant="outline" className="flex items-center gap-1" data-unique-id="61fe7b95-4d7f-494e-9c80-4b0917284c21" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <Download className="h-4 w-4" /><span className="editable-text" data-unique-id="36fdf4e6-91ab-48cc-a0ee-96d4193a3517" data-file-name="components/preview/pdf/PDFViewer.tsx">
          Download PDF
        </span></Button>
      </div>
    </div>;
}