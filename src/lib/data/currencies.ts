export type Currency = { code: string; symbol: string; name: string; locale: string };

export const CURRENCIES: Currency[] = [
	{ code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
	{ code: 'EUR', symbol: '€', name: 'Euro', locale: 'en-IE' },
	{ code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
	{ code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
	{ code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
	{ code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
	{ code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
	{ code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'en-AE' },
	{ code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
	{ code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH' },
	{ code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
	{ code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ' },
	{ code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
	{ code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
	{ code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso', locale: 'es-MX' },
	{ code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE' },
	{ code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO' },
	{ code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK' },
	{ code: 'PLN', symbol: 'zł', name: 'Polish Zloty', locale: 'pl-PL' },
	{ code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'en-HK' },
	{ code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
	{ code: 'TRY', symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR' },
	{ code: 'THB', symbol: '฿', name: 'Thai Baht', locale: 'th-TH' },
	{ code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY' },
	{ code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID' },
	{ code: 'PHP', symbol: '₱', name: 'Philippine Peso', locale: 'en-PH' },
	{ code: 'VND', symbol: '₫', name: 'Vietnamese Dong', locale: 'vi-VN' },
	{ code: 'NGN', symbol: '₦', name: 'Nigerian Naira', locale: 'en-NG' },
	{ code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', locale: 'en-KE' },
	{ code: 'EGP', symbol: 'E£', name: 'Egyptian Pound', locale: 'ar-EG' }
];

export const findCurrency = (code: string) => CURRENCIES.find((c) => c.code === code);
