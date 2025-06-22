'use client';

import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import PDFViewer component to avoid SSR issues
const PDFViewerComponent = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="48496801-12a1-419e-a8bf-b01ef8789d7e" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" data-unique-id="2ec60c71-507b-4e72-b827-81a554fa9d6a" data-file-name="components/preview/pdf/PDFViewer.tsx"></div>
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
  return <div data-unique-id="01007a18-a94c-485d-b9bf-79c683db6f8d" data-file-name="components/preview/pdf/PDFViewer.tsx">
      <div className="mb-4" data-unique-id="35dbd9d6-8dc0-4b85-a8ff-9750d48319ce" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <h2 className="text-2xl font-semibold" data-unique-id="2d817ff0-5527-4799-9f92-502dde60f6d6" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-muted-foreground" data-unique-id="2d7c723f-f8b9-4139-81f4-2123222a0f81" data-file-name="components/preview/pdf/PDFViewer.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>
      
      <div className="h-[70vh] border rounded-lg overflow-hidden bg-white" data-unique-id="c807dce8-494e-4f45-879b-db932cad9fac" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <PDFViewerComponent pdfUrl={selectedPDF.fileUrl} title={selectedPDF.title} />
      </div>
      
      <div className="mt-4 flex justify-end gap-2" data-unique-id="16aacb69-53ff-441b-a631-1412cfcd1581" data-file-name="components/preview/pdf/PDFViewer.tsx">
        <Button onClick={openInNewTab} variant="outline" className="flex items-center gap-1" data-unique-id="8bc1f7fc-55fd-4c3e-b78b-ca46ba911452" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <ExternalLink className="h-4 w-4" />
          <span className="editable-text" data-unique-id="7b649bb9-5a70-4823-9005-ce30de07be40" data-file-name="components/preview/pdf/PDFViewer.tsx">Open in New Tab</span>
        </Button>
        <Button onClick={() => onDownloadPDF(selectedPDF)} variant="outline" className="flex items-center gap-1" data-unique-id="87778e6c-37d4-4dea-893b-a33c2649b5e6" data-file-name="components/preview/pdf/PDFViewer.tsx">
          <Download className="h-4 w-4" />
          <span className="editable-text" data-unique-id="54405a26-c6ff-47bb-b3c5-96291b39fc1a" data-file-name="components/preview/pdf/PDFViewer.tsx">Download PDF</span>
        </Button>
      </div>
    </div>;
}