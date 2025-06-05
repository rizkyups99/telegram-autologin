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
      }} data-unique-id="c8575fb2-197c-41f5-bc0b-93c84fc6d2fe" data-file-name="components/preview/pdf/MobilePDFReader.tsx" />;
    }
    if (renderMethod === 'object') {
      return <object data={pdfUrl} type="application/pdf" className="w-full h-full" style={{
        minHeight: '600px'
      }} data-unique-id="17e8aa57-8425-4615-9fb1-07b3b95b9950" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-8" data-unique-id="be549e0e-874d-41b6-8d59-f5e8506044a2" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <p className="text-center text-muted-foreground" data-unique-id="2f9e059d-9f6a-475a-8cbc-cb4cc36e7147" data-file-name="components/preview/pdf/MobilePDFReader.tsx"><span className="editable-text" data-unique-id="eaa65d35-700c-49cf-b31d-943bfbfe3f2f" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
              PDF cannot be displayed in this browser. Please download or open in a new tab.
            </span></p>
            <div className="flex gap-2" data-unique-id="188b9f31-933c-4002-b35b-6e6d889d72c5" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
              <Button onClick={openInNewTab} variant="outline" data-unique-id="6b1a2157-0e81-4cf4-af4d-9254a7c0628f" data-file-name="components/preview/pdf/MobilePDFReader.tsx"><span className="editable-text" data-unique-id="813621fb-bdd2-43e9-bf67-651af0444617" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
                Open in New Tab
              </span></Button>
              <Button onClick={() => onDownloadPDF(selectedPDF)} data-unique-id="81a37b8f-14f1-497f-9424-d8edd8343f36" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="5be97653-3dd1-40c1-ba53-6aa5bd383548" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
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
    }} data-unique-id="1b2770c1-8306-4830-809f-7c365fe14444" data-file-name="components/preview/pdf/MobilePDFReader.tsx" />;
  };
  return <div className="flex flex-col h-full" data-unique-id="081ce782-3fe0-419e-b2a4-ab08302204e1" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="mb-4 p-4 bg-white border-b" data-unique-id="643c1381-c257-43d2-886c-a451c6d0e5c0" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
        <h2 className="text-xl font-semibold mb-1" data-unique-id="1abef8f9-c83a-4b45-b98e-c8a6bc749550" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-sm text-muted-foreground" data-unique-id="b3643a75-b075-4e08-b720-a7611b1a4c27" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b" data-unique-id="81c20abe-313a-4fa7-96f6-1ca2aefb3da2" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
        <div className="flex items-center gap-2" data-unique-id="9af5fc76-6384-44a0-8dda-a010b1892c24" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50} data-unique-id="a4305d73-e848-4c92-9b41-0e881e3c1826" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center" data-unique-id="e4fff6b7-1431-4648-a657-a5670b4e8155" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
            {zoom}<span className="editable-text" data-unique-id="47297ce0-8333-470a-a4e1-f40a28d127f4" data-file-name="components/preview/pdf/MobilePDFReader.tsx">%
          </span></span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200} data-unique-id="509ef689-23e8-4512-a8b5-5e8d5e1847eb" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2" data-unique-id="60008f6b-e3bc-4eaf-87d4-0f14d440db14" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <Button variant="outline" size="sm" onClick={openInNewTab} data-unique-id="e7c1d8b6-c366-4129-95b1-2a29177efc3a" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDownloadPDF(selectedPDF)} data-unique-id="5369b011-d4f7-4a4e-9f8c-19578538398b" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 bg-gray-100" data-unique-id="d0912d65-4aea-40bc-bd92-f78f12cdc111" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
        {renderPDFContent()}
      </div>
    </div>;
}