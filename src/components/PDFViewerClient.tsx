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
    return <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="f94b0de6-8345-4b1d-86bb-12154b38a1e9" data-file-name="components/PDFViewerClient.tsx">
        <Loader className="h-8 w-8 animate-spin" />
      </div>;
  }
  if (!pdfId && !pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="61533802-5f96-49e6-a9e4-2e73a527c319" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="6cd70a98-1f82-41ff-ae02-2f610917a473" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="1ff37e90-04c0-45b2-81c7-ea641b758d81" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="e9c35278-947c-4078-a1b1-0ae3d98eee5a" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="19fb639b-156b-495f-a36a-cd77db152caa" data-file-name="components/PDFViewerClient.tsx">PDF Viewer</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="07cf20d6-eed4-488d-8576-719522ab1940" data-file-name="components/PDFViewerClient.tsx">No PDF specified. Please provide a PDF ID or URL.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  if (!pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="95ea67b1-c26e-4e04-be2b-196a879a447a" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="2f97a3f2-15da-4933-a20c-bd354ed4120e" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="8bc070b5-cc3d-4de7-9e45-0e015790ce9b" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="0b87127e-9292-4fb7-831c-150ab8009cf2" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="90ccb184-cea7-47e7-931e-1cbda40c3bcb" data-file-name="components/PDFViewerClient.tsx">PDF Not Found</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="7e240fad-c98e-4bfd-a94d-e148dbcad4c3" data-file-name="components/PDFViewerClient.tsx">The requested PDF could not be loaded.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  return <div className="container mx-auto px-4 py-8" data-unique-id="bc556322-adf9-47cd-8841-4199d40007c8" data-file-name="components/PDFViewerClient.tsx">
      <UniversalPDFViewer pdfUrl={pdfUrl} title={title} onDownload={handleDownload} />
    </div>;
}