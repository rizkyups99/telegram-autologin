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
  return <Card className="mb-6" data-unique-id="8149a6f4-2c26-40b7-b50a-065303b45c77" data-file-name="components/PDFRecoveryTool.tsx">
      <CardHeader data-unique-id="6591430c-a7b2-4698-9192-5ce603e57d6b" data-file-name="components/PDFRecoveryTool.tsx">
        <CardTitle data-unique-id="0b0a9ea3-73a6-4eb2-9340-f89045a80503" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="dde2e121-9047-46f4-8b01-e7e889f49106" data-file-name="components/PDFRecoveryTool.tsx">PDF Recovery Tool</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="9dc06c82-77d8-4dce-bd99-f877b5ab8364" data-file-name="components/PDFRecoveryTool.tsx">
          PDF files yang berhasil diupload ke Cloudinary tapi gagal disimpan ke database
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="d0425463-5187-4980-a1d7-57854ebb3c20" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 mb-4 rounded-md flex items-center`} data-unique-id="99ef5a31-c27c-4cec-8419-4f9bc97e0677" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="f3ec6179-5ea3-45d9-b367-11caed5a6c43" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{statusMessage.message}</span>
          </div>}
        
        <div className="space-y-4" data-unique-id="aeb8564d-316e-42c0-8870-4e1da42b42bf" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
          {itemsArray.map(([key, item]) => <div key={key} className="p-4 border rounded-md" data-is-mapped="true" data-unique-id="9d82b0d9-2061-4d03-842e-82e38763c0cb" data-file-name="components/PDFRecoveryTool.tsx">
              <div className="flex items-center justify-between mb-2" data-is-mapped="true" data-unique-id="4238e22a-d6d9-4e8f-b4c7-1f32caaaaf04" data-file-name="components/PDFRecoveryTool.tsx">
                <h3 className="font-medium" data-is-mapped="true" data-unique-id="bf15fc51-b437-46e7-b29f-b39108396197" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.title}</h3>
                <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="e38fe513-6204-4ced-94aa-f47c24443989" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
                  {new Date(item.uploadTime).toLocaleString()}
                </span>
              </div>
              <div className="grid gap-2 grid-cols-1 md:grid-cols-2 mb-4" data-is-mapped="true" data-unique-id="c275726b-04df-4ac9-a6b2-e1c77e6d639d" data-file-name="components/PDFRecoveryTool.tsx">
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="45f57ad8-32d5-4f86-9212-f8d13ee786fe" data-file-name="components/PDFRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="a73f5b17-cbe7-4ef5-816e-927a8daa55d4" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="2b0133e5-3d81-425f-bc2a-b9084fd5d5b5" data-file-name="components/PDFRecoveryTool.tsx">Cover URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="fa6fd960-da1b-40eb-9bc9-d004403eceeb" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.coverUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="683ba0ad-9e4e-48cd-922b-66478f06baf4" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="22a28e06-78ac-484d-a2c1-3b78d751a843" data-file-name="components/PDFRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="c8b467a7-c057-4d93-b10f-044075b8b6b7" data-file-name="components/PDFRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="f081c59e-6dd9-4b05-a4de-aecf043245fb" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="cb7ef826-0f07-40f3-a54b-3c0600ec5e2c" data-file-name="components/PDFRecoveryTool.tsx">File URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="fe7502e0-69b4-4450-b691-21ea5edc6e94" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">{item.fileUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="cda5a3a2-5149-4443-94f1-c3be828d2867" data-file-name="components/PDFRecoveryTool.tsx"><span className="editable-text" data-unique-id="a0ad987f-4986-4dd6-a9de-97563bbe0d62" data-file-name="components/PDFRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
              </div>
              <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="3176de19-3a7f-4a8d-af63-a92eb2eaa685" data-file-name="components/PDFRecoveryTool.tsx">
                <Button variant="outline" size="sm" onClick={() => handleDelete(key)} data-is-mapped="true" data-unique-id="46f5fb1c-43d4-410c-86b0-92bd29bca2f7" data-file-name="components/PDFRecoveryTool.tsx">
                  <Trash className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="ae4bb773-03b2-4330-8c1c-13be08ddcffa" data-file-name="components/PDFRecoveryTool.tsx">
                  Delete
                </span></Button>
                <Button size="sm" onClick={() => handleRecovery(key, item)} disabled={isRecovering} data-is-mapped="true" data-unique-id="79f9e395-1d57-4cde-8092-26e8e6686358" data-file-name="components/PDFRecoveryTool.tsx" data-dynamic-text="true">
                  {isRecovering ? <span className="flex items-center" data-is-mapped="true" data-unique-id="4d7a420a-2f54-4915-b554-dabea1e4d7fe" data-file-name="components/PDFRecoveryTool.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="6d69f226-8de2-4d78-a853-7d2608a86e83" data-file-name="components/PDFRecoveryTool.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg><span className="editable-text" data-unique-id="0acf9cf7-e518-4707-befc-e206f74e2bfb" data-file-name="components/PDFRecoveryTool.tsx">
                      Recovering...
                    </span></span> : "Recover to Database"}
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}