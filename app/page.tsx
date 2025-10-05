"use client";

import { useState, useEffect } from "react";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Tabs, Tab } from "@heroui/tabs";
import { Avatar } from "@heroui/avatar";
import { Image } from "@heroui/image";
import { Badge } from "@heroui/badge";
import { Chip } from "@heroui/chip";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Progress } from "@heroui/progress";
import { motion } from "framer-motion";

import { title, subtitle } from "@/components/primitives";
import { HeartFilledIcon } from "@/components/icons";

// Quiz example data
const sampleQuizzes = [
	{
		id: "1",
		title: "Crypto Basics",
		questions: 10,
		players: 1243,
		prize: 250,
		category: "Crypto",
		image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?q=80&w=500&h=300&auto=format&fit=crop",
	},
	{
		id: "2",
		title: "Blockchain Masters",
		questions: 15,
		players: 987,
		prize: 500,
		category: "Blockchain",
		image: "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=500&h=300&auto=format&fit=crop",
	},
	{
		id: "3",
		title: "NFT Knowledge",
		questions: 8,
		players: 654,
		prize: 150,
		category: "NFTs",
		image: "https://images.unsplash.com/photo-1646458590637-ec1b2cdcb95d?q=80&w=500&h=300&auto=format&fit=crop",
	},
];

// Feature steps
const howItWorks = [
	{
		id: 1,
		title: "Create Your Quiz",
		description:
			"Design engaging quizzes with multiple choice questions, timers, and crypto prizes.",
		icon: "🎮",
	},
	{
		id: 2,
		title: "Share Game Code",
		description: "Players join your quiz by entering a unique game code on their devices.",
		icon: "🔢",
	},
	{
		id: 3,
		title: "Live Competition",
		description:
			"Players compete in real-time with dynamic leaderboards updating after each question.",
		icon: "⚡",
	},
	{
		id: 4,
		title: "Win Crypto Rewards",
		description: "Top performers win cUSD rewards sent directly to their connected wallets.",
		icon: "💰",
	},
];

export default function Home() {
	const [activeTab, setActiveTab] = useState("popular");
	const [counter, setCounter] = useState(0);

	// Animation for number counter
	useEffect(() => {
		const interval = setInterval(() => {
			if (counter < 10000) {
				setCounter((prev) => prev + 123);
			} else {
				clearInterval(interval);
			}
		}, 50);

		return () => clearInterval(interval);
	}, [counter]);

	return (
		<div className="flex flex-col gap-20 pb-20">
			{/* Hero Section */}
			<section className="flex flex-col items-center justify-center gap-8 pt-10 md:pt-24 px-4">
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="text-center flex flex-col gap-4"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.6 }}>
					<h1 className={title({ size: "lg", color: "blue" })}>BrainiacWiz</h1>
					<h2 className={title({ size: "md" })}>
						Win <span className={title({ color: "green" })}>Crypto</span> With Your
						Knowledge
					</h2>
					<p className={subtitle({ class: "mt-4 md:w-3/4 mx-auto" })}>
						The multiplayer quiz platform where knowledge pays off. Create quizzes,
						compete in real-time, and win cryptocurrency rewards.
					</p>
				</motion.div>

				<motion.div
					animate={{ opacity: 1 }}
					className="flex flex-col sm:flex-row gap-4"
					initial={{ opacity: 0 }}
					transition={{ delay: 0.3, duration: 0.6 }}>
					<Button
						as={Link}
						className="font-medium text-lg"
						color="primary"
						href="/play/gamepin"
						radius="full"
						size="lg"
						variant="shadow">
						Join a Quiz
					</Button>
					<Button
						as={Link}
						className="font-medium text-lg"
						color="secondary"
						href="/host/create"
						radius="full"
						size="lg"
						variant="bordered">
						Create a Quiz
					</Button>
				</motion.div>

				<motion.div
					animate={{ opacity: 1, scale: 1 }}
					className="mt-8 p-6 bg-content2 rounded-3xl shadow-lg w-full max-w-4xl"
					initial={{ opacity: 0, scale: 0.9 }}
					transition={{ delay: 0.5, duration: 0.6 }}>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
						<div className="flex flex-col items-center p-4 rounded-xl bg-content3">
							<span className="text-5xl font-bold text-primary mb-2">
								{counter.toLocaleString()}+
							</span>
							<p className="text-default-500">Players Worldwide</p>
						</div>
						<div className="flex flex-col items-center p-4 rounded-xl bg-content3">
							<span className="text-5xl font-bold text-secondary mb-2">
								{Math.round(counter / 50).toLocaleString()}+
							</span>
							<p className="text-default-500">Quizzes Created</p>
						</div>
						<div className="flex flex-col items-center p-4 rounded-xl bg-content3">
							<span className="text-5xl font-bold text-success mb-2">
								${Math.round(counter / 10).toLocaleString()}
							</span>
							<p className="text-default-500">Rewards Distributed</p>
						</div>
					</div>
				</motion.div>
			</section>

			{/* Featured Quizzes Section */}
			<section className="w-full px-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}>
					<div className="flex items-center justify-between mb-6">
						<h2 className={title({ size: "sm", class: "mb-4" })}>Featured Quizzes</h2>
						<Tabs
							aria-label="Quiz categories"
							className="mb-6"
							color="primary"
							selectedKey={activeTab}
							onSelectionChange={setActiveTab as any}>
							<Tab key="popular" title="Popular" />
							<Tab key="newest" title="Newest" />
							<Tab key="biggest" title="Biggest Prize" />
						</Tabs>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{sampleQuizzes.map((quiz) => (
							<motion.div
								key={quiz.id}
								className="h-full"
								whileHover={{ y: -8, transition: { duration: 0.2 } }}>
								<Card
									isHoverable
									isPressable
									as={Link}
									className="h-full"
									href={`/play/gamepin?quiz=${quiz.id}`}>
									<CardBody className="p-0 overflow-hidden w-full">
										<Image
											alt={quiz.title}
											className="w-full object-cover h-48 mx-auto"
											src={quiz.image}
										/>
									</CardBody>
									<CardFooter className="flex flex-col items-start text-left">
										<div className="flex items-center justify-between w-full mb-2">
											<Badge color="primary" variant="flat">
												{quiz.category}
											</Badge>
											<div className="flex items-center gap-1">
												<HeartFilledIcon
													className="text-danger"
													size={16}
												/>
												<span className="text-sm text-default-500">
													{quiz.players}
												</span>
											</div>
										</div>
										<h3 className="font-bold text-xl">{quiz.title}</h3>
										<div className="flex justify-between w-full mt-2">
											<Chip size="sm" variant="flat">
												{quiz.questions} Questions
											</Chip>
											<Chip color="success" variant="shadow">
												${quiz.prize} Prize
											</Chip>
										</div>
									</CardFooter>
								</Card>
							</motion.div>
						))}
					</div>

					<div className="flex justify-center mt-6">
						<Button
							as={Link}
							className="font-medium"
							color="primary"
							href="/play/leaderboard/global"
							radius="full"
							variant="ghost">
							View All Quizzes
						</Button>
					</div>
				</motion.div>
			</section>

			{/* How It Works Section */}
			<section className="w-full px-6 py-10 bg-gradient-to-b from-content1 to-background">
				<motion.div
					className="max-w-6xl mx-auto flex flex-col gap-4"
					initial={{ opacity: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1 }}>
					<h2
						className={title({
							size: "sm",
							color: "cyan",
							class: "mb-10 text-center",
						})}>
						How BrainiacWiz Works
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
						{howItWorks.map((step, index) => (
							<motion.div
								key={step.id}
								className="flex gap-4"
								initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
								transition={{ delay: index * 0.1, duration: 0.6 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1, x: 0 }}>
								<div className="h-16 w-16 flex items-center justify-center bg-primary rounded-full text-3xl flex-shrink-0">
									{step.icon}
								</div>
								<div>
									<h3 className="text-xl font-bold mb-2">{step.title}</h3>
									<p className="text-default-500">{step.description}</p>
								</div>
							</motion.div>
						))}
					</div>

					<motion.div
						className="mt-16 text-center"
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.4, duration: 0.6 }}
						viewport={{ once: true }}
						whileInView={{ opacity: 1, y: 0 }}>
						<Button
							as={Link}
							className="font-medium"
							color="secondary"
							href="/about"
							radius="full"
							size="lg"
							variant="ghost">
							Learn More
						</Button>
					</motion.div>
				</motion.div>
			</section>

			{/* Demo Section */}
			<section className="w-full px-6">
				<motion.div
					className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10 items-center"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}>
					<div className="w-full md:w-1/2 space-y-6">
						<h2 className={title({ size: "sm" })}>
							Try A <span className={title({ color: "pink" })}>Demo Quiz</span>
						</h2>
						<p className={subtitle({ class: "!w-full mt-6" })}>
							Experience the excitement of BrainiacWiz with our demo quiz. Test your
							knowledge, see your score, and learn how easy it is to participate.
						</p>

						<ScrollShadow className="h-48 w-full">
							<div className="space-y-4">
								<div className="p-4 bg-content2 rounded-lg">
									<p className="font-medium">
										What is the primary currency used in BrainiacWiz rewards?
									</p>
									<div className="grid grid-cols-2 gap-2 mt-3">
										<Button color="primary" size="sm" variant="flat">
											A. Bitcoin
										</Button>
										<Button color="primary" size="sm" variant="flat">
											B. Ethereum
										</Button>
										<Button color="primary" size="sm" variant="flat">
											C. cUSD
										</Button>
										<Button color="primary" size="sm" variant="flat">
											D. Dogecoin
										</Button>
									</div>
								</div>
								<div className="p-4 bg-content2 rounded-lg">
									<p className="font-medium">
										How many players can join a single quiz?
									</p>
									<div className="grid grid-cols-2 gap-2 mt-3">
										<Button color="primary" size="sm" variant="flat">
											A. Up to 10
										</Button>
										<Button color="primary" size="sm" variant="flat">
											B. Up to 50
										</Button>
										<Button color="primary" size="sm" variant="flat">
											C. Up to 100
										</Button>
										<Button color="primary" size="sm" variant="flat">
											D. Unlimited
										</Button>
									</div>
								</div>
							</div>
						</ScrollShadow>

						<div>
							<p className="text-sm text-default-500 mb-2">Time remaining:</p>
							<Progress
								aria-label="Time remaining"
								className="mb-4"
								color="warning"
								value={65}
							/>
							<Button
								as={Link}
								className="font-medium"
								color="primary"
								href="/play/gamepin"
								radius="full"
								variant="shadow">
								Play Full Demo
							</Button>
						</div>
					</div>

					<div className="w-full md:w-1/2 relative">
						<motion.div
							className="relative z-10"
							initial={{ scale: 0.8, opacity: 0 }}
							transition={{ duration: 0.8 }}
							viewport={{ once: true }}
							whileInView={{ scale: 1, opacity: 1 }}>
							<Image
								alt="People playing quiz"
								className="rounded-xl shadow-2xl"
								src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop"
							/>
						</motion.div>
						<div className="absolute top-10 right-10 w-16 h-16 bg-primary rounded-full -z-10 opacity-60 blur-xl" />
						<div className="absolute bottom-10 left-10 w-24 h-24 bg-secondary rounded-full -z-10 opacity-60 blur-xl" />
					</div>
				</motion.div>
			</section>

			{/* CTA Section */}
			<section className="w-full px-6">
				<motion.div
					className="max-w-4xl mx-auto text-center py-16 px-8 bg-gradient-to-r from-primary-900/20 to-secondary-900/20 rounded-3xl"
					initial={{ opacity: 0, y: 20 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1, y: 0 }}>
					<h2 className={title({ size: "md", class: "mb-4" })}>
						Ready to <span className={title({ color: "violet" })}>Play</span>?
					</h2>
					<p className={subtitle({ class: "!w-full mb-8 md:w-3/4 mx-auto" })}>
						Join thousands of players earning crypto rewards for their knowledge. Create
						your first quiz or join an existing game.
					</p>
					<div className="flex flex-col sm:flex-row justify-center gap-4">
						<Button
							as={Link}
							className="font-medium"
							color="primary"
							href="/play/gamepin"
							radius="full"
							size="lg"
							variant="shadow">
							Join a Quiz
						</Button>
						<Button
							as={Link}
							className="font-medium"
							color="secondary"
							href="/host/create"
							radius="full"
							size="lg"
							variant="bordered">
							Create a Quiz
						</Button>
					</div>
				</motion.div>
			</section>

			{/* Testimonials Section */}
			<section className="w-full px-6">
				<motion.div
					className="flex flex-col gap-6"
					initial={{ opacity: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					whileInView={{ opacity: 1 }}>
					<h2 className={title({ size: "sm", class: "text-center" })}>
						Player Testimonials
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{[1, 2, 3].map((i) => (
							<motion.div
								key={i}
								initial={{ opacity: 0, y: 20 }}
								transition={{ delay: i * 0.1, duration: 0.6 }}
								viewport={{ once: true }}
								whileInView={{ opacity: 1, y: 0 }}>
								<Card className="p-4">
									<CardBody>
										<div className="flex items-center gap-3 mb-4">
											<Avatar
												src={`https://i.pravatar.cc/150?img=${20 + i}`}
											/>
											<div>
												<p className="font-bold">Quiz Enthusiast {i}</p>
												<p className="text-sm text-default-500">
													@quizuser{i}
												</p>
											</div>
										</div>
										<p className="text-default-500">
											{i === 1 &&
												"BrainiacWiz is amazing! I've won over $50 in crypto by just answering questions about topics I'm passionate about."}
											{i === 2 &&
												"The real-time competition makes every quiz exciting. I love seeing my name climb the leaderboard after each question!"}
											{i === 3 &&
												"Creating quizzes for my students has been a game-changer. They're much more engaged now that there are crypto rewards."}
										</p>
									</CardBody>
								</Card>
							</motion.div>
						))}
					</div>
				</motion.div>
			</section>
		</div>
	);
}
