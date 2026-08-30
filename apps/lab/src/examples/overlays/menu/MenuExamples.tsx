import * as React from 'react';
import {
  OverlayRoot,
  MenuRoot,
  MenuTrigger,
  MenuContent,
  MenuItem,
  MenuClose,
} from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function UncontrolledMenuExample() {
  const [openState, setOpenState] = React.useState('Menu is closed');
  const [selected, setSelected] = React.useState('');

  return (
    <ExampleFrame
      title="Uncontrolled Menu"
      description="An uncontrolled Menu with two enabled items, one disabled item, and an explicit close action. The status below reflects open/close callbacks and the selected command."
    >
      <OverlayRoot>
        <MenuRoot
          onOpenChange={(next) => {
            setOpenState(next ? 'Menu is open' : 'Menu is closed');
          }}
        >
          <MenuTrigger>Menu actions</MenuTrigger>
          <MenuContent>
            <MenuItem
              onSelect={() => {
                setSelected('Copy selected');
              }}
            >
              Copy
            </MenuItem>
            <MenuItem
              onSelect={() => {
                setSelected('Paste selected');
              }}
            >
              Paste
            </MenuItem>
            <MenuItem disabled>
              Delete
            </MenuItem>
            <MenuClose />
          </MenuContent>
        </MenuRoot>
      </OverlayRoot>
      <output role="status">
        {openState}
        {selected ? ` — ${selected}` : ''}
      </output>
    </ExampleFrame>
  );
}

function ControlledMenuExample() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [lastRequested, setLastRequested] = React.useState<boolean | null>(null);
  const [selected, setSelected] = React.useState('');

  return (
    <ExampleFrame
      title="Controlled Menu"
      description="A controlled Menu whose open state is managed by parent React state. The status below names each requested state change and the selected command."
    >
      <OverlayRoot>
        <MenuRoot
          open={isOpen}
          onOpenChange={(next) => {
            setIsOpen(next);
            setLastRequested(next);
          }}
        >
          <MenuTrigger>Controlled menu</MenuTrigger>
          <MenuContent>
            <MenuItem
              onSelect={() => {
                setSelected('Duplicate selected');
              }}
            >
              Duplicate
            </MenuItem>
            <MenuItem
              onSelect={() => {
                setSelected('Rename selected');
              }}
            >
              Rename
            </MenuItem>
            <MenuClose />
          </MenuContent>
        </MenuRoot>
      </OverlayRoot>
      <output role="status">
        {lastRequested === null
          ? 'No state change yet'
          : `Last requested: ${lastRequested ? 'open' : 'closed'}`}
        {selected ? ` — ${selected}` : ''}
      </output>
    </ExampleFrame>
  );
}

export function MenuExamples(): React.ReactNode {
  return (
    <>
      <UncontrolledMenuExample />
      <ControlledMenuExample />
    </>
  );
}
