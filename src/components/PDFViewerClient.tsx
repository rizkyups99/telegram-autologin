'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import UniversalPDFViewer from './UniversalPDFViewer';
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

  // Fetch PDF data if ID is provided
  useEffect(() => {
    if (!pdfId) {
      setIsLoading(false);
      return;
    }
    const fetchPdfData = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('pdfs').select('title, fileUrl').eq('id', pdfId).single();
        if (error) {
          console.error('Error fetching PDF data:', error);
        } else if (data) {
          setTitle(data.title);
          if (!pdfUrl && data.fileUrl) {
            setPdfUrl(data.fileUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching PDF data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPdfData();
  }, [pdfId]);
  const handleDownload = async () => {
    if (!pdfUrl) return;
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = title ? `${title}.pdf` : 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      if (pdfUrl) {
        window.open(pdfUrl, '_blank');
      }
    }
  };
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="60c84d33-afcc-4263-afda-6385c728d39b" data-file-name="components/PDFViewerClient.tsx">
        <Loader className="h-8 w-8 animate-spin" />
      </div>;
  }
  if (!pdfId && !pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="434c335e-940a-4ac8-ba60-03c3c4332f08" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="b0e8c99a-d0ce-4b23-a4d0-2c0be8092de6" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="c595e964-7e5d-4c35-9608-3ad2a7e807f9" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="813c0b81-95fa-448b-89ec-a72d4a468c9b" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="2f934235-fd6d-4c16-bf97-c22f1c337ad4" data-file-name="components/PDFViewerClient.tsx">PDF Viewer</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="ba53b9ad-cab5-4416-aefc-e479da1b4fb7" data-file-name="components/PDFViewerClient.tsx">No PDF specified. Please provide a PDF ID or URL.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  if (!pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="d2139506-9f9d-427b-b502-c2dac5188450" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="24d15f48-28cc-4454-852b-574505a1ec51" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="69dfaa02-94d1-4c69-abdf-200926770b5d" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="5c81944a-1555-4549-8d3c-832d27e8810e" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="208d4952-4cae-41f2-8c06-0a3b6b8ded85" data-file-name="components/PDFViewerClient.tsx">PDF Not Found</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="ff41853c-b78d-4d34-bb60-2a667fbfc66f" data-file-name="components/PDFViewerClient.tsx">The requested PDF could not be loaded.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  return <div className="container mx-auto px-4 py-8" data-unique-id="af8af296-2391-447a-b650-71d5188e9a80" data-file-name="components/PDFViewerClient.tsx">
      <UniversalPDFViewer pdfUrl={pdfUrl} title={title} onDownload={handleDownload} />
    </div>;
}