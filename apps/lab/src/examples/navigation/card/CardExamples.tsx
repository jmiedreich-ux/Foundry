import * as React from 'react';
import { Card, type CardProps } from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function CompleteCardExample() {
  return (
    <ExampleFrame
      title="Card with title, description, and content"
      description="A complete Card displaying a visible title, description, and ordinary inert child content. Card is a static semantic container and has no owned interaction, state, or action."
    >
      <Card
        title="Project Summary"
        description="Overview of the current milestone and its acceptance criteria."
      >
        <p>This content is part of the Card body and is not interactive. It remains present as static, readable content within the labelled article.</p>
        <p>Card provides a labelled semantic boundary for grouped content. It does not own click, keyboard, focus, or live-region behavior.</p>
      </Card>
    </ExampleFrame>
  );
}

function MinimalCardExample() {
  return (
    <ExampleFrame
      title="Minimal Card"
      description="A valid minimal Card with a non-empty title, no description, and no children. The explicit small size demonstrates the card size contract."
    >
      <Card title="Standalone note" size="sm" />
    </ExampleFrame>
  );
}

export function CardExamples(): React.ReactNode {
  return (
    <>
      <CompleteCardExample />
      <MinimalCardExample />
    </>
  );
}
