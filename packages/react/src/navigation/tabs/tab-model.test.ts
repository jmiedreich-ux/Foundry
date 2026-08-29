import { describe, expect, it } from 'vitest';
import { validateTabsComposition, moveTabSelection } from './tab-model.js';

const triggers = [{ value: 'a' }, { value: 'b', disabled: true }, { value: 'c' }] as const;
const panels = ['a', 'b', 'c'] as const;

describe('validateTabsComposition', () => {
	it('returns original sequence for valid composition', () => {
		expect(validateTabsComposition(triggers, panels, 'a')).toBe(triggers);
	});

	it('throws for empty triggers or panels', () => {
		expect(() => validateTabsComposition([], ['a'], '')).toThrow();
		expect(() => validateTabsComposition([{ value: 'a' }], [], '')).toThrow();
	});

	it('throws for duplicate trigger values', () => {
		expect(() => validateTabsComposition([{ value: 'a' }, { value: 'a' }], ['a', 'b'], 'a')).toThrow();
	});

	it('throws for duplicate panel values', () => {
		expect(() => validateTabsComposition([{ value: 'a' }, { value: 'b' }], ['a', 'a'], 'a')).toThrow();
	});

	it('throws for trigger without matching panel', () => {
		expect(() => validateTabsComposition([{ value: 'x' }], ['y'], 'x')).toThrow();
	});

	it('throws for panel without matching trigger', () => {
		expect(() => validateTabsComposition([{ value: 'x' }], ['y'], 'x')).toThrow();
	});

	it('throws when all triggers are disabled', () => {
		expect(() => validateTabsComposition([{ value: 'a', disabled: true }], ['a'], 'a')).toThrow();
	});

	it('throws for unknown or disabled selected value', () => {
		expect(() => validateTabsComposition([{ value: 'a' }], ['a'], 'z')).toThrow();
		expect(() => validateTabsComposition(triggers, panels, 'b')).toThrow();
	});
});

describe('moveTabSelection', () => {
	it('ArrowRight wraps among enabled', () => {
		expect(moveTabSelection(triggers, 'a', 'ArrowRight')).toBe('c');
		expect(moveTabSelection(triggers, 'c', 'ArrowRight')).toBe('a');
	});

	it('ArrowLeft wraps among enabled', () => {
		expect(moveTabSelection(triggers, 'c', 'ArrowLeft')).toBe('a');
		expect(moveTabSelection(triggers, 'a', 'ArrowLeft')).toBe('c');
	});

	it('Home and End target first and last enabled', () => {
		expect(moveTabSelection(triggers, 'c', 'Home')).toBe('a');
		expect(moveTabSelection(triggers, 'a', 'End')).toBe('c');
	});

	it('does not mutate inputs', () => {
		const t = [{ value: 'a' }, { value: 'b', disabled: true }, { value: 'c' }];
		const snapshot = JSON.stringify(t);
		moveTabSelection(t, 'a', 'ArrowRight');
		expect(JSON.stringify(t)).toBe(snapshot);
	});
});
