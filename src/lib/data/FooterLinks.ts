interface LinkItem {
	name: string
	link: string
	external?: boolean
	isNew?: boolean
	isUpdated?: boolean
	isSelf?: boolean
}

interface FooterSection {
	title: string
	links: LinkItem[]
}

interface SocialLink {
	name: string
	url: string
	icon: string
}

const FooterLinks: FooterSection[] = [
	{
		title: 'Product Modules',
		links: [
			{ name: 'Forms & Surveys', link: '/forms-and-surveys' },
			{ name: 'Feedback Boards', link: '/boards' },
			{ name: 'Roadmap', link: '/roadmaps' },
			{ name: 'Release Notes', link: '/release-notes' },
			{ name: 'Knowledge Base', link: '/knowledge-base' },
			{ name: 'AI Assist', link: '/ai' },
			{ name: 'iOS App', link: '/ios', isNew: true },
		{ name: 'All Features', link: '/features' },
			{ name: 'SupportWire', link: 'https://supportwire.app', external: true, isNew: true }
		]
	},
	{
		title: 'Resources',
		links: [
			{ name: 'Pricing', link: '/pricing' },
			{ name: 'Chat With Us', link: '/support', isNew: true },
			{ name: 'Reach Support', link: '/support' },
			{ name: 'Blog & Resources', link: '/blog' },
			{ name: 'Dossier', link: '/dossier' },
			{ name: 'Glossary', link: '/glossary', isNew: true },
			{ name: 'Questions? Answered.', link: '/faq' },
			{ name: 'Demo & Playground', link: '/request-demo' },
			{ name: 'Help Center', link: 'https://help.featureos.app', external: true, isSelf: true },
			{ name: 'API Documentation', link: 'https://developers.featureos.app', external: true },
			{ name: 'Developer API', link: '/developer-api' }
		]
	},
	{
		title: 'More of FeatureOS',
		links: [
			{ name: 'What is FeatureOS?', link: '/what-is' },
			{ name: 'Customer Stories', link: '/customers' },
			{ name: 'Feedback Portal', link: 'https://feedback.featureos.app', external: true, isSelf: true },
			{ name: 'Changelog', link: 'https://feedback.featureos.app/changelog', external: true, isSelf: true },
			{ name: 'Compare FeatureOS', link: '/alternatives' },
			{ name: 'Switch to FeatureOS', link: '/switch' },
			{ name: 'Enterprise', link: '/enterprise' },
			{ name: 'Status', link: 'https://status.featureos.app', external: true },
			{ name: 'Security', link: '/legal/security' }
		]
	},
	{
		title: 'Behind FeatureOS',
		links: [
			{ name: 'About', link: 'https://www.skcript.com/company', external: true },
			{ name: 'Careers', link: 'https://www.skcript.com/careers', external: true },
			{ name: 'Skcript Newsroom', link: 'https://www.skcript.com/newsroom', external: true }
		]
	},
	{
		title: 'Free Tools',
		links: [
			{ name: 'NPS Calculator', link: '/tools/nps-calculator' },
			{ name: 'Changelog Generator', link: '/tools/changelog-generator' },
			{ name: 'Survey Generator', link: '/tools/survey-generator' }
		]
	}
]

export const socialLinks: SocialLink[] = [
	{
		name: 'Email',
		url: 'mailto:support@featureos.app',
		icon: 'simple-icons:maildotru'
	},
	{
		name: 'GitHub',
		url: 'https://github.com/skcript',
		icon: 'simple-icons:github'
	},
	{
		name: 'Instagram',
		url: 'https://instagram.com/skcript',
		icon: 'simple-icons:instagram'
	},
	{
		name: 'LinkedIn',
		url: 'https://linkedin.com/company/featureos',
		icon: 'simple-icons:linkedin'
	},
	{
		name: 'YouTube',
		url: 'https://www.youtube.com/@featureos',
		icon: 'simple-icons:youtube'
	}
]

export default FooterLinks
