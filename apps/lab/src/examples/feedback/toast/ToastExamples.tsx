import * as React from 'react';
import { Toast, Button } from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function ControlledToastExample() {
  const [isOpen, setIsOpen] = React.useState(true);
  const [status, setStatus] = React.useState('Toast is open');

  const handleRestore = React.useCallback(() => {
    setIsOpen(true);
    setStatus('Toast was restored');
  }, []);

  return (
    <ExampleFrame
      title="Controlled Toast"
      description="A Toast whose visibility is driven by React state. It starts open with a success tone. Dismissing uses the Toast's built-in dismiss. When closed, a separate public Button restores the same Toast instance without creating another one. This demonstration verifies that controlled open state, dismiss callback, restore action, and outcome reporting all work together."
    >
      <Toast
        open={isOpen}
        onOpenChange={(next) => {
          setIsOpen(next);
          if (!next) {
            setStatus('Toast was dismissed');
          }
        }}
        title="Operation Complete"
        description="Your changes have been saved successfully."
        tone="success"
      />
      {!isOpen ? (
        <div>
          <Button
            category="add"
            label="Restore Toast"
            onClick={handleRestore}
          />
        </div>
      ) : null}
      <output role="status">{status}</output>
    </ExampleFrame>
  );
}

export function ToastExamples(): React.ReactNode {
  return (
    <>
      <ControlledToastExample />
    </>
  );
}
