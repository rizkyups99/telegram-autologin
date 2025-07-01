'use client';

import { Button } from '../ui/button';
import { Play } from 'lucide-react';
export function NoVideoSelected() {
  return <div className="text-center py-16" data-unique-id="1d235f8b-ab7f-4749-a656-82a4c0cd1028" data-file-name="components/video/NoVideoSelected.tsx">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center" data-unique-id="22901ece-ffe2-470c-8ffa-4831619720ed" data-file-name="components/video/NoVideoSelected.tsx">
        <Play className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-lg" data-unique-id="96d5e06b-d1e3-4473-8c22-75e346864a47" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="fb2b20a7-576e-47db-a53d-42924d28e7be" data-file-name="components/video/NoVideoSelected.tsx">
        Silakan pilih video dari daftar untuk memutarnya di sini.
      </span></p>
      <Button onClick={() => {
      // Find and click the list tab trigger
      const listTab = document.querySelector('[data-value="list"]');
      if (listTab instanceof HTMLElement) {
        listTab.click();
      }
    }} className="mt-4" data-unique-id="323cf64b-d6e4-4f68-a3f2-ff8462f8bcd0" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="04db6202-c662-4027-ae17-cd17ac8927ba" data-file-name="components/video/NoVideoSelected.tsx">
        Lihat Daftar Video
      </span></Button>
    </div>;
}