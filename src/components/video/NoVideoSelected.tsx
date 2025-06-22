'use client';

import { Button } from '../ui/button';
import { Play } from 'lucide-react';
export function NoVideoSelected() {
  return <div className="text-center py-16" data-unique-id="e0a77621-513e-400a-82ca-b6c0c946a0c2" data-file-name="components/video/NoVideoSelected.tsx">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center" data-unique-id="a786d637-423d-448f-bddd-a20578e3554c" data-file-name="components/video/NoVideoSelected.tsx">
        <Play className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-lg" data-unique-id="09353f49-fc89-4d59-b1f7-248e63b32abf" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="7ed35826-3bf0-4671-8b65-caf7765d6e9e" data-file-name="components/video/NoVideoSelected.tsx">
        Silakan pilih video dari daftar untuk memutarnya di sini.
      </span></p>
      <Button onClick={() => {
      // Find and click the list tab trigger
      const listTab = document.querySelector('[data-value="list"]');
      if (listTab instanceof HTMLElement) {
        listTab.click();
      }
    }} className="mt-4" data-unique-id="8dde63fc-9878-42ee-aaf6-98db6d726807" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="79b0222a-2439-474f-a99d-138c90f19235" data-file-name="components/video/NoVideoSelected.tsx">
        Lihat Daftar Video
      </span></Button>
    </div>;
}