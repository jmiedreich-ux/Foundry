export const labelCategories = [
  'cancel', 'save', 'delete', 'add', 'back', 'retry', 'dismiss',
  'reorder', 'edit', 'open', 'done', 'duplicate', 'rename'
] as const;

export type LabelCategory = (typeof labelCategories)[number];

export interface LabelDefinition {
  value: string;
  allowOverride: boolean;
}

export type LabelCatalog = Record<LabelCategory, LabelDefinition>;

export const englishLabelCatalog: LabelCatalog = {
  cancel: { value: 'Cancel', allowOverride: false },
  save: { value: 'Save', allowOverride: false },
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

export function resolveLabel(category: LabelCategory, override?: string, catalog: LabelCatalog = englishLabelCatalog): string {
  const definition = catalog[category];
  return override && definition.allowOverride ? override : definition.value;
}
