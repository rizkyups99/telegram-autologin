'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PDFViewer component to avoid SSR issues
const PDFViewerComponent = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="674ef8ba-a057-40fa-adf9-bba00b591e07" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="122dfceb-c05d-4203-b605-cc702f4cce83" data-file-name="components/preview/pdf/PDFViewer.tsx"></div>
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
  return <div data-unique-id="585b76a0-2f23-4abd-9868-1786ecf9f41d" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="mb-4" data-unique-id="533cd293-5b0b-4d37-bf8e-f3e271f8ba6e" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <h2 className="text-2xl font-semibold" data-unique-id="afd8c3a4-bcf6-46c9-9d2a-3ff8e617addd" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-muted-foreground" data-unique-id="d4932342-61f9-4f27-992a-de61ee0dbb1c" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>
      
      <div className="h-[70vh] border rounded-lg overflow-hidden" data-unique-id="2af60f5a-7733-4342-9743-b557d331e370" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <PDFViewerComponent pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} />
      </div>
      
      <div className="mt-4 flex justify-end" data-unique-id="de9a33ef-f9a8-46d4-970c-b1ccd737ac75" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <Button onClick={() => onDownloadPDF(selectedPDF)} variant="outline" className="flex items-center gap-1" data-unique-id="4e89f7b1-2e5a-4d21-ac5d-bc7ccc229dc2" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <Download className="h-4 w-4" /><span className="editable-text" data-unique-id="81db4f90-8afa-4f55-9daf-08ca3c25ed72" data-file-name="components/preview/pdf/PDFViewer.tsx">
          Download PDF
        </span></Button>
      </div>
    </div>;
}