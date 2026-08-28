import * as React from 'react';
import { Switch, Field, Group } from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function ControlledSwitchExample() {
  const [checked, setChecked] = React.useState(false);

  return (
    <ExampleFrame
      title="Controlled Switch"
      description="A controlled Switch whose checked state is managed by React state. Toggling it updates the status output."
    >
      <Field label="Controlled switch">
        <Switch checked={checked} onChange={(e) => setChecked(e.currentTarget.checked)} />
      </Field>
      <output role="status">State: {checked ? 'on' : 'off'}</output>
    </ExampleFrame>
  );
}

function UncontrolledSwitchExample() {
  const [resetCount, setResetCount] = React.useState(0);

  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    const handleReset = () => {
      setResetCount((c) => c + 1);
    };

    form.addEventListener('reset', handleReset);
    return () => form.removeEventListener('reset', handleReset);
  }, []);

  return (
    <ExampleFrame
      title="Uncontrolled Switch with Reset"
      description="An uncontrolled Switch inside a native form. It begins on. Pressing Reset restores the default on state."
    >
      <form ref={formRef} method="dialog" action="#uncontrolled-switch">
        <Field label="Uncontrolled switch (initially on)">
          <Switch defaultChecked />
        </Field>
        <footer>
          <button type="reset">Reset form</button>
        </footer>
      </form>
      <output role="status">Reset count: {resetCount}</output>
    </ExampleFrame>
  );
}

function DisabledGroupSwitchExample() {
  return (
    <ExampleFrame
      title="Disabled Group Switch"
      description="A Switch inside a disabled Group. It inherits the disabled state and cannot be toggled."
    >
      <Group disabled label="Disabled section">
        <Field label="Disabled switch">
          <Switch defaultChecked />
        </Field>
      </Group>
    </ExampleFrame>
  );
}

export function SwitchExamples(): React.ReactNode {
  return (
    <>
      <ControlledSwitchExample />
      <UncontrolledSwitchExample />
      <DisabledGroupSwitchExample />
    </>
  );
}
