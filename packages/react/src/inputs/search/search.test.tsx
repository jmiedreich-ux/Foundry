import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Field, Group } from '../../foundation/field.js';
import { clearUncontrolledSearch, Search, type SearchProps } from './search.js';

describe('Search', () => {
  it('renders a native search input with Field-owned label, description, error, and required relationships', () => {
    const markup = renderToStaticMarkup(
      <Field label="Find a record" description="Search by name" error="Enter a search term." required>
        <Search name="query" defaultValue="Ada" data-example="record-search" />
      </Field>
    );

    const id = markup.match(/<input[^>]* id="([^"]+)"/)?.[1];
    expect(id).toBeTruthy();
    expect(markup).toContain(`for="${id}"`);
    expect(markup).toContain(`aria-labelledby="${id}-label"`);
    expect(markup).toContain(`aria-describedby="${id}-description ${id}-error"`);
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('aria-required="true"');
    expect(markup).toContain('required=""');
    expect(markup).toContain('type="search"');
    expect(markup).toContain('name="query"');
    expect(markup).toContain('value="Ada"');
    expect(markup).toContain('data-control="search"');
    expect(markup).toContain('data-search-clear="true"');
  });

  it('marks an initially empty uncontrolled value and does not render a redundant clear action', () => {
    const markup = renderToStaticMarkup(<Search name="empty-query" defaultValue="" />);

    expect(markup).toContain('data-empty=""');
    expect(markup).not.toContain('data-search-clear');
  });

  it('uses the supplied controlled value and accepts only one state mode at the type boundary', () => {
    const markup = renderToStaticMarkup(<Search value="Current query" onValueChange={() => {}} />);

    expect(markup).toContain('value="Current query"');
    expect(markup).not.toContain('data-empty');
    expectTypeOf<SearchProps>().not.toMatchTypeOf<{ value: string; defaultValue: string }>();
  });

  it('inherits disabled and size from Group while allowing an explicit disabled=false override', () => {
    const inheritedMarkup = renderToStaticMarkup(
      <Group disabled size="lg">
        <Field label="Find a record">
          <Search defaultValue="Ada" />
        </Field>
      </Group>
    );
    const overrideMarkup = renderToStaticMarkup(
      <Group disabled>
        <Field label="Find a record">
          <Search defaultValue="Ada" disabled={false} />
        </Field>
      </Group>
    );

    expect(inheritedMarkup).toMatch(/<input[^>]*disabled=""/);
    expect(inheritedMarkup).toContain('data-disabled=""');
    expect(inheritedMarkup).not.toContain('data-search-clear');
    expect(overrideMarkup).not.toMatch(/<input[^>]*disabled=""/);
    expect(overrideMarkup).not.toMatch(/<input[^>]*data-disabled=""/);
  });

  it('does not render a clear action for a read-only search', () => {
    const markup = renderToStaticMarkup(<Search defaultValue="Ada" readOnly />);

    expect(markup).toContain('readonly=""');
    expect(markup).not.toContain('data-search-clear');
  });

  it('clears the uncontrolled native value before notifying, then restores input focus', () => {
    const calls: string[] = [];
    const input = {
      value: 'Ada',
      focus: () => calls.push('focus')
    };

    clearUncontrolledSearch(
      input,
      (value) => calls.push(`value:${value}`),
      () => calls.push('clear')
    );

    expect(input.value).toBe('');
    expect(calls).toEqual(['value:', 'clear', 'focus']);
  });

  it('keeps component-owned role, styling, and data hooks from being overridden', () => {
    const markup = renderToStaticMarkup(
      <Search
        {...({
          defaultValue: 'Ada',
          type: 'text',
          role: 'searchbox',
          className: 'consumer-class',
          style: { color: 'red' },
          'data-control': 'not-search',
          'data-empty': 'not-empty',
          'data-search-clear': 'not-a-button-hook'
        } as unknown as SearchProps)}
      />
    );

    expect(markup).toMatch(/<input[^>]*type="search"/);
    expect(markup).toMatch(/<input[^>]*data-control="search"/);
    expect(markup).not.toContain('not-search');
    expect(markup).not.toContain('not-empty');
    expect(markup).not.toContain('not-a-button-hook');
    expect(markup).not.toContain('searchbox');
    expect(markup).not.toContain('consumer-class');
    expect(markup).not.toContain('color:red');
    expectTypeOf<SearchProps>().toMatchTypeOf<{
      role?: never;
      className?: never;
      style?: never;
    }>();
    expectTypeOf(Search).toMatchTypeOf<React.ForwardRefExoticComponent<SearchProps>>();
  });
});
