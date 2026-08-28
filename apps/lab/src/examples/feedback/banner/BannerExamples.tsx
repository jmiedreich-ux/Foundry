import * as React from 'react';
import { Banner, Button } from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function ControlledBannerExample() {
  const [isOpen, setIsOpen] = React.useState(true);
  const [status, setStatus] = React.useState('Banner is open');

  const handleRestore = React.useCallback(() => {
    setIsOpen(true);
    setStatus('Banner was restored');
  }, []);

  return (
    <ExampleFrame
      title="Controlled Banner"
      description="A Banner whose visibility is driven by React state. It starts open with a warning tone. Dismissing uses the Banner's built-in dismiss. When closed, a separate public Button restores the same Banner instance without creating another one. This demonstration verifies that controlled open state, dismiss callback, restore action, and outcome reporting all work together."
    >
      <Banner
        open={isOpen}
        onOpenChange={(next) => {
          setIsOpen(next);
          if (!next) {
            setStatus('Banner was dismissed');
          }
        }}
        title="Warning"
        description="This Banner is controlled by external React state. Clicking Dismiss will close it. You can reopen it using the restore button below."
        tone="warning"
        action={
          <Button
            category="back"
            label="Recovery action"
            onClick={() => {
              setStatus('Recovery action invoked');
            }}
          />
        }
      />
      {!isOpen ? (
        <div>
          <Button
            category="add"
            label="Restore Banner"
            onClick={handleRestore}
          />
        </div>
      ) : null}
      <output role="status">{status}</output>
    </ExampleFrame>
  );
}

export function BannerExamples(): React.ReactNode {
  return (
    <>
      <ControlledBannerExample />
    </>
  );
}
