export interface TabTrigger {
	value: string;
	disabled?: boolean;
}

export function validateTabsComposition(
	triggers: readonly TabTrigger[],
	panelValues: readonly string[],
	selectedValue: string,
): readonly TabTrigger[] {
	if (triggers.length === 0 || panelValues.length === 0) throw new Error('triggers and panel values must not be empty');

	const triggerValues = triggers.map((t) => t.value);
	if (triggerValues.some((value) => value.length === 0) || panelValues.some((value) => value.length === 0)) {
		throw new Error('trigger and panel values must not be empty');
	}
	if (new Set(triggerValues).size !== triggerValues.length) throw new Error('duplicate trigger values');
	if (new Set(panelValues).size !== panelValues.length) throw new Error('duplicate panel values');

	triggerValues.forEach((v) => {
		if (!panelValues.includes(v)) throw new Error(`trigger value ${JSON.stringify(v)} has no matching panel`);
	});
	panelValues.forEach((v) => {
		if (!triggerValues.includes(v)) throw new Error(`panel value ${JSON.stringify(v)} has no matching trigger`);
	});

	if (triggers.every((t) => t.disabled)) throw new Error('at least one enabled trigger is required');
	if (!triggers.some((t) => t.value === selectedValue)) throw new Error('selected value unknown');
	if (triggers.find((t) => t.value === selectedValue)?.disabled) throw new Error('selected value is disabled');

	return triggers;
}

export function moveTabSelection(
	triggers: readonly TabTrigger[],
	currentValue: string,
	key: 'ArrowLeft' | 'ArrowRight' | 'Home' | 'End',
): string {
	const enabled = triggers.filter((t) => !t.disabled);
	const idx = enabled.findIndex((t) => t.value === currentValue);
	if (key === 'Home') return enabled[0].value;
	if (key === 'End') return enabled[enabled.length - 1].value;

	const delta = key === 'ArrowRight' ? 1 : -1;
	const next = (idx + delta + enabled.length) % enabled.length;
	return enabled[next].value;
}
