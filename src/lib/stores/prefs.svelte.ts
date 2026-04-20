import { Storage } from '../storage/local';
import { PreferencesSchema, DEFAULT_PREFERENCES, type Preferences } from '../schemas/prefs';

const KEY = 'featureos_inv_v1_prefs';
const store = new Storage(KEY, PreferencesSchema, DEFAULT_PREFERENCES);

export function createPrefsStore() {
	let prefs = $state<Preferences>(store.read());

	function patch(next: Partial<Preferences>) {
		prefs = { ...prefs, ...next };
		store.write(prefs);
	}

	function consumeNumber(): string {
		const seq = prefs.nextSequence;
		const year = new Date().getFullYear();
		const month = String(new Date().getMonth() + 1).padStart(2, '0');
		const padded = String(seq).padStart(4, '0');
		const number = prefs.numberingFormat
			.replace('{prefix}', prefs.numberingPrefix)
			.replace('{YYYY}', String(year))
			.replace('{YY}', String(year).slice(-2))
			.replace('{MM}', month)
			.replace('{####}', padded)
			.replace('{###}', String(seq).padStart(3, '0'));
		patch({ nextSequence: seq + 1 });
		return number;
	}

	return {
		get value() {
			return prefs;
		},
		patch,
		consumeNumber
	};
}
