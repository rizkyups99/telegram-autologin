import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { PDFViewerClientWrapper } from '@/components/ClientWrappers';
export default function PDFViewerPage() {
  return <div className="container mx-auto px-4 py-8" data-unique-id="8e50dd21-811a-4a7e-a713-0d944afeccf8" data-file-name="app/pdf-viewer/page.tsx">
      <Card className="mb-6" data-unique-id="e9d4c974-c4b4-421b-a6cc-31f8f4d818be" data-file-name="app/pdf-viewer/page.tsx">
        <CardHeader data-unique-id="bde82e8f-5ba7-4354-82e7-f1114c83eb1a" data-file-name="app/pdf-viewer/page.tsx">
          <CardTitle data-unique-id="1ff0145f-feeb-4160-8eac-932c628dacd3" data-file-name="app/pdf-viewer/page.tsx"><span className="editable-text" data-unique-id="6676da85-cef5-42f3-9a4a-2ceb7f319869" data-file-name="app/pdf-viewer/page.tsx">PDF Viewer</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="cf895fe4-9782-44e8-8204-52d5b286c4b8" data-file-name="app/pdf-viewer/page.tsx">
            Loading PDF viewer...
          </span></CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={<div className="flex justify-center p-6" data-unique-id="ed60028b-e80d-4321-b0be-1cddb3d1a60f" data-file-name="app/pdf-viewer/page.tsx">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>}>
        <PDFViewerClientWrapper />
      </Suspense>
    </div>;
}