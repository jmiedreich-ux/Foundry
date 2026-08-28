import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Group, LocaleProvider } from '../../foundation/index.js';
import { Button, buttonVariants, type ButtonProps } from './button.js';

describe('Button', () => {
  it('renders each approved variant with its category label and a native button type', () => {
    for (const variant of buttonVariants) {
      const markup = renderToStaticMarkup(<Button category="save" variant={variant} />);

      expect(markup).toContain(`data-variant="${variant}"`);
      expect(markup).toContain('type="button"');
      expect(markup).toContain('>Save</button>');
    }
  });

  it('uses localized category labels and refuses a label override for a locked category', () => {
    const labels = {
      cancel: { value: 'Cancel', allowOverride: false },
      save: { value: 'Store', allowOverride: false },
      delete: { value: 'Delete', allowOverride: false },
      add: { value: 'Add', allowOverride: true },
      back: { value: 'Back', allowOverride: true },
      retry: { value: 'Retry', allowOverride: false },
      dismiss: { value: 'Dismiss', allowOverride: false },
      reorder: { value: 'Reorder', allowOverride: false },
      edit: { value: 'Edit', allowOverride: false },
      open: { value: 'Open', allowOverride: false },
      done: { value: 'Done', allowOverride: false },
      duplicate: { value: 'Duplicate', allowOverride: false },
      rename: { value: 'Rename', allowOverride: false }
    };
    const markup = renderToStaticMarkup(
      <LocaleProvider labels={labels}>
        <Button category="save" label="Persist" />
        <Button category="add" label="Add participant" />
      </LocaleProvider>
    );

    expect(markup).toContain('>Store</button>');
    expect(markup).not.toContain('Persist');
    expect(markup).toContain('>Add participant</button>');
  });

  it('blocks disabled and loading actions with native and Control Base state', () => {
    const inheritedDisabled = renderToStaticMarkup(
      <Group disabled>
        <Button category="save" />
      </Group>
    );
    const loading = renderToStaticMarkup(<Button category="save" loading />);

    expect(inheritedDisabled).toMatch(/<button[^>]*disabled=""[^>]*data-disabled=""/);
    expect(loading).toMatch(/<button[^>]*disabled=""[^>]*aria-busy="true"/);
    expect(loading).toContain('data-loading=""');
    expect(loading).toContain('data-disabled=""');
  });

  it('forwards a native button ref and rejects consumer styling escapes at the type boundary', () => {
    expectTypeOf(Button).toMatchTypeOf<React.ForwardRefExoticComponent<ButtonProps>>();
    expectTypeOf<ButtonProps>().toMatchTypeOf<{ className?: never; style?: never }>();
  });
});
