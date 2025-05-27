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
  return <Card className="mb-6" data-unique-id="a2674012-40ef-45b1-9c0e-5959a20732fa" data-file-name="components/PDFRecoveryTool.tsx">
      <CardHeader data-unique-id="af3ea00d-232c-48a5-a40f-bbfe53ec6c3b" data-file-name="components/PDFRecoveryTool.tsx">
        <CardTitle data-unique-id="2be48b90-0efb-42ca-8d69-c156407c4c65" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="ecb12787-db94-4732-ae14-e3e765e22840" data-file-name="components/PDFRecoveryTool.tsx">PDF Recovery Tool</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="01dfb704-d8d6-4965-a8ac-a1c0ec6d26b1" data-file-name="components/PDFRecoveryTool.tsx">
          PDF files yang berhasil diupload ke Cloudinary tapi gagal disimpan ke database
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="5e6558ca-7e2f-432d-8b73-cfe69f8596ca" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 mb-4 rounded-md flex items-center`} data-unique-id="5a6c72c5-ab18-40de-a402-85648943e3af" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="4a64c64c-3c14-4f8f-b3dc-67ccb4a9879b" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{statusMessage.message}</span>
          </div>}
        
        <div className="space-y-4" data-unique-id="a53d3caa-16b3-4bd0-bc96-7e6831cdfc3d" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
          {itemsArray.map(([key, item]) => <div key={key} className="p-4 border rounded-md" data-is-mapped="true" data-unique-id="7ff458cc-c8b2-43ba-b8bc-75054c1f499d" data-file-name="components/PDFRecoveryTool.tsx">
              <div className="flex items-center justify-between mb-2" data-is-mapped="true" data-unique-id="de2c76ca-f651-4745-910e-e52cac964ce8" data-file-name="components/PDFRecoveryTool.tsx">
                <h3 className="font-medium" data-is-mapped="true" data-unique-id="82ff5b18-35bd-4a3a-9096-eecb10c139a0" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.title}</h3>
                <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="5007de4d-afe5-4d6a-ae2e-b7f0b2de9462" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
                  {new Date(item.uploadTime).toLocaleString()}
                </span>
              </div>
              <div className="grid gap-2 grid-cols-1 md:grid-cols-2 mb-4" data-is-mapped="true" data-unique-id="fcc49fb1-6fe6-4d1e-bd8a-220665a3133b" data-file-name="components/PDFRecoveryTool.tsx">
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="c982e04e-eda0-46a9-baac-789e87fdb212" data-file-name="components/PDFRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="a855b805-4cad-4919-9e6d-517429830ad8" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="bcdba4df-7d0f-48d2-ac49-352705d8eeab" data-file-name="components/PDFRecoveryTool.tsx">Cover URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="88a2205f-fc0a-40c0-865f-29d5896a3f5d" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.coverUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="51cfd0c8-f532-4772-9759-8bfd99477c2b" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="20308091-9daa-40d2-a79b-0780fba96d0b" data-file-name="components/PDFRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="1a658ef5-e563-4356-9e7e-3bb85c35de1a" data-file-name="components/PDFRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="353b5df2-2dec-4ea6-b56a-ecf4cc1dcd29" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="d32c5799-68df-4bde-9c5f-6bcefa811a7b" data-file-name="components/PDFRecoveryTool.tsx">File URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="a6764a4a-c54d-403b-b124-d5de332c8ef6" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.fileUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="4f227215-49a8-4d1c-b55d-869e9341c1d9" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="a85f30f9-9ea8-46d2-9ca1-1c7acc82fbf2" data-file-name="components/PDFRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
              </div>
              <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="e377d6ea-4f60-4223-9205-c94314496b1a" data-file-name="components/PDFRecoveryTool.tsx">
                <Button variant="outline" size="sm" onClick={() => handleDelete(key)} data-is-mapped="true" data-unique-id="fe4f6952-05c7-4676-96a8-8c23813b430f" data-file-name="components/PDFRecoveryTool.tsx">
                  <Trash className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="e2927174-6a01-4505-9e86-5d4ec47ee79a" data-file-name="components/PDFRecoveryTool.tsx">
                  Delete
                </span></Button>
                <Button size="sm" onClick={() => handleRecovery(key, item)} disabled={isRecovering} data-is-mapped="true" data-unique-id="f69ebea3-75ed-46a6-b492-d4ada95f6235" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
                  {isRecovering ? <span className="flex items-center" data-is-mapped="true" data-unique-id="641e61a2-f872-4870-b242-477fa04c0323" data-file-name="components/PDFRecoveryTool.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="d2c0813b-8d82-4606-988b-6603e56e6aff" data-file-name="components/PDFRecoveryTool.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg><span className="editable-text" data-unique-id="07b25882-6a2e-4b74-a925-36c743f13487" data-file-name="components/PDFRecoveryTool.tsx">
                      Recovering...
                    </span></span> : "Recover to Database"}
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}