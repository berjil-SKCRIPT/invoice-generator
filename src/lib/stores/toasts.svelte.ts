import { newId } from '../utils/id';

export type Toast = {
	id: string;
	message: string;
	action?: { label: string; run: () => void };
};

export function createToastStore() {
	let toasts = $state<Toast[]>([]);
	function push(t: Omit<Toast, 'id'>, ms = 5000) {
		const id = newId();
		toasts = [...toasts, { ...t, id }];
		setTimeout(() => {
			toasts = toasts.filter((x) => x.id !== id);
		}, ms);
	}
	return {
		get value() {
			return toasts;
		},
		push,
		dismiss(id: string) {
			toasts = toasts.filter((t) => t.id !== id);
		}
	};
}
