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
    return <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="cc8661df-15ec-458d-a9ed-5764ca033636" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="text-center" data-unique-id="97e28df2-ed88-4121-a8e9-f44b0d6e6b28" data-file-name="components/UniversalPDFViewer.tsx">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" data-unique-id="d84393c1-c068-4308-8673-2e67ade2e4bd" data-file-name="components/UniversalPDFViewer.tsx"></div>
          <p className="text-gray-600" data-unique-id="3aad7bc9-1ec5-427a-936f-f5c5672495cf" data-file-name="components/UniversalPDFViewer.tsx"><span className="editable-text" data-unique-id="8764ab42-24e0-4fc6-a970-60b713ab5a72" data-file-name="components/UniversalPDFViewer.tsx">Loading PDF...</span></p>
        </div>
      </div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg" data-unique-id="12a459eb-f69c-47f4-8fbc-d121f07a2da7" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="text-center" data-unique-id="b6153302-f79d-4e9b-8737-d0bfd79430d6" data-file-name="components/UniversalPDFViewer.tsx">
          <div className="text-red-600 mb-4" data-unique-id="31c4c6a3-eac2-4084-9025-ee91b727ae53" data-file-name="components/UniversalPDFViewer.tsx">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="bb18a9d7-8147-4d74-87f7-ca12bb4158dc" data-file-name="components/UniversalPDFViewer.tsx">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium" data-unique-id="752ab0b1-d28a-4832-99e0-9084fd35efcf" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">{error}</p>
          <Button onClick={() => window.open(pdfUrl, '_blank')} className="mt-4" data-unique-id="4901bc77-b5ff-4ac7-ac2f-cc66753466de" data-file-name="components/UniversalPDFViewer.tsx"><span className="editable-text" data-unique-id="07185193-1dba-432f-a4be-03f7069d91a2" data-file-name="components/UniversalPDFViewer.tsx">
            Open in New Tab
          </span></Button>
        </div>
      </div>;
  }
  return <div ref={containerRef} className={`bg-white border rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`} data-unique-id="edbc75fd-5689-4aec-ba6b-9bfc67929051" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="bg-gray-50 border-b px-4 py-3" data-unique-id="4ba66cf2-3ebf-4f95-af44-ed295ee68eef" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="flex items-center justify-between" data-unique-id="d2565341-415a-4c1e-ae54-c4a16840bdae" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
          <div data-unique-id="f7a449d8-ec7d-487a-aecc-7629c8a8ca77" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
            {title && <h3 className="font-medium text-gray-900" data-unique-id="fd714aa9-bd3c-4870-b0da-2b926f0e133b" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">{title}</h3>}
            <p className="text-sm text-gray-600" data-unique-id="84c1b609-8318-427a-8cfe-99140ef8c33c" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="47909551-dbdf-42c8-b9dd-83ea581d5381" data-file-name="components/UniversalPDFViewer.tsx">
              Page </span>{currentPage}<span className="editable-text" data-unique-id="3604c384-1724-4365-8c69-1fdc77e08357" data-file-name="components/UniversalPDFViewer.tsx"> of </span>{totalPages}
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2" data-unique-id="0936aea9-1806-4f1a-95e6-9c522560db24" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
            {/* Navigation */}
            <div className="flex items-center gap-1" data-unique-id="c4eb5382-40ac-4214-afd3-faf88a6575e9" data-file-name="components/UniversalPDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1} data-unique-id="ef621f22-809d-4204-940b-cc7c2851b48a" data-file-name="components/UniversalPDFViewer.tsx">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <input type="number" min="1" max={totalPages} value={currentPage} onChange={e => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                goToPage(page);
              }
            }} className="w-16 px-2 py-1 text-sm border rounded text-center" data-unique-id="701c2411-19dd-4c92-8fff-065bbd0de2ee" data-file-name="components/UniversalPDFViewer.tsx" />
              
              <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages} data-unique-id="e31942f7-c08e-4e0f-abe1-e55139cc9942" data-file-name="components/UniversalPDFViewer.tsx">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1" data-unique-id="423b4e1e-1cee-4683-9049-02cad55b0363" data-file-name="components/UniversalPDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={zoomOut} data-unique-id="62ee654b-5bfb-4b3b-8e6e-1698f12d3265" data-file-name="components/UniversalPDFViewer.tsx">
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium px-2" data-unique-id="1b7675e6-4592-444e-bbb0-f354d367f7eb" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
                {Math.round(scale * 100)}<span className="editable-text" data-unique-id="6b71df0b-4025-4c24-a78c-a06e7835f654" data-file-name="components/UniversalPDFViewer.tsx">%
              </span></span>
              
              <Button variant="outline" size="sm" onClick={zoomIn} data-unique-id="49f21434-b9ae-4eaa-af48-2850501bc7a8" data-file-name="components/UniversalPDFViewer.tsx">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Other controls */}
            <Button variant="outline" size="sm" onClick={rotate} data-unique-id="953587e1-e594-4dd3-8a22-5b228722d343" data-file-name="components/UniversalPDFViewer.tsx">
              <RotateCw className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={toggleFullscreen} data-unique-id="fd5a5214-6f53-4adc-b30c-67d2276de3f6" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>

            {onDownload && <Button variant="outline" size="sm" onClick={onDownload} data-unique-id="3c9e730f-85a8-4375-ba33-db53b40f6f6d" data-file-name="components/UniversalPDFViewer.tsx">
                <Download className="h-4 w-4" />
              </Button>}
          </div>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="p-4 bg-gray-100 overflow-auto" style={{
      height: isFullscreen ? 'calc(100vh - 80px)' : '600px'
    }} data-unique-id="7064c740-ff39-469c-ad9e-bcb12689ea26" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="flex justify-center" data-unique-id="f0419468-609e-4350-9fe7-10af53fdb8f5" data-file-name="components/UniversalPDFViewer.tsx">
          <canvas ref={canvasRef} className="shadow-lg bg-white max-w-full h-auto" style={{
          maxWidth: '100%',
          height: 'auto'
        }} data-unique-id="1fce0c86-5eab-454d-bf9d-d03fc0b5b0d8" data-file-name="components/UniversalPDFViewer.tsx" />
        </div>
      </div>
    </div>;
}