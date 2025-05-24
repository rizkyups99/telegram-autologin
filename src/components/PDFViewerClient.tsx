'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the PDFViewer component with ssr: false
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="8528d17b-80a2-481f-ad29-7a5aacfd98a2" data-file-name="components/PDFViewerClient.tsx">
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
    return <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="ba207002-cedd-46d9-b964-2f5706702907" data-file-name="components/PDFViewerClient.tsx">
        <Loader className="h-8 w-8 animate-spin" />
      </div>;
  }
  if (!pdfId && !pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="889a4ad8-108d-48ba-9f8b-c9624ddbd99d" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="610f242e-0d07-4079-953b-d139ec1ffbd3" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="b25dcf77-1e2d-4157-a92d-896f76f801cb" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="74c8d8d8-c725-48ca-87b0-31c784787f5a" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="2abfa7e1-e305-4b0e-a480-1981dccda842" data-file-name="components/PDFViewerClient.tsx">PDF Viewer</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="87a6d4b9-7f46-48a5-8e9c-628815e42d5c" data-file-name="components/PDFViewerClient.tsx">No PDF specified. Please provide a PDF ID or URL.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  return <div data-unique-id="03ee24c2-4cd4-4c09-8e2f-cba180daf3e2" data-file-name="components/PDFViewerClient.tsx">
      <Card className="mb-6" data-unique-id="87cba593-087d-43ac-838e-68108fbe335e" data-file-name="components/PDFViewerClient.tsx">
        <CardHeader data-unique-id="503ea651-3e16-4052-b980-f86ae6efce6f" data-file-name="components/PDFViewerClient.tsx">
          <CardTitle data-unique-id="bd8eac86-c891-443d-92ec-9cd1b1308fa0" data-file-name="components/PDFViewerClient.tsx" data-dynamic-text="true">{title || 'PDF Viewer'}</CardTitle>
          <CardDescription>
            {pdfId ? `Viewing PDF ID: ${pdfId}` : 'Viewing PDF from URL'}
          </CardDescription>
        </CardHeader>
      </Card>
      
      <PDFViewer pdfId={pdfId} pdfUrl={pdfUrl} title={title} />
    </div>;
}