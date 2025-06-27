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
  return <Card className="mb-6" data-unique-id="c21cd66f-0508-4d0d-b7b7-732a448a9e3e" data-file-name="components/AudioRecoveryTool.tsx">
      <CardHeader data-unique-id="eb2198a9-561c-46da-a1ba-12583caa75b0" data-file-name="components/AudioRecoveryTool.tsx">
        <CardTitle data-unique-id="c74463fe-cc50-45f2-a0d4-6a7a4f82572d" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="51800eb2-7c2f-46a8-baec-e1805325b1c1" data-file-name="components/AudioRecoveryTool.tsx">Audio Recovery Tool</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="1389e9f1-7fe8-4ec9-81c3-3c29a8d6581d" data-file-name="components/AudioRecoveryTool.tsx">
          Audio files yang berhasil diupload ke Cloudinary tapi gagal disimpan ke database
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="e990d2e4-4e70-4579-a224-647da669e6cc" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 mb-4 rounded-md flex items-center`} data-unique-id="af613b62-c9d3-4062-b12f-bd60a64bda65" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="01a95514-a7c2-487b-b010-3efe8dfd2b48" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{statusMessage.message}</span>
          </div>}
        
        <div className="space-y-4" data-unique-id="c53f6bf6-c70a-4806-b4dd-48b7ac5e7c48" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
          {itemsArray.map(([key, item]) => <div key={key} className="p-4 border rounded-md" data-is-mapped="true" data-unique-id="d610392f-0889-4d35-a075-3bb4c22bb2f8" data-file-name="components/AudioRecoveryTool.tsx">
              <div className="flex items-center justify-between mb-2" data-is-mapped="true" data-unique-id="6b277c62-43c3-4dff-9573-57ffd3257edd" data-file-name="components/AudioRecoveryTool.tsx">
                <h3 className="font-medium" data-is-mapped="true" data-unique-id="d5ebd1d1-7d65-4346-93e6-ba86fd3df389" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{item.title}</h3>
                <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="c9194c18-3b3e-41f4-b3bc-beabd18c27f0" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
                  {new Date(item.uploadTime).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col mb-4" data-is-mapped="true" data-unique-id="ddd62f6b-799e-478b-8253-c98646cd4f64" data-file-name="components/AudioRecoveryTool.tsx">
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="c6d7fbff-8538-4bf8-be7b-c9aa041457a0" data-file-name="components/AudioRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="3df5ceb0-c7b5-4bde-8f65-4455e137ed1c" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="5c2c40aa-ea66-47c4-a72f-48bf186a4464" data-file-name="components/AudioRecoveryTool.tsx">File URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="75c749d5-e0f8-4676-906f-5f69513166d9" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{item.fileUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="095ba192-cca0-4cb3-8da9-1735d058cc90" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="0363be88-97a0-473c-8c40-47ec6cd8aeba" data-file-name="components/AudioRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
              </div>
              <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="4ce0165c-0854-4eea-a968-5d4edf9d5ce7" data-file-name="components/AudioRecoveryTool.tsx">
                <Button variant="outline" size="sm" onClick={() => handleDelete(key)} data-is-mapped="true" data-unique-id="16115607-878a-464d-a3e2-454c820ddf2e" data-file-name="components/AudioRecoveryTool.tsx">
                  <Trash className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="7f12f797-9a7b-4720-9168-6a789cc3893f" data-file-name="components/AudioRecoveryTool.tsx">
                  Delete
                </span></Button>
                <Button size="sm" onClick={() => handleRecovery(key, item)} disabled={isRecovering} data-is-mapped="true" data-unique-id="3de0e10b-c6c6-4927-a971-80f5b74b8a98" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
                  {isRecovering ? <span className="flex items-center" data-is-mapped="true" data-unique-id="659ee48b-6587-4f49-ad27-3a9db07fb34a" data-file-name="components/AudioRecoveryTool.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="ff5a15c9-d6ae-4fe3-a8e5-f46a354b8e35" data-file-name="components/AudioRecoveryTool.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg><span className="editable-text" data-unique-id="18b5a009-8af0-4fc0-b23d-f60033dfcd62" data-file-name="components/AudioRecoveryTool.tsx">
                      Recovering...
                    </span></span> : "Recover to Database"}
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}