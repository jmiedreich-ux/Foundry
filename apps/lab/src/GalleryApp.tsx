import * as React from 'react';
import { SkinProvider, LocaleProvider } from '@foundry/react';
import { ExampleFrame } from './ExampleFrame';
import { FamilyNavigation } from './FamilyNavigation';
import { GalleryLayout } from './GalleryLayout';
import { MotionSetting } from './MotionSetting';
import { FieldExamples } from './examples/fields/FieldExamples';

const families = [
  { id: 'family-actions', title: 'Actions', description: 'Action control examples will appear here.' },
  { id: 'family-inputs', title: 'Inputs', description: 'Input control examples will appear here.' },
  { id: 'family-overlays', title: 'Overlays', description: 'Overlay control examples will appear here.' },
  { id: 'family-navigation', title: 'Navigation', description: 'Navigation control examples will appear here.' },
  { id: 'family-feedback', title: 'Feedback', description: 'Feedback control examples will appear here.' },
] as const;

export function GalleryApp() {
  return (
    <SkinProvider>
      <LocaleProvider>
        <GalleryLayout>
          <header>
            <h1>Control Gallery</h1>
            <p>Interactive demonstration of the Foundry control library.</p>
            <MotionSetting />
          </header>
          <FamilyNavigation />
          <main aria-label="Gallery application">
            {families.map((family) => (
              <section key={family.id} id={family.id} aria-labelledby={`${family.id}-title`}>
                <h2 id={`${family.id}-title`}>{family.title}</h2>
                {family.id === 'family-inputs' ? (
                  <FieldExamples />
                ) : (
                  <ExampleFrame
                    title={`${family.title} examples`}
                    description={family.description}
                  />
                )}
              </section>
            ))}
          </main>
        </GalleryLayout>
      </LocaleProvider>
    </SkinProvider>
  );
}
