import { Suspense } from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import { PDFViewerClientWrapper } from '@/components/ClientWrappers';

export default function PDFViewerPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>PDF Viewer</CardTitle>
          <CardDescription>
            Loading PDF viewer...
          </CardDescription>
        </CardHeader>
      </Card>

      <Suspense fallback={
        <div className="flex justify-center p-6">
          <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
      }>
        <PDFViewerClientWrapper />
      </Suspense>
    </div>
  );
}
