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
    <section className="example-frame" aria-labelledby={titleId} aria-describedby={descId}>
      <h3 id={titleId}>{title}</h3>
      <p className="example-frame__description" id={descId}>{description}</p>
      <div className="example-frame__content">
        {children}
      </div>
    </section>
  );
}
