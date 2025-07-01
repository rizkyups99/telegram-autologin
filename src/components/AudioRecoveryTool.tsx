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
  return <Card className="mb-6" data-unique-id="15d26f9d-479a-42b5-be5a-cee54fe2746d" data-file-name="components/AudioRecoveryTool.tsx">
      <CardHeader data-unique-id="48a5437e-52f8-48ac-87b7-fad1a6a0eb31" data-file-name="components/AudioRecoveryTool.tsx">
        <CardTitle data-unique-id="f0a904ec-138c-41cd-97c8-f7d414d394c1" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="0535ce05-e815-4eb2-84f1-62c3601dcf15" data-file-name="components/AudioRecoveryTool.tsx">Audio Recovery Tool</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="511e56cb-a801-442a-869f-b7d11f0e3dc5" data-file-name="components/AudioRecoveryTool.tsx">
          Audio files yang berhasil diupload ke Cloudinary tapi gagal disimpan ke database
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="650fd34a-c971-4b9c-a0e2-9832960eaf75" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 mb-4 rounded-md flex items-center`} data-unique-id="dc077147-af3b-4337-a256-353573556a7d" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="964c4daa-4baa-4a8b-b9f3-51f19e19b629" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{statusMessage.message}</span>
          </div>}
        
        <div className="space-y-4" data-unique-id="87b9b4ed-7871-4267-b3cb-c107f92d14ce" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
          {itemsArray.map(([key, item]) => <div key={key} className="p-4 border rounded-md" data-is-mapped="true" data-unique-id="68979a19-8490-468b-9be9-22ec0d855209" data-file-name="components/AudioRecoveryTool.tsx">
              <div className="flex items-center justify-between mb-2" data-is-mapped="true" data-unique-id="4708a395-b38c-47cb-ab17-1d814d772eb3" data-file-name="components/AudioRecoveryTool.tsx">
                <h3 className="font-medium" data-is-mapped="true" data-unique-id="33b91580-1039-4099-80f6-d8b59a8b3605" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{item.title}</h3>
                <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="1a2478aa-b951-4b1e-a52d-c354a27126e4" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
                  {new Date(item.uploadTime).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col mb-4" data-is-mapped="true" data-unique-id="784eec44-0eb8-4882-94b4-2a6be30bc771" data-file-name="components/AudioRecoveryTool.tsx">
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="c53b675e-bcbc-4036-b9fc-5076753ba09a" data-file-name="components/AudioRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="59c63200-0c7f-4db9-89f5-d2e4ae5a87c0" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="458fc1cc-507e-490f-bcce-6907e0e1c67d" data-file-name="components/AudioRecoveryTool.tsx">File URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="1954f51b-a53e-44f6-9e3b-d63ff3fb8376" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{item.fileUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="d643bc38-9572-4858-8dff-dbc686d0e386" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="5ec2eb2f-1cd9-4037-a03e-30c5e208c670" data-file-name="components/AudioRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
              </div>
              <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="e9b050a9-d52d-4b0f-a539-5770d20d3560" data-file-name="components/AudioRecoveryTool.tsx">
                <Button variant="outline" size="sm" onClick={() => handleDelete(key)} data-is-mapped="true" data-unique-id="15d8e979-de19-4087-b3bb-a56cae3d79ac" data-file-name="components/AudioRecoveryTool.tsx">
                  <Trash className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="8da1ecf4-acd4-4445-8d98-1e689753f66e" data-file-name="components/AudioRecoveryTool.tsx">
                  Delete
                </span></Button>
                <Button size="sm" onClick={() => handleRecovery(key, item)} disabled={isRecovering} data-is-mapped="true" data-unique-id="711c119c-9756-4801-87a8-9c13d1c08669" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
                  {isRecovering ? <span className="flex items-center" data-is-mapped="true" data-unique-id="c649111c-622f-44e9-abf7-d0dd7bd23ad8" data-file-name="components/AudioRecoveryTool.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="a0206bfd-98bc-48f2-b6ee-72f80007d121" data-file-name="components/AudioRecoveryTool.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg><span className="editable-text" data-unique-id="c80f28eb-e503-4e95-9b2c-73dc0c9a12bd" data-file-name="components/AudioRecoveryTool.tsx">
                      Recovering...
                    </span></span> : "Recover to Database"}
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}