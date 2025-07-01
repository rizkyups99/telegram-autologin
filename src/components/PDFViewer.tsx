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
  return <Card className="w-full" data-unique-id="2db29859-c1ac-4d44-8384-2ce49ad0c8cb" data-file-name="components/PDFViewer.tsx">
      <CardContent className="p-0" data-unique-id="75880199-29ac-4730-95e5-68634870af48" data-file-name="components/PDFViewer.tsx">
        <div className="flex flex-col" ref={viewerRef} data-unique-id="f189d40b-b357-48d0-ad14-bf0561d40f19" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
          {/* PDF Viewer Controls */}
          <div className="flex items-center justify-between p-4 border-b" data-unique-id="c708b153-63ef-4fc3-938e-1983998e15a9" data-file-name="components/PDFViewer.tsx">
            <div className="flex items-center space-x-2" data-unique-id="daeed4a8-6d20-4fc1-bbca-3a94815a5479" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1 || isLoading} title="Previous Page" data-unique-id="ba7d3f1c-9a83-4c48-b138-ec136dfb3cc3" data-file-name="components/PDFViewer.tsx">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm" data-unique-id="e02885a1-ccdd-4697-be6b-d84d431e21df" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isLoading ? 'Loading...' : `Page ${pageNumber} of ${numPages || '?'}`}
              </span>
              
              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= (numPages || 1) || isLoading} title="Next Page" data-unique-id="06eced40-d7ec-4089-baeb-a6cc2017b2c0" data-file-name="components/PDFViewer.tsx">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2" data-unique-id="d6c60e78-dcd3-4da1-810c-487bbe8882b2" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5 || isLoading} title="Zoom Out" data-unique-id="9751908f-338c-4ee9-9239-1b76651f1129" data-file-name="components/PDFViewer.tsx">
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm w-16 text-center" data-unique-id="adee5824-b633-4916-8347-1efa11784ace" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {Math.round(scale * 100)}<span className="editable-text" data-unique-id="c720cd09-8c5a-4c83-8e0b-3cb47009754f" data-file-name="components/PDFViewer.tsx">%
              </span></span>
              
              <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3 || isLoading} title="Zoom In" data-unique-id="494a1a24-5f15-47d6-a417-c1054b1872c3" data-file-name="components/PDFViewer.tsx">
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={rotate} disabled={isLoading} title="Rotate" data-unique-id="e28ca574-779b-4a7d-9733-853aabd713e9" data-file-name="components/PDFViewer.tsx">
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={toggleFullscreen} disabled={isLoading} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} data-unique-id="0f7274d4-7709-4229-a0da-47fc29a87987" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm" onClick={downloadPdf} disabled={!pdfUrl || isLoading} title="Download PDF" data-unique-id="5ba2ceaf-4d11-436a-b901-a23e79c96766" data-file-name="components/PDFViewer.tsx">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* PDF Viewer */}
          <div className={`flex justify-center p-4 bg-muted min-h-[500px] ${isFullscreen ? 'h-screen' : ''}`} data-unique-id="e60d5b1c-e665-4508-ac83-241e3c6390fb" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
            {isLoading && <div className="flex flex-col items-center justify-center h-full" data-unique-id="752d440a-1b06-4bec-813e-7efa876f2f72" data-file-name="components/PDFViewer.tsx">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground" data-unique-id="9deaa820-8936-4a1f-a169-06840b99f345" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="b13c2b73-7959-41d3-947b-30a234e6dc6d" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
              </div>}
            
            {error && renderMethod === 'download' && <div className="flex flex-col items-center justify-center h-full space-y-4" data-unique-id="9e3b5fea-b0f3-4df8-8eb2-68e2ed71a1ff" data-file-name="components/PDFViewer.tsx">
                <AlertTriangle className="h-12 w-12 text-orange-500" />
                <p className="text-center text-red-500 max-w-md" data-unique-id="f129cf7d-b133-40fe-82c2-783fccc19fc5" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">{error}</p>
                <Button onClick={downloadPdf} className="flex items-center gap-2" data-unique-id="50cbe732-acbc-4b7c-9086-1653310ad5f4" data-file-name="components/PDFViewer.tsx">
                  <Download className="h-4 w-4" />
                  <span className="editable-text" data-unique-id="d6f0e461-5f85-4922-ba09-bd20f418ab53" data-file-name="components/PDFViewer.tsx">Download PDF</span>
                </Button>
              </div>}
            
            {pdfUrl && !error && renderMethod === 'pdfjs' && <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} loading={<div className="flex flex-col items-center justify-center h-full" data-unique-id="ea5b2874-bb43-4fbe-a520-7f0ca690ce26" data-file-name="components/PDFViewer.tsx">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground" data-unique-id="30582f3c-e43f-48db-baf4-614a7dbc888e" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="b94cc132-64c4-4d88-a771-279460888bd7" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
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
            
            {pdfUrl && !error && renderMethod === 'iframe' && <div className="w-full h-full min-h-[500px]" data-unique-id="60ccf107-2484-48d0-84dd-1c604f75c010" data-file-name="components/PDFViewer.tsx">
                <iframe src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=${pageNumber}&zoom=${Math.round(scale * 100)}`} className="w-full h-full border-0 rounded-lg" title={title || "PDF Viewer"} onLoad={() => setIsLoading(false)} onError={() => onDocumentLoadError(new Error('Iframe failed to load'))} data-unique-id="31a69aa3-e61b-40d2-9a3f-ba94ce7e0147" data-file-name="components/PDFViewer.tsx" />
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
}