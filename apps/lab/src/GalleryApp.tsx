import * as React from 'react';
import { SkinProvider, LocaleProvider } from '@foundry/react';

export function GalleryApp() {
  return (
    <SkinProvider>
      <LocaleProvider>
        <main aria-label="Gallery application" />
      </LocaleProvider>
    </SkinProvider>
  );
}