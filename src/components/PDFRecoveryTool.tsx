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
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
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
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: item.title,
          coverUrl: item.coverUrl,
          fileUrl: item.fileUrl,
          categoryId: item.categoryId
        })
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || data.details || "Recovery failed");
      }

      // Remove the recovery item from localStorage
      localStorage.removeItem(key);

      // Update state
      const newRecoveryItems = {
        ...recoveryItems
      };
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
    const newRecoveryItems = {
      ...recoveryItems
    };
    delete newRecoveryItems[key];
    setRecoveryItems(newRecoveryItems);
  };
  const itemsArray = Object.entries(recoveryItems);
  if (itemsArray.length === 0) {
    return null; // Don't render anything if there are no recovery items
  }
  return <Card className="mb-6" data-unique-id="fe3a2eef-dae5-42cf-bb0e-59dc05033420" data-file-name="components/PDFRecoveryTool.tsx">
      <CardHeader data-unique-id="22deb5a6-6fab-48d3-8e10-f3a0069efbbd" data-file-name="components/PDFRecoveryTool.tsx">
        <CardTitle data-unique-id="b9c8f4d2-2208-4804-9c3a-a67f1dc237b7" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="3a3405f2-5bb1-48af-ad73-c44417faafb7" data-file-name="components/PDFRecoveryTool.tsx">PDF Recovery Tool</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="139bf2d9-f4f4-4c24-a9ed-d96edaf8cc80" data-file-name="components/PDFRecoveryTool.tsx">
          PDF files yang berhasil diupload ke Cloudinary tapi gagal disimpan ke database
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="d3d78605-7fae-4227-a888-cb7c1a75aee6" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 mb-4 rounded-md flex items-center`} data-unique-id="9e32eff5-2c1b-4148-a949-ebc613bd9de0" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="8e97dd21-9fa2-4906-947d-0ec57673fda4" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{statusMessage.message}</span>
          </div>}
        
        <div className="space-y-4" data-unique-id="f2697a5e-11ab-4db5-a6cd-dca6ee49ff02" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
          {itemsArray.map(([key, item]) => <div key={key} className="p-4 border rounded-md" data-is-mapped="true" data-unique-id="b63bb38f-2fa8-494e-89d5-e6d4ca760422" data-file-name="components/PDFRecoveryTool.tsx">
              <div className="flex items-center justify-between mb-2" data-is-mapped="true" data-unique-id="1a0325e4-14dc-4dc2-bf35-eba8f4c8f0b1" data-file-name="components/PDFRecoveryTool.tsx">
                <h3 className="font-medium" data-is-mapped="true" data-unique-id="413cb95f-4f27-49eb-ad17-d3492156dccb" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.title}</h3>
                <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="3998e380-ca4c-4687-bfb5-0a4d5818a7be" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
                  {new Date(item.uploadTime).toLocaleString()}
                </span>
              </div>
              <div className="grid gap-2 grid-cols-1 md:grid-cols-2 mb-4" data-is-mapped="true" data-unique-id="d20eb686-469f-4774-b060-645daba8f6ce" data-file-name="components/PDFRecoveryTool.tsx">
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="daa7adcf-d587-4d91-80d6-67d2c81262a4" data-file-name="components/PDFRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="9d5cea57-ebd7-4c6d-add0-0ff00bb25da5" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="578c618c-f3a3-47fe-82b8-1e750bcddb2a" data-file-name="components/PDFRecoveryTool.tsx">Cover URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="0da6a8be-0e59-4151-84ca-b5f74f34d31a" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.coverUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="c36f3d5a-7b93-4c05-a1ba-ba2f09e05ef9" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="72e51340-f8b4-4eda-9cdb-70abd4215fce" data-file-name="components/PDFRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="cb7c3a5e-16dc-4376-9396-9c0ed1369cfc" data-file-name="components/PDFRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="437a03c8-b166-445e-976b-6dc3396861a7" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="1795f66d-53f2-4381-9128-bfaa60b9a7b0" data-file-name="components/PDFRecoveryTool.tsx">File URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="455f8cde-f1e2-4040-92ab-21ebdf6e3ff6" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.fileUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="ebfe87d2-afd7-4ddc-b47d-759ee1931a67" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="3161c873-87d9-4c54-ab19-fac485114cd6" data-file-name="components/PDFRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
              </div>
              <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="f4b42f71-d1d0-4fed-bd23-9179382f8f7d" data-file-name="components/PDFRecoveryTool.tsx">
                <Button variant="outline" size="sm" onClick={() => handleDelete(key)} data-is-mapped="true" data-unique-id="4f066ee2-467b-4dd3-acf2-9f54747e88b7" data-file-name="components/PDFRecoveryTool.tsx">
                  <Trash className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="cc0db5ca-77fc-4b5e-a3b7-9cad551afa33" data-file-name="components/PDFRecoveryTool.tsx">
                  Delete
                </span></Button>
                <Button size="sm" onClick={() => handleRecovery(key, item)} disabled={isRecovering} data-is-mapped="true" data-unique-id="ddbfae66-a9f7-4f9c-91d8-09f75c72979a" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
                  {isRecovering ? <span className="flex items-center" data-is-mapped="true" data-unique-id="548afab8-9563-4cf2-94ca-ab1e35173f19" data-file-name="components/PDFRecoveryTool.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="c90acd3a-6590-4942-9446-fe433cd903d4" data-file-name="components/PDFRecoveryTool.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg><span className="editable-text" data-unique-id="2fff1248-8c0e-49a3-aeab-e06db7376a82" data-file-name="components/PDFRecoveryTool.tsx">
                      Recovering...
                    </span></span> : "Recover to Database"}
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}