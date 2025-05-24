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
  return <Card className="w-full" data-unique-id="91a436c8-b702-4dd6-8910-f8dafc5b21f2" data-file-name="components/PDFViewer.tsx">
      <CardContent className="p-0" data-unique-id="6507f4c1-19fa-4cb9-adc2-cc2133c54b3d" data-file-name="components/PDFViewer.tsx">
        <div className="flex flex-col" ref={viewerRef} data-unique-id="4f3855e2-2c0f-4e68-9dbe-50dd61c3dcd5" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
          {/* PDF Viewer Controls */}
          <div className="flex items-center justify-between p-4 border-b" data-unique-id="6dc60238-1e4f-4913-b2bd-2c97965658b7" data-file-name="components/PDFViewer.tsx">
            <div className="flex items-center space-x-2" data-unique-id="202c5f10-a347-4110-b447-da9074290f76" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1 || isLoading} title="Previous Page" data-unique-id="b4f15b75-0416-4d0a-a703-2310f2bea98f" data-file-name="components/PDFViewer.tsx">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm" data-unique-id="cd0135ab-b7ac-42aa-82f5-bb52315b4055" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isLoading ? 'Loading...' : `Page ${pageNumber} of ${numPages || '?'}`}
              </span>
              
              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= (numPages || 1) || isLoading} title="Next Page" data-unique-id="88146388-a0a2-41e9-a084-a70e7e70746e" data-file-name="components/PDFViewer.tsx">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2" data-unique-id="aa29eb8c-4ad2-42d8-85e0-370a0bb27243" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5 || isLoading} title="Zoom Out" data-unique-id="ac5dc05c-dfee-442d-805c-aff7488d38e8" data-file-name="components/PDFViewer.tsx">
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm w-16 text-center" data-unique-id="b569e294-70c2-4778-9368-07ed8d2a4d1d" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {Math.round(scale * 100)}<span className="editable-text" data-unique-id="48a2f0d3-0b5c-4a25-bb50-8d99b8f39af0" data-file-name="components/PDFViewer.tsx">%
              </span></span>
              
              <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3 || isLoading} title="Zoom In" data-unique-id="d78bf279-c104-4368-9195-79eda7d446b3" data-file-name="components/PDFViewer.tsx">
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={rotate} disabled={isLoading} title="Rotate" data-unique-id="e66a15d4-a292-4f20-9512-a4320ef0d3b7" data-file-name="components/PDFViewer.tsx">
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={toggleFullscreen} disabled={isLoading} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} data-unique-id="f561a2b3-97cc-4686-a6d4-4c7ed1a3d5d2" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm" onClick={downloadPdf} disabled={!pdfUrl || isLoading} title="Download PDF" data-unique-id="c8258620-5e05-43d3-ac1b-0a84f57034c0" data-file-name="components/PDFViewer.tsx">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* PDF Viewer */}
          <div className={`flex justify-center p-4 bg-muted min-h-[500px] ${isFullscreen ? 'h-screen' : ''}`} data-unique-id="23f08fb2-a904-461a-913d-028afdbe8347" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
            {isLoading && <div className="flex flex-col items-center justify-center h-full" data-unique-id="056645c3-e95a-4d48-8f45-aeda2b39b816" data-file-name="components/PDFViewer.tsx">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground" data-unique-id="2cca27e9-6e67-4ecb-89c6-3f5ca7a112b2" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="e8fa3b83-0076-411d-ac14-a506e25d9762" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
              </div>}
            
            {error && <div className="flex flex-col items-center justify-center h-full text-red-500" data-unique-id="b7c7d14a-0abb-4cf5-b913-99e3b87a0739" data-file-name="components/PDFViewer.tsx">
                <p data-unique-id="d2c1fccf-0d36-492f-b361-b8db5951f6f4" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">{error}</p>
              </div>}
            
            {pdfUrl && !error && <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} loading={<div className="flex flex-col items-center justify-center h-full" data-unique-id="69bc351f-fe85-4f2e-8290-1efe13b78697" data-file-name="components/PDFViewer.tsx">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground" data-unique-id="c2ffc6f3-c7e0-4e38-803f-1ce81bf40704" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="abc6ac85-5605-4367-aff1-36901f6dcb17" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
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