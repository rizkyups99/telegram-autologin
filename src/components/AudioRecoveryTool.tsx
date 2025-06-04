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
  return <Card className="mb-6" data-unique-id="57e47ce6-03db-484d-90e5-19e204ec4e21" data-file-name="components/AudioRecoveryTool.tsx">
      <CardHeader data-unique-id="4948e0d8-746e-4e14-a9e7-f499c074a611" data-file-name="components/AudioRecoveryTool.tsx">
        <CardTitle data-unique-id="c763f010-4a62-4bcd-bd6f-cc99e4062d89" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="f88b011d-2942-4575-bb05-8ee46358df38" data-file-name="components/AudioRecoveryTool.tsx">Audio Recovery Tool</span></CardTitle>
        <CardDescription><span className="editable-text" data-unique-id="5b725039-7a26-4726-9fc3-a7218d984cee" data-file-name="components/AudioRecoveryTool.tsx">
          Audio files yang berhasil diupload ke Cloudinary tapi gagal disimpan ke database
        </span></CardDescription>
      </CardHeader>
      <CardContent data-unique-id="a41f49f2-82ac-48f4-8a0c-66f89bcfbb1a" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
        {statusMessage && <div className={`${statusMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'} p-3 mb-4 rounded-md flex items-center`} data-unique-id="efc45635-3354-4c74-b896-77afac2206a7" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
            {statusMessage.type === 'success' ? <CheckCircle className="h-5 w-5 mr-2" /> : <AlertCircle className="h-5 w-5 mr-2" />}
            <span data-unique-id="5ff61d45-b3cd-4c83-bc34-4a1987ce0c89" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{statusMessage.message}</span>
          </div>}
        
        <div className="space-y-4" data-unique-id="5088ff09-1276-4b5b-91f9-c833f41754a8" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
          {itemsArray.map(([key, item]) => <div key={key} className="p-4 border rounded-md" data-is-mapped="true" data-unique-id="d82f4703-2694-4b49-a63e-c6e8c8c416f9" data-file-name="components/AudioRecoveryTool.tsx">
              <div className="flex items-center justify-between mb-2" data-is-mapped="true" data-unique-id="8ded88fb-bb36-4942-acd5-693aac357fb4" data-file-name="components/AudioRecoveryTool.tsx">
                <h3 className="font-medium" data-is-mapped="true" data-unique-id="1f865185-38d8-4ab5-95e7-ff94014dee59" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{item.title}</h3>
                <span className="text-sm text-muted-foreground" data-is-mapped="true" data-unique-id="592c11ff-8c92-4d6d-b54a-eabcac328f4e" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
                  {new Date(item.uploadTime).toLocaleString()}
                </span>
              </div>
              <div className="flex flex-col mb-4" data-is-mapped="true" data-unique-id="53de1939-2fcc-41f0-a764-f51132239b78" data-file-name="components/AudioRecoveryTool.tsx">
                <div className="flex flex-col" data-is-mapped="true" data-unique-id="77f2ab51-9b55-48da-9047-5f43fd2da86a" data-file-name="components/AudioRecoveryTool.tsx">
                  <span className="text-sm font-medium" data-is-mapped="true" data-unique-id="3622507e-0170-4ae9-b4dd-455e0dd26807" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="944c287f-43a8-49c0-af3d-d5937fe1077a" data-file-name="components/AudioRecoveryTool.tsx">File URL:</span></span>
                  <span className="text-xs text-muted-foreground truncate" data-is-mapped="true" data-unique-id="97e492aa-d4b8-4974-9605-7a930b85b114" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">{item.fileUrl}</span>
                  <span className="text-xs text-green-600" data-is-mapped="true" data-unique-id="6126df5b-4d23-4500-94bd-4e98dea52565" data-file-name="components/AudioRecoveryTool.tsx"><span className="editable-text" data-unique-id="d5c1ba99-3bb4-41a4-ab2f-85fc333e33dd" data-file-name="components/AudioRecoveryTool.tsx">(Supabase Storage)</span></span>
                </div>
              </div>
              <div className="flex justify-end space-x-2" data-is-mapped="true" data-unique-id="4cb95083-b7c8-42dc-a958-cb8babb67f9c" data-file-name="components/AudioRecoveryTool.tsx">
                <Button variant="outline" size="sm" onClick={() => handleDelete(key)} data-is-mapped="true" data-unique-id="ff055e62-b192-4c2a-aeab-fc2a65ec6cd5" data-file-name="components/AudioRecoveryTool.tsx">
                  <Trash className="h-4 w-4 mr-2" /><span className="editable-text" data-unique-id="b2122f62-fe2e-4940-9a83-479bdb81dc97" data-file-name="components/AudioRecoveryTool.tsx">
                  Delete
                </span></Button>
                <Button size="sm" onClick={() => handleRecovery(key, item)} disabled={isRecovering} data-is-mapped="true" data-unique-id="0eb72dba-5dc1-4194-ab45-f753740bbef0" data-file-name="components/AudioRecoveryTool.tsx" data-dynamic-text="true">
                  {isRecovering ? <span className="flex items-center" data-is-mapped="true" data-unique-id="bdc28e85-af11-47d0-91a7-e6be982d6b53" data-file-name="components/AudioRecoveryTool.tsx">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" data-is-mapped="true" data-unique-id="46e25499-5d79-4792-a11a-63045d6b26f4" data-file-name="components/AudioRecoveryTool.tsx">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg><span className="editable-text" data-unique-id="4f14af48-394c-4d81-8c8c-f3151c84c917" data-file-name="components/AudioRecoveryTool.tsx">
                      Recovering...
                    </span></span> : "Recover to Database"}
                </Button>
              </div>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}