export type FocusContext =
	| 'none'
	| 'from'
	| 'to'
	| 'item'
	| 'tax'
	| 'discount'
	| 'shipping'
	| 'payment'
	| 'notes';

export function createFocusStore() {
	let context = $state<FocusContext>('none');
	return {
		get value() {
			return context;
		},
		set(c: FocusContext) {
			context = c;
		}
	};
}
