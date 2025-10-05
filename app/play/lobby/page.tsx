"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Spinner } from "@heroui/spinner";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";

interface Player {
	id: string;
	name: string;
	avatar: string;
}

const LobbyPage = () => {
	const searchParams = useSearchParams();
	const quizId = searchParams.get("quizId");
	const gamePin = searchParams.get("gamePin");

	const [isLoading, setIsLoading] = useState(true);
	const [players, setPlayers] = useState<Player[]>([]);
	const [quizDetails, setQuizDetails] = useState<{ title: string; hostName: string } | null>(
		null,
	);

	useEffect(() => {
		// Validate that we have the required params
		if (!quizId || !gamePin) {
			addToast({
				title: "Error",
				description: "Missing quiz information. Please go back and try again.",
				color: "danger",
			});

			return;
		}

		// Fetch quiz details
		async function fetchQuizDetails() {
			try {
				const response = await fetch(`/api/quiz/${quizId}`);

				if (!response.ok) {
					throw new Error("Failed to fetch quiz details");
				}

				const data = await response.json();

				setQuizDetails({
					title: data.title,
					hostName: data.host?.name || "Quiz Host",
				});
			} catch (error) {
				console.error("Error fetching quiz details:", error);
				addToast({
					title: "Error",
					description: "Failed to load quiz details",
					color: "danger",
				});
			} finally {
				setIsLoading(false);
			}
		}

		// Mock player data for now
		// In a real implementation, this would come from a WebSocket or polling mechanism
		setPlayers([
			{ id: "p1", name: "Player 1", avatar: "https://i.pravatar.cc/150?img=1" },
			{ id: "p2", name: "Player 2", avatar: "https://i.pravatar.cc/150?img=2" },
			{ id: "p3", name: "Player 3", avatar: "https://i.pravatar.cc/150?img=3" },
		]);

		fetchQuizDetails();

		// Setup would include WebSocket connection for real-time updates
	}, [quizId, gamePin]);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[80vh]">
				<Spinner color="primary" size="lg" />
				<p className="mt-4 text-default-500">Loading quiz lobby...</p>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8">
			<Card className="max-w-3xl mx-auto border-none shadow-md">
				<CardHeader className="flex flex-col gap-2">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold">{quizDetails?.title || "Quiz Lobby"}</h1>
						<Chip className="text-md" color="primary" size="lg" variant="flat">
							PIN: {gamePin}
						</Chip>
					</div>
					<p className="text-default-500">
						Hosted by <span className="font-semibold">{quizDetails?.hostName}</span>
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
										<span className="font-medium text-sm">{player.name}</span>
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
	);
};

export default LobbyPage;
