import { forwardRef, useId, type AriaAttributes, type ComponentPropsWithoutRef, type DOMAttributes, type ReactNode } from 'react';
import { resolveControlBase, type ControlSize } from '../../foundation/control-base.js';
import { useGroup } from '../../foundation/providers.js';

type RefusedAriaProps = { [attribute in `aria-${string}`]?: never };
type EventKeys = Exclude<keyof DOMAttributes<HTMLElement>, 'children' | 'dangerouslySetInnerHTML'>;
type RefusedEventProps = { [attribute in EventKeys]?: never };
type NativeArticleProps = Omit<
  ComponentPropsWithoutRef<'article'>,
  | keyof AriaAttributes
  | EventKeys
  | 'aria-describedby'
  | 'autoFocus'
  | 'className'
  | 'contentEditable'
  | 'hidden'
  | 'inert'
  | 'onBlur'
  | 'onClick'
  | 'onDoubleClick'
  | 'onFocus'
  | 'onKeyDown'
  | 'onKeyPress'
  | 'onKeyUp'
  | 'onMouseDown'
  | 'onMouseUp'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
  | 'role'
  | 'draggable'
  | 'popover'
  | 'style'
  | 'tabIndex'
>;

export interface CardProps extends NativeArticleProps, RefusedAriaProps, RefusedEventProps {
  title: string;
  description?: string | null;
  children?: ReactNode;
  size?: ControlSize;
  autoFocus?: never;
  className?: never;
  contentEditable?: never;
  'data-checked'?: never;
  disabled?: never;
  'data-disabled'?: never;
  'data-focus-visible'?: never;
  hidden?: never;
  inert?: never;
  invalid?: never;
  'data-invalid'?: never;
  loading?: never;
  'data-loading'?: never;
  'data-open'?: never;
  readOnly?: never;
  'data-readonly'?: never;
  role?: never;
  draggable?: never;
  popover?: never;
  'data-selected'?: never;
  style?: never;
  tabIndex?: never;
  'data-control'?: never;
  'data-size'?: never;
}

function safeArticleProps(props: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(props).filter(([name]) => (
    !name.startsWith('aria-')
    && !name.startsWith('on')
    && !['autoFocus', 'className', 'contentEditable', 'data-checked', 'data-control', 'data-disabled', 'data-focus-visible', 'data-invalid', 'data-loading', 'data-open', 'data-readonly', 'data-selected', 'data-size', 'disabled', 'draggable', 'hidden', 'inert', 'invalid', 'loading', 'popover', 'readOnly', 'role', 'style', 'tabIndex'].includes(name)
  )));
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { children, description, size, title, ...rest },
  ref
) {
  if (typeof title !== 'string' || title.trim().length === 0) throw new Error('Card requires a non-empty title.');

  const group = useGroup();
  const state = resolveControlBase({ size }, { disabled: false, size: group.size ?? 'md' });
  const titleId = `${useId().replaceAll(':', '')}-card-title`;
  const hasDescription = typeof description === 'string' && description.trim().length > 0;
  const descriptionId = hasDescription ? `${titleId}-description` : undefined;
  const safeProps = safeArticleProps(rest as Record<string, unknown>) as ComponentPropsWithoutRef<'article'>;

  return (
    <article
      {...safeProps}
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      data-control="card"
      data-size={state.size}
    >
      <h2 id={titleId}>{title}</h2>
      {hasDescription ? <p id={descriptionId}>{description}</p> : null}
      {children}
    </article>
  );
});
