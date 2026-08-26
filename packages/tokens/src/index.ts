export const defaultSkinName = 'default' as const;

export type FoundrySkinName = typeof defaultSkinName | (string & {});
