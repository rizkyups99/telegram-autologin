'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, CheckCircle, Trash } from 'lucide-react';
interface RecoveryItem {
  title: string;
  fileUrl: string;
  categoryId: string;
  uploadTime: string;
}
export default function AudioRecoveryTool() {
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
        if (key && key.startsWith('audio_upload_recovery_')) {
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
      // Try to re-save the audio data to the database
      const response = await fetch("/api/audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: item.title,
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
        message: `Successfully recovered audio: ${item.title}`
      });

      // Clear status message after 3 seconds
      setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
    } catch (error) {
      console.error("Error recovering audio:", error);
      setStatusMessage({
        type: 'error',
        message: error instanceof Error ? error.message : "Failed to recover audio"
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
  return <Card className="mb-6" data-unique-id="410c6af0-c33f-4a26-becd-a2cf3325a30d" data-file-name="components/AudioRecoveryTool.tsx">
      <CardHeader data-unique-id="07a085c3-3599-4adf-9756-6151fd672b7e" data-file-name="components/AudioRecoveryTool.tsx">
        <CardTitle data-unique-id="0042a220-92e1-4069-89f2-6ceb0d62af63" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="a0826fd9-236f-467d-975f-86e59c72f967" data-file-name="components/AudioRecoveryTool.tsx">Audio Recovery Tool</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="f0bf4241-92b6-4b36-8a80-5a140f9459e9" data-file-name="components/AudioRecoveryTool.tsx">
          Audio files yang berhasil diupload ke Cloudinary tapi gagal disimpan ke database
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="ee0fd9cb-12af-4efa-8af4-1594f4f87c05" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 mb-4 rounded-md flex items-center`} data-unique-id="74b9306b-cf5b-48b3-995c-23fc14cc77ee" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="f47d0d6b-8b44-4b29-9485-dd575347fef6" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{statusMessage.message}</span>
          </div>}
        
        <div className="space-y-4" data-unique-id="86ab5c40-bebf-41da-b315-6d7e87d2c98e" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
          {itemsArray.map(([key, item]) => <div key={key} className="p-4 border rounded-md" data-is-mapped="true" data-unique-id="b87c21d1-c209-4780-9136-6aeeaa613d93" data-file-name="components/AudioRecoveryTool.tsx">
              <div className="flex items-center justify-between mb-2" data-is-mapped="true" data-unique-id="98ebcdb1-0fa5-490d-a478-e76d8226eb62" data-file-name="components/AudioRecoveryTool.tsx">
                <h3 className="font-medium" data-is-mapped="true" data-unique-id="eed4b394-88a1-4901-b54b-bfbf9aa4b975" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{item.title}</h3>
                <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="3fcb864f-14c1-44f4-82e0-ca85b2114800" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
                  {new Date(item.uploadTime).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col mb-4" data-is-mapped="true" data-unique-id="5245ad9d-1c16-40fc-955c-f6a5b00641c3" data-file-name="components/AudioRecoveryTool.tsx">
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="0f05a7c3-c3a3-455d-81e9-ce2b1f7058ff" data-file-name="components/AudioRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="3ce4aed8-945e-4ec1-9db2-effaedc82b3a" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="7fa6b9aa-5ef9-4816-a7d9-040267684f01" data-file-name="components/AudioRecoveryTool.tsx">File URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="95c92242-ef8d-4f28-b896-982416c078bf" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{item.fileUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="183be7da-c27d-4194-88cc-9fef50da4c3a" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="a2c394e1-8f23-47e3-ac74-5172897b2c4a" data-file-name="components/AudioRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
              </div>
              <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="dc229ec8-27fd-415a-b290-ebd5ac8272a5" data-file-name="components/AudioRecoveryTool.tsx">
                <Button variant="outline" size="sm" onClick={() => handleDelete(key)} data-is-mapped="true" data-unique-id="b55f7a75-8821-4c18-8dce-c405a189fcbe" data-file-name="components/AudioRecoveryTool.tsx">
                  <Trash className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="b69d4a05-583e-47c6-985d-8ca1fcd3985f" data-file-name="components/AudioRecoveryTool.tsx">
                  Delete
                </span></Button>
                <Button size="sm" onClick={() => handleRecovery(key, item)} disabled={isRecovering} data-is-mapped="true" data-unique-id="36698483-72ae-4528-a48a-6e930416e865" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
                  {isRecovering ? <span className="flex items-center" data-is-mapped="true" data-unique-id="5d53a422-5822-47d6-ab15-29fc5ced05ff" data-file-name="components/AudioRecoveryTool.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="4a8018bf-56f9-4296-9edc-1bb46b9c3179" data-file-name="components/AudioRecoveryTool.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg><span className="editable-text" data-unique-id="fd106552-67bb-4f17-8ed1-30cbe56a9811" data-file-name="components/AudioRecoveryTool.tsx">
                      Recovering...
                    </span></span> : "Recover to Database"}
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}