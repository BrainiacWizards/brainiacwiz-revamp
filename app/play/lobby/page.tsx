"use client";
import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/lib/contexts/quiz-context";

const LobbyPage = () => {
	const router = useRouter();
	const { currentQuiz, gamePin, players, isLoading, error, playerName, joinQuiz } = useQuiz();

	const [isJoiningModalOpen, setIsJoiningModalOpen] = useState(false);
	const [localPlayerName, setLocalPlayerName] = useState("");
	const [isJoining, setIsJoining] = useState(false);

	useEffect(() => {
		// Show error toast if there's an error
		if (error) {
			addToast({
				title: "Error",
				description: error,
				color: "danger",
			});
		}
	}, [error]);

	useEffect(() => {
		// If we don't have a quiz or gamePin, we need to return to the gamepin page
		if (!currentQuiz && !isLoading) {
			addToast({
				title: "Error",
				description: "Missing quiz information. Please go back and try again.",
				color: "danger",
			});

			// Redirect back to gamepin page after a short delay
			setTimeout(() => {
				router.push("/play/gamepin");
			}, 1500);
			return;
		}

		// If we have a quiz but no player name, show the join modal
		if (currentQuiz && !playerName) {
			setIsJoiningModalOpen(true);
		}
	}, [currentQuiz, gamePin, isLoading, playerName, router]);

	const handleJoinQuiz = async () => {
		if (!gamePin || !localPlayerName.trim()) {
			addToast({
				title: "Error",
				description: "Please enter your name",
				color: "danger",
			});
			return;
		}

		setIsJoining(true);

		try {
			const success = await joinQuiz(gamePin, localPlayerName);

			if (success) {
				addToast({
					title: "Success",
					description: "You've joined the quiz!",
					color: "success",
				});
				setIsJoiningModalOpen(false);
			} else {
				throw new Error("Failed to join quiz");
			}
		} catch (error) {
			addToast({
				title: "Error",
				description: "Failed to join quiz. Please try again.",
				color: "danger",
			});
		} finally {
			setIsJoining(false);
		}
	};

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[80vh]">
				<Spinner color="primary" size="lg" />
				<p className="mt-4 text-default-500">Loading quiz lobby...</p>
			</div>
		);
	}

	if (!currentQuiz) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[80vh]">
				<p className="text-default-500">Redirecting to game pin page...</p>
			</div>
		);
	}

	return (
		<>
			<div className="container mx-auto px-4 py-8">
				<Card className="max-w-3xl mx-auto border-none shadow-md">
					<CardHeader className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<h1 className="text-3xl font-bold">{currentQuiz.title}</h1>
							<Chip className="text-md" color="primary" size="lg" variant="flat">
								PIN: {currentQuiz.gamePin}
							</Chip>
						</div>
						<p className="text-default-500">
							Hosted by <span className="font-semibold">{currentQuiz.hostName}</span>
						</p>
					</CardHeader>

					<CardBody className="py-6">
						<div className="flex flex-col gap-6">
							<div>
								<h2 className="text-xl font-semibold mb-3">
									Waiting for game to start
								</h2>
								<p className="text-default-500 mb-4">
									The quiz will begin once the host starts the game. Get ready!
								</p>
							</div>

							<div>
								<h3 className="text-lg font-semibold mb-3">
									Players in lobby: {players.length}
								</h3>
								<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
									{players.map((player) => (
										<div
											key={player.id}
											className="flex flex-col items-center gap-2 p-2 bg-default-50 rounded-lg">
											<Avatar
												className="mb-1"
												name={player.name}
												size="lg"
												src={player.avatar}
											/>
											<span className="font-medium text-sm">
												{player.name}
											</span>
											{playerName === player.name && (
												<Chip size="sm" color="success" variant="dot">
													You
												</Chip>
											)}
										</div>
									))}
								</div>
							</div>
						</div>
					</CardBody>

					<CardFooter className="flex flex-col gap-3 py-6">
						<p className="text-center text-default-500">
							The host will start the quiz shortly. Stay tuned!
						</p>
						<div className="flex justify-center">
							<Spinner color="primary" size="sm" />
						</div>
					</CardFooter>
				</Card>
			</div>

			{/* Join Quiz Modal */}
			<Modal
				isOpen={isJoiningModalOpen}
				onOpenChange={setIsJoiningModalOpen}
				isDismissable={false}
				hideCloseButton>
				<ModalContent>
					<ModalHeader className="flex flex-col gap-1">
						<h2>Join {currentQuiz.title}</h2>
					</ModalHeader>
					<ModalBody>
						<p className="mb-4 text-default-500">
							Enter your name to join this quiz session
						</p>
						<Input
							label="Your Name"
							placeholder="Enter your name"
							value={localPlayerName}
							onChange={(e) => setLocalPlayerName(e.target.value)}
						/>
					</ModalBody>
					<ModalFooter>
						<Button
							color="primary"
							isLoading={isJoining}
							isDisabled={!localPlayerName.trim()}
							onPress={handleJoinQuiz}>
							{isJoining ? "Joining..." : "Join Quiz"}
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default LobbyPage;
