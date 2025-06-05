'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, RotateCw, Maximize, Minimize } from 'lucide-react';

// PDF.js types
declare global {
  interface Window {
    pdfjsLib: any;
  }
}
interface UniversalPDFViewerProps {
  pdfUrl: string;
  title?: string;
  onDownload?: () => void;
}
export default function UniversalPDFViewer({
  pdfUrl,
  title,
  onDownload
}: UniversalPDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load PDF.js worker
  useEffect(() => {
    const loadPDFJS = async () => {
      try {
        // Set worker source
        if (typeof window !== 'undefined') {
          const pdfjsLib = await import('pdfjs-dist');
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          window.pdfjsLib = pdfjsLib;

          // Load the PDF document
          await loadPDF();
        }
      } catch (err) {
        console.error('Failed to load PDF.js:', err);
        setError('Failed to load PDF viewer');
        setShowFallback(true);
        setIsLoading(false);
      }
    };
    loadPDFJS();
  }, [pdfUrl]);
  const loadPDF = async () => {
    try {
      setIsLoading(true);
      setError(null);
      if (!window.pdfjsLib) {
        throw new Error('PDF.js not loaded');
      }
      const loadingTask = window.pdfjsLib.getDocument(pdfUrl);
      const pdf = await loadingTask.promise;
      setPdfDoc(pdf);
      setTotalPages(pdf.numPages);
      setCurrentPage(1);

      // Render the first page
      await renderPage(pdf, 1);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError('Failed to load PDF document');
      setShowFallback(true);
      setIsLoading(false);
    }
  };
  const renderPage = async (pdf: any, pageNumber: number) => {
    try {
      const page = await pdf.getPage(pageNumber);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const context = canvas.getContext('2d');
      if (!context) return;

      // Calculate scale based on container width for responsive design
      const containerWidth = containerRef.current?.clientWidth || 800;
      const viewport = page.getViewport({
        scale: 1.0,
        rotation
      });
      const calculatedScale = Math.min((containerWidth - 40) / viewport.width,
      // 40px for padding
      scale);
      const scaledViewport = page.getViewport({
        scale: calculatedScale,
        rotation
      });

      // Set canvas dimensions
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      canvas.style.width = `${scaledViewport.width}px`;
      canvas.style.height = `${scaledViewport.height}px`;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Render the page
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };
      await page.render(renderContext).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
      setError('Failed to render PDF page');
    }
  };
  const goToPage = async (pageNumber: number) => {
    if (!pdfDoc || pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    await renderPage(pdfDoc, pageNumber);
  };
  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };
  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };
  const zoomIn = async () => {
    const newScale = Math.min(scale * 1.2, 3.0);
    setScale(newScale);
    if (pdfDoc) {
      await renderPage(pdfDoc, currentPage);
    }
  };
  const zoomOut = async () => {
    const newScale = Math.max(scale / 1.2, 0.5);
    setScale(newScale);
    if (pdfDoc) {
      await renderPage(pdfDoc, currentPage);
    }
  };
  const rotate = async () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    if (pdfDoc) {
      await renderPage(pdfDoc, currentPage);
    }
  };
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Re-render on window resize
  useEffect(() => {
    const handleResize = async () => {
      if (pdfDoc && currentPage) {
        await renderPage(pdfDoc, currentPage);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdfDoc, currentPage, scale, rotation]);
  if (showFallback) {
    // Dynamic import of fallback component
    const FallbackPDFViewer = require('./FallbackPDFViewer').default;
    return <FallbackPDFViewer pdfUrl={pdfUrl} title={title} onDownload={onDownload} />;
  }
  if (isLoading) {
    return <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="5b5cba39-e17b-4de3-bbd2-4348e8e8ba1a" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="text-center" data-unique-id="68ead662-48ed-425d-83af-4aa1699ada78" data-file-name="components/UniversalPDFViewer.tsx">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" data-unique-id="c1b98647-a9e0-4c3a-97e1-2679decc8716" data-file-name="components/UniversalPDFViewer.tsx"></div>
          <p className="text-gray-600" data-unique-id="948443c2-87ed-44d8-a294-d08454b69919" data-file-name="components/UniversalPDFViewer.tsx"><span className="editable-text" data-unique-id="e2881eb0-0b86-41f5-a176-922cadcad3e0" data-file-name="components/UniversalPDFViewer.tsx">Loading PDF...</span></p>
        </div>
      </div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg" data-unique-id="c2a72adf-228d-4528-8f77-0aa43994a3d9" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="text-center" data-unique-id="cb9a9802-7edf-42b4-88ba-7c5425528696" data-file-name="components/UniversalPDFViewer.tsx">
          <div className="text-red-600 mb-4" data-unique-id="a0b9161c-9a93-4a04-98e0-346e3e1f3d27" data-file-name="components/UniversalPDFViewer.tsx">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="a56ea7b9-4ffe-40f5-9050-4b82a9421c15" data-file-name="components/UniversalPDFViewer.tsx">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium" data-unique-id="df3a1992-065f-4aeb-9772-4a3082817954" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">{error}</p>
          <Button onClick={() => window.open(pdfUrl, '_blank')} className="mt-4" data-unique-id="caaa657c-dc45-4c06-94c5-f584052d77e9" data-file-name="components/UniversalPDFViewer.tsx"><span className="editable-text" data-unique-id="36d8c743-e494-4ab7-8e4d-e2285ab80fd6" data-file-name="components/UniversalPDFViewer.tsx">
            Open in New Tab
          </span></Button>
        </div>
      </div>;
  }
  return <div ref={containerRef} className={`bg-white border rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`} data-unique-id="4193ffc2-aecb-4366-a234-49595f57b4bb" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="bg-gray-50 border-b px-4 py-3" data-unique-id="b51dfcff-065b-41ba-a7c2-c562713726a9" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="flex items-center justify-between" data-unique-id="0f1f36f9-bc08-4238-94b8-848737f17e0a" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
          <div data-unique-id="adb4235d-280d-4afc-8fb7-12d43df8060d" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
            {title && <h3 className="font-medium text-gray-900" data-unique-id="0cc5819e-3389-43da-b7ab-e11686972b31" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">{title}</h3>}
            <p className="text-sm text-gray-600" data-unique-id="b88c7e09-bf3a-42cd-bd0b-92b9704495ac" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="6feb7bc6-65e4-4e10-a68d-d2ea6c10e34c" data-file-name="components/UniversalPDFViewer.tsx">
              Page </span>{currentPage}<span className="editable-text" data-unique-id="145d1bd0-aecc-470e-870b-4824c4142b04" data-file-name="components/UniversalPDFViewer.tsx"> of </span>{totalPages}
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2" data-unique-id="1c371978-4552-499f-8f7a-d2008b67b058" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
            {/* Navigation */}
            <div className="flex items-center gap-1" data-unique-id="02afe05c-35f0-4984-a27b-7f3d73177285" data-file-name="components/UniversalPDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1} data-unique-id="00db0518-5dcc-4b5e-b377-d4364124f886" data-file-name="components/UniversalPDFViewer.tsx">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <input type="number" min="1" max={totalPages} value={currentPage} onChange={e => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                goToPage(page);
              }
            }} className="w-16 px-2 py-1 text-sm border rounded text-center" data-unique-id="49e5315b-3f49-4519-b858-93c991864c34" data-file-name="components/UniversalPDFViewer.tsx" />
              
              <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages} data-unique-id="f0307b2d-5b3d-4897-8a3d-cef8faf5b3d6" data-file-name="components/UniversalPDFViewer.tsx">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1" data-unique-id="2aa9e802-77dc-426b-bc02-66aeb78fc310" data-file-name="components/UniversalPDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={zoomOut} data-unique-id="2025ce8f-a114-46cf-9209-79912d29d09a" data-file-name="components/UniversalPDFViewer.tsx">
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium px-2" data-unique-id="5f85d42e-75da-4c53-98b0-4f79024bb990" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
                {Math.round(scale * 100)}<span className="editable-text" data-unique-id="2808d707-a3b0-4133-a298-d74b5eb5708d" data-file-name="components/UniversalPDFViewer.tsx">%
              </span></span>
              
              <Button variant="outline" size="sm" onClick={zoomIn} data-unique-id="ea117143-79d3-4175-aa27-fc5b382b8564" data-file-name="components/UniversalPDFViewer.tsx">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Other controls */}
            <Button variant="outline" size="sm" onClick={rotate} data-unique-id="b8eba71e-57bd-49e1-a968-f705724238b2" data-file-name="components/UniversalPDFViewer.tsx">
              <RotateCw className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={toggleFullscreen} data-unique-id="007b17e3-1e30-43e0-90ad-f8a443eba5fd" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>

            {onDownload && <Button variant="outline" size="sm" onClick={onDownload} data-unique-id="4428528c-8e42-4522-957c-9e0fbb9acb43" data-file-name="components/UniversalPDFViewer.tsx">
                <Download className="h-4 w-4" />
              </Button>}
          </div>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="p-4 bg-gray-100 overflow-auto" style={{
      height: isFullscreen ? 'calc(100vh - 80px)' : '600px'
    }} data-unique-id="3de0b2a4-cdea-498d-96ba-f59f8d689cd9" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="flex justify-center" data-unique-id="c84075c9-1e51-4b65-82dd-a07df5ec205f" data-file-name="components/UniversalPDFViewer.tsx">
          <canvas ref={canvasRef} className="shadow-lg bg-white max-w-full h-auto" style={{
          maxWidth: '100%',
          height: 'auto'
        }} data-unique-id="16f6ad9b-7084-45a1-968c-eb86ee3d3050" data-file-name="components/UniversalPDFViewer.tsx" />
        </div>
      </div>
    </div>;
}