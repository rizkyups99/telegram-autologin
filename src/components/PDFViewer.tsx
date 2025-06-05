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
  return <Card className="w-full" data-unique-id="a93c6b1c-180b-4976-8857-ece20c3291e1" data-file-name="components/PDFViewer.tsx">
      <CardContent className="p-0" data-unique-id="45bc0fac-917b-4868-92bd-3cb993f735dc" data-file-name="components/PDFViewer.tsx">
        <div className="flex flex-col" ref={viewerRef} data-unique-id="85a14ca5-d64f-489b-9c4b-54c4db28a234" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
          {/* PDF Viewer Controls */}
          <div className="flex items-center justify-between p-4 border-b" data-unique-id="e06a8984-f82f-4e1f-98e3-43f0b67b477f" data-file-name="components/PDFViewer.tsx">
            <div className="flex items-center space-x-2" data-unique-id="9479adee-8006-41fe-8a72-f65247cd2852" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1 || isLoading} title="Previous Page" data-unique-id="b78f9c8f-9881-425f-a2e2-885dad544648" data-file-name="components/PDFViewer.tsx">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm" data-unique-id="c8dcf33c-6722-4f55-8403-cc9385829c3c" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isLoading ? 'Loading...' : `Page ${pageNumber} of ${numPages || '?'}`}
              </span>
              
              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= (numPages || 1) || isLoading} title="Next Page" data-unique-id="e072e5a8-074d-4570-b269-14d827d7b76f" data-file-name="components/PDFViewer.tsx">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2" data-unique-id="a8532580-4d2d-4bff-b925-ac70cef47d3f" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5 || isLoading} title="Zoom Out" data-unique-id="91601628-45c2-461f-91ca-2ae64686a8fa" data-file-name="components/PDFViewer.tsx">
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm w-16 text-center" data-unique-id="a753e5bf-4b13-4431-a7e2-55a1ee0a6e3d" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {Math.round(scale * 100)}<span className="editable-text" data-unique-id="0c8321d8-3505-48c5-892d-d4dffcc292b5" data-file-name="components/PDFViewer.tsx">%
              </span></span>
              
              <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3 || isLoading} title="Zoom In" data-unique-id="f06229cd-3394-4588-801e-5b6b5991bd52" data-file-name="components/PDFViewer.tsx">
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={rotate} disabled={isLoading} title="Rotate" data-unique-id="d830b5fe-8b5e-4bd0-9f80-521af1ca5959" data-file-name="components/PDFViewer.tsx">
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={toggleFullscreen} disabled={isLoading} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} data-unique-id="9c997800-2200-483e-ad52-149969c04be2" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm" onClick={downloadPdf} disabled={!pdfUrl || isLoading} title="Download PDF" data-unique-id="365a35c6-06f0-4164-8c88-46ca47ff0bf7" data-file-name="components/PDFViewer.tsx">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* PDF Viewer */}
          <div className={`flex justify-center p-4 bg-muted min-h-[500px] ${isFullscreen ? 'h-screen' : ''}`} data-unique-id="fd5d5352-dd49-427f-beaf-e02f21887795" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
            {isLoading && <div className="flex flex-col items-center justify-center h-full" data-unique-id="d3ddbb6e-2bf2-4e42-885b-82a705fb0419" data-file-name="components/PDFViewer.tsx">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground" data-unique-id="d1e12101-fe45-4417-92bd-c4c5abba8d7d" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="7d478739-e5af-416e-9aaa-49a1e02a99f3" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
              </div>}
            
            {error && renderMethod === 'download' && <div className="flex flex-col items-center justify-center h-full space-y-4" data-unique-id="8ed4bee5-dd54-4b16-8bf0-bded15c1149d" data-file-name="components/PDFViewer.tsx">
                <AlertTriangle className="h-12 w-12 text-orange-500" />
                <p className="text-center text-red-500 max-w-md" data-unique-id="b038913f-7eb5-4a16-b23d-c834ab66f4cb" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">{error}</p>
                <Button onClick={downloadPdf} className="flex items-center gap-2" data-unique-id="cdbac7aa-1d60-4c43-974b-6029b0f46ec3" data-file-name="components/PDFViewer.tsx">
                  <Download className="h-4 w-4" />
                  <span className="editable-text" data-unique-id="cf7fbf82-3690-4e58-af57-8727a09a83b8" data-file-name="components/PDFViewer.tsx">Download PDF</span>
                </Button>
              </div>}
            
            {pdfUrl && !error && renderMethod === 'pdfjs' && <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} loading={<div className="flex flex-col items-center justify-center h-full" data-unique-id="53f2a659-22bb-40a1-8fc1-74dd4f37cc8b" data-file-name="components/PDFViewer.tsx">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground" data-unique-id="d5852799-ba28-4bde-abb2-686d38082ab4" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="ce11570c-16ec-4ce3-8a6d-29349a3e5ea4" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
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
            
            {pdfUrl && !error && renderMethod === 'iframe' && <div className="w-full h-full min-h-[500px]" data-unique-id="ca73bae3-1d8b-4ada-a86c-0a7945450d11" data-file-name="components/PDFViewer.tsx">
                <iframe src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=${pageNumber}&zoom=${Math.round(scale * 100)}`} className="w-full h-full border-0 rounded-lg" title={title || "PDF Viewer"} onLoad={() => setIsLoading(false)} onError={() => onDocumentLoadError(new Error('Iframe failed to load'))} data-unique-id="cdee6553-5cb0-45f5-9f27-c48a8c563f15" data-file-name="components/PDFViewer.tsx" />
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
}