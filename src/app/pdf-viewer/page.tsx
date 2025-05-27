import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { PDFViewerClientWrapper } from '@/components/ClientWrappers';
export default function PDFViewerPage() {
  return <div className="container mx-auto px-4 py-8" data-unique-id="21dc33de-a4f5-4e44-bee6-5981c268b0bd" data-file-name="app/pdf-viewer/page.tsx">
      <Card className="mb-6" data-unique-id="7c290232-2f82-4df2-8260-3a2f6f55ddb8" data-file-name="app/pdf-viewer/page.tsx">
        <CardHeader data-unique-id="d77c3976-3b65-4eac-b55c-01f23aac0b1a" data-file-name="app/pdf-viewer/page.tsx">
          <CardTitle data-unique-id="821b66d7-3e4e-41d8-bdf5-3feae7bdf3e4" data-file-name="app/pdf-viewer/page.tsx"><span className="editable-text" data-unique-id="da1b6e28-58ad-446f-bd68-76cbc90937cc" data-file-name="app/pdf-viewer/page.tsx">PDF Viewer</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="0640588f-e4ec-4053-bcf2-1ad11697a346" data-file-name="app/pdf-viewer/page.tsx">
            Loading PDF viewer...
          </span></CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={<div className="flex justify-center p-6" data-unique-id="631a8c9f-dcf1-4f80-937d-15c634582b37" data-file-name="app/pdf-viewer/page.tsx">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>}>
        <PDFViewerClientWrapper />
      </Suspense>
    </div>;
}