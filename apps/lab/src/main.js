import './styles.css';

const root = document.querySelector('#root');

root.innerHTML = `
  <header class="topbar">
    <a class="brand" href="#top" aria-label="Foundry control gallery home">Foundry</a>
    <div class="topbar__meta"><span class="status-dot"></span> Control gallery <span aria-hidden="true">·</span> Core v1</div>
    <button class="button button--secondary compact" id="motionToggle" aria-pressed="false">Reduce motion</button>
  </header>
  <main id="top" class="shell">
    <section class="intro" aria-labelledby="gallery-title">
      <div>
        <p class="section-label">Interactive reference</p>
        <h1 id="gallery-title">Controls that prove their behavior.</h1>
        <p class="lede">A standalone Foundry bench. Change values, open layers, trigger errors, and reset forms—the examples below are live.</p>
      </div>
      <div class="intro__facts" aria-label="Gallery coverage"><span>24 examples</span><span>Keyboard-aware</span><span>Standalone</span></div>
    </section>
    <nav class="section-nav" aria-label="Control families">
      <a href="#actions">Actions</a><a href="#forms">Inputs</a><a href="#overlays">Overlays</a><a href="#navigation">Navigation</a><a href="#feedback">Feedback</a>
    </nav>

    <section id="actions" class="family" aria-labelledby="actions-title">
      <div class="family__heading"><p class="section-label">01 / Actions</p><h2 id="actions-title">Make intent visible.</h2></div>
      <div class="showcase two-up">
        <article class="specimen"><div class="specimen__head"><h3>Button</h3><code>variant</code></div>
          <div class="button-row">
            <button class="button button--primary" id="saveButton">Save changes</button>
            <button class="button button--secondary" id="secondaryButton">Preview</button>
            <button class="button button--destructive" id="deleteButton">Remove</button>
            <button class="button button--link" id="linkButton">Learn more</button>
          </div>
          <p class="hint" id="buttonHint">Each variant has a real result; Save enters a temporary loading state.</p>
        </article>
        <article class="specimen"><div class="specimen__head"><h3>Disabled & loading</h3><code>state</code></div>
          <div class="button-row"><button class="button button--primary" disabled>Submit report</button><button class="button button--secondary" id="asyncButton">Run check</button></div>
          <p class="hint">Disabled controls do not trigger actions. Run check announces completion.</p>
        </article>
      </div>
    </section>

    <section id="forms" class="family" aria-labelledby="forms-title">
      <div class="family__heading"><p class="section-label">02 / Inputs</p><h2 id="forms-title">State is observable, not implied.</h2></div>
      <form id="controlForm" class="showcase form-grid" novalidate>
        <article class="specimen span-2"><div class="specimen__head"><h3>Field & validation</h3><code>required</code></div>
          <div class="field-row"><label class="field">Control name<input id="controlName" name="controlName" autocomplete="off" placeholder="e.g. Date range" aria-describedby="nameError" /></label>
          <label class="field">Family<select id="familySelect" name="family"><option value="Inputs">Inputs</option><option value="Actions">Actions</option><option value="Overlays">Overlays</option><option value="Feedback">Feedback</option></select></label></div>
          <p class="field-error" id="nameError" role="alert"></p>
          <div class="button-row"><button class="button button--primary" type="submit">Validate field</button><button class="button button--secondary" type="reset">Reset form</button></div>
        </article>
        <article class="specimen"><div class="specimen__head"><h3>Search</h3><code>filter</code></div>
          <label class="search"><span aria-hidden="true">⌕</span><input id="searchInput" type="search" placeholder="Filter controls" aria-label="Filter controls" /></label>
          <ul class="result-list" id="searchResults" aria-live="polite"></ul>
        </article>
        <article class="specimen"><div class="specimen__head"><h3>Choice controls</h3><code>selected</code></div>
          <label class="check"><input type="checkbox" id="stableCheckbox" checked /> Keep interactions stable</label>
          <fieldset class="radio-set"><legend>Density</legend><label><input type="radio" name="density" value="Comfortable" checked /> Comfortable</label><label><input type="radio" name="density" value="Compact" /> Compact</label></fieldset>
          <label class="switch"><input type="checkbox" id="notifications" role="switch" checked /><span class="switch__track" aria-hidden="true"></span><span>Enable notifications</span></label>
          <p class="hint" id="choiceOutput" aria-live="polite">Comfortable density · notifications enabled.</p>
        </article>
      </form>
    </section>

    <section id="overlays" class="family" aria-labelledby="overlays-title">
      <div class="family__heading"><p class="section-label">03 / Overlays</p><h2 id="overlays-title">Layers return you to where you started.</h2></div>
      <div class="showcase three-up">
        <article class="specimen"><div class="specimen__head"><h3>Dialog</h3><code>modal</code></div><button class="button button--primary" data-open="dialog">Open dialog</button><p class="hint">Escape closes it and restores focus.</p></article>
        <article class="specimen"><div class="specimen__head"><h3>Drawer</h3><code>side layer</code></div><button class="button button--secondary" data-open="drawer">Open drawer</button><p class="hint">A side layer for non-destructive context.</p></article>
        <article class="specimen"><div class="specimen__head"><h3>Menu & popover</h3><code>anchored</code></div><div class="button-row"><button class="button button--secondary" id="menuTrigger" aria-expanded="false">Actions</button><button class="button button--secondary" id="popoverTrigger" aria-expanded="false">Details</button></div><div class="anchored" id="menu" hidden role="menu"><button role="menuitem">Duplicate</button><button role="menuitem">Archive</button></div><div class="anchored popover" id="popover" hidden role="status">Popover content sits next to its trigger.</div></article>
      </div>
    </section>

    <section id="navigation" class="family" aria-labelledby="navigation-title">
      <div class="family__heading"><p class="section-label">04 / Navigation</p><h2 id="navigation-title">Change the view, keep the place.</h2></div>
      <article class="specimen tabs-specimen"><div class="tabs" role="tablist" aria-label="Gallery views"><button role="tab" aria-selected="true" aria-controls="panel-default" id="tab-default">Default</button><button role="tab" aria-selected="false" aria-controls="panel-empty" id="tab-empty" tabindex="-1">Empty</button><button role="tab" aria-selected="false" aria-controls="panel-loading" id="tab-loading" tabindex="-1">Loading</button></div>
        <div class="tab-panel" id="panel-default" role="tabpanel" aria-labelledby="tab-default">Default state keeps the control ready for the next action.</div>
        <div class="tab-panel" id="panel-empty" role="tabpanel" aria-labelledby="tab-empty" hidden><strong>No saved controls yet.</strong><br />Create one above to populate this state.</div>
        <div class="tab-panel" id="panel-loading" role="tabpanel" aria-labelledby="tab-loading" hidden><div class="skeleton skeleton--wide"></div><div class="skeleton skeleton--short"></div></div>
      </article>
    </section>

    <section id="feedback" class="family" aria-labelledby="feedback-title">
      <div class="family__heading"><p class="section-label">05 / Feedback</p><h2 id="feedback-title">Signal outcomes with a next step.</h2></div>
      <div class="showcase two-up"><article class="specimen" id="bannerSpecimen"><div class="banner"><div><strong>Draft mode is on.</strong><p>Changes stay local until you save them.</p></div><button class="icon-button" id="dismissBanner" aria-label="Dismiss banner">×</button></div><button class="button button--link" id="restoreBanner" hidden>Restore banner</button></article>
      <article class="specimen"><div class="specimen__head"><h3>Status & empty state</h3><code>feedback</code></div><div class="chip-row"><span class="chip chip--success">Ready</span><span class="chip chip--warning">Needs review</span><span class="chip">Draft</span></div><div class="empty"><strong>Nothing to review.</strong><p>When a list has no meaningful next item, say so plainly.</p></div></article></div>
    </section>
  </main>
  <div class="toast-region" aria-live="polite" aria-atomic="true"></div>
  <div class="scrim" id="scrim" hidden></div>
  <section class="dialog" id="dialog" role="dialog" aria-modal="true" aria-labelledby="dialogTitle" hidden><div class="dialog__head"><h2 id="dialogTitle">Save this gallery state?</h2><button class="icon-button" data-close aria-label="Close dialog">×</button></div><p>Your current control choices will be kept in this browser session.</p><div class="button-row"><button class="button button--primary" data-close>Save state</button><button class="button button--secondary" data-close>Cancel</button></div></section>
  <aside class="drawer" id="drawer" aria-labelledby="drawerTitle" hidden><div class="dialog__head"><h2 id="drawerTitle">Control details</h2><button class="icon-button" data-close aria-label="Close drawer">×</button></div><p>Drawers preserve surrounding context while providing a focused secondary task.</p><button class="button button--secondary" data-close>Close drawer</button></aside>
`;

const toastRegion = document.querySelector('.toast-region');
const showToast = (message) => {
  const toast = document.createElement('div');
  toast.className = 'toast'; toast.textContent = message; toastRegion.append(toast);
  window.setTimeout(() => toast.remove(), 3600);
};

function loadingButton(button, message) {
  const original = button.textContent; button.disabled = true; button.textContent = 'Working…';
  window.setTimeout(() => { button.disabled = false; button.textContent = original; showToast(message); }, 900);
}
document.querySelector('#saveButton').addEventListener('click', (event) => loadingButton(event.currentTarget, 'Changes saved.'));
document.querySelector('#asyncButton').addEventListener('click', (event) => loadingButton(event.currentTarget, 'Check complete: no issues found.'));
document.querySelector('#secondaryButton').addEventListener('click', () => showToast('Preview opened in the gallery.'));
document.querySelector('#deleteButton').addEventListener('click', () => showToast('Remove is intentionally a reversible gallery action.'));
document.querySelector('#linkButton').addEventListener('click', () => document.querySelector('#forms').scrollIntoView({ behavior: 'smooth' }));

const form = document.querySelector('#controlForm'); const nameInput = document.querySelector('#controlName'); const error = document.querySelector('#nameError');
form.addEventListener('submit', (event) => { event.preventDefault(); const valid = nameInput.value.trim().length > 1; nameInput.setAttribute('aria-invalid', String(!valid)); nameInput.classList.toggle('is-invalid', !valid); error.textContent = valid ? '' : 'Enter a control name with at least two characters.'; if (!valid) { nameInput.focus(); return; } showToast(`${nameInput.value.trim()} is valid in ${document.querySelector('#familySelect').value}.`); });
form.addEventListener('reset', () => window.setTimeout(() => { nameInput.removeAttribute('aria-invalid'); nameInput.classList.remove('is-invalid'); error.textContent = ''; updateChoice(); }, 0));

const controls = ['Button', 'TextField', 'Select', 'Checkbox', 'RadioGroup', 'Switch', 'Search', 'Dialog', 'Drawer', 'Popover', 'Menu', 'Tabs', 'Banner', 'Toast', 'LoadingSkeleton'];
const results = document.querySelector('#searchResults');
function renderResults(query = '') { const visible = controls.filter((item) => item.toLowerCase().includes(query.toLowerCase())); results.innerHTML = visible.length ? visible.map((item) => `<li>${item}</li>`).join('') : '<li>No controls match that filter.</li>'; }
document.querySelector('#searchInput').addEventListener('input', (event) => renderResults(event.target.value)); renderResults();
function updateChoice() { const density = document.querySelector('input[name="density"]:checked').value; const notices = document.querySelector('#notifications').checked ? 'enabled' : 'disabled'; document.querySelector('#choiceOutput').textContent = `${density} density · notifications ${notices}.`; }
document.querySelectorAll('input[name="density"], #notifications, #stableCheckbox').forEach((input) => input.addEventListener('change', updateChoice));

let lastTrigger = null; const scrim = document.querySelector('#scrim');
function openLayer(id, trigger) { lastTrigger = trigger; document.querySelector(`#${id}`).hidden = false; scrim.hidden = false; document.querySelector(`#${id} button`).focus(); }
function closeLayers() { document.querySelectorAll('.dialog, .drawer').forEach((layer) => layer.hidden = true); scrim.hidden = true; lastTrigger?.focus(); }
document.querySelectorAll('[data-open]').forEach((button) => button.addEventListener('click', () => openLayer(button.dataset.open, button)));
document.querySelectorAll('[data-close]').forEach((button) => button.addEventListener('click', closeLayers)); scrim.addEventListener('click', closeLayers);
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeLayers(); closeAnchored(); } });
function closeAnchored() { ['menu', 'popover'].forEach((id) => document.querySelector(`#${id}`).hidden = true); document.querySelector('#menuTrigger').setAttribute('aria-expanded', 'false'); document.querySelector('#popoverTrigger').setAttribute('aria-expanded', 'false'); }
document.querySelector('#menuTrigger').addEventListener('click', (event) => { const menu = document.querySelector('#menu'); const open = menu.hidden; closeAnchored(); menu.hidden = !open; event.currentTarget.setAttribute('aria-expanded', String(open)); });
document.querySelector('#popoverTrigger').addEventListener('click', (event) => { const popover = document.querySelector('#popover'); const open = popover.hidden; closeAnchored(); popover.hidden = !open; event.currentTarget.setAttribute('aria-expanded', String(open)); });
document.addEventListener('click', (event) => { if (!event.target.closest('.anchored, #menuTrigger, #popoverTrigger')) closeAnchored(); });

const tabs = [...document.querySelectorAll('[role="tab"]')];
function selectTab(tab) { tabs.forEach((item) => { const active = item === tab; item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1; document.querySelector(`#${item.getAttribute('aria-controls')}`).hidden = !active; }); }
tabs.forEach((tab, index) => { tab.addEventListener('click', () => selectTab(tab)); tab.addEventListener('keydown', (event) => { if (!['ArrowRight', 'ArrowLeft'].includes(event.key)) return; event.preventDefault(); const next = tabs[(index + (event.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; next.focus(); selectTab(next); }); });

document.querySelector('#dismissBanner').addEventListener('click', () => { document.querySelector('.banner').hidden = true; document.querySelector('#restoreBanner').hidden = false; });
document.querySelector('#restoreBanner').addEventListener('click', () => { document.querySelector('.banner').hidden = false; document.querySelector('#restoreBanner').hidden = true; });
document.querySelector('#motionToggle').addEventListener('click', (event) => { const reduced = document.body.classList.toggle('reduce-motion'); event.currentTarget.setAttribute('aria-pressed', String(reduced)); event.currentTarget.textContent = reduced ? 'Motion reduced' : 'Reduce motion'; });
