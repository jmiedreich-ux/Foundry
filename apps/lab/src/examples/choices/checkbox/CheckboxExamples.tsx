import * as React from 'react';
import { Checkbox, Field, Group } from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function ControlledCheckboxExample() {
  const [checked, setChecked] = React.useState(false);

  return (
    <ExampleFrame
      title="Controlled Checkbox"
      description="A controlled Checkbox whose checked state is managed by React state. Toggling it updates the status output."
    >
      <Field label="Controlled option">
        <Checkbox checked={checked} onChange={(e) => setChecked(e.currentTarget.checked)} />
      </Field>
      <output role="status">Checked: {checked ? 'yes' : 'no'}</output>
    </ExampleFrame>
  );
}

function UncontrolledCheckboxExample() {
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
      title="Uncontrolled Checkbox with Reset"
      description="An uncontrolled Checkbox inside a native form. It begins checked. Pressing Reset restores the default checked state."
    >
      <form ref={formRef} method="dialog" action="#uncontrolled-checkbox">
        <Field label="Uncontrolled option (initially checked)">
          <Checkbox defaultChecked />
        </Field>
        <footer>
          <button type="reset">Reset form</button>
        </footer>
      </form>
      <output role="status">Reset count: {resetCount}</output>
    </ExampleFrame>
  );
}

function DisabledGroupCheckboxExample() {
  return (
    <ExampleFrame
      title="Disabled Group Checkbox"
      description="A Checkbox inside a disabled Group. It inherits the disabled state and cannot be toggled."
    >
      <Group disabled label="Disabled section">
        <Field label="Disabled option">
          <Checkbox defaultChecked />
        </Field>
      </Group>
    </ExampleFrame>
  );
}

export function CheckboxExamples(): React.ReactNode {
  return (
    <>
      <ControlledCheckboxExample />
      <UncontrolledCheckboxExample />
      <DisabledGroupCheckboxExample />
    </>
  );
}
