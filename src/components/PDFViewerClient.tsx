'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/db/supabase';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the PDFViewer component with ssr: false
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex justify-center p-6">
      <Loader className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
});

export default function PDFViewerClient() {
  const [pdfId, setPdfId] = useState<number | undefined>(undefined);
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Get search params directly from window.location
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('id');
      const urlParam = params.get('url');
      
      if (idParam) {
        setPdfId(parseInt(idParam));
      }
      
      if (urlParam) {
        setPdfUrl(urlParam);
      }
    } catch (error) {
      console.error('Error parsing URL parameters:', error);
    }
  }, []);
  
  // Fetch PDF title if ID is provided
  useEffect(() => {
    if (!pdfId) {
      setIsLoading(false);
      return;
    }
    
    const fetchPdfTitle = async () => {
      try {
        const { data, error } = await supabase
          .from('pdfs')
          .select('title')
          .eq('id', pdfId)
          .single();
          
        if (error) {
          console.error('Error fetching PDF title:', error);
        } else if (data) {
          setTitle(data.title);
        }
      } catch (error) {
        console.error('Error fetching PDF title:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPdfTitle();
  }, [pdfId]);
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  if (!pdfId && !pdfUrl) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>PDF Viewer</CardTitle>
            <CardDescription>No PDF specified. Please provide a PDF ID or URL.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{title || 'PDF Viewer'}</CardTitle>
          <CardDescription>
            {pdfId ? `Viewing PDF ID: ${pdfId}` : 'Viewing PDF from URL'}
          </CardDescription>
        </CardHeader>
      </Card>
      
      <PDFViewer pdfId={pdfId} pdfUrl={pdfUrl} title={title} />
    </div>
  );
}
