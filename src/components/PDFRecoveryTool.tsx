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
  return <Card className="mb-6" data-unique-id="4b2df8de-8747-4a22-8aff-73ec4d1abb47" data-file-name="components/PDFRecoveryTool.tsx">
      <CardHeader data-unique-id="dd6657cf-1836-4023-af83-2dc999d19da7" data-file-name="components/PDFRecoveryTool.tsx">
        <CardTitle data-unique-id="634591ba-f6b4-4d19-9f14-8c41e0ce6a41" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="c0014320-dd1d-4607-909b-2e562d10edec" data-file-name="components/PDFRecoveryTool.tsx">PDF Recovery Tool</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="c0ab09d7-1809-4edc-bae9-26b0a6f811d5" data-file-name="components/PDFRecoveryTool.tsx">
          PDF files yang berhasil diupload ke Cloudinary tapi gagal disimpan ke database
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="41c5ff94-28b5-449c-9a19-2be36d9f9557" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 mb-4 rounded-md flex items-center`} data-unique-id="3fe8a20a-2041-4f75-93bc-43fb005f3a9f" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="eb65c631-2c8c-4408-ba9a-37b63cd1c816" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{statusMessage.message}</span>
          </div>}
        
        <div className="space-y-4" data-unique-id="6589a4ed-25ec-43ec-a9de-82dddeaa2e5e" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
          {itemsArray.map(([key, item]) => <div key={key} className="p-4 border rounded-md" data-is-mapped="true" data-unique-id="e75582ed-d0bd-42d4-a864-5b7b36185301" data-file-name="components/PDFRecoveryTool.tsx">
              <div className="flex items-center justify-between mb-2" data-is-mapped="true" data-unique-id="13724334-efc8-41d9-a50d-b0af6959d9c3" data-file-name="components/PDFRecoveryTool.tsx">
                <h3 className="font-medium" data-is-mapped="true" data-unique-id="38d9ef8d-57d0-4d22-8df7-beba754337dd" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.title}</h3>
                <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="41eff683-56df-418e-b466-7ff35e9453cd" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
                  {new Date(item.uploadTime).toLocaleString()}
                </span>
              </div>
              <div className="grid gap-2 grid-cols-1 md:grid-cols-2 mb-4" data-is-mapped="true" data-unique-id="2135295d-e6af-4a2b-8376-e2b9ab8e36fc" data-file-name="components/PDFRecoveryTool.tsx">
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="9952f45a-4523-48ab-9964-05eac981e171" data-file-name="components/PDFRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="4b01ec04-e423-4076-ab3f-65a77badee68" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="b70917a1-5972-46ea-b6a6-fd9f9c163418" data-file-name="components/PDFRecoveryTool.tsx">Cover URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="72053744-7b11-42e9-9ead-0b3bb28627ea" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.coverUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="4824ff82-2078-4146-bb7f-bc6719d3778d" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="515f3c96-0a3b-43fa-a5ad-10ac69a990f7" data-file-name="components/PDFRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="82a4bd99-8c36-462c-a17e-e11b2cc5766d" data-file-name="components/PDFRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="ae9577eb-361c-4273-9008-f6a4469352bf" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="1f0b2d09-1d31-4eb7-800e-165dc8de7e27" data-file-name="components/PDFRecoveryTool.tsx">File URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="7f9c06d5-2ab8-46ca-a656-a60b54cb0c94" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.fileUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="52885805-3833-4d65-bc86-aa70fedaadec" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="a43b0840-dbfd-4be6-bbbc-1deae5e70b18" data-file-name="components/PDFRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
              </div>
              <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="b8164c5c-4208-47e9-9b48-8031b9080f86" data-file-name="components/PDFRecoveryTool.tsx">
                <Button variant="outline" size="sm" onClick={() => handleDelete(key)} data-is-mapped="true" data-unique-id="5e88815a-30f3-4ad6-a354-08071c7ad4af" data-file-name="components/PDFRecoveryTool.tsx">
                  <Trash className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="3a3e19cb-71bf-4079-9860-70676b388251" data-file-name="components/PDFRecoveryTool.tsx">
                  Delete
                </span></Button>
                <Button size="sm" onClick={() => handleRecovery(key, item)} disabled={isRecovering} data-is-mapped="true" data-unique-id="2aca30fd-3b7e-4a6f-a171-b04665818afe" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
                  {isRecovering ? <span className="flex items-center" data-is-mapped="true" data-unique-id="3c990c85-977f-4e89-b186-be569091590c" data-file-name="components/PDFRecoveryTool.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="58eb0141-a39f-41e1-8a7c-ba328b1b0095" data-file-name="components/PDFRecoveryTool.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg><span className="editable-text" data-unique-id="b3509e3a-b8ea-4a6e-9f9e-284e7b24bd79" data-file-name="components/PDFRecoveryTool.tsx">
                      Recovering...
                    </span></span> : "Recover to Database"}
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}