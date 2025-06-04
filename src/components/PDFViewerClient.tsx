'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the PDFViewer component with ssr: false
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="4d7cefde-64a2-4cdd-811c-9a67d2132068" data-file-name="components/PDFViewerClient.tsx">
      <Loader className="h-8 w-8 animate-spin text-primary" />
    </div>
});
export default function PDFViewerClient() {
  const [pdfId, setPdfId] = useState<number | undefined>(undefined);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Get search params directly from window.location
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('id');
      const urlParam = params.get('url');
      if (idParam) {
        setPdfId(parseInt(idParam));
      }
      if (urlParam) {
        setPdfUrl(urlParam);
      }
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
    }
  }, []);

  // Fetch PDF title if ID is provided
  useEffect(() => {
    if (!pdfId) {
      setIsLoading(false);
      return;
    }
    const fetchPdfTitle = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('pdfs').select('title').eq('id', pdfId).single();
        if (error) {
          console.error('Error fetching PDF title:', error);
        } else if (data) {
          setTitle(data.title);
        }
      } catch (error) {
        console.error('Error fetching PDF title:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPdfTitle();
  }, [pdfId]);
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="4871fd03-6e7d-467b-aeb2-7a94357b427e" data-file-name="components/PDFViewerClient.tsx">
        <Loader className="h-8 w-8 animate-spin" />
      </div>;
  }
  if (!pdfId && !pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="db93af1a-3f8c-4ff8-846e-2162341ca572" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="c8c95bf6-2d7a-446f-a8c6-dadbd56660e3" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="9c7e44ac-cdb7-4489-946b-f429fb0579b3" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="cc06066a-0e46-4730-aa5b-3b0ab7444399" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="3d0afc03-0903-4120-afec-6e08bf10a1d6" data-file-name="components/PDFViewerClient.tsx">PDF Viewer</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="75708490-21a0-4bb3-8c15-710f49c88825" data-file-name="components/PDFViewerClient.tsx">No PDF specified. Please provide a PDF ID or URL.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  return <div data-unique-id="8f4fa58d-28ec-4ee4-bc12-151ad55227d2" data-file-name="components/PDFViewerClient.tsx">
      <Card className="mb-6" data-unique-id="137f42db-27d8-47a2-b432-209086992789" data-file-name="components/PDFViewerClient.tsx">
        <CardHeader data-unique-id="8d3b5cda-04c6-4394-860c-1e68ecac197d" data-file-name="components/PDFViewerClient.tsx">
          <CardTitle data-unique-id="9b7f05b4-28dc-4665-8708-ff4864fd1f97" data-file-name="components/PDFViewerClient.tsx" data-dynamic-text="true">{title || 'PDF Viewer'}</CardTitle>
          <CardDescription>
            {pdfId ? `Viewing PDF ID: ${pdfId}` : 'Viewing PDF from URL'}
          </CardDescription>
        </CardHeader>
      </Card>
      
      <PDFViewer pdfId={pdfId} pdfUrl={pdfUrl} title={title} />
    </div>;
}