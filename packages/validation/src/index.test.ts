import { describe, expect, it } from 'vitest';
import { required } from './index.js';

describe('required validation', () => {
  it('rejects absent, blank, and empty-array values with a stable message', () => {
    expect(required(undefined)).toEqual({ valid: false, message: 'This field is required.' });
    expect(required('   ', 'Enter a venue name.')).toEqual({ valid: false, message: 'Enter a venue name.' });
    expect(required([])).toEqual({ valid: false, message: 'This field is required.' });
  });

  it('accepts entered scalar and array values without altering them', () => {
    expect(required('Foundry')).toEqual({ valid: true });
    expect(required(0)).toEqual({ valid: true });
    expect(required(['one'])).toEqual({ valid: true });
  });
});
