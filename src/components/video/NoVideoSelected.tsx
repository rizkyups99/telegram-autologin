'use client';

import { Button } from '../ui/button';
import { Play } from 'lucide-react';
export function NoVideoSelected() {
  return <div className="text-center py-16" data-unique-id="4861f007-1407-44f9-ac43-ce4d9709b7b1" data-file-name="components/video/NoVideoSelected.tsx">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center" data-unique-id="a5aaf959-8dc0-495a-8643-45bf412d66eb" data-file-name="components/video/NoVideoSelected.tsx">
        <Play className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-lg" data-unique-id="61e0aa14-dfa7-416c-9790-25ac965b1ee7" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="44c83ae8-2640-4cf1-9c36-8a581ef1e625" data-file-name="components/video/NoVideoSelected.tsx">
        Silakan pilih video dari daftar untuk memutarnya di sini.
      </span></p>
      <Button onClick={() => {
      // Find and click the list tab trigger
      const listTab = document.querySelector('[data-value="list"]');
      if (listTab instanceof HTMLElement) {
        listTab.click();
      }
    }} className="mt-4" data-unique-id="9aa2a208-5a7a-4843-b06c-89b47ff73e93" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="3a004479-37d8-41f5-aa1a-8b6c3f02b03f" data-file-name="components/video/NoVideoSelected.tsx">
        Lihat Daftar Video
      </span></Button>
    </div>;
}