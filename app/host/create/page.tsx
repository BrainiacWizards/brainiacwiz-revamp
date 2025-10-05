"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { Divider } from "@heroui/divider";
import { Textarea } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Tooltip } from "@heroui/tooltip";
import { Spinner } from "@heroui/spinner";
import { Toast } from "@heroui/toast";
import { motion } from "framer-motion";

import { title, subtitle } from "@/components/primitives";

// Categories for quizzes
const categories = [
	{ value: "crypto", label: "Cryptocurrency" },
	{ value: "blockchain", label: "Blockchain" },
	{ value: "nft", label: "NFTs" },
	{ value: "defi", label: "DeFi" },
	{ value: "gaming", label: "Gaming" },
	{ value: "tech", label: "Technology" },
	{ value: "science", label: "Science" },
	{ value: "history", label: "History" },
	{ value: "general", label: "General Knowledge" },
];

export default function CreateQuizPage() {
	const router = useRouter();
	// Helper function to show toast notifications
	const showToast = (message: string, color?: "danger" | "success" | "warning") => {
		// Using Toast component directly
		console.log(`Toast: ${message} (${color})`);
		// In a real implementation, we would display a toast notification
		// For now, just log to console since we're having issues with the Toast API
	};
	const [activeTab, setActiveTab] = useState("details");
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Quiz details
	const [quizTitle, setQuizTitle] = useState("");
	const [quizDescription, setQuizDescription] = useState("");
	const [category, setCategory] = useState("");
	const [prizePool, setPrizePool] = useState(100);
	const [timePerQuestion, setTimePerQuestion] = useState(30);

	// Questions
	const [questions, setQuestions] = useState([
		{
			id: "q1",
			text: "",
			options: ["", "", "", ""],
			correctIdx: 0,
		},
	]);

	// Current question being edited
	const [currentQuestion, setCurrentQuestion] = useState(0);

	// Add a new question
	const addQuestion = () => {
		setQuestions([
			...questions,
			{
				id: `q${questions.length + 1}`,
				text: "",
				options: ["", "", "", ""],
				correctIdx: 0,
			},
		]);
		setCurrentQuestion(questions.length);
	};

	// Update question text
	const updateQuestionText = (text: string) => {
		const newQuestions = [...questions];
		newQuestions[currentQuestion].text = text;
		setQuestions(newQuestions);
	};

	// Update option text
	const updateOptionText = (index: number, text: string) => {
		const newQuestions = [...questions];
		newQuestions[currentQuestion].options[index] = text;
		setQuestions(newQuestions);
	};

	// Set correct answer
	const setCorrectAnswer = (index: number) => {
		const newQuestions = [...questions];
		newQuestions[currentQuestion].correctIdx = index;
		setQuestions(newQuestions);
	};

	// Remove a question
	const removeQuestion = (index: number) => {
		if (questions.length <= 1) {
			showToast("You must have at least one question", "warning");
			return;
		}

		const newQuestions = questions.filter((_, i) => i !== index);
		setQuestions(newQuestions);

		if (currentQuestion >= newQuestions.length) {
			setCurrentQuestion(newQuestions.length - 1);
		}
	};

	// Submit the quiz
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validate quiz details
		if (!quizTitle.trim()) {
			showToast("Please enter a quiz title", "danger");
			setActiveTab("details");
			return;
		}

		// Validate questions
		let isValid = true;
		questions.forEach((q, i) => {
			if (!q.text.trim()) {
				showToast(`Question ${i + 1} needs text`, "danger");
				setActiveTab("questions");
				setCurrentQuestion(i);
				isValid = false;
			}

			q.options.forEach((opt, j) => {
				if (!opt.trim()) {
					showToast(`Question ${i + 1}, Option ${j + 1} needs text`, "danger");
					setActiveTab("questions");
					setCurrentQuestion(i);
					isValid = false;
				}
			});
		});

		if (!isValid) return;

		// Submit to API
		try {
			setIsSubmitting(true);

			const response = await fetch("/api/quiz", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title: quizTitle,
					description: quizDescription,
					category,
					prizePool,
					timePerQuestion,
					questions: questions.map((q) => ({
						text: q.text,
						options: q.options,
						correctIdx: q.correctIdx,
					})),
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.error || "Failed to create quiz");
			}

			const data = await response.json();
			showToast("Quiz created successfully!", "success");

			// Redirect to the quiz page
			router.push(`/host/quiz?id=${data.quiz.id}`);
		} catch (error) {
			console.error("Error creating quiz:", error);
			showToast(error instanceof Error ? error.message : "Failed to create quiz", "danger");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<motion.div
			className="py-8 px-4 md:px-0"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}>
			<div className="mb-8 text-center">
				<h1 className={title({ size: "lg" })}>
					Create Your <span className={title({ color: "blue" })}>Quiz</span>
				</h1>
				<p className={subtitle({ class: "mt-2 max-w-lg mx-auto" })}>
					Design engaging quizzes with rewards that players will love
				</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto">
				<div className="lg:col-span-8">
					<form onSubmit={handleSubmit}>
						<Card className="mb-8 shadow-lg">
							<CardHeader className="flex flex-col gap-1 pb-0 bg-gradient-to-r from-blue-900/20 to-blue-700/5">
								<Tabs
									aria-label="Quiz creation steps"
									selectedKey={activeTab}
									onSelectionChange={setActiveTab as any}
									variant="underlined"
									classNames={{
										tabList: "gap-6",
										cursor: "bg-blue-500",
										tab: "data-[selected=true]:text-blue-500 data-[selected=true]:font-medium",
									}}>
									<Tab
										key="details"
										title={
											<div className="flex items-center gap-2">
												<span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/20 text-blue-500 text-xs">
													1
												</span>
												<span>Quiz Details</span>
											</div>
										}
									/>
									<Tab
										key="questions"
										title={
											<div className="flex items-center gap-2">
												<span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/20 text-blue-500 text-xs">
													2
												</span>
												<span>Add Questions</span>
											</div>
										}
									/>
									<Tab
										key="preview"
										title={
											<div className="flex items-center gap-2">
												<span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500/20 text-blue-500 text-xs">
													3
												</span>
												<span>Preview</span>
											</div>
										}
									/>
								</Tabs>
							</CardHeader>

							<CardBody className="py-6">
								{activeTab === "details" && (
									<motion.div
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.3 }}
										className="flex flex-col gap-6">
										<Input
											label="Quiz Title"
											placeholder="Enter an engaging title for your quiz"
											value={quizTitle}
											onChange={(e) => setQuizTitle(e.target.value)}
											isRequired
											variant="bordered"
											startContent={
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
													className="text-default-400">
													<path
														d="M20.24 12.24C21.3658 11.1142 21.9983 9.58722 21.9983 7.99504C21.9983 6.40285 21.3658 4.87588 20.24 3.75004C19.1142 2.62419 17.5872 1.9917 15.995 1.9917C14.4028 1.9917 12.8758 2.62419 11.75 3.75004L5 10.5V19H13.5L20.24 12.24Z"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M16 8L2 22"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M17.5 15H9"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											}
											className="mb-2"
										/>
										<div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg mb-6">
											<p className="text-xs text-blue-600 dark:text-blue-400">
												Great titles are concise, intriguing, and relevant
												to your topic
											</p>
										</div>

										<Textarea
											label="Description"
											placeholder="Tell players what your quiz is about"
											value={quizDescription}
											onChange={(e) => setQuizDescription(e.target.value)}
											variant="bordered"
											minRows={3}
											startContent={
												<svg
													width="16"
													height="16"
													viewBox="0 0 24 24"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
													className="text-default-400 mt-2.5">
													<path
														d="M8 10H16"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M8 14H16"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M8 18H12"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M16 2V6"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M8 2V6"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3 10V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V10H3Z"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
													<path
														d="M3 10V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V10H3Z"
														stroke="currentColor"
														strokeWidth="2"
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
											}
										/>

										<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
											<div>
												<Select
													label="Category"
													placeholder="Select a category"
													selectedKeys={category ? [category] : []}
													onSelectionChange={(keys) => {
														const selected = Array.from(
															keys,
														)[0] as string;
														setCategory(selected);
													}}
													variant="bordered"
													classNames={{
														label: "text-blue-600 dark:text-blue-400 font-medium",
													}}
													startContent={
														<svg
															width="16"
															height="16"
															viewBox="0 0 24 24"
															fill="none"
															xmlns="http://www.w3.org/2000/svg"
															className="text-default-400">
															<path
																d="M19.5 12.5C19.5 11.12 20.62 10 22 10V9C22 5 21 4 17 4H7C3 4 2 5 2 9V9.5C3.38 9.5 4.5 10.62 4.5 12C4.5 13.38 3.38 14.5 2 14.5V15C2 19 3 20 7 20H17C21 20 22 19 22 15C20.62 15 19.5 13.88 19.5 12.5Z"
																stroke="currentColor"
																strokeWidth="1.5"
																strokeLinecap="round"
																strokeLinejoin="round"
															/>
															<path
																d="M10 4V20"
																stroke="currentColor"
																strokeWidth="1.5"
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeDasharray="5 5"
															/>
														</svg>
													}>
													{categories.map((cat) => (
														<SelectItem key={cat.value}>
															{cat.label}
														</SelectItem>
													))}
												</Select>
												<p className="mt-1 text-xs text-default-500">
													Choose the best category for discovery
												</p>
											</div>

											<div>
												<Input
													type="number"
													label="Prize Pool (in cUSD)"
													placeholder="100"
													value={prizePool.toString()}
													onChange={(e) =>
														setPrizePool(Number(e.target.value))
													}
													min={0}
													variant="bordered"
													classNames={{
														label: "text-blue-600 dark:text-blue-400 font-medium",
													}}
													startContent={
														<div className="pointer-events-none flex items-center">
															<span className="text-default-400 text-small">
																$
															</span>
														</div>
													}
												/>
												<div className="mt-2">
													<div className="flex items-center justify-between text-xs">
														<span>Low attraction</span>
														<span>High attraction</span>
													</div>
													<div className="w-full h-1.5 bg-default-100 rounded-full mt-1 relative">
														<div
															className={`absolute h-1.5 bg-gradient-to-r from-blue-300 to-blue-600 rounded-full transition-all duration-300`}
															style={{
																width: `${Math.min(100, prizePool / 5)}%`,
															}}></div>
														{prizePool >= 100 && (
															<div className="absolute -right-1 -top-0.5 h-2.5 w-2.5 bg-blue-600 rounded-full"></div>
														)}
													</div>
													<p className="mt-1 text-xs text-default-500">
														{prizePool < 50
															? "Low prizes attract fewer players"
															: prizePool < 100
																? "Moderate prize pool will attract average players"
																: "Excellent! High prize pools attract more players"}
													</p>
												</div>
											</div>
										</div>

										<Input
											type="number"
											label="Time per Question (seconds)"
											placeholder="30"
											value={timePerQuestion.toString()}
											onChange={(e) =>
												setTimePerQuestion(Number(e.target.value))
											}
											min={5}
											max={120}
											variant="bordered"
										/>

										<div className="flex justify-end mt-4">
											<Button
												color="primary"
												onClick={() => setActiveTab("questions")}>
												Continue to Questions
											</Button>
										</div>
									</motion.div>
								)}

								{activeTab === "questions" && (
									<motion.div
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.3 }}>
										<div className="flex items-center justify-between mb-6">
											<h3 className="text-xl font-semibold">
												Questions ({questions.length})
											</h3>
											<Button
												color="primary"
												variant="flat"
												onClick={addQuestion}>
												Add Question
											</Button>
										</div>

										<div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mb-6">
											{questions.map((q, i) => (
												<Button
													key={q.id}
													size="sm"
													color={
														i === currentQuestion
															? "primary"
															: "default"
													}
													variant={
														i === currentQuestion ? "solid" : "flat"
													}
													onClick={() => setCurrentQuestion(i)}
													className="relative">
													{i + 1}
													{i !== 0 && (
														<Tooltip content="Remove question">
															<button
																className="absolute -top-1 -right-1 bg-danger text-white rounded-full w-4 h-4 flex items-center justify-center text-xs"
																onClick={(e) => {
																	e.stopPropagation();
																	removeQuestion(i);
																}}>
																×
															</button>
														</Tooltip>
													)}
												</Button>
											))}
										</div>

										<div className="mb-6">
											<Textarea
												label={`Question ${currentQuestion + 1}`}
												placeholder="Enter your question here"
												value={questions[currentQuestion].text}
												onChange={(e) => updateQuestionText(e.target.value)}
												variant="bordered"
												className="mb-4"
											/>

											<div className="space-y-4">
												<p className="font-medium mb-2">Answer Options</p>
												{questions[currentQuestion].options.map(
													(option, i) => (
														<div
															key={i}
															className="flex gap-3 items-center">
															<Button
																isIconOnly
																color={
																	questions[currentQuestion]
																		.correctIdx === i
																		? "success"
																		: "default"
																}
																variant={
																	questions[currentQuestion]
																		.correctIdx === i
																		? "solid"
																		: "bordered"
																}
																size="sm"
																onClick={() => setCorrectAnswer(i)}>
																{questions[currentQuestion]
																	.correctIdx === i
																	? "✓"
																	: String.fromCharCode(65 + i)}
															</Button>
															<Input
																placeholder={`Option ${String.fromCharCode(65 + i)}`}
																value={option}
																onChange={(e) =>
																	updateOptionText(
																		i,
																		e.target.value,
																	)
																}
																variant="bordered"
																className="flex-grow"
															/>
														</div>
													),
												)}
											</div>
										</div>

										<div className="flex justify-between mt-6">
											<Button
												color="default"
												variant="flat"
												onClick={() => setActiveTab("details")}>
												Back to Details
											</Button>
											<Button
												color="primary"
												onClick={() => setActiveTab("preview")}>
												Continue to Preview
											</Button>
										</div>
									</motion.div>
								)}

								{activeTab === "preview" && (
									<motion.div
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.3 }}
										className="space-y-8">
										<div className="p-6 bg-content2 rounded-xl">
											<div className="flex justify-between items-start">
												<div>
													<h2 className="text-2xl font-bold">
														{quizTitle || "Untitled Quiz"}
													</h2>
													<p className="text-default-500">
														{quizDescription ||
															"No description provided"}
													</p>
												</div>
												<Chip color="success" variant="shadow">
													${prizePool} Prize
												</Chip>
											</div>

											<div className="mt-4">
												<div className="flex gap-2 items-center">
													<span className="text-default-500">
														Category:
													</span>
													<Chip variant="flat" size="sm">
														{categories.find(
															(c) => c.value === category,
														)?.label || "Uncategorized"}
													</Chip>
												</div>
												<div className="flex gap-2 items-center mt-2">
													<span className="text-default-500">
														Questions:
													</span>
													<span>{questions.length}</span>
												</div>
												<div className="flex gap-2 items-center mt-2">
													<span className="text-default-500">
														Time per question:
													</span>
													<span>{timePerQuestion} seconds</span>
												</div>
											</div>
										</div>

										<div className="space-y-4">
											<h3 className="text-xl font-semibold">
												Questions Preview
											</h3>

											<div className="space-y-6">
												{questions.map((q, qIndex) => (
													<Card key={q.id} className="bg-content1">
														<CardBody>
															<p className="font-medium mb-3">
																{qIndex + 1}.{" "}
																{q.text || "Untitled Question"}
															</p>
															<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
																{q.options.map((opt, oIndex) => (
																	<Chip
																		key={oIndex}
																		color={
																			q.correctIdx === oIndex
																				? "success"
																				: "default"
																		}
																		variant={
																			q.correctIdx === oIndex
																				? "bordered"
																				: "flat"
																		}
																		className="w-full justify-start">
																		{String.fromCharCode(
																			65 + oIndex,
																		)}
																		. {opt || "Empty option"}
																	</Chip>
																))}
															</div>
														</CardBody>
													</Card>
												))}
											</div>
										</div>

										<div className="flex justify-between mt-6">
											<Button
												color="default"
												variant="flat"
												onClick={() => setActiveTab("questions")}>
												Back to Questions
											</Button>
											<Button
												color="primary"
												type="submit"
												isLoading={isSubmitting}
												isDisabled={isSubmitting}>
												{isSubmitting ? "Creating Quiz..." : "Create Quiz"}
											</Button>
										</div>
									</motion.div>
								)}
							</CardBody>
						</Card>
					</form>
				</div>

				{/* Right column with tips and features */}
				<div className="lg:col-span-4">
					<div className="sticky top-20">
						<Card className="mb-6 border-blue-600 border-2">
							<CardHeader className="bg-blue-600/10">
								<h3 className="text-lg font-bold flex items-center gap-2">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M12 16V12"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M12 8H12.01"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									Quiz Creation Tips
								</h3>
							</CardHeader>
							<CardBody>
								<motion.ul
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
									className="space-y-4 text-sm">
									<motion.li
										initial={{ x: -10, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										className="flex items-start gap-2">
										<span className="text-blue-500 font-bold mt-0.5">1.</span>
										<span>
											Keep questions clear and concise with single correct
											answers
										</span>
									</motion.li>
									<motion.li
										initial={{ x: -10, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										className="flex items-start gap-2">
										<span className="text-blue-500 font-bold mt-0.5">2.</span>
										<span>
											Add 4 options per question for optimal difficulty
										</span>
									</motion.li>
									<motion.li
										initial={{ x: -10, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										className="flex items-start gap-2">
										<span className="text-blue-500 font-bold mt-0.5">3.</span>
										<span>
											Consider time limits (30s per question recommended)
										</span>
									</motion.li>
									<motion.li
										initial={{ x: -10, opacity: 0 }}
										animate={{ x: 0, opacity: 1 }}
										className="flex items-start gap-2">
										<span className="text-blue-500 font-bold mt-0.5">4.</span>
										<span>Set prize pools to attract more participants</span>
									</motion.li>
								</motion.ul>
							</CardBody>
						</Card>

						<Card className="mb-6">
							<CardHeader>
								<h3 className="text-lg font-bold flex items-center gap-2">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M22 12H18L15 21L9 3L6 12H2"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									Quiz Engagement Stats
								</h3>
							</CardHeader>
							<CardBody>
								<div className="space-y-4">
									<div>
										<p className="text-sm text-default-500 mb-1">
											Avg. player engagement
										</p>
										<div className="w-full bg-default-100 rounded-full h-2">
											<div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-4/5"></div>
										</div>
										<p className="text-xs text-default-400 mt-1">
											Quizzes with 8+ questions have 80% completion rate
										</p>
									</div>

									<div>
										<p className="text-sm text-default-500 mb-1">
											Prize pool effectiveness
										</p>
										<div className="w-full bg-default-100 rounded-full h-2">
											<div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4"></div>
										</div>
										<p className="text-xs text-default-400 mt-1">
											100+ cUSD prize pools attract 75% more players
										</p>
									</div>

									<div>
										<div className="flex justify-between text-sm mb-2">
											<span>10 questions</span>
											<span>20 min to complete</span>
										</div>
										<div className="text-xs text-center p-2 bg-default-50 rounded-lg">
											Recommended quiz length for maximum engagement
										</div>
									</div>
								</div>
							</CardBody>
						</Card>

						<Card>
							<CardHeader className="bg-gradient-to-r from-blue-700/20 to-blue-500/10">
								<h3 className="text-lg font-bold flex items-center gap-2">
									<svg
										width="24"
										height="24"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg">
										<path
											d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
										<path
											d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
										/>
									</svg>
									Host Benefits
								</h3>
							</CardHeader>
							<CardBody>
								<ul className="space-y-3 text-sm">
									<li className="flex items-center gap-2">
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M20 6L9 17L4 12"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<span>Earn 10% commission from all prize pools</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M20 6L9 17L4 12"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<span>Build reputation with host leaderboard</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M20 6L9 17L4 12"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<span>Gain followers who get notified of your quizzes</span>
									</li>
									<li className="flex items-center gap-2">
										<svg
											width="18"
											height="18"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg">
											<path
												d="M20 6L9 17L4 12"
												stroke="currentColor"
												strokeWidth="2"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										<span>
											Unlock special quiz templates after 5 hosted quizzes
										</span>
									</li>
								</ul>
							</CardBody>
						</Card>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
