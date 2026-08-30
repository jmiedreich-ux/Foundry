import * as React from 'react';
import {
  OverlayRoot,
  DrawerRoot,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
} from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function UncontrolledDrawerExample() {
  const [outcome, setOutcome] = React.useState('Drawer is closed');

  return (
    <ExampleFrame
      title="Uncontrolled Drawer"
      description="An uncontrolled Drawer that manages its own open state. Click the trigger to open it, click close to dismiss. The status below reflects the current state via onOpenChange."
    >
      <OverlayRoot>
        <DrawerRoot
          side="end"
          onOpenChange={(next) => {
            setOutcome(next ? 'Drawer is open' : 'Drawer is closed');
          }}
        >
          <DrawerTrigger>Open drawer</DrawerTrigger>
          <DrawerContent title="Drawer content">
            <p>
              This is an uncontrolled drawer using side="end". The dialog close
              button or Escape will dismiss it and update the status below.
            </p>
            <footer>
              <DrawerClose />
            </footer>
          </DrawerContent>
        </DrawerRoot>
      </OverlayRoot>
      <output role="status">{outcome}</output>
    </ExampleFrame>
  );
}

function ControlledDrawerExample() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [lastRequested, setLastRequested] = React.useState<boolean | null>(null);

  return (
    <ExampleFrame
      title="Controlled Drawer"
      description="A controlled Drawer whose open state is managed by parent React state. The status below names each requested state change."
    >
      <OverlayRoot>
        <DrawerRoot
          side="start"
          open={isOpen}
          onOpenChange={(next) => {
            setIsOpen(next);
            setLastRequested(next);
          }}
        >
          <DrawerTrigger>Open controlled drawer</DrawerTrigger>
          <DrawerContent title="Controlled drawer">
            <p>
              This drawer is controlled by parent state. All state changes flow
              through the parent onOpenChange callback.
            </p>
            <footer>
              <DrawerClose />
            </footer>
          </DrawerContent>
        </DrawerRoot>
      </OverlayRoot>
      <output role="status">
        {lastRequested === null
          ? 'No state change yet'
          : `Last requested: ${lastRequested ? 'open' : 'closed'}`}
      </output>
    </ExampleFrame>
  );
}

export function DrawerExamples(): React.ReactNode {
  return (
    <>
      <UncontrolledDrawerExample />
      <ControlledDrawerExample />
    </>
  );
}
