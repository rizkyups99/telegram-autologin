'use client';

import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { supabase } from '@/db/supabase';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Maximize, Minimize, RotateCw, Download, Loader, AlertTriangle } from 'lucide-react';
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
  const [renderMethod, setRenderMethod] = useState<'pdfjs' | 'iframe' | 'download'>('pdfjs');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const [subscriptionActive, setSubscriptionActive] = useState<boolean>(false);

  // Detect mobile and browser capabilities
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isChrome = /chrome/i.test(userAgent);
      const isIOS = /iphone|ipad|ipod/i.test(userAgent);
      const isAndroid = /android/i.test(userAgent);
      setIsMobile(isMobileDevice);

      // Determine best render method based on browser capabilities
      if (isMobileDevice && isChrome && (isIOS || isAndroid)) {
        // For Chrome on mobile, try PDF.js first, fallback to iframe if needed
        setRenderMethod('pdfjs');
      } else {
        setRenderMethod('pdfjs');
      }
    }
  }, []);

  // Initialize PDF.js worker with better mobile compatibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Use a more reliable CDN for mobile compatibility
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      } catch (err) {
        console.error('Error configuring PDF.js:', err);
        setRenderMethod('iframe');
      }
    }
  }, [isMobile]);

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
    setError(null);
  }

  // Handle document load error with fallback
  function onDocumentLoadError(error: Error) {
    console.error('Error loading PDF with PDF.js:', error);

    // If PDF.js fails on mobile Chrome, try iframe fallback
    if (isMobile && renderMethod === 'pdfjs') {
      console.log('Falling back to iframe method for mobile');
      setRenderMethod('iframe');
      setError(null);
      setIsLoading(false);
    } else if (renderMethod === 'iframe') {
      // If iframe also fails, show download option
      console.log('Iframe method failed, showing download option');
      setRenderMethod('download');
      setError('This PDF cannot be displayed in your browser. Please download it to view.');
      setIsLoading(false);
    } else {
      setError('Failed to load PDF. Please try downloading the file.');
      setIsLoading(false);
    }
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
  return <Card className="w-full" data-unique-id="b4435da8-cc4a-4d9d-a962-5eb7be8d5ba9" data-file-name="components/PDFViewer.tsx">
      <CardContent className="p-0" data-unique-id="11d60d8f-2320-44b2-b5ba-44710d976bf3" data-file-name="components/PDFViewer.tsx">
        <div className="flex flex-col" ref={viewerRef} data-unique-id="76747903-6eeb-4025-9926-c49b0477402a" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
          {/* PDF Viewer Controls */}
          <div className="flex items-center justify-between p-4 border-b" data-unique-id="e3fcb8c9-617f-4ab8-864a-876f09bb8702" data-file-name="components/PDFViewer.tsx">
            <div className="flex items-center space-x-2" data-unique-id="80270df6-51f6-482f-9ab6-3e53e73bb9a4" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1 || isLoading} title="Previous Page" data-unique-id="ba9f8658-346b-45b9-968d-17c47c7f0712" data-file-name="components/PDFViewer.tsx">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm" data-unique-id="e551c474-573b-4a09-95ea-09fa53b47f0a" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isLoading ? 'Loading...' : `Page ${pageNumber} of ${numPages || '?'}`}
              </span>
              
              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= (numPages || 1) || isLoading} title="Next Page" data-unique-id="f1013184-44d9-4bed-8d0f-3a0fba795948" data-file-name="components/PDFViewer.tsx">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2" data-unique-id="39f8e2ae-ee17-4356-8ac0-e9aac6ca6e83" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5 || isLoading} title="Zoom Out" data-unique-id="1a9bcf9d-a7ad-43c2-bf38-e4816d2807d8" data-file-name="components/PDFViewer.tsx">
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm w-16 text-center" data-unique-id="e3dc211e-cd57-41d8-b089-405cc60987a2" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {Math.round(scale * 100)}<span className="editable-text" data-unique-id="90f9d0e1-c554-4864-b26b-6a5b0b0d3e24" data-file-name="components/PDFViewer.tsx">%
              </span></span>
              
              <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3 || isLoading} title="Zoom In" data-unique-id="91b1af6e-d0ea-4df0-86a5-287be4819a17" data-file-name="components/PDFViewer.tsx">
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={rotate} disabled={isLoading} title="Rotate" data-unique-id="8b390f23-16e4-4107-bf85-1b80f7faf730" data-file-name="components/PDFViewer.tsx">
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={toggleFullscreen} disabled={isLoading} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} data-unique-id="6b8eb906-0691-4a65-b7b1-d5e2e4cd985e" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm" onClick={downloadPdf} disabled={!pdfUrl || isLoading} title="Download PDF" data-unique-id="27049bb4-ae2b-42ab-88db-268079c6c4d5" data-file-name="components/PDFViewer.tsx">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* PDF Viewer */}
          <div className={`flex justify-center p-4 bg-muted min-h-[500px] ${isFullscreen ? 'h-screen' : ''}`} data-unique-id="0a335f5a-dc82-40bc-b062-30d892f73ad0" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
            {isLoading && <div className="flex flex-col items-center justify-center h-full" data-unique-id="5a05e7c8-fd0a-4f9a-b816-144fa24e0bb8" data-file-name="components/PDFViewer.tsx">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground" data-unique-id="e67b6deb-8076-460c-b735-4f7f37b38afc" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="f6a1ff0b-e2b2-403d-8e53-cec9bfdc8b50" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
              </div>}
            
            {error && renderMethod === 'download' && <div className="flex flex-col items-center justify-center h-full space-y-4" data-unique-id="b953100f-d410-4583-bc20-031a3879d318" data-file-name="components/PDFViewer.tsx">
                <AlertTriangle className="h-12 w-12 text-orange-500" />
                <p className="text-center text-red-500 max-w-md" data-unique-id="1eb457c4-2a66-4910-b758-f9a4d20fb59b" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">{error}</p>
                <Button onClick={downloadPdf} className="flex items-center gap-2" data-unique-id="2f73f7c6-a987-4d2d-9fad-08015e28041b" data-file-name="components/PDFViewer.tsx">
                  <Download className="h-4 w-4" />
                  <span className="editable-text" data-unique-id="7046bf61-225d-4e18-9bf0-41ad0c897b68" data-file-name="components/PDFViewer.tsx">Download PDF</span>
                </Button>
              </div>}
            
            {pdfUrl && !error && renderMethod === 'pdfjs' && <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} loading={<div className="flex flex-col items-center justify-center h-full" data-unique-id="6ec192e0-2e6d-4202-9f59-f2799f0d9bd2" data-file-name="components/PDFViewer.tsx">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground" data-unique-id="092b130f-b38a-4043-bf05-cae7b0e06f05" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="d1b7d74f-b8cc-4477-9311-e67ef813c8c4" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
                  </div>} options={{
            cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
            cMapPacked: true,
            standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
            // Mobile-specific optimizations
            disableStream: isMobile,
            disableAutoFetch: isMobile,
            disableFontFace: isMobile
          }}>
                <Page pageNumber={pageNumber} scale={isMobile ? Math.min(scale, 1.5) : scale} rotate={rotation} renderTextLayer={false} renderAnnotationLayer={false} className="shadow-lg max-w-full" canvasBackground="white" />
              </Document>}
            
            {pdfUrl && !error && renderMethod === 'iframe' && <div className="w-full h-full min-h-[500px]" data-unique-id="37089730-23ce-4bf0-b15e-a0d09d6d5d0b" data-file-name="components/PDFViewer.tsx">
                <iframe src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=${pageNumber}&zoom=${Math.round(scale * 100)}`} className="w-full h-full border-0 rounded-lg" title={title || "PDF Viewer"} onLoad={() => setIsLoading(false)} onError={() => onDocumentLoadError(new Error('Iframe failed to load'))} data-unique-id="3abb4f5f-ccc0-445b-b9cc-1c289da153c1" data-file-name="components/PDFViewer.tsx" />
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
}