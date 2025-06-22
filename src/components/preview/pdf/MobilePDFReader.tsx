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
      }} data-unique-id="da07b931-890d-4d53-8892-d764427514cb" data-file-name="components/preview/pdf/MobilePDFReader.tsx" />;
    }
    if (renderMethod === 'object') {
      return <object data={pdfUrl} type="application/pdf" className="w-full h-full" style={{
        minHeight: '600px'
      }} data-unique-id="bab7d2c4-ed76-456b-9470-91a780dc136d" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <div className="flex flex-col items-center justify-center h-full space-y-4 p-8" data-unique-id="7aff7ec0-8941-409f-95c5-e6b870f292ca" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <p className="text-center text-muted-foreground" data-unique-id="61f07fee-f347-459e-a986-10efdb62290b" data-file-name="components/preview/pdf/MobilePDFReader.tsx"><span className="editable-text" data-unique-id="1f6e48f3-def0-492b-826e-255fe7125cca" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
              PDF cannot be displayed in this browser. Please download or open in a new tab.
            </span></p>
            <div className="flex gap-2" data-unique-id="38dd8a36-d35c-4c4e-9870-5a77e69c4691" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
              <Button onClick={openInNewTab} variant="outline" data-unique-id="0e57b97c-8790-464b-a947-e7658098c161" data-file-name="components/preview/pdf/MobilePDFReader.tsx"><span className="editable-text" data-unique-id="4714c569-0643-4235-aa37-2a00089e6810" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
                Open in New Tab
              </span></Button>
              <Button onClick={() => onDownloadPDF(selectedPDF)} data-unique-id="d822e3fb-d4c5-4c93-a681-7add307afd81" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="38a69a3c-1679-48be-83c7-c9e86998c802" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
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
    }} data-unique-id="b39bc3cb-6e22-4930-b9ea-39b935a42077" data-file-name="components/preview/pdf/MobilePDFReader.tsx" />;
  };
  return <div className="flex flex-col h-full" data-unique-id="06569ad0-f493-47c0-b73f-75e1ede08ebc" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
      {/* Header */}
      <div className="mb-4 p-4 bg-white border-b" data-unique-id="ff4c502e-e984-42bc-a013-5308026a90d9" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
        <h2 className="text-xl font-semibold mb-1" data-unique-id="a86a90a6-09a1-4cdf-8b48-29233472f6af" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">{selectedPDF.title}</h2>
        <p className="text-sm text-muted-foreground" data-unique-id="41f8ff46-bafb-49e6-b258-674df994185f" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">{categoryName}</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b" data-unique-id="d2f2eabc-643e-4c55-b3d6-b354920e5c98" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
        <div className="flex items-center gap-2" data-unique-id="4710dc01-49b3-49a7-ac8e-f5f6f22d7cd1" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50} data-unique-id="b987764d-a02c-4988-ba4c-0fbb6e31ba01" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center" data-unique-id="588c2735-5c92-49e8-93e2-89dc3fb6a667" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
            {zoom}<span className="editable-text" data-unique-id="20b92e12-4fea-4257-8629-c0c5dce3f6bb" data-file-name="components/preview/pdf/MobilePDFReader.tsx">%
          </span></span>
          <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200} data-unique-id="0497c389-ec4a-4a82-af6b-9ec52aa80a3a" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2" data-unique-id="15216be3-f6e6-4945-b4f1-acdbe0c61884" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
          <Button variant="outline" size="sm" onClick={openInNewTab} data-unique-id="b03d0728-a9b1-46ee-975e-7d46f7e3979a" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDownloadPDF(selectedPDF)} data-unique-id="9cf4ac12-688b-4a6d-9a7e-75cc1d95fd22" data-file-name="components/preview/pdf/MobilePDFReader.tsx">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 bg-gray-100" data-unique-id="a6b7984a-00f0-4fbe-9021-a1ce1e3a3e61" data-file-name="components/preview/pdf/MobilePDFReader.tsx" data-dynamic-text="true">
        {renderPDFContent()}
      </div>
    </div>;
}