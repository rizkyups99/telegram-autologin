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
  return <Card className="mb-6" data-unique-id="f92e1a34-c2a9-4561-8617-1b3de6a1277b" data-file-name="components/AudioRecoveryTool.tsx">
      <CardHeader data-unique-id="66e5e272-6be1-4915-910d-c36433612c84" data-file-name="components/AudioRecoveryTool.tsx">
        <CardTitle data-unique-id="2e23ff63-0d14-4dd9-82cf-0815a5624f7a" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="c2efed53-2af9-4f47-9075-8d46b4be26aa" data-file-name="components/AudioRecoveryTool.tsx">Audio Recovery Tool</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="17645d92-a138-4006-abb4-33131ffcc496" data-file-name="components/AudioRecoveryTool.tsx">
          Audio files yang berhasil diupload ke Cloudinary tapi gagal disimpan ke database
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="fbab5ebc-c026-4419-b558-7f4946791e60" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 mb-4 rounded-md flex items-center`} data-unique-id="4a7a9157-978e-4eaf-8d8a-85a442f8c226" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="812a9150-e48b-4924-83f1-5f8651c59d24" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{statusMessage.message}</span>
          </div>}
        
        <div className="space-y-4" data-unique-id="754601a2-9114-4777-a836-6d7b9ab623ff" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
          {itemsArray.map(([key, item]) => <div key={key} className="p-4 border rounded-md" data-is-mapped="true" data-unique-id="8c104b01-de19-434f-a506-2534b198d579" data-file-name="components/AudioRecoveryTool.tsx">
              <div className="flex items-center justify-between mb-2" data-is-mapped="true" data-unique-id="c7c86fae-8f16-47b6-a84b-9d03b21cd0fc" data-file-name="components/AudioRecoveryTool.tsx">
                <h3 className="font-medium" data-is-mapped="true" data-unique-id="aae07fce-a8fb-468b-929f-571a801e2389" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{item.title}</h3>
                <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="43f845a8-497c-4641-a698-290b9af3cc7b" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
                  {new Date(item.uploadTime).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col mb-4" data-is-mapped="true" data-unique-id="8131c109-d8b9-458f-a361-7b316db6b5c7" data-file-name="components/AudioRecoveryTool.tsx">
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="08a274bb-6915-44a4-a2cf-6e7c961808e7" data-file-name="components/AudioRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="ac17f11b-f287-42c9-9a57-47fac324008c" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="4530201f-9763-4352-9d17-552bb4acfadd" data-file-name="components/AudioRecoveryTool.tsx">File URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="b5d9f42f-6217-431a-a0a6-243cf38f6368" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{item.fileUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="6231e56e-0a78-46ed-9888-b2ec2868034a" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="bfc3cee7-64ea-41e8-b257-390ae7d281a2" data-file-name="components/AudioRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
              </div>
              <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="cdbe37da-4a8a-4132-a89f-086e2ee88e19" data-file-name="components/AudioRecoveryTool.tsx">
                <Button variant="outline" size="sm" onClick={() => handleDelete(key)} data-is-mapped="true" data-unique-id="efb3dc7a-ab00-448f-9c10-3641a6c9edae" data-file-name="components/AudioRecoveryTool.tsx">
                  <Trash className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="10e13c03-d845-43b4-a770-8b8911b294d1" data-file-name="components/AudioRecoveryTool.tsx">
                  Delete
                </span></Button>
                <Button size="sm" onClick={() => handleRecovery(key, item)} disabled={isRecovering} data-is-mapped="true" data-unique-id="e6e2a2af-dccc-4c44-af8f-98a4755a11c1" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
                  {isRecovering ? <span className="flex items-center" data-is-mapped="true" data-unique-id="dfe127b2-9e9c-466f-9bda-a7f4a4a7c9f7" data-file-name="components/AudioRecoveryTool.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="68ad3d15-9766-4aee-b6b8-c66bb241cba2" data-file-name="components/AudioRecoveryTool.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg><span className="editable-text" data-unique-id="de04a703-7f05-490a-868b-87c94380efe6" data-file-name="components/AudioRecoveryTool.tsx">
                      Recovering...
                    </span></span> : "Recover to Database"}
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}