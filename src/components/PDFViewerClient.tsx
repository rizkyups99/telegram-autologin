'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the PDFViewer component with ssr: false
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="09f6219b-d5dd-458b-bc4c-daf9b5e27862" data-file-name="components/PDFViewerClient.tsx">
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
    return <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="d148e9aa-c66c-4c85-8279-6f5f96b94da2" data-file-name="components/PDFViewerClient.tsx">
        <Loader className="h-8 w-8 animate-spin" />
      </div>;
  }
  if (!pdfId && !pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="145c251c-ba3a-42a4-b7a2-763bd729ccaf" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="bdcdec0b-89c3-41fd-86ac-902b635b7dc0" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="84b4ec00-b119-4388-82bc-4a0facdec0b0" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="1f21ec8c-6c93-4132-baba-cab5de0f46fa" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="e97a63ff-2557-4f10-b0dc-8a51366e9584" data-file-name="components/PDFViewerClient.tsx">PDF Viewer</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="54a5d7b0-22ec-4bba-b80a-14e62059089a" data-file-name="components/PDFViewerClient.tsx">No PDF specified. Please provide a PDF ID or URL.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  return <div data-unique-id="093f25de-9260-4992-b633-5f9de96e2729" data-file-name="components/PDFViewerClient.tsx">
      <Card className="mb-6" data-unique-id="098345ab-b795-474e-b305-e7680d1c68a1" data-file-name="components/PDFViewerClient.tsx">
        <CardHeader data-unique-id="678fbf1e-a0c8-4619-9627-88e0681b714f" data-file-name="components/PDFViewerClient.tsx">
          <CardTitle data-unique-id="0eeacfd0-bb2d-415a-b1d2-b3971174c7ad" data-file-name="components/PDFViewerClient.tsx" data-dynamic-text="true">{title || 'PDF Viewer'}</CardTitle>
          <CardDescription>
            {pdfId ? `Viewing PDF ID: ${pdfId}` : 'Viewing PDF from URL'}
          </CardDescription>
        </CardHeader>
      </Card>
      
      <PDFViewer pdfId={pdfId} pdfUrl={pdfUrl} title={title} />
    </div>;
}