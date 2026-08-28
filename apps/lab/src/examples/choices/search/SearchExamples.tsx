import * as React from 'react';
import { Search, Field } from '@foundry/react';
import { ExampleFrame } from '../../../ExampleFrame';

const categories = ['Actions', 'Alerts', 'Buttons', 'Cards', 'Choices', 'Dialogs', 'Feedback', 'Forms', 'Inputs', 'Layout'];

function ControlledSearchExample() {
  const [query, setQuery] = React.useState('');

  const filtered = categories.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <ExampleFrame
      title="Controlled Search"
      description="A controlled Search component filtering a fixed list. Clearing returns to the empty state. The status summary updates with every change."
    >
      <Field label="Filter categories">
        <Search value={query} onValueChange={setQuery} />
      </Field>
      <div>
        {query === '' ? (
          <p>No filter applied. {categories.length} categories available.</p>
        ) : filtered.length > 0 ? (
          <>
            <ul>
              {filtered.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </>
        ) : (
          <p>No results match "{query}".</p>
        )}
      </div>
      <output role="status" aria-atomic="true">
        {query === ''
          ? `Showing all ${categories.length} categories.`
          : filtered.length > 0
            ? `${filtered.length} of ${categories.length} match "${query}".`
            : `No results match "${query}".`}
      </output>
    </ExampleFrame>
  );
}

export function SearchExamples(): React.ReactNode {
  return <ControlledSearchExample />;
}
