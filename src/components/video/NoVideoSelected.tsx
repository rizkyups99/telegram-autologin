'use client';

import { Button } from '../ui/button';
import { Play } from 'lucide-react';
export function NoVideoSelected() {
  return <div className="text-center py-16" data-unique-id="697f00c1-0d90-45d3-b0a3-1d15225ab28d" data-file-name="components/video/NoVideoSelected.tsx">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center" data-unique-id="8ec133ea-0a0c-4445-b6ae-591df9100fde" data-file-name="components/video/NoVideoSelected.tsx">
        <Play className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-lg" data-unique-id="03482f97-4c9f-461a-9417-8f2dba4c2a73" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="7db8c6e0-236b-4e39-b13d-18edb4351da8" data-file-name="components/video/NoVideoSelected.tsx">
        Silakan pilih video dari daftar untuk memutarnya di sini.
      </span></p>
      <Button onClick={() => {
      // Find and click the list tab trigger
      const listTab = document.querySelector('[data-value="list"]');
      if (listTab instanceof HTMLElement) {
        listTab.click();
      }
    }} className="mt-4" data-unique-id="afc45dff-4c5f-43ed-b4c9-293f041376e6" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="53d22233-907b-4864-a427-20cbfab36ea4" data-file-name="components/video/NoVideoSelected.tsx">
        Lihat Daftar Video
      </span></Button>
    </div>;
}