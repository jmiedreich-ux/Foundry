import * as React from 'react';
import { LoadingSkeleton } from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function DefaultSkeletonExample() {
  return (
    <ExampleFrame
      title="Default Three-line Skeleton"
      description="Content is loading. This LoadingSkeleton uses the default of three lines. The component has no progress value or timer and conveys an indeterminate loading state."
    >
      <LoadingSkeleton label="Loading content" />
    </ExampleFrame>
  );
}

function ExtendedSkeletonExample() {
  return (
    <ExampleFrame
      title="Extended Six-line Skeleton"
      description="Content is loading. This LoadingSkeleton renders six skeleton lines and uses a long accessible label to demonstrate label handling. The component has no progress value or timer and conveys an indeterminate loading state."
    >
      <LoadingSkeleton
        label="Loading extended content: multiple sections are being fetched and will be displayed shortly"
        lines={6}
      />
    </ExampleFrame>
  );
}

export function LoadingSkeletonExamples(): React.ReactNode {
  return (
    <>
      <DefaultSkeletonExample />
      <ExtendedSkeletonExample />
    </>
  );
}
