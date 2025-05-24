'use client';

import { Button } from '../ui/button';
import { Play } from 'lucide-react';
export function NoVideoSelected() {
  return <div className="text-center py-16" data-unique-id="1e1db70e-c50e-477b-aa58-626ff9182d8b" data-file-name="components/video/NoVideoSelected.tsx">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center" data-unique-id="d444ca09-97a8-4915-be97-6b1afd9da74a" data-file-name="components/video/NoVideoSelected.tsx">
        <Play className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-lg" data-unique-id="8f554056-88d7-40ee-b09a-28dc8cb4e04f" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="1a604ad0-03ea-4cab-a4c7-b39dd9e042e8" data-file-name="components/video/NoVideoSelected.tsx">
        Silakan pilih video dari daftar untuk memutarnya di sini.
      </span></p>
      <Button onClick={() => {
      // Find and click the list tab trigger
      const listTab = document.querySelector('[data-value="list"]');
      if (listTab instanceof HTMLElement) {
        listTab.click();
      }
    }} className="mt-4" data-unique-id="c6b767ed-c828-4fa7-a5e9-7f4b0efb498a" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="e65c62d9-3013-42d1-a31f-a6b753f153c4" data-file-name="components/video/NoVideoSelected.tsx">
        Lihat Daftar Video
      </span></Button>
    </div>;
}