'use client';

import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { supabase } from '@/db/supabase';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize, Minimize, RotateCw, Download, Loader } from 'lucide-react';

// Set up the worker for PDF.js - moved inside a useEffect to ensure it only runs in browser
interface PDFViewerProps {
  pdfId?: number;
  pdfUrl?: string;
  title?: string;
}
export default function PDFViewer({
  pdfId,
  pdfUrl: initialPdfUrl,
  title
}: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(initialPdfUrl);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [subscriptionActive, setSubscriptionActive] = useState<boolean>(false);

  // Initialize PDF.js worker - ONLY in browser environment
  useEffect(() => {
    // This will only run on the client side
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js`;
  }, []);

  // Fetch PDF URL if pdfId is provided but no URL
  useEffect(() => {
    const fetchPdfData = async () => {
      if (!pdfId && !initialPdfUrl) return;
      if (pdfId && !initialPdfUrl) {
        try {
          setIsLoading(true);
          const {
            data,
            error
          } = await supabase.from('pdfs').select('fileUrl, title').eq('id', pdfId).single();
          if (error) throw error;
          if (data) {
            setPdfUrl(data.fileUrl);
          }
        } catch (err) {
          console.error('Error fetching PDF:', err);
          setError('Failed to load PDF. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      } else {
        // If URL is directly provided
        setPdfUrl(initialPdfUrl);
        setIsLoading(false);
      }
    };
    fetchPdfData();
  }, [pdfId, initialPdfUrl]);

  // Set up real-time subscription for PDF updates
  useEffect(() => {
    if (!pdfId || subscriptionActive) return;
    let channel: any = null;
    try {
      // Create a new subscription
      channel = supabase.channel(`pdf_changes_${pdfId}`).on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'pdfs',
        filter: `id=eq.${pdfId}`
      }, payload => {
        // Update the PDF URL if it changes
        if (payload.new && payload.new.fileUrl !== pdfUrl) {
          setPdfUrl(payload.new.fileUrl);
          // Reset to first page when PDF changes
          setPageNumber(1);
        }
      }).subscribe();
      setSubscriptionActive(true);
    } catch (err) {
      console.error('Error setting up subscription:', err);
    }

    // Clean up subscription on unmount
    return () => {
      if (channel) {
        channel.unsubscribe();
        setSubscriptionActive(false);
      }
    };
  }, [pdfId, pdfUrl, subscriptionActive]);

  // Handle document load success
  function onDocumentLoadSuccess({
    numPages
  }: {
    numPages: number;
  }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  // Handle document load error
  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF. The file might be corrupted or inaccessible.');
    setIsLoading(false);
  }

  // Page navigation functions
  const goToPrevPage = () => {
    setPageNumber(prev => Math.max(prev - 1, 1));
  };
  const goToNextPage = () => {
    setPageNumber(prev => Math.min(prev + 1, numPages || 1));
  };

  // Zoom functions
  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };
  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  // Rotation function
  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Fullscreen toggle with safety checks
  const toggleFullscreen = () => {
    if (!viewerRef.current) return;
    try {
      if (!isFullscreen) {
        if (viewerRef.current.requestFullscreen) {
          viewerRef.current.requestFullscreen();
        }
      } else {
        if (typeof document !== 'undefined') {
          const doc = document; // Local variable ensures check is recognized by ESLint
          if (doc.exitFullscreen) {
            doc.exitFullscreen();
          }
        }
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  // Listen for fullscreen change events with safety checks
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Download function with safety checks
  const downloadPdf = () => {
    if (!pdfUrl) return;
    try {
      if (typeof document !== 'undefined') {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = title || 'document.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };
  return <Card className="w-full" data-unique-id="e3c67713-d431-4c7e-9aec-580b010da089" data-file-name="components/PDFViewer.tsx">
      <CardContent className="p-0" data-unique-id="9eefb8db-b960-43e8-a8cb-265f0107278b" data-file-name="components/PDFViewer.tsx">
        <div className="flex flex-col" ref={viewerRef} data-unique-id="a26cdc20-c55c-4ab3-a6d7-5d8f1e7f2016" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
          {/* PDF Viewer Controls */}
          <div className="flex items-center justify-between p-4 border-b" data-unique-id="7f759b7c-5210-402f-b248-af5f33f22a5e" data-file-name="components/PDFViewer.tsx">
            <div className="flex items-center space-x-2" data-unique-id="1aa1ebbc-d974-4ea5-87b2-1610b1399402" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1 || isLoading} title="Previous Page" data-unique-id="794b9d5a-4f90-400f-b3f3-429afda97d97" data-file-name="components/PDFViewer.tsx">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm" data-unique-id="ba7d8b26-cb01-4cec-8bd2-e264b8ae3932" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isLoading ? 'Loading...' : `Page ${pageNumber} of ${numPages || '?'}`}
              </span>
              
              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= (numPages || 1) || isLoading} title="Next Page" data-unique-id="16fd8e55-2bac-4f5e-bf7c-1675d925f4ff" data-file-name="components/PDFViewer.tsx">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2" data-unique-id="e283fff0-4ce9-43ea-90d9-095507e59726" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5 || isLoading} title="Zoom Out" data-unique-id="bee4e78f-3b9e-41cc-b2b1-079a5085ee19" data-file-name="components/PDFViewer.tsx">
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm w-16 text-center" data-unique-id="4bfa0422-d04e-47f5-9526-b83694f4b47e" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {Math.round(scale * 100)}<span className="editable-text" data-unique-id="c5bf2362-4843-4046-b396-8206cba1110b" data-file-name="components/PDFViewer.tsx">%
              </span></span>
              
              <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3 || isLoading} title="Zoom In" data-unique-id="963d804c-54da-4488-bf15-f397cc9ea34d" data-file-name="components/PDFViewer.tsx">
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={rotate} disabled={isLoading} title="Rotate" data-unique-id="8ca8889a-724b-4471-9e69-80482d8a02d2" data-file-name="components/PDFViewer.tsx">
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={toggleFullscreen} disabled={isLoading} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} data-unique-id="444494d9-e9b3-4bdf-a5cb-7ec54a56701c" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm" onClick={downloadPdf} disabled={!pdfUrl || isLoading} title="Download PDF" data-unique-id="be918d57-0c08-475d-a336-c547d20a7f9a" data-file-name="components/PDFViewer.tsx">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* PDF Viewer */}
          <div className={`flex justify-center p-4 bg-muted min-h-[500px] ${isFullscreen ? 'h-screen' : ''}`} data-unique-id="cdf56ebc-4997-4290-8b83-b9e522bcb0c4" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
            {isLoading && <div className="flex flex-col items-center justify-center h-full" data-unique-id="3da30485-7b6a-4108-bf47-5917d295dceb" data-file-name="components/PDFViewer.tsx">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground" data-unique-id="76132030-3b98-4750-8e28-852a8d205865" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="2dab037d-dd31-4cdf-9532-75212b03b4c4" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
              </div>}
            
            {error && <div className="flex flex-col items-center justify-center h-full text-red-500" data-unique-id="a01d4828-9616-4c91-9380-1ddb9ad794f7" data-file-name="components/PDFViewer.tsx">
                <p data-unique-id="511c313e-44f8-4a88-bd69-628fd33a5cac" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">{error}</p>
              </div>}
            
            {pdfUrl && !error && <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} loading={<div className="flex flex-col items-center justify-center h-full" data-unique-id="a2e567c9-d2af-489c-8b1f-23f22d2effd5" data-file-name="components/PDFViewer.tsx">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground" data-unique-id="0a07b516-c70a-4154-adeb-7aded4f05253" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="99ec882a-e7b4-4825-9641-6b433865b672" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
                  </div>} options={{
            cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
            cMapPacked: true,
            standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/'
          }}>
                <Page pageNumber={pageNumber} scale={scale} rotate={rotation} renderTextLayer={false} renderAnnotationLayer={false} className="shadow-lg" />
              </Document>}
          </div>
        </div>
      </CardContent>
    </Card>;
}