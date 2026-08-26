import * as React from 'react';
import { SkinProvider, LocaleProvider } from '@foundry/react';

export function GalleryApp() {
  return (
    <SkinProvider>
      <LocaleProvider>
        <main aria-label="Gallery application">
          <h1>Control Gallery</h1>
          <p>Interactive demonstration of the Foundry control library.</p>

          <section id="family-actions">
            <h2>Actions</h2>
          </section>

          <section id="family-inputs">
            <h2>Inputs</h2>
          </section>

          <section id="family-overlays">
            <h2>Overlays</h2>
          </section>

          <section id="family-navigation">
            <h2>Navigation</h2>
          </section>

          <section id="family-feedback">
            <h2>Feedback</h2>
          </section>
        </main>
      </LocaleProvider>
    </SkinProvider>
  );
}