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
    return <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="07886644-2869-4d52-a0cf-4923e2c55034" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="text-center" data-unique-id="243c5669-7e7f-4320-a560-f19724ced1dc" data-file-name="components/UniversalPDFViewer.tsx">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" data-unique-id="bdeef401-f912-47d6-bde5-7365f07634b5" data-file-name="components/UniversalPDFViewer.tsx"></div>
          <p className="text-gray-600" data-unique-id="93686051-0a25-4bac-a1ed-508180166e89" data-file-name="components/UniversalPDFViewer.tsx"><span className="editable-text" data-unique-id="2c688ddd-0b11-4018-9fad-f40e09acfbc8" data-file-name="components/UniversalPDFViewer.tsx">Loading PDF...</span></p>
        </div>
      </div>;
  }
  if (error) {
    return <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg" data-unique-id="7a471b4e-1f38-497d-8094-aa31fc270836" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="text-center" data-unique-id="6de84ce2-28a7-45b9-860a-14e7c699747f" data-file-name="components/UniversalPDFViewer.tsx">
          <div className="text-red-600 mb-4" data-unique-id="eb27e440-3a45-4ab9-8b74-1052fdaa2f3c" data-file-name="components/UniversalPDFViewer.tsx">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="5ea39372-9512-43ae-807b-959976594916" data-file-name="components/UniversalPDFViewer.tsx">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 18.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium" data-unique-id="0be67f19-9a51-4b4c-a137-2cc3387d7483" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">{error}</p>
          <Button onClick={() => window.open(pdfUrl, '_blank')} className="mt-4" data-unique-id="037a42f0-ca28-422f-b5f9-4e1a6708080f" data-file-name="components/UniversalPDFViewer.tsx"><span className="editable-text" data-unique-id="d80d58fd-4766-4d8f-9412-bf0cfdfe077c" data-file-name="components/UniversalPDFViewer.tsx">
            Open in New Tab
          </span></Button>
        </div>
      </div>;
  }
  return <div ref={containerRef} className={`bg-white border rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''}`} data-unique-id="5b7b39b8-3db9-40b3-ae45-0413657d4274" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="bg-gray-50 border-b px-4 py-3" data-unique-id="04d60857-6a15-4412-a751-1bfdb06f8ad9" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="flex items-center justify-between" data-unique-id="2556be93-9f8e-48ee-903b-5e6b98cbae12" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
          <div data-unique-id="9bdd8eca-4358-4874-813b-538e738c424c" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
            {title && <h3 className="font-medium text-gray-900" data-unique-id="c2916e3f-d724-4623-897a-e9e5bf95a499" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">{title}</h3>}
            <p className="text-sm text-gray-600" data-unique-id="127f420c-8b52-4242-a7f6-361483bd2314" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true"><span className="editable-text" data-unique-id="f45a12b4-f601-4815-94a1-721f57ea1469" data-file-name="components/UniversalPDFViewer.tsx">
              Page </span>{currentPage}<span className="editable-text" data-unique-id="08d855ae-00ab-4ca1-9fc1-494decfddf27" data-file-name="components/UniversalPDFViewer.tsx"> of </span>{totalPages}
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-2" data-unique-id="8f6ec600-9bfd-41be-ada4-1c115e27c49a" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
            {/* Navigation */}
            <div className="flex items-center gap-1" data-unique-id="afa3efe3-d2c2-4d7e-a98b-390a280cdad5" data-file-name="components/UniversalPDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={prevPage} disabled={currentPage === 1} data-unique-id="fff25cbb-5539-4c10-adca-098ce8502106" data-file-name="components/UniversalPDFViewer.tsx">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <input type="number" min="1" max={totalPages} value={currentPage} onChange={e => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                goToPage(page);
              }
            }} className="w-16 px-2 py-1 text-sm border rounded text-center" data-unique-id="2e1647c6-caba-42e1-a468-692c1d59f97b" data-file-name="components/UniversalPDFViewer.tsx" />
              
              <Button variant="outline" size="sm" onClick={nextPage} disabled={currentPage === totalPages} data-unique-id="5db55631-d58e-4b81-869c-0e05ed9d49a0" data-file-name="components/UniversalPDFViewer.tsx">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1" data-unique-id="436a15b0-24f6-45b3-b3d9-a0adaecd8fc0" data-file-name="components/UniversalPDFViewer.tsx">
              <Button variant="outline" size="sm" onClick={zoomOut} data-unique-id="755b0304-2427-4ecb-9031-59f2c1126f61" data-file-name="components/UniversalPDFViewer.tsx">
                <ZoomOut className="h-4 w-4" />
              </Button>
              
              <span className="text-sm font-medium px-2" data-unique-id="d69e2719-345c-4471-b28e-19e5aba79587" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
                {Math.round(scale * 100)}<span className="editable-text" data-unique-id="64e3e995-eea9-43b9-a276-0404b75a8805" data-file-name="components/UniversalPDFViewer.tsx">%
              </span></span>
              
              <Button variant="outline" size="sm" onClick={zoomIn} data-unique-id="d422b634-d254-48ec-916a-091cd28d7e76" data-file-name="components/UniversalPDFViewer.tsx">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Other controls */}
            <Button variant="outline" size="sm" onClick={rotate} data-unique-id="4d262feb-f02a-401e-bb84-0dd44dc28674" data-file-name="components/UniversalPDFViewer.tsx">
              <RotateCw className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" onClick={toggleFullscreen} data-unique-id="79ef499f-4a01-4971-b94d-b2605cf5d07d" data-file-name="components/UniversalPDFViewer.tsx" data-dynamic-text="true">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>

            {onDownload && <Button variant="outline" size="sm" onClick={onDownload} data-unique-id="55403271-6ecb-41c9-9c1a-0132e1988bb7" data-file-name="components/UniversalPDFViewer.tsx">
                <Download className="h-4 w-4" />
              </Button>}
          </div>
        </div>
      </div>

      {/* PDF Canvas */}
      <div className="p-4 bg-gray-100 overflow-auto" style={{
      height: isFullscreen ? 'calc(100vh - 80px)' : '600px'
    }} data-unique-id="6e04a522-2325-4304-aea2-6fd179233ea6" data-file-name="components/UniversalPDFViewer.tsx">
        <div className="flex justify-center" data-unique-id="f728ceb9-88d0-43d0-805c-43cbc0c0bfaa" data-file-name="components/UniversalPDFViewer.tsx">
          <canvas ref={canvasRef} className="shadow-lg bg-white max-w-full h-auto" style={{
          maxWidth: '100%',
          height: 'auto'
        }} data-unique-id="f7011448-ee86-4c90-a697-0d04ad58e4a3" data-file-name="components/UniversalPDFViewer.tsx" />
        </div>
      </div>
    </div>;
}