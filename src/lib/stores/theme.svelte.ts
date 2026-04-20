import { Storage } from '../storage/local';
import { PreferencesSchema, DEFAULT_PREFERENCES, type Preferences } from '../schemas/prefs';

type Theme = Preferences['theme'];
const KEY = 'featureos_inv_v1_prefs';
const store = new Storage(KEY, PreferencesSchema, DEFAULT_PREFERENCES);

function applyTheme(theme: Theme) {
	if (typeof document === 'undefined') return;
	const sys = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	document.documentElement.dataset.theme = theme === 'system' ? sys : theme;
}

export function createThemeStore() {
	const initial = store.read();
	let theme = $state<Theme>(initial.theme);

	$effect.root(() => {
		$effect(() => {
			applyTheme(theme);
			store.write({ ...store.read(), theme });
		});
	});

	return {
		get value() {
			return theme;
		},
		set(next: Theme) {
			theme = next;
		},
		cycle() {
			const order: Theme[] = ['light', 'dark', 'oled', 'system'];
			theme = order[(order.indexOf(theme) + 1) % order.length];
		}
	};
}
