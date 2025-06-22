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
    return <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="480ea232-b952-4794-aa75-cdc77fbbb6c5" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="text-center" data-unique-id="01aab242-3bd4-43ff-9d3e-91e07eb08b18" data-file-name="components/UniversalPDFViewer.tsx">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" data-unique-id="b590baef-9868-4c04-a973-280dbf78b503" data-file-name="components/UniversalPDFViewer.tsx"></div>
          <p className="text-gray-600" data-unique-id="dd12c4c9-0865-43db-bb91-1e81f5a9c99f" data-file-name="components/UniversalPDFViewer.tsx"><span className="editable-text" data-unique-id="d17a31f2-fc43-4a66-b972-7e09f9494fdd" data-file-name="components/UniversalPDFViewer.tsx">Loading PDF...</span></p>
        </div>
      </div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg" data-unique-id="1dcc3b3a-3ce9-499f-80dc-e0cff7b468e3" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="text-center" data-unique-id="9b8f2089-3910-40fe-8dd2-fd76195d5e3a" data-file-name="components/UniversalPDFViewer.tsx">
          <div className="text-red-600 mb-4" data-unique-id="9e2766d6-2922-4c6e-9301-247cb371facd" data-file-name="components/UniversalPDFViewer.tsx">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="5b29737e-723b-4558-8fba-caa99d9c3fc7" data-file-name="components/UniversalPDFViewer.tsx">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium" data-unique-id="6773aab7-a633-4df4-bf0b-c3a582e4c471" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">{error}</p>
          <Button onClick={() => window.open(pdfUrl, '_blank')} className="mt-4" data-unique-id="0067a6a3-47c5-4e15-8736-dfd2eca6a142" data-file-name="components/UniversalPDFViewer.tsx"><span className="editable-text" data-unique-id="a944e012-9628-42b0-9e9b-f87139bb9496" data-file-name="components/UniversalPDFViewer.tsx">
            Open in New Tab
          </span></Button>
        </div>
      </div>;
  }
  return <div ref={containerRef} className={`bg-white border rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`} data-unique-id="8297b047-2856-4226-a49d-bc2a84b0e002" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="bg-gray-50 border-b px-4 py-3" data-unique-id="116219b2-06e1-4ec8-9973-fc55bc01f975" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="flex items-center justify-between" data-unique-id="65da138a-7a70-4c18-823b-02da266e2945" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
          <div data-unique-id="32c965d5-39f6-4345-b47a-711c27214b95" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
            {title && <h3 className="font-medium text-gray-900" data-unique-id="2f374173-af57-4ccb-87bd-ab85bfd1defe" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">{title}</h3>}
            <p className="text-sm text-gray-600" data-unique-id="06e858ce-c451-4673-8a4a-0de24125cfc5" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="cea44eea-3cea-4912-97ea-4c569f241d58" data-file-name="components/UniversalPDFViewer.tsx">
              Page </span>{currentPage}<span className="editable-text" data-unique-id="2570b5d7-9399-49c5-b233-555340f58955" data-file-name="components/UniversalPDFViewer.tsx"> of </span>{totalPages}
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2" data-unique-id="4cd25247-3e10-4916-a407-c71e94caab9b" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
            {/* Navigation */}
            <div className="flex items-center gap-1" data-unique-id="7d9abca1-83e1-4b5a-b17d-482d67307f78" data-file-name="components/UniversalPDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1} data-unique-id="cbcbeea4-aa7a-40bf-bb67-b13885ad750e" data-file-name="components/UniversalPDFViewer.tsx">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <input type="number" min="1" max={totalPages} value={currentPage} onChange={e => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                goToPage(page);
              }
            }} className="w-16 px-2 py-1 text-sm border rounded text-center" data-unique-id="31c3d781-3d09-498b-9faa-4be1d371fac3" data-file-name="components/UniversalPDFViewer.tsx" />
              
              <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages} data-unique-id="fbfa0c49-4056-4ecd-bbfe-25a2c2b06497" data-file-name="components/UniversalPDFViewer.tsx">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1" data-unique-id="56746e4b-987e-4a10-a093-504e5c60b429" data-file-name="components/UniversalPDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={zoomOut} data-unique-id="0018230a-d5a5-4703-b85a-1adc60f028c2" data-file-name="components/UniversalPDFViewer.tsx">
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium px-2" data-unique-id="0e55fb2c-578b-453f-a4cd-289711f39504" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
                {Math.round(scale * 100)}<span className="editable-text" data-unique-id="48ab149f-00b7-427e-938c-d35683a52249" data-file-name="components/UniversalPDFViewer.tsx">%
              </span></span>
              
              <Button variant="outline" size="sm" onClick={zoomIn} data-unique-id="1f35de28-ce22-46f0-b6fd-0d95b0c4ac98" data-file-name="components/UniversalPDFViewer.tsx">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Other controls */}
            <Button variant="outline" size="sm" onClick={rotate} data-unique-id="591988a9-30c7-4b33-a663-825b5c21f329" data-file-name="components/UniversalPDFViewer.tsx">
              <RotateCw className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={toggleFullscreen} data-unique-id="f3149386-48e0-48b7-bcc4-4c9e3fee1e28" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>

            {onDownload && <Button variant="outline" size="sm" onClick={onDownload} data-unique-id="9e1f833b-8879-4e25-a8af-f1dfa96846d6" data-file-name="components/UniversalPDFViewer.tsx">
                <Download className="h-4 w-4" />
              </Button>}
          </div>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="p-4 bg-gray-100 overflow-auto" style={{
      height: isFullscreen ? 'calc(100vh - 80px)' : '600px'
    }} data-unique-id="e06ba9e0-9b24-483c-8f06-70caf00773d7" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="flex justify-center" data-unique-id="24bc59e1-6952-4272-b952-9d0077ce1e07" data-file-name="components/UniversalPDFViewer.tsx">
          <canvas ref={canvasRef} className="shadow-lg bg-white max-w-full h-auto" style={{
          maxWidth: '100%',
          height: 'auto'
        }} data-unique-id="ad2c1340-7659-4266-b7be-3b004b34efea" data-file-name="components/UniversalPDFViewer.tsx" />
        </div>
      </div>
    </div>;
}