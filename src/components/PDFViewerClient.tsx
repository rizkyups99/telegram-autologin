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
    return <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="93ad3bec-95ee-4f70-a51b-ff118f9252ae" data-file-name="components/PDFViewerClient.tsx">
        <Loader className="h-8 w-8 animate-spin" />
      </div>;
  }
  if (!pdfId && !pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="87fbb850-e197-4413-9f28-a13a531dbd06" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="04d62bed-d01e-4dd9-8248-d38d8e90474e" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="ce00b933-519d-4221-8d59-0ad799411059" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="dfa5dafb-d679-4972-bce1-b280d3e8d55c" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="9e07fa4c-1463-434a-a400-e0312a3e7224" data-file-name="components/PDFViewerClient.tsx">PDF Viewer</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="e5a102a1-fc11-4770-afd1-686c617caf98" data-file-name="components/PDFViewerClient.tsx">No PDF specified. Please provide a PDF ID or URL.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  if (!pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="3f7eda18-7a4b-4dbd-a9b0-e73c8a8d24eb" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="050a8ac5-0bca-4f41-8efa-a063b6af6c0d" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="ab9ab937-7bc9-4757-aaca-6db384a77094" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="8dc8dacf-44fa-4d25-bfca-c8b8f530aa53" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="55ba6980-abb4-4e07-9515-e5c2e3594061" data-file-name="components/PDFViewerClient.tsx">PDF Not Found</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="6b8e53e5-e6cf-4f28-bc0c-7d5a97c90435" data-file-name="components/PDFViewerClient.tsx">The requested PDF could not be loaded.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  return <div className="container mx-auto px-4 py-8" data-unique-id="b269a31f-d1ca-4a4d-93b9-e413c646cb50" data-file-name="components/PDFViewerClient.tsx">
      <UniversalPDFViewer pdfUrl={pdfUrl} title={title} onDownload={handleDownload} />
    </div>;
}