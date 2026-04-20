const SiteMeta = {
	siteName: 'FeatureOS',
	siteDescription:
		'All-in-one feedback management platform for product teams. Try free for 30 days. Guaranteed return on investment.',
	siteUrl: 'https://featureos.com',
	SignupURL: 'https://portal.featureos.app/new',
	SigninURL: 'https://portal.featureos.app/auth/signin',
	DemoURL: '/request-demo',
	assets: {
		domain: 'https://assets.production.featureos.com',
		prefix: 'https://assets.production.featureos.com/featureos/site-assets'
	},
	image: {
		src: 'https://assets.production.featureos.com/featureos/site-assets/images/og.jpg',
		alt: 'Build great products.'
	},
	logo: {
		src: '/brand/featureos_logo.png',
		url: 'https://featureos.com/brand/featureos_logo.png',
		width: 2048,
		height: 2048,
		alt: 'FeatureOS Logo'
	},
	defaultOg:
		'https://assets.production.featureos.com/featureos/site-assets/images/og.jpg',
	fallbackOG:
		'https://assets.production.featureos.com/featureos/site-assets/images/og.jpg?v11',
	social: {
		twitter: 'https://x.com/getFeatureOS',
		linkedin: 'https://linkedin.com/company/featureos',
		instagram: 'https://instagram.com/skcript',
		youtube: 'https://www.youtube.com/skcript',
		github: 'https://github.com/skcript'
	},
	seo: {
		defaultTitle:
			'Product Management Platform for Feedback, Roadmaps & Prioritization',
		titleTemplate: '%s | FeatureOS',
		defaultKeywords: [
			'product management',
			'feature development',
			'AI product management',
			'customer feedback',
			'product analytics',
			'feature prioritization',
			'product roadmap',
			'user feedback management'
		],
		twitterHandle: '@getFeatureOS',
		locale: 'en_US',
		robots: 'index,follow'
	},
	organization: {
		name: 'Skcript',
		legalName: 'Skcript Technologies Private Limited',
		url: 'https://www.skcript.com',
		logo: 'https://assets.production.featureos.com/skcript/site-assets/images/brand/Skcript_logo.png',
		description:
			'Skcript builds AI-native software for enterprise automation, support intelligence, and modern hiring workflows.',
		foundingDate: '2013'
	}
} as const

export default SiteMeta
