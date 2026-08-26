import * as React from 'react';

interface ExampleFrameProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function ExampleFrame({ title, description, children }: ExampleFrameProps) {
  const titleId = React.useId();
  const descId = React.useId();

  return (
    <section aria-labelledby={titleId} aria-describedby={descId}>
      <h3 id={titleId}>{title}</h3>
      <p id={descId}>{description}</p>
      <div>
        {children}
      </div>
    </section>
  );
}
