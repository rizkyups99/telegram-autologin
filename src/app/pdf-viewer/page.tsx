import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { PDFViewerClientWrapper } from '@/components/ClientWrappers';
export default function PDFViewerPage() {
  return <div className="container mx-auto px-4 py-8" data-unique-id="0d8804eb-cd3d-40aa-a3e3-2506e6eab7f3" data-file-name="app/pdf-viewer/page.tsx">
      <Card className="mb-6" data-unique-id="c4d27ff6-b1ff-418f-903d-f368aa81b1ec" data-file-name="app/pdf-viewer/page.tsx">
        <CardHeader data-unique-id="f3b74b08-8276-46bc-890f-0c84a47de26b" data-file-name="app/pdf-viewer/page.tsx">
          <CardTitle data-unique-id="ff892174-397f-4061-8fa8-ecf9ec4f2217" data-file-name="app/pdf-viewer/page.tsx"><span className="editable-text" data-unique-id="9d4f2a18-0552-4e60-944e-bdc0a6b3341d" data-file-name="app/pdf-viewer/page.tsx">PDF Viewer</span></CardTitle>
          <CardDescription><span className="editable-text" data-unique-id="e482c86d-51be-4c41-b7a7-15dcf799d565" data-file-name="app/pdf-viewer/page.tsx">
            Loading PDF viewer...
          </span></CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={<div className="flex justify-center p-6" data-unique-id="7c16d57d-50c0-4538-bc41-c4250ba41448" data-file-name="app/pdf-viewer/page.tsx">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>}>
        <PDFViewerClientWrapper />
      </Suspense>
    </div>;
}