'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the PDFViewer component with ssr: false
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => <div className="flex justify-center p-6" data-unique-id="5adbd510-9f54-4106-9ce0-949fe42f5890" data-file-name="components/PDFViewerClient.tsx">
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
    return <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="1f09c132-2d74-4334-81ba-10bd221c10d3" data-file-name="components/PDFViewerClient.tsx">
        <Loader className="h-8 w-8 animate-spin" />
      </div>;
  }
  if (!pdfId && !pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="4eb186b4-b082-4f79-9c2e-168d03e2a614" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="dcf236ae-3de1-40a0-8ab0-7b16699dc304" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="d2508458-5b42-4f06-ba35-ee503a5a3e4b" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="e4e34e92-fbf4-4549-b76d-ab35d3d06873" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="0ffd1f7b-3e94-4b59-83ad-fa0a5992d272" data-file-name="components/PDFViewerClient.tsx">PDF Viewer</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="b99376cf-8d5b-413a-8fc1-28ff4356f6fd" data-file-name="components/PDFViewerClient.tsx">No PDF specified. Please provide a PDF ID or URL.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  return <div data-unique-id="1a1ee2ca-868a-49f8-a3eb-e93885345a9a" data-file-name="components/PDFViewerClient.tsx">
      <Card className="mb-6" data-unique-id="9b026f8e-57c8-4e4d-8815-e42a13768fa3" data-file-name="components/PDFViewerClient.tsx">
        <CardHeader data-unique-id="3202c70b-84de-4ca0-b5b5-2ca92296005b" data-file-name="components/PDFViewerClient.tsx">
          <CardTitle data-unique-id="994ca3cb-bb47-412b-8c53-0fbd91b9eb4c" data-file-name="components/PDFViewerClient.tsx" data-dynamic-text="true">{title || 'PDF Viewer'}</CardTitle>
          <CardDescription>
            {pdfId ? `Viewing PDF ID: ${pdfId}` : 'Viewing PDF from URL'}
          </CardDescription>
        </CardHeader>
      </Card>
      
      <PDFViewer pdfId={pdfId} pdfUrl={pdfUrl} title={title} />
    </div>;
}