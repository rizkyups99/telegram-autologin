'use client';

import { Button } from '../ui/button';
import { Play } from 'lucide-react';
export function NoVideoSelected() {
  return <div className="text-center py-16" data-unique-id="f61d92a1-4d3b-4621-a6a3-d3b0701f0117" data-file-name="components/video/NoVideoSelected.tsx">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center" data-unique-id="40cab318-6616-4b63-8a48-6a89ae3243a8" data-file-name="components/video/NoVideoSelected.tsx">
        <Play className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-lg" data-unique-id="efcd4a8b-5d9c-458e-8324-2d23b61e38ef" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="29905503-0e4e-4cf9-92a9-437c2243b9e4" data-file-name="components/video/NoVideoSelected.tsx">
        Silakan pilih video dari daftar untuk memutarnya di sini.
      </span></p>
      <Button onClick={() => {
      // Find and click the list tab trigger
      const listTab = document.querySelector('[data-value="list"]');
      if (listTab instanceof HTMLElement) {
        listTab.click();
      }
    }} className="mt-4" data-unique-id="bc0d65ee-f6db-4ded-888f-6cdb0723bf4c" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="e3ce9ecc-e403-4469-808f-38256988a0eb" data-file-name="components/video/NoVideoSelected.tsx">
        Lihat Daftar Video
      </span></Button>
    </div>;
}