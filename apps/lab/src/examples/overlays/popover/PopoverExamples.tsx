import * as React from 'react';
import {
  OverlayRoot,
  PopoverRoot,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function UncontrolledPopoverExample() {
  const [outcome, setOutcome] = React.useState('Popover is closed');

  return (
    <ExampleFrame
      title="Uncontrolled Popover"
      description="An uncontrolled Popover that manages its own open state. Click the trigger to open, use the close button to dismiss. The status below reflects state transitions from onOpenChange."
    >
      <OverlayRoot>
        <PopoverRoot
          onOpenChange={(next) => {
            setOutcome(next ? 'Popover is open' : 'Popover is closed');
          }}
        >
          <PopoverTrigger>Open popover</PopoverTrigger>
          <PopoverContent title="Popover details">
            <p>
              This is an uncontrolled non-modal popover using native popover="auto". Opening
              and closing updates the callback outcome shown below.
            </p>
            <footer>
              <PopoverClose />
            </footer>
          </PopoverContent>
        </PopoverRoot>
      </OverlayRoot>
      <output role="status">{outcome}</output>
    </ExampleFrame>
  );
}

function ControlledPopoverExample() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [lastRequested, setLastRequested] = React.useState<boolean | null>(null);

  return (
    <ExampleFrame
      title="Controlled Popover"
      description="A controlled Popover whose open state is managed by parent React state. The status below names each requested state change."
    >
      <OverlayRoot>
        <PopoverRoot
          open={isOpen}
          onOpenChange={(next) => {
            setIsOpen(next);
            setLastRequested(next);
          }}
        >
          <PopoverTrigger>Open controlled popover</PopoverTrigger>
          <PopoverContent title="Controlled popover">
            <p>
              This popover is controlled by parent state. All state changes flow
              through the parent onOpenChange callback.
            </p>
            <footer>
              <PopoverClose />
            </footer>
          </PopoverContent>
        </PopoverRoot>
      </OverlayRoot>
      <output role="status">
        {lastRequested === null
          ? 'No state change yet'
          : `Last requested: ${lastRequested ? 'open' : 'closed'}`}
      </output>
    </ExampleFrame>
  );
}

export function PopoverExamples(): React.ReactNode {
  return (
    <>
      <UncontrolledPopoverExample />
      <ControlledPopoverExample />
    </>
  );
}
