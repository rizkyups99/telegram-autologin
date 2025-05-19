'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, Trash } from 'lucide-react';

interface RecoveryItem {
  title: string;
  coverUrl: string;
  fileUrl: string;
  categoryId: string;
  uploadTime: string;
}

export default function PDFRecoveryTool() {
  const [recoveryItems, setRecoveryItems] = useState<Record<string, RecoveryItem>>({});
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isRecovering, setIsRecovering] = useState(false);

  // Load recovery items from localStorage
  useEffect(() => {
    const items: Record<string, RecoveryItem> = {};
    if (typeof window !== 'undefined') {
      // Find all keys in localStorage that match our pattern
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('pdf_upload_recovery_')) {
          try {
            const item = JSON.parse(localStorage.getItem(key) || '');
            items[key] = item;
          } catch (e) {
            console.error(`Failed to parse recovery item ${key}:`, e);
          }
        }
      }
    }
    setRecoveryItems(items);
  }, []);

  const handleRecovery = async (key: string, item: RecoveryItem) => {
    setIsRecovering(true);
    try {
      // Try to re-save the PDF data to the database
      const response = await fetch("/api/pdfs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: item.title,
          coverUrl: item.coverUrl,
          fileUrl: item.fileUrl,
          categoryId: item.categoryId
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || "Recovery failed");
      }
      
      // Remove the recovery item from localStorage
      localStorage.removeItem(key);
      
      // Update state
      const newRecoveryItems = { ...recoveryItems };
      delete newRecoveryItems[key];
      setRecoveryItems(newRecoveryItems);
      
      setStatusMessage({
        type: 'success',
        message: `Successfully recovered PDF: ${item.title}`
      });
      
      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error recovering PDF:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to recover PDF"
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const handleDelete = (key: string) => {
    localStorage.removeItem(key);
    const newRecoveryItems = { ...recoveryItems };
    delete newRecoveryItems[key];
    setRecoveryItems(newRecoveryItems);
  };

  const itemsArray = Object.entries(recoveryItems);

  if (itemsArray.length === 0) {
    return null; // Don't render anything if there are no recovery items
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>PDF Recovery Tool</CardTitle>
        <CardDescription>
          PDF files yang berhasil diupload ke Cloudinary tapi gagal disimpan ke database
        </CardDescription>
      </CardHeader>
      <CardContent>
        {statusMessage && (
          <div className={`${
            statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          } p-3 mb-4 rounded-md flex items-center`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            <span>{statusMessage.message}</span>
          </div>
        )}
        
        <div className="space-y-4">
          {itemsArray.map(([key, item]) => (
            <div key={key} className="p-4 border rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium">{item.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {new Date(item.uploadTime).toLocaleString()}
                </span>
              </div>
              <div className="grid gap-2 grid-cols-1 md:grid-cols-2 mb-4">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Cover URL:</span>
                  <span className="text-xs text-muted-foreground truncate">{item.coverUrl}</span>
                  <span className="text-xs text-green-600">(Supabase Storage)</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">File URL:</span>
                  <span className="text-xs text-muted-foreground truncate">{item.fileUrl}</span>
                  <span className="text-xs text-green-600">(Supabase Storage)</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDelete(key)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button 
                  size="sm"
                  onClick={() => handleRecovery(key, item)}
                  disabled={isRecovering}
                >
                  {isRecovering ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Recovering...
                    </span>
                  ) : (
                    "Recover to Database"
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
