import * as React from 'react';
import { StatusChip } from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function AllTonesExample() {
  return (
    <ExampleFrame
      title="StatusChip Tones"
      description="Each tone conveys a distinct status. All four tones are shown with adjacent chips. Labels convey outcome text beyond color alone."
    >
      <div>
        <StatusChip label="Draft not yet submitted" tone="neutral" />
        <StatusChip label="Changes saved successfully" tone="success" />
        <StatusChip label="Review overdue by 3 days" tone="warning" />
        <StatusChip label="Deployment failed: connection timeout" tone="danger" />
      </div>
    </ExampleFrame>
  );
}

function OverflowExample() {
  return (
    <ExampleFrame
      title="Long Label Overflow"
      description="A single StatusChip with a deliberately long label demonstrates text overflow behavior within its container."
    >
      <div>
        <StatusChip
          label="Deployment pipeline stage seven of twelve encountered an unrecoverable resource contention error requiring manual intervention"
          tone="danger"
        />
      </div>
    </ExampleFrame>
  );
}

export function StatusChipExamples(): React.ReactNode {
  return (
    <>
      <AllTonesExample />
      <OverflowExample />
    </>
  );
}
