import { createContext, useContext, type PropsWithChildren } from 'react';
import { defaultSkinName, type FoundrySkinName } from '@foundry/tokens';
import '@foundry/tokens/skins/default.css';
import { englishLabelCatalog, type LabelCatalog } from './labels.js';
import type { ControlSize } from './control-base.js';

export interface SkinContextValue { name: FoundrySkinName; }
export interface LocaleContextValue { locale: string; labels: LabelCatalog; }
export interface GroupContextValue { disabled?: boolean; size?: ControlSize; }

const SkinContext = createContext<SkinContextValue>({ name: defaultSkinName });
const LocaleContext = createContext<LocaleContextValue>({ locale: 'en', labels: englishLabelCatalog });
const GroupContext = createContext<GroupContextValue>({});

export function SkinProvider({ skin = defaultSkinName, children }: PropsWithChildren<{ skin?: FoundrySkinName }>) {
  return <SkinContext.Provider value={{ name: skin }}><div data-foundry-skin={skin}>{children}</div></SkinContext.Provider>;
}

export function LocaleProvider({ locale = 'en', labels = englishLabelCatalog, children }: PropsWithChildren<Partial<LocaleContextValue>>) {
  return <LocaleContext.Provider value={{ locale, labels }}>{children}</LocaleContext.Provider>;
}

export function GroupProvider({ value, children }: PropsWithChildren<{ value: GroupContextValue }>) {
  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}

export const useSkin = () => useContext(SkinContext);
export const useLocale = () => useContext(LocaleContext);
export const useGroup = () => useContext(GroupContext);
