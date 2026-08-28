import * as React from 'react';
import { EmptyState, Button } from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

function EmptyStateRecoveryExample() {
  const [outcome, setOutcome] = React.useState('');

  return (
    <ExampleFrame
      title="Empty State Recovery"
      description="A stable EmptyState with detailed recovery guidance. Clicking the recovery action updates the visible outcome text without adding another empty state."
    >
      <EmptyState
        title="No Results Found"
        description="Your current filters have returned no matching results. To find what you are looking for, try broadening your search criteria, removing specific filter constraints, or checking for alternate spellings. You can also clear all applied filters to see the complete set of available items and begin narrowing from there."
        action={
          <Button
            category="add"
            label="Clear All Filters"
            onClick={() => {
              setOutcome('All filters cleared. Showing complete item list.');
            }}
          />
        }
      />
      {outcome ? <p>{outcome}</p> : null}
    </ExampleFrame>
  );
}

export function EmptyStateExamples(): React.ReactNode {
  return <EmptyStateRecoveryExample />;
}
