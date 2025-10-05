export type SiteConfig = typeof siteConfig;

export const siteConfig = {
	name: "BrainiacWiz",
	description:
		"The multiplayer quiz platform where knowledge pays off. Win crypto with your knowledge.",
	navItems: [
		{
			label: "Home",
			href: "/",
		},
		{
			label: "Play",
			href: "/play/gamepin",
		},
		{
			label: "Host",
			href: "/host/create",
		},
		{
			label: "Leaderboard",
			href: "/play/leaderboard/global",
		},
		{
			label: "About",
			href: "/about",
		},
		{
			label: "Support",
			href: "/support/faqs",
		},
	],
	navMenuItems: [
		{
			label: "Play Quiz",
			href: "/play/gamepin",
		},
		{
			label: "Host Quiz",
			href: "/host/create",
		},
		{
			label: "My Dashboard",
			href: "/profile",
		},
		{
			label: "My Quizzes",
			href: "/host/quiz",
		},
		{
			label: "Leaderboard",
			href: "/play/leaderboard/global",
		},
		{
			label: "Settings",
			href: "/settings",
		},
		{
			label: "Help & Feedback",
			href: "/help-feedback",
		},
		{
			label: "Logout",
			href: "/logout",
		},
	],
	links: {
		github: "https://github.com/BrainiacWizards/brainiacwiz-revamp",
		twitter: "https://twitter.com/brainiacwiz",
		docs: "/support/faqs",
		discord: "https://discord.gg/brainiacwiz",
		wallet: "https://valora.com",
		leaderboard: "/play/leaderboard/global",
	},
};
