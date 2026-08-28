import * as React from 'react';
import { SkinProvider, LocaleProvider } from '@foundry/react';
import { ExampleFrame } from './ExampleFrame';
import { FamilyNavigation } from './FamilyNavigation';
import { GalleryLayout } from './GalleryLayout';
import { MotionSetting } from './MotionSetting';
import { ButtonExamples } from './examples/actions/button/ButtonExamples';
import { CheckboxExamples } from './examples/choices/checkbox/CheckboxExamples';
import { RadioGroupExamples } from './examples/choices/radio-group/RadioGroupExamples';
import { SearchExamples } from './examples/choices/search/SearchExamples';
import { SwitchExamples } from './examples/choices/switch/SwitchExamples';
import { BannerExamples } from './examples/feedback/banner/BannerExamples';
import { EmptyStateExamples } from './examples/feedback/empty-state/EmptyStateExamples';
import { LoadingSkeletonExamples } from './examples/feedback/loading-skeleton/LoadingSkeletonExamples';
import { StatusChipExamples } from './examples/feedback/status-chip/StatusChipExamples';
import { ToastExamples } from './examples/feedback/toast/ToastExamples';
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
                {family.id === 'family-actions' ? (
                  <ButtonExamples />
                ) : family.id === 'family-inputs' ? (
                  <>
                    <FieldExamples />
                    <CheckboxExamples />
                    <SwitchExamples />
                    <RadioGroupExamples />
                    <SearchExamples />
                  </>
                ) : family.id === 'family-feedback' ? (
                  <>
                    <StatusChipExamples />
                    <BannerExamples />
                    <ToastExamples />
                    <EmptyStateExamples />
                    <LoadingSkeletonExamples />
                  </>
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
