import * as React from 'react';

const families = [
  { label: 'Actions', href: '#family-actions' },
  { label: 'Inputs', href: '#family-inputs' },
  { label: 'Overlays', href: '#family-overlays' },
  { label: 'Navigation', href: '#family-navigation' },
  { label: 'Feedback', href: '#family-feedback' },
] as const;

export function FamilyNavigation() {
  return (
    <nav aria-label="Gallery control-family navigation">
      <ul>
        {families.map((item) => (
          <li key={item.href}>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
