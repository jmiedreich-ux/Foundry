import { readFileSync } from 'node:fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { LocaleProvider, SkinProvider, useLocale, useSkin } from './providers.js';

function Probe() {
  const skin = useSkin();
  const locale = useLocale();
  return <output>{`${skin.name}:${locale.locale}:${locale.labels.save.value}`}</output>;
}

describe('foundation providers and default skin', () => {
  it('loads the default skin selector and its shared focus token', () => {
    const css = readFileSync(new URL('../../../tokens/src/skins/default.css', import.meta.url), 'utf8');
    expect(css).toContain('[data-foundry-skin="default"]');
    expect(css).toContain('--foundry-focus-ring');
  });

  it('provides default skin and English labels to descendants', () => {
    const markup = renderToStaticMarkup(<SkinProvider><LocaleProvider><Probe /></LocaleProvider></SkinProvider>);
    expect(markup).toContain('data-foundry-skin="default"');
    expect(markup).toContain('default:en:Save');
  });
});
