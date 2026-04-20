import dayjs from 'dayjs';

export type PaymentTerms = 'net0' | 'net7' | 'net15' | 'net30' | 'net60' | 'custom';

const TERM_DAYS: Record<Exclude<PaymentTerms, 'custom'>, number> = {
	net0: 0,
	net7: 7,
	net15: 15,
	net30: 30,
	net60: 60
};

export const today = () => dayjs().format('YYYY-MM-DD');
export const addDays = (date: string, days: number) =>
	dayjs(date).add(days, 'day').format('YYYY-MM-DD');
export const formatHuman = (date: string) => dayjs(date).format('MMM D, YYYY');

export const dueFromTerms = (issued: string, terms: PaymentTerms): string => {
	if (terms === 'custom') return issued;
	return addDays(issued, TERM_DAYS[terms]);
};
