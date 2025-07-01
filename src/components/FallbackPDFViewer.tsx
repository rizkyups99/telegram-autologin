'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Download, ExternalLink, FileText, AlertCircle } from 'lucide-react';
interface FallbackPDFViewerProps {
  pdfUrl: string;
  title?: string;
  onDownload?: () => void;
}
export default function FallbackPDFViewer({
  pdfUrl,
  title,
  onDownload
}: FallbackPDFViewerProps) {
  const [renderMethod, setRenderMethod] = useState<'embed' | 'iframe' | 'download'>('embed');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // Detect browser capabilities
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isChrome = /chrome/i.test(userAgent);
    const isSafari = /safari/i.test(userAgent) && !/chrome/i.test(userAgent);

    // Determine best rendering method based on browser
    if (isMobile && (isChrome || isSafari)) {
      setRenderMethod('iframe');
    } else if (isMobile) {
      setRenderMethod('download');
    } else {
      setRenderMethod('embed');
    }
    setIsLoading(false);
  }, []);
  const handleDownload = async () => {
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = title ? `${title}.pdf` : 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      if (onDownload) {
        onDownload();
      }
    } catch (error) {
      console.error('Download failed:', error);
      // Fallback: open in new tab
      window.open(pdfUrl, '_blank');
    }
  };
  const openInNewTab = () => {
    window.open(pdfUrl, '_blank');
  };
  const renderPDFContent = () => {
    if (renderMethod === 'download') {
      return <div className="flex flex-col items-center justify-center h-96 bg-blue-50 rounded-lg border-2 border-dashed border-blue-300" data-unique-id="64de268b-b9ed-43f4-a7ff-b4ee499ab490" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="text-center max-w-md" data-unique-id="64e6ff69-d8cc-4451-83c3-eadb43cdcaa1" data-file-name="components/FallbackPDFViewer.tsx">
            <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-900 mb-2" data-unique-id="94d6f4f2-0f5e-444b-ad5a-adf05c430277" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="c93e582f-9a41-4930-bc11-817f310de803" data-file-name="components/FallbackPDFViewer.tsx">
              PDF Ready for Download
            </span></h3>
            <p className="text-blue-700 mb-6" data-unique-id="6dd15c56-a15a-4058-9cc0-35e7ed39d069" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="a1167f3f-61d0-4652-8f7c-c6e2f657995f" data-file-name="components/FallbackPDFViewer.tsx">
              Your browser doesn't support inline PDF viewing. Download the file to view it with your device's PDF reader.
            </span></p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center" data-unique-id="344ecd21-89c0-4a19-a0e3-fed73a3dc7fd" data-file-name="components/FallbackPDFViewer.tsx">
              <Button onClick={handleDownload} className="flex items-center gap-2" data-unique-id="fc7c467e-be73-48d3-88c0-7ea78c736d06" data-file-name="components/FallbackPDFViewer.tsx">
                <Download className="h-4 w-4" /><span className="editable-text" data-unique-id="783b82ea-ab2d-41e4-95b5-5073d0e94ef1" data-file-name="components/FallbackPDFViewer.tsx">
                Download PDF
              </span></Button>
              <Button variant="outline" onClick={openInNewTab} className="flex items-center gap-2" data-unique-id="8c8b92fc-060b-4677-a9af-eae60d4eedf3" data-file-name="components/FallbackPDFViewer.tsx">
                <ExternalLink className="h-4 w-4" /><span className="editable-text" data-unique-id="170f9a7a-be84-4147-8c33-79cefd810b52" data-file-name="components/FallbackPDFViewer.tsx">
                Open in New Tab
              </span></Button>
            </div>
          </div>
        </div>;
    }
    if (renderMethod === 'iframe') {
      return <div className="relative" data-unique-id="0b181703-7305-4128-afaf-1085a1d67d88" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
          <iframe src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`} className="w-full h-96 border rounded-lg" title={title || 'PDF Document'} onError={() => setHasError(true)} onLoad={() => setHasError(false)} data-unique-id="1853c3fb-fa2b-4443-9cd2-d28b21b7494b" data-file-name="components/FallbackPDFViewer.tsx" />
          
          {/* Overlay controls for mobile */}
          <div className="absolute top-2 right-2 flex gap-2" data-unique-id="370f912d-0ed1-412b-b5fe-73b0fb095e1f" data-file-name="components/FallbackPDFViewer.tsx">
            <Button size="sm" variant="outline" onClick={handleDownload} className="bg-white/90 backdrop-blur-sm" data-unique-id="6ff73fe7-67d2-4883-922f-2604a4f57c09" data-file-name="components/FallbackPDFViewer.tsx">
              <Download className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={openInNewTab} className="bg-white/90 backdrop-blur-sm" data-unique-id="1b59d974-cc3c-4de8-a844-76d210ec7530" data-file-name="components/FallbackPDFViewer.tsx">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </div>;
    }

    // Default embed method
    return <div className="relative" data-unique-id="f6847974-87e9-4d63-af59-ca2236d3bc6b" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
        <embed src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`} type="application/pdf" className="w-full h-96 border rounded-lg" onError={() => setHasError(true)} data-unique-id="1201dfee-675e-419d-b080-2010b013661f" data-file-name="components/FallbackPDFViewer.tsx" />
        
        {/* Fallback for when embed fails */}
        {hasError && <div className="absolute inset-0 flex items-center justify-center bg-gray-50 border rounded-lg" data-unique-id="8f9a1604-c8ea-4070-9069-d2330914cbeb" data-file-name="components/FallbackPDFViewer.tsx">
            <div className="text-center" data-unique-id="289a4ca5-bffc-4fc0-a073-6537adea10aa" data-file-name="components/FallbackPDFViewer.tsx">
              <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
              <p className="text-gray-600 mb-4" data-unique-id="515ec58c-cf4c-4875-802c-fde17ddffb05" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="32b8a6e3-90a3-46c4-9666-4057da747c8d" data-file-name="components/FallbackPDFViewer.tsx">
                Unable to display PDF in browser
              </span></p>
              <div className="flex gap-2 justify-center" data-unique-id="928066d3-324c-45dc-ba5b-d1728926e942" data-file-name="components/FallbackPDFViewer.tsx">
                <Button onClick={handleDownload} data-unique-id="0b6dd688-f0b3-4aa7-9605-c0bc698680ff" data-file-name="components/FallbackPDFViewer.tsx">
                  <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="4b70bd92-2053-44a6-8bf6-c47594c89d7c" data-file-name="components/FallbackPDFViewer.tsx">
                  Download PDF
                </span></Button>
                <Button variant="outline" onClick={openInNewTab} data-unique-id="b16c9b7a-5f1d-4131-9aa7-cbcee75f38b2" data-file-name="components/FallbackPDFViewer.tsx">
                  <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="11d423f4-5233-4f5f-b3a9-7ec721392b40" data-file-name="components/FallbackPDFViewer.tsx">
                  Open in New Tab
                </span></Button>
              </div>
            </div>
          </div>}
      </div>;
  };
  if (isLoading) {
    return <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg" data-unique-id="8d856a7c-53c5-48d4-9a14-4357525a03c4" data-file-name="components/FallbackPDFViewer.tsx">
        <div className="text-center" data-unique-id="3ea0cae2-3a44-49d5-b810-eb7ac03e211a" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" data-unique-id="49a70ceb-854c-472f-af57-9b375fa11fcc" data-file-name="components/FallbackPDFViewer.tsx"></div>
          <p className="text-gray-600" data-unique-id="2b4369fd-b93b-45da-b315-f1baaed32a7b" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="e427cf33-9c12-4aa9-939d-57cee93d0d4f" data-file-name="components/FallbackPDFViewer.tsx">Preparing PDF viewer...</span></p>
        </div>
      </div>;
  }
  return <div className="bg-white" data-unique-id="72d5c515-9230-4531-b1c3-e31c195d9b7b" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
      {/* Header with title and actions */}
      {title && <div className="border-b bg-gray-50 px-4 py-3 rounded-t-lg" data-unique-id="ff27d136-dfd2-43fa-b0cf-c9250959a4e4" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="flex items-center justify-between" data-unique-id="53d7e5ea-801f-49f2-9525-87bdf3394e9d" data-file-name="components/FallbackPDFViewer.tsx">
            <h3 className="font-medium text-gray-900" data-unique-id="68f22fd8-8e00-4012-86bb-b89c64edd66e" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">{title}</h3>
            <div className="flex gap-2" data-unique-id="8c993497-c2dc-44e4-aeb1-399a682d4a17" data-file-name="components/FallbackPDFViewer.tsx">
              <Button size="sm" variant="outline" onClick={handleDownload} data-unique-id="a83c49ba-c7ba-4e5a-8643-c7956f92b06d" data-file-name="components/FallbackPDFViewer.tsx">
                <Download className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="8ca85f12-7f48-4761-8d38-815e64f99c5e" data-file-name="components/FallbackPDFViewer.tsx">
                Download
              </span></Button>
              <Button size="sm" variant="outline" onClick={openInNewTab} data-unique-id="47753a3c-2b6c-44a7-be40-63b32325b946" data-file-name="components/FallbackPDFViewer.tsx">
                <ExternalLink className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="e6626728-9dfb-4493-9f94-17a543d41957" data-file-name="components/FallbackPDFViewer.tsx">
                Open in Tab
              </span></Button>
            </div>
          </div>
        </div>}

      {/* PDF Content */}
      <div className="p-4" data-unique-id="0e94203d-8aa7-493d-87cc-74d344a6d082" data-file-name="components/FallbackPDFViewer.tsx" data-dynamic-text="true">
        {renderPDFContent()}
      </div>

      {/* Browser compatibility info */}
      <div className="px-4 pb-4" data-unique-id="315aadd4-862e-4796-8c2f-ae39431861c0" data-file-name="components/FallbackPDFViewer.tsx">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3" data-unique-id="d57a501b-bd99-48d8-bb79-8184d84035fd" data-file-name="components/FallbackPDFViewer.tsx">
          <div className="flex items-start gap-2" data-unique-id="2d68fe4b-d6ff-4bb2-9601-e0544006e8b7" data-file-name="components/FallbackPDFViewer.tsx">
            <div className="flex-shrink-0 mt-0.5" data-unique-id="41162aae-ff6d-47b8-a9a5-87d61fc354ff" data-file-name="components/FallbackPDFViewer.tsx">
              <svg className="h-4 w-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-unique-id="0036376c-1ee6-41b2-bef2-2fb9c7812a8e" data-file-name="components/FallbackPDFViewer.tsx">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-sm text-blue-800" data-unique-id="d45c771e-c495-4d89-8ea5-ebdf65da0621" data-file-name="components/FallbackPDFViewer.tsx">
              <p className="font-medium" data-unique-id="bbd82b38-1e5a-4287-84ac-31a939a658a5" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="cab6ffb9-d9eb-4ed9-ae51-be57271fcae8" data-file-name="components/FallbackPDFViewer.tsx">Browser Compatibility Notice</span></p>
              <p className="mt-1" data-unique-id="a2bf4e78-89f7-4e2a-8ce8-12a0bf00822a" data-file-name="components/FallbackPDFViewer.tsx"><span className="editable-text" data-unique-id="6b7c514a-beae-44fa-adaf-3620db858266" data-file-name="components/FallbackPDFViewer.tsx">
                This is a fallback PDF viewer. For the best experience, consider downloading the PDF or opening it in a new tab.
              </span></p>
            </div>
          </div>
        </div>
      </div>
    </div>;
}