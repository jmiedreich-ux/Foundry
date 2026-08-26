export const controlCatalogs = ['core', 'specialized', 'custom'] as const;
export type ControlCatalog = (typeof controlCatalogs)[number];

export interface ControlRegistryEntry {
  name: string;
  catalog: ControlCatalog;
  states: readonly string[];
}

export function defineControl(entry: ControlRegistryEntry): ControlRegistryEntry {
  if (!entry.name.trim()) throw new Error('Foundry controls require a stable name.');
  return entry;
}

export interface ExampleState {
  id: string;
  title: string;
  observableBehavior: string;
}
