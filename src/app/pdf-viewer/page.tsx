import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { PDFViewerClientWrapper } from '@/components/ClientWrappers';
export default function PDFViewerPage() {
  return <div className="container mx-auto px-4 py-8" data-unique-id="2edd1cc1-3f91-4406-9b2d-4da0d57b3637" data-file-name="app/pdf-viewer/page.tsx">
      <Card className="mb-6" data-unique-id="e8bbb105-c492-44eb-9b88-27b579eab510" data-file-name="app/pdf-viewer/page.tsx">
        <CardHeader data-unique-id="bd200380-46ec-41b6-83f2-05b64f822afe" data-file-name="app/pdf-viewer/page.tsx">
          <CardTitle data-unique-id="c8f3e1ff-b147-49c3-ae31-a2a32e38a65d" data-file-name="app/pdf-viewer/page.tsx"><span className="editable-text" data-unique-id="c9f0f351-7d06-414a-8002-015f4c9669fa" data-file-name="app/pdf-viewer/page.tsx">PDF Viewer</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="f6b10ff2-c962-44f5-b222-1738148dc8dd" data-file-name="app/pdf-viewer/page.tsx">
            Loading PDF viewer...
          </span></CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={<div className="flex justify-center p-6" data-unique-id="7eaea041-1d53-40c3-b2fb-8b4ff2924f94" data-file-name="app/pdf-viewer/page.tsx">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>}>
        <PDFViewerClientWrapper />
      </Suspense>
    </div>;
}