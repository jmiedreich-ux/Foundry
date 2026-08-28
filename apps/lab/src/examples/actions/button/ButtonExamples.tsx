import * as React from 'react';
import { Button } from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function VariantDemonstration() {
  const [status, setStatus] = React.useState('none');

  return (
    <ExampleFrame
      title="Button Variants"
      description="Each of the four approved variants changes the status output when clicked."
    >
      <div>
        <Button category="open" variant="primary" onClick={() => setStatus('primary clicked')} />
        <Button category="edit" variant="secondary" onClick={() => setStatus('secondary clicked')} />
        <Button category="delete" variant="destructive" onClick={() => setStatus('destructive clicked')} />
        <Button category="back" variant="link" onClick={() => setStatus('link clicked')} />
      </div>
      <output role="status">Status: {status}</output>
    </ExampleFrame>
  );
}

function SaveStateDemonstration() {
  const [count, setCount] = React.useState(0);

  return (
    <ExampleFrame
      title="Save Button States"
      description="Only the enabled Save Button invokes its handler. Disabled and loading states increment nothing."
    >
      <div>
        <Button category="save" onClick={() => setCount((c) => c + 1)} />
        <Button category="save" disabled onClick={() => setCount((c) => c + 1)} />
        <Button category="save" loading onClick={() => setCount((c) => c + 1)} />
      </div>
      <output role="status">Save handler invoked: {count} time{count === 1 ? '' : 's'}</output>
    </ExampleFrame>
  );
}

function CustomLabelDemonstration() {
  const [status, setStatus] = React.useState('inactive');

  return (
    <ExampleFrame
      title="Custom Label"
      description="Only the add and back categories accept a supplied label. This add Button carries a long custom label."
    >
      <Button
        category="add"
        label="Add New Project Category"
        onClick={() => setStatus('activated: Add New Project Category')}
      />
      <output role="status">{status}</output>
    </ExampleFrame>
  );
}

export function ButtonExamples(): React.ReactNode {
  return (
    <>
      <VariantDemonstration />
      <SaveStateDemonstration />
      <CustomLabelDemonstration />
    </>
  );
}
