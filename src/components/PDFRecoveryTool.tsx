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
  return <Card className="mb-6" data-unique-id="5f268e5a-c613-4c8a-9413-d1d124dcef53" data-file-name="components/PDFRecoveryTool.tsx">
      <CardHeader data-unique-id="908b1c14-88a4-4340-a8d0-54ab85d4b2e7" data-file-name="components/PDFRecoveryTool.tsx">
        <CardTitle data-unique-id="e890a4eb-a3fb-4391-9e3b-b777088e078f" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="38ed4cb9-2d43-42f2-a688-c82eb0fe4464" data-file-name="components/PDFRecoveryTool.tsx">PDF Recovery Tool</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="6dc653c2-5c6d-4b53-8d5f-a1d905463655" data-file-name="components/PDFRecoveryTool.tsx">
          PDF files yang berhasil diupload ke Cloudinary tapi gagal disimpan ke database
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="414bb56d-ffc1-4628-883f-ccf5965b7ce0" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 mb-4 rounded-md flex items-center`} data-unique-id="b7dd865a-7114-443d-be8f-aa2a24c9bd9b" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="e9c81398-b0fc-43fd-8051-2d5fa0ae6bd7" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{statusMessage.message}</span>
          </div>}
        
        <div className="space-y-4" data-unique-id="288ccf71-f183-4b46-a77f-dfc777681314" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
          {itemsArray.map(([key, item]) => <div key={key} className="p-4 border rounded-md" data-is-mapped="true" data-unique-id="d896e392-176c-44d7-835c-792ccbd28087" data-file-name="components/PDFRecoveryTool.tsx">
              <div className="flex items-center justify-between mb-2" data-is-mapped="true" data-unique-id="60a667e6-d142-489f-80f4-653dd00e5b0a" data-file-name="components/PDFRecoveryTool.tsx">
                <h3 className="font-medium" data-is-mapped="true" data-unique-id="aed32c85-796f-472d-ab16-0373b32eb886" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.title}</h3>
                <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="b6c6ba09-34a4-4f17-a0da-3f3cbd12531f" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
                  {new Date(item.uploadTime).toLocaleString()}
                </span>
              </div>
              <div className="grid gap-2 grid-cols-1 md:grid-cols-2 mb-4" data-is-mapped="true" data-unique-id="11093f3d-83b3-4037-b318-6fe1a87b72e1" data-file-name="components/PDFRecoveryTool.tsx">
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="61745419-ec4f-4dbf-a702-9341cbd51888" data-file-name="components/PDFRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="f4ec4ca7-daeb-4a18-9028-32c5ae61e218" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="1404af64-aad3-4ec2-a85b-061886265f9b" data-file-name="components/PDFRecoveryTool.tsx">Cover URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="ae465fb7-409c-4df1-be5e-d282cd287e3a" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.coverUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="f1c1f3f3-b653-4554-84c3-4249a48663ce" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="44caa7d8-4447-4ed9-9fe6-e782d46ce6e8" data-file-name="components/PDFRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="825d8565-ea43-4cd3-83d8-257d44c0dc22" data-file-name="components/PDFRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="8675e31d-d34a-41b1-ad04-b7f054bd9938" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="f9ce38cf-47be-4bc9-b298-ade22d4f1495" data-file-name="components/PDFRecoveryTool.tsx">File URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="07e8dea7-c907-44a6-a2d9-288cb4aaf145" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.fileUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="4d327c87-3c16-436e-861f-97c472638cdd" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="c29184ef-5832-4d06-9a3b-708a60fdbed8" data-file-name="components/PDFRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
              </div>
              <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="9322c49c-9041-4ffb-be6d-900a46b5ee8d" data-file-name="components/PDFRecoveryTool.tsx">
                <Button variant="outline" size="sm" onClick={() => handleDelete(key)} data-is-mapped="true" data-unique-id="fea458b7-6f93-447b-93ad-59a1914048a0" data-file-name="components/PDFRecoveryTool.tsx">
                  <Trash className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="53d4aac0-12a8-4d53-b3be-87d635ff383b" data-file-name="components/PDFRecoveryTool.tsx">
                  Delete
                </span></Button>
                <Button size="sm" onClick={() => handleRecovery(key, item)} disabled={isRecovering} data-is-mapped="true" data-unique-id="90269a0f-e096-456e-9a89-fa38d43677f4" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
                  {isRecovering ? <span className="flex items-center" data-is-mapped="true" data-unique-id="d5c1e341-f99a-45fc-b727-e0539603bbbf" data-file-name="components/PDFRecoveryTool.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="0d5c3de7-cc84-4080-a609-78b7a348b139" data-file-name="components/PDFRecoveryTool.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg><span className="editable-text" data-unique-id="0e570169-1c40-470a-b9e5-d6d7b759ca47" data-file-name="components/PDFRecoveryTool.tsx">
                      Recovering...
                    </span></span> : "Recover to Database"}
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}