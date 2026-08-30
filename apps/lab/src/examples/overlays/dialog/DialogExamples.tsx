import * as React from 'react';
import {
  OverlayRoot,
  DialogRoot,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function UncontrolledDialogExample() {
  const [outcome, setOutcome] = React.useState('Dialog is closed');

  return (
    <ExampleFrame
      title="Uncontrolled Dialog"
      description="An uncontrolled Dialog that manages its own open state. Click the trigger to open, use the close button to dismiss. The status below reflects the current open state from onOpenChange."
    >
      <OverlayRoot>
        <DialogRoot
          onOpenChange={(next) => {
            setOutcome(next ? 'Dialog is open' : 'Dialog is closed');
          }}
        >
          <DialogTrigger>Open dialog</DialogTrigger>
          <DialogContent title="Confirmation">
            <p>
              This is an uncontrolled dialog. Opening and closing updates the
              callback outcome shown below.
            </p>
            <footer>
              <DialogClose />
            </footer>
          </DialogContent>
        </DialogRoot>
      </OverlayRoot>
      <output role="status">{outcome}</output>
    </ExampleFrame>
  );
}

function ControlledDialogExample() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [lastRequested, setLastRequested] = React.useState<boolean | null>(null);

  return (
    <ExampleFrame
      title="Controlled Dialog"
      description="A controlled Dialog whose open state is managed by the parent. Trigger requests open through onOpenChange. The status below names each requested state change."
    >
      <OverlayRoot>
        <DialogRoot
          open={isOpen}
          onOpenChange={(next) => {
            setIsOpen(next);
            setLastRequested(next);
          }}
        >
          <DialogTrigger>Open controlled dialog</DialogTrigger>
          <DialogContent title="Controlled dialog">
            <p>
              This dialog is controlled by parent React state. All state changes
              flow through the parent's onOpenChange callback.
            </p>
            <footer>
              <DialogClose />
            </footer>
          </DialogContent>
        </DialogRoot>
      </OverlayRoot>
      <output role="status">
        {lastRequested === null
          ? 'No state change yet'
          : `Last requested: ${lastRequested ? 'open' : 'closed'}`}
      </output>
    </ExampleFrame>
  );
}

export function DialogExamples(): React.ReactNode {
  return (
    <>
      <UncontrolledDialogExample />
      <ControlledDialogExample />
    </>
  );
}
