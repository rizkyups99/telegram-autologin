'use client';

import { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { supabase } from '@/db/supabase';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize,
  RotateCw,
  Download,
  Loader
} from 'lucide-react';

// Set up the worker for PDF.js - moved inside a useEffect to ensure it only runs in browser
interface PDFViewerProps {
  pdfId?: number;
  pdfUrl?: string;
  title?: string;
}

export default function PDFViewer({ pdfId, pdfUrl: initialPdfUrl, title }: PDFViewerProps) {
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
          const { data, error } = await supabase
            .from('pdfs')
            .select('fileUrl, title')
            .eq('id', pdfId)
            .single();
          
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
      channel = supabase
        .channel(`pdf_changes_${pdfId}`)
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'pdfs',
            filter: `id=eq.${pdfId}`
          }, 
          (payload) => {
            // Update the PDF URL if it changes
            if (payload.new && payload.new.fileUrl !== pdfUrl) {
              setPdfUrl(payload.new.fileUrl);
              // Reset to first page when PDF changes
              setPageNumber(1);
            }
          }
        )
        .subscribe();
      
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
  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
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

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div className="flex flex-col" ref={viewerRef}>
          {/* PDF Viewer Controls */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToPrevPage} 
                disabled={pageNumber <= 1 || isLoading}
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <span className="text-sm">
                {isLoading ? 'Loading...' : `Page ${pageNumber} of ${numPages || '?'}`}
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextPage} 
                disabled={pageNumber >= (numPages || 1) || isLoading}
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={zoomOut} 
                disabled={scale <= 0.5 || isLoading}
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm w-16 text-center">
                {Math.round(scale * 100)}%
              </span>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={zoomIn} 
                disabled={scale >= 3 || isLoading}
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={rotate} 
                disabled={isLoading}
                title="Rotate"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleFullscreen} 
                disabled={isLoading}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={downloadPdf} 
                disabled={!pdfUrl || isLoading}
                title="Download PDF"
              >
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* PDF Viewer */}
          <div className={`flex justify-center p-4 bg-muted min-h-[500px] ${isFullscreen ? 'h-screen' : ''}`}>
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">Loading PDF...</p>
              </div>
            )}
            
            {error && (
              <div className="flex flex-col items-center justify-center h-full text-red-500">
                <p>{error}</p>
              </div>
            )}
            
            {pdfUrl && !error && (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="flex flex-col items-center justify-center h-full">
                    <Loader className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-2 text-sm text-muted-foreground">Loading PDF...</p>
                  </div>
                }
                options={{
                  cMapUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/cmaps/',
                  cMapPacked: true,
                  standardFontDataUrl: 'https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/'
                }}
              >
                <Page 
                  pageNumber={pageNumber} 
                  scale={scale}
                  rotate={rotation}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="shadow-lg"
                />
              </Document>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
