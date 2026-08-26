import * as React from 'react';

export function GalleryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="gallery-layout">
      {children}
    </div>
  );
}
