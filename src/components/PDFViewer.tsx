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
  return <Card className="w-full" data-unique-id="c9497b0b-de70-4b37-ae05-71a8f49b10d2" data-file-name="components/PDFViewer.tsx">
      <CardContent className="p-0" data-unique-id="04ab4866-0def-4e3f-82f2-5e64a3adf75a" data-file-name="components/PDFViewer.tsx">
        <div className="flex flex-col" ref={viewerRef} data-unique-id="57377d40-8b8d-4b2a-8320-4b19b5bab1af" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
          {/* PDF Viewer Controls */}
          <div className="flex items-center justify-between p-4 border-b" data-unique-id="97c63550-c542-4195-ae36-6c354d45e2b7" data-file-name="components/PDFViewer.tsx">
            <div className="flex items-center space-x-2" data-unique-id="a4d81c4d-b253-4be4-9c8d-1e735f9ec9a2" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={goToPrevPage} disabled={pageNumber <= 1 || isLoading} title="Previous Page" data-unique-id="30f32b9e-359a-489c-817e-0919ba750e0e" data-file-name="components/PDFViewer.tsx">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm" data-unique-id="8703389c-debb-4ebe-a372-b6863c6b97c8" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isLoading ? 'Loading...' : `Page ${pageNumber} of ${numPages || '?'}`}
              </span>
              
              <Button variant="outline" size="sm" onClick={goToNextPage} disabled={pageNumber >= (numPages || 1) || isLoading} title="Next Page" data-unique-id="cebdae6b-aca4-443d-9185-3604d2951bec" data-file-name="components/PDFViewer.tsx">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2" data-unique-id="b1ad2be1-3133-4d1e-b024-952305f53140" data-file-name="components/PDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5 || isLoading} title="Zoom Out" data-unique-id="4269f01b-58aa-4bda-86c3-3ffbf6f2ddfb" data-file-name="components/PDFViewer.tsx">
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm w-16 text-center" data-unique-id="ad5259e0-ec10-4d29-96ad-496181da4adc" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {Math.round(scale * 100)}<span className="editable-text" data-unique-id="a2d42548-cc9b-4408-b94b-d5da98cb2d3d" data-file-name="components/PDFViewer.tsx">%
              </span></span>
              
              <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3 || isLoading} title="Zoom In" data-unique-id="2c6ca0a5-46f8-488d-944d-637bf61f317c" data-file-name="components/PDFViewer.tsx">
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={rotate} disabled={isLoading} title="Rotate" data-unique-id="87746b53-8bbf-4f7e-a48d-aa9e83d8eed5" data-file-name="components/PDFViewer.tsx">
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <Button variant="outline" size="sm" onClick={toggleFullscreen} disabled={isLoading} title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"} data-unique-id="25a8806e-875d-4931-9241-dde6d5f4cce3" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
                {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
              
              <Button variant="outline" size="sm" onClick={downloadPdf} disabled={!pdfUrl || isLoading} title="Download PDF" data-unique-id="fdcade72-4851-43d6-92ab-4969a7fb3d94" data-file-name="components/PDFViewer.tsx">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* PDF Viewer */}
          <div className={`flex justify-center p-4 bg-muted min-h-[500px] ${isFullscreen ? 'h-screen' : ''}`} data-unique-id="8b4b5e01-d23e-41a6-955b-86a24624ef95" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">
            {isLoading && <div className="flex flex-col items-center justify-center h-full" data-unique-id="25c86501-9b0f-48dc-902e-35bb24b9a9e5" data-file-name="components/PDFViewer.tsx">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground" data-unique-id="ac2b9f9e-be00-4678-8f9a-e2e5ea30149b" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="6ee3ed86-5160-4f39-85dd-e760ef9c6430" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
              </div>}
            
            {error && renderMethod === 'download' && <div className="flex flex-col items-center justify-center h-full space-y-4" data-unique-id="5a726770-13fe-40a6-ac11-bfc0d25a2fd9" data-file-name="components/PDFViewer.tsx">
                <AlertTriangle className="h-12 w-12 text-orange-500" />
                <p className="text-center text-red-500 max-w-md" data-unique-id="7399285a-7910-4771-bbc2-ecfa4e0a66e2" data-file-name="components/PDFViewer.tsx" data-dynamic-text="true">{error}</p>
                <Button onClick={downloadPdf} className="flex items-center gap-2" data-unique-id="e9c61b2a-d238-456e-b5e6-47620376fee4" data-file-name="components/PDFViewer.tsx">
                  <Download className="h-4 w-4" />
                  <span className="editable-text" data-unique-id="71943d8f-3bcf-47af-89a1-face9f65155b" data-file-name="components/PDFViewer.tsx">Download PDF</span>
                </Button>
              </div>}
            
            {pdfUrl && !error && renderMethod === 'pdfjs' && <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} loading={<div className="flex flex-col items-center justify-center h-full" data-unique-id="c792bd7d-b49d-4ef2-9632-5b1337aa28a7" data-file-name="components/PDFViewer.tsx">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground" data-unique-id="5dcdd624-1bb6-49a5-813e-b6e0da233a57" data-file-name="components/PDFViewer.tsx"><span className="editable-text" data-unique-id="a7fd37a4-59e3-4fd1-bfc6-9219383cae98" data-file-name="components/PDFViewer.tsx">Loading PDF...</span></p>
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
            
            {pdfUrl && !error && renderMethod === 'iframe' && <div className="w-full h-full min-h-[500px]" data-unique-id="c40f1ac5-8dab-49ad-b9f1-600cb4f644b9" data-file-name="components/PDFViewer.tsx">
                <iframe src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=${pageNumber}&zoom=${Math.round(scale * 100)}`} className="w-full h-full border-0 rounded-lg" title={title || "PDF Viewer"} onLoad={() => setIsLoading(false)} onError={() => onDocumentLoadError(new Error('Iframe failed to load'))} data-unique-id="70477f66-0eba-4a31-83a6-bcde9262723f" data-file-name="components/PDFViewer.tsx" />
              </div>}
          </div>
        </div>
      </CardContent>
    </Card>;
}