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
    return <div className="container mx-auto px-4 py-8 flex justify-center" data-unique-id="30c28998-1788-4819-bedf-799c27caa888" data-file-name="components/PDFViewerClient.tsx">
        <Loader className="h-8 w-8 animate-spin" />
      </div>;
  }
  if (!pdfId && !pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="d11446fc-b5f6-41b0-9eb5-1a632b3154ab" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="65015279-7178-4a52-99e5-eefd96ee0e0a" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="5569abf5-268c-4cf6-818f-c8c7cf5cdb71" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="a46ab934-fd26-47da-b03f-082e363e0a31" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="3142934d-da80-4ef6-84f5-f48ea2740fb2" data-file-name="components/PDFViewerClient.tsx">PDF Viewer</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="46863cf0-75ce-4c38-b9d3-5fe5be310dd5" data-file-name="components/PDFViewerClient.tsx">No PDF specified. Please provide a PDF ID or URL.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  if (!pdfUrl) {
    return <div className="container mx-auto px-4 py-8" data-unique-id="b6a2057d-9881-49ef-ac97-23c40dac7ac3" data-file-name="components/PDFViewerClient.tsx">
        <Card data-unique-id="c50a7ace-73e1-41af-983b-ded8b58555a6" data-file-name="components/PDFViewerClient.tsx">
          <CardHeader data-unique-id="f6984727-81de-4ea0-b2ec-2b4d21ec166f" data-file-name="components/PDFViewerClient.tsx">
            <CardTitle data-unique-id="1b9346a0-8a89-40b4-ae62-838b8753f897" data-file-name="components/PDFViewerClient.tsx"><span className="editable-text" data-unique-id="0e9ab450-d77e-4ad8-828c-ed8249b565e8" data-file-name="components/PDFViewerClient.tsx">PDF Not Found</span></CardTitle>
            <CardDescription><span className="editable-text" data-unique-id="d9fe8d59-be67-4d1b-bc9a-493e15f9898a" data-file-name="components/PDFViewerClient.tsx">The requested PDF could not be loaded.</span></CardDescription>
          </CardHeader>
        </Card>
      </div>;
  }
  return <div className="container mx-auto px-4 py-8" data-unique-id="f2749639-079c-4749-a5bb-41083fc0c819" data-file-name="components/PDFViewerClient.tsx">
      <UniversalPDFViewer pdfUrl={pdfUrl} title={title} onDownload={handleDownload} />
    </div>;
}