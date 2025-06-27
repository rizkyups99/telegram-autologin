'use client';

import { Button } from '../ui/button';
import { Play } from 'lucide-react';
export function NoVideoSelected() {
  return <div className="text-center py-16" data-unique-id="0ab06914-b5e5-4a4b-b9c8-008ed8944c3a" data-file-name="components/video/NoVideoSelected.tsx">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center" data-unique-id="92aa98eb-30da-4302-a296-a5ad5035a374" data-file-name="components/video/NoVideoSelected.tsx">
        <Play className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-lg" data-unique-id="a1bfef68-f2ab-4c65-b6d5-395dc7bdc1ee" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="2c3adbae-2b57-4eec-a17f-aa71b05cc400" data-file-name="components/video/NoVideoSelected.tsx">
        Silakan pilih video dari daftar untuk memutarnya di sini.
      </span></p>
      <Button onClick={() => {
      // Find and click the list tab trigger
      const listTab = document.querySelector('[data-value="list"]');
      if (listTab instanceof HTMLElement) {
        listTab.click();
      }
    }} className="mt-4" data-unique-id="8770549c-7df7-4a09-8295-84176a250fa2" data-file-name="components/video/NoVideoSelected.tsx"><span className="editable-text" data-unique-id="06a817a9-e3a1-441d-b3c2-c8664199d8db" data-file-name="components/video/NoVideoSelected.tsx">
        Lihat Daftar Video
      </span></Button>
    </div>;
}