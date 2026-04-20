import { z } from 'zod';
import { BrandSchema, PartySchema } from './invoice';

export const PreferencesSchema = z.object({
	theme: z.enum(['light', 'dark', 'oled', 'system']).default('system'),
	region: z.enum(['IN', 'INTL']).default('INTL'),
	defaultCurrency: z.string().length(3).default('USD'),
	defaultTemplate: z
		.enum(['modern', 'minimal', 'classic', 'creative', 'corporate'])
		.default('modern'),
	defaultFont: z.enum(['inter', 'space-grotesk', 'plex-serif']).default('inter'),
	brand: BrandSchema.partial().optional(),
	lastFromParty: PartySchema.optional(),
	recentRecipients: z.array(PartySchema).max(20).default([]),
	numberingPrefix: z.string().default('INV'),
	numberingFormat: z.string().default('{prefix}-{YYYY}-{####}'),
	nextSequence: z.number().int().min(1).default(1)
});

export type Preferences = z.infer<typeof PreferencesSchema>;

export const DEFAULT_PREFERENCES: Preferences = PreferencesSchema.parse({});
