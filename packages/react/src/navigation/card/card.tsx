import { forwardRef, useId, type AriaAttributes, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { resolveControlBase, type ControlSize } from '../../foundation/control-base.js';
import { useGroup } from '../../foundation/providers.js';

type RefusedAriaProps = { [attribute in `aria-${string}`]?: never };
type NativeArticleProps = Omit<
  ComponentPropsWithoutRef<'article'>,
  | keyof AriaAttributes
  | 'aria-describedby'
  | 'autoFocus'
  | 'className'
  | 'hidden'
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
  | 'style'
  | 'tabIndex'
>;

export interface CardProps extends NativeArticleProps, RefusedAriaProps {
  title: string;
  description?: string | null;
  children?: ReactNode;
  size?: ControlSize;
  autoFocus?: never;
  className?: never;
  disabled?: never;
  hidden?: never;
  invalid?: never;
  loading?: never;
  onClick?: never;
  onFocus?: never;
  onKeyDown?: never;
  onPointerDown?: never;
  readOnly?: never;
  role?: never;
  style?: never;
  tabIndex?: never;
  'data-control'?: never;
  'data-size'?: never;
}

function safeArticleProps(props: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(props).filter(([name]) => (
    !name.startsWith('aria-')
    && !name.startsWith('on')
    && !['autoFocus', 'className', 'data-control', 'data-size', 'disabled', 'hidden', 'invalid', 'loading', 'readOnly', 'role', 'style', 'tabIndex'].includes(name)
  )));
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { children, description, size, title, ...rest },
  ref
) {
  if (typeof title !== 'string' || title.length === 0) throw new Error('Card requires a non-empty title.');

  const group = useGroup();
  const state = resolveControlBase({ size }, { disabled: false, size: group.size ?? 'md' });
  const titleId = `${useId().replaceAll(':', '')}-card-title`;
  const hasDescription = typeof description === 'string' && description.length > 0;
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
