'use client';

import { Button } from '../ui/button';
import { Play } from 'lucide-react';

export function NoVideoSelected() {
  return (
    <div className="text-center py-16">
      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <Play className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-lg">
        Silakan pilih video dari daftar untuk memutarnya di sini.
      </p>
      <Button 
        onClick={() => {
          // Find and click the list tab trigger
          const listTab = document.querySelector('[data-value="list"]');
          if (listTab instanceof HTMLElement) {
            listTab.click();
          }
        }}
        className="mt-4"
      >
        Lihat Daftar Video
      </Button>
    </div>
  );
}
