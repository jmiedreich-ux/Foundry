import * as React from 'react';
import { RadioGroup, Field, Group } from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

const planOptions = [
  { value: 'basic', label: 'Basic' },
  { value: 'pro', label: 'Pro' },
  { value: 'enterprise', label: 'Enterprise' }
] as const;

function ControlledRadioGroupExample() {
  const [selected, setSelected] = React.useState('basic');

  return (
    <ExampleFrame
      title="Controlled RadioGroup"
      description="A controlled RadioGroup whose selection is managed by React state. Choosing an option updates the status output."
    >
      <Field label="Plan selection">
        <RadioGroup
          name="plan-controlled"
          options={planOptions}
          value={selected}
          onValueChange={setSelected}
        />
      </Field>
      <output role="status">Selected: {selected}</output>
    </ExampleFrame>
  );
}

function UncontrolledRadioGroupExample() {
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
      title="Uncontrolled RadioGroup with Reset"
      description="An uncontrolled required RadioGroup inside a native form. It starts with Pro selected. Pressing Reset restores the Pro default and updates the status output."
    >
      <form ref={formRef} method="dialog" action="#uncontrolled-radio">
        <Field label="Plan selection (initially Pro)">
          <RadioGroup
            name="plan-uncontrolled"
            options={planOptions}
            defaultValue="pro"
            required
          />
        </Field>
        <footer>
          <button type="reset">Reset form</button>
        </footer>
      </form>
      <output role="status">Reset count: {resetCount}</output>
    </ExampleFrame>
  );
}

function DisabledGroupRadioGroupExample() {
  return (
    <ExampleFrame
      title="Disabled Group RadioGroup"
      description="A non-required RadioGroup inside a disabled Group. It inherits the disabled state and its options cannot change."
    >
      <Group disabled label="Disabled section">
        <Field label="Plan selection (disabled)">
          <RadioGroup
            name="plan-disabled"
            options={planOptions}
            defaultValue="basic"
          />
        </Field>
      </Group>
    </ExampleFrame>
  );
}

export function RadioGroupExamples(): React.ReactNode {
  return (
    <>
      <ControlledRadioGroupExample />
      <UncontrolledRadioGroupExample />
      <DisabledGroupRadioGroupExample />
    </>
  );
}
