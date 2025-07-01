'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut, RotateCw, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';
interface PDF {
  id: number;
  title: string;
  coverUrl: string;
  fileUrl: string;
  categoryId: number;
  categoryName?: string;
}
interface MobilePDFReaderProps {
  selectedPDF: PDF;
  onDownloadPDF: (pdf: PDF) => void;
  categoryName?: string;
}
export function MobilePDFReader({
  selectedPDF,
  onDownloadPDF,
  categoryName
}: MobilePDFReaderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [renderMethod, setRenderMethod] = useState<'embed' | 'iframe' | 'object'>('embed');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobile(mobile);

      // For mobile Chrome, prefer iframe method
      if (mobile && /chrome/i.test(userAgent)) {
        setRenderMethod('iframe');
      }
    }
  }, []);
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };
  const openInNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(selectedPDF.fileUrl, '_blank');
    }
  };
  const renderPDFContent = () => {
    const pdfUrl = `${selectedPDF.fileUrl}#toolbar=1&navpanes=1&scrollbar=1&zoom=${zoom}`;
    if (renderMethod === 'iframe') {
      return <iframe src={pdfUrl} className="w-full h-full border-0" title={selectedPDF.title} style={{
        minHeight: '600px'
      }} onError={() => {
        console.log('Iframe failed, trying object method');
        setRenderMethod('object');
      }} data-unique-id="339dcb04-3414-4bf4-9c96-4e71b77e8011" data-file-name="components/preview/pdf/MobilePDFReader.tsx" />;
    }
    if (renderMethod === 'object') {
      return <object data={pdfUrl} type="application/pdf" className="w-full h-full" style={{
        minHeight: '600px'
      }} data-unique-id="fc8a0406-2c2f-4883-be33-c1d7fecabbf2" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-8" data-unique-id="06611a50-248f-4861-aac4-2c4e0c61b462" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <p className="text-center text-muted-foreground" data-unique-id="fb0f5a4f-799b-4d5f-a528-92592b2010ea" data-file-name="components/preview/pdf/MobilePDFReader.tsx"><span className="editable-text" data-unique-id="0e2085ae-b211-4d42-97d9-b309122d8173" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
              PDF cannot be displayed in this browser. Please download or open in a new tab.
            </span></p>
            <div className="flex gap-2" data-unique-id="66d8a870-dcdb-4756-9c32-25269024c7a6" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
              <Button onClick={openInNewTab} variant="outline" data-unique-id="7f71de74-bbad-4631-9b2b-9037ce0a8290" data-file-name="components/preview/pdf/MobilePDFReader.tsx"><span className="editable-text" data-unique-id="6987b7ad-c02e-4eb8-9cd5-0bcd8ab2a9e7" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
                Open in New Tab
              </span></Button>
              <Button onClick={() => onDownloadPDF(selectedPDF)} data-unique-id="b5816bb5-6677-46a2-b92e-aa5e798ed447" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="b1ad58cc-7368-4f23-b98b-64175ae26de0" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
                Download PDF
              </span></Button>
            </div>
          </div>
        </object>;
    }

    // Default embed method
    return <embed src={pdfUrl} type="application/pdf" className="w-full h-full" style={{
      minHeight: '600px'
    }} onError={() => {
      console.log('Embed failed, trying iframe method');
      setRenderMethod('iframe');
    }} data-unique-id="4a42901a-f5b1-4b20-bb53-a7ae893d255e" data-file-name="components/preview/pdf/MobilePDFReader.tsx" />;
  };
  return <div className="flex flex-col h-full" data-unique-id="4d74be78-8697-4fee-b3ab-13dab92c0012" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="mb-4 p-4 bg-white border-b" data-unique-id="f087a8d9-ebb3-455f-bdbd-a465837ea316" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
        <h2 className="text-xl font-semibold mb-1" data-unique-id="3e9f08ce-a985-4427-b219-cbb2089dd628" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-sm text-muted-foreground" data-unique-id="d7d882d0-3ac5-4bd0-b72e-f3b2e4b8feaa" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b" data-unique-id="ad8bd46a-8c3a-44b1-adbe-567ad74207fb" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
        <div className="flex items-center gap-2" data-unique-id="396f0d93-3837-440e-8efa-2186d3eaa0c8" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50} data-unique-id="633ff771-4ef5-423f-89e7-4359f834c052" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center" data-unique-id="2a4c07c5-b903-4ffe-86f8-45e32297ea16" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
            {zoom}<span className="editable-text" data-unique-id="24f4e8fc-c82c-45a3-8fda-bacb7169fab9" data-file-name="components/preview/pdf/MobilePDFReader.tsx">%
          </span></span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200} data-unique-id="0cf2555f-81e4-4e0d-bb0b-776774ad3891" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2" data-unique-id="e1ba50d9-d408-4556-9f39-9af3ee4eb98e" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <Button variant="outline" size="sm" onClick={openInNewTab} data-unique-id="56f82088-7739-41b0-be9f-7a76f7a40a0a" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDownloadPDF(selectedPDF)} data-unique-id="b056583d-4858-40b6-912a-b6e0e692a6d9" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 bg-gray-100" data-unique-id="9b8550f3-2e91-4a92-bfec-34fca548ce5a" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
        {renderPDFContent()}
      </div>
    </div>;
}