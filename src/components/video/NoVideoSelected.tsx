'use client';

import { Button } from '../ui/button';
import { Play } from 'lucide-react';
export function NoVideoSelected() {
  return <div className="text-center py-16" data-unique-id="e73b4c2c-3cad-452b-acb1-c75a306a9bab" data-file-name="components/video/NoVideoSelected.tsx">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center" data-unique-id="b357d07b-051b-4575-8dd2-f2363bd4978c" data-file-name="components/video/NoVideoSelected.tsx">
        <Play className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-lg" data-unique-id="c3fe7f16-7d93-4b98-9190-37a468f0421d" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="c5fb5009-88f8-4784-bd84-42f05368fe1f" data-file-name="components/video/NoVideoSelected.tsx">
        Silakan pilih video dari daftar untuk memutarnya di sini.
      </span></p>
      <Button onClick={() => {
      // Find and click the list tab trigger
      const listTab = document.querySelector('[data-value="list"]');
      if (listTab instanceof HTMLElement) {
        listTab.click();
      }
    }} className="mt-4" data-unique-id="4ac61dc2-2966-485d-9f5e-2bace86ace79" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="9a229bad-451c-41b2-b529-115a8ae29fe0" data-file-name="components/video/NoVideoSelected.tsx">
        Lihat Daftar Video
      </span></Button>
    </div>;
}