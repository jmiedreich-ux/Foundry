import * as React from 'react';
import { Field, Group, TextField, Select } from '@foundry/react';
import { ExampleFrame } from '../../ExampleFrame';

function ControlledTextFieldExample() {
  const [value, setValue] = React.useState('');

  return (
    <ExampleFrame
      title="Controlled TextField"
      description="A controlled TextField with an observable current-value output."
    >
      <Field label="Controlled input">
        <TextField
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </Field>
      <output>Current value: {value || '(empty)'}</output>
    </ExampleFrame>
  );
}

function UncontrolledFormExample() {
  return (
    <ExampleFrame
      title="Uncontrolled Form with Reset"
      description="Native form with documented initial values. Default text is 'hello'. Default selection is 'alpha'. Reset restores those initial values."
    >
      <form method="dialog" action="#reset-example">
        <Field label="Text field (initial: hello)">
          <TextField defaultValue="hello" />
        </Field>

        <Field label="Select (initial: alpha)">
          <Select defaultValue="alpha">
            <option value="alpha">Alpha</option>
            <option value="beta">Beta</option>
            <option value="gamma">Gamma</option>
          </Select>
        </Field>

        <footer>
          <button type="reset">Reset to initial values</button>
        </footer>
      </form>
    </ExampleFrame>
  );
}

function RequiredFieldExample() {
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState<string | undefined>();
  const [success, setSuccess] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setSuccess('');
    if (value.trim() === '') {
      setError('This field is required.');
      return;
    }
    setError(undefined);
    setSuccess(`Submitted: ${value}`);
  };

  return (
    <ExampleFrame
      title="Required Controlled Field"
      description="Submitting blank sets an error. Editing after error preserves the value. Valid submission clears the error and shows success."
    >
      <form noValidate onSubmit={handleSubmit}>
        <Field
          label="Required field"
          required
          error={submitted ? error : undefined}
        >
          <TextField
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
            required
          />
        </Field>

        <footer>
          <button type="submit">Submit</button>
        </footer>
      </form>

      {success ? <p role="status">{success}</p> : null}
    </ExampleFrame>
  );
}

function DisabledGroupExample() {
  return (
    <ExampleFrame
      title="Disabled Group"
      description="A disabled Group whose field control is also disabled."
    >
      <Group disabled label="Disabled section">
        <Field label="Disabled field">
          <TextField defaultValue="read-only context" />
        </Field>
      </Group>
    </ExampleFrame>
  );
}

function LongLabelExample() {
  const [value, setValue] = React.useState('');

  return (
    <ExampleFrame
      title="Long Field Label"
      description="A long field label that remains programmatically connected to its control via Field-generated labeling."
    >
      <Field label="This is an exceptionally long field label that demonstrates how the control remains programmatically connected despite label length">
        <TextField
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
        />
      </Field>
      <output>Value: {value || '(empty)'}</output>
    </ExampleFrame>
  );
}

export function FieldExamples(): React.ReactNode {
  return (
    <>
      <ControlledTextFieldExample />
      <UncontrolledFormExample />
      <RequiredFieldExample />
      <DisabledGroupExample />
      <LongLabelExample />
    </>
  );
}
