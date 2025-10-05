"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Question, Quiz } from "../generated/prisma";
import { iPlayer } from "@/types";

// Define the shape of our context
interface QuizContextType {
	// Quiz state
	currentQuiz: Quiz | null;
	gamePin: string | null;
	players: iPlayer[];
	isLoading: boolean;
	error: string | null;
	questions: Question[] | null;
	currentQuestion: number | null;

	// Player info
	playerName: string | null;
	playerId: string | null;

	// Functions
	setGamePin: (pin: string) => void;
	setPlayerName: (name: string) => void;
	fetchQuizByPin: (pin: string) => Promise<void>;
	fetchQuizById: (id: string) => Promise<void>;
	fetchQuestions: (quizId: string) => Promise<void>;
	joinQuiz: (pin: string, playerName: string) => Promise<boolean>;
	startQuiz: () => Promise<boolean>;
	answerQuestion: (questionId: string, answerIndex: number) => Promise<void>;
	nextQuestion: () => Promise<void>;
}

// Create the context with a default value
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Provider component that wraps our app and makes quiz data available
export function QuizProvider({ children }: { children: ReactNode }) {
	// State for quiz data
	const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
	const [questions, setQuestions] = useState<Question[] | null>(null);
	const [currentQuestion, setCurrentQuestion] = useState<number | null>(null);
	const [gamePin, setGamePin] = useState<string | null>(null);
	const [players, setPlayers] = useState<iPlayer[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// State for player data
	const [playerName, setPlayerName] = useState<string | null>(null);
	const [playerId, setPlayerId] = useState<string | null>(null);

	// Initialize from sessionStorage if available
	useEffect(() => {
		const quizId = sessionStorage.getItem("quizId");
		const pin = sessionStorage.getItem("gamePin");
		const name = localStorage.getItem("playerName");
		const player_id = sessionStorage.getItem("playerId");

		if (pin) {
			setGamePin(pin);
		}

		if (name) {
			setPlayerName(name);
		}

		if (player_id) {
			setPlayerId(player_id);
		}

		if (quizId && pin && !currentQuiz) {
			fetchQuizById(quizId);
		}
	}, []);

	// Function to fetch questions for a quiz
	const fetchQuestions = async (quizId: string): Promise<void> => {
		if (!quizId) {
			setError("Quiz ID is required to fetch questions");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/questions/${quizId}`);

			if (!response.ok) {
				throw new Error(`Failed to fetch questions: ${response.statusText}`);
			}

			const data = await response.json();
			setQuestions(data.questions);

			if (currentQuiz) {
				setCurrentQuestion(currentQuiz.currentQn || 0);
			}
		} catch (err) {
			console.error("Error fetching questions:", err);
			setError(err instanceof Error ? err.message : "Failed to fetch questions");
		} finally {
			setIsLoading(false);
		}
	};

	// Function to validate and fetch a quiz by its game pin
	const fetchQuizByPin = async (pin: string): Promise<void> => {
		if (!pin) {
			setError("Please enter a game pin");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/quiz/validate-pin`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ gamePin: pin }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to validate game pin");
			}

			// Save the game pin for later use
			setGamePin(pin);
			sessionStorage.setItem("gamePin", pin);

			// Fetch the quiz details
			if (data.quizId) {
				sessionStorage.setItem("quizId", data.quizId);
				await fetchQuizById(data.quizId);
			}
		} catch (err) {
			console.error("Error validating game pin:", err);
			setError(err instanceof Error ? err.message : "Failed to validate game pin");
		} finally {
			setIsLoading(false);
		}
	};

	// Function to fetch quiz by ID
	const fetchQuizById = async (id: string): Promise<void> => {
		if (!id) {
			setError("Quiz ID is required");
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/quiz/${id}`);

			if (!response.ok) {
				throw new Error("Failed to fetch quiz details");
			}

			const data = await response.json();

			// Mock players for now - in a real app this would come from API
			const mockPlayers = [
				{ id: "p1", name: "Player 1", avatar: "https://i.pravatar.cc/150?img=1" },
				{ id: "p2", name: "Player 2", avatar: "https://i.pravatar.cc/150?img=2" },
				{ id: "p3", name: "Player 3", avatar: "https://i.pravatar.cc/150?img=3" },
			];

			const quizData: Quiz = {
				id: data.id,
				title: data.title,
				gamePin: gamePin || data.gamePin || "",
				hostId: data.hostId || "",
				hostName: data.hostName || data.host?.name || "Quiz Host",
				currentQn: data.currentQn ?? 0,
				totalQns: data.totalQns ?? 0,
				totalPlayers: data.totalPlayers ?? data.players?.length ?? 0,
				prize: data.prize ?? 0,
				difficulty: data.difficulty ?? "EASY",
				timePerQn: data.timePerQn ?? 30,
				createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
				startedAt: data.startedAt ? new Date(data.startedAt) : null,
				endedAt: data.endedAt ? new Date(data.endedAt) : null,
				status: data.status,
				description: data.description ?? "",
				imageUrl: data.imageUrl ?? "",
				category: data.category ?? "",
			};

			setCurrentQuiz(quizData);
			setCurrentQuestion(quizData.currentQn || 0);
			setPlayers(mockPlayers);

			// Fetch questions for this quiz
			await fetchQuestions(id);
		} catch (err) {
			console.error("Error fetching quiz details:", err);
			setError(err instanceof Error ? err.message : "Failed to fetch quiz details");
		} finally {
			setIsLoading(false);
		}
	};

	// Function to join a quiz
	const joinQuiz = async (pin: string, name: string): Promise<boolean> => {
		if (!pin || !name) {
			setError("Game pin and player name are required");
			return false;
		}

		setIsLoading(true);
		setError(null);

		try {
			// In a real app, this would be an API call to join the quiz
			// For now, we'll simulate it with a delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setPlayerName(name);
			localStorage.setItem("playerName", name);

			// Generate a mock player ID
			const generatedPlayerId = `player_${Date.now()}`;

			setPlayerId(generatedPlayerId);
			sessionStorage.setItem("playerId", generatedPlayerId);

			// Add the new player to the list
			setPlayers((prev) => [
				...prev,
				{
					id: generatedPlayerId,
					name,
					avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
				},
			]);

			return true;
		} catch (err) {
			console.error("Error joining quiz:", err);
			setError(err instanceof Error ? err.message : "Failed to join quiz");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	// Function to start the quiz (for hosts)
	const startQuiz = async (): Promise<boolean> => {
		if (!currentQuiz) {
			setError("No quiz selected");
			return false;
		}

		setIsLoading(true);
		setError(null);

		try {
			// In a real app, this would be an API call to start the quiz
			// For now, we'll simulate it with a delay
			await new Promise((resolve) => setTimeout(resolve, 1000));

			setCurrentQuiz((prev) =>
				prev
					? {
							...prev,
							status: "LIVE",
							currentQn: 0,
							startedAt: new Date(),
						}
					: null,
			);

			setCurrentQuestion(0);
			return true;
		} catch (err) {
			console.error("Error starting quiz:", err);
			setError(err instanceof Error ? err.message : "Failed to start quiz");
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	// Function to submit an answer to a question
	const answerQuestion = async (questionId: string, answerIndex: number): Promise<void> => {
		if (!currentQuiz || !playerId || !questions) {
			setError("No quiz, questions, or player selected");
			return;
		}

		try {
			// In a real app, this would be an API call to submit the answer
			// For now, we'll simulate it with a delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			console.log(
				`Player ${playerId} answered question ${questionId} with option ${answerIndex}`,
			);

			// Additional logic for handling the answer would go here
		} catch (err) {
			console.error("Error submitting answer:", err);
			setError(err instanceof Error ? err.message : "Failed to submit answer");
		}
	};

	// Function to move to the next question (for hosts)
	const nextQuestion = async (): Promise<void> => {
		if (!currentQuiz || !questions) {
			setError("No quiz or questions selected");
			return;
		}

		try {
			// In a real app, this would be an API call to advance the quiz
			// For now, we'll simulate it with a delay
			await new Promise((resolve) => setTimeout(resolve, 500));

			const nextIndex = (currentQuestion !== null ? currentQuestion : -1) + 1;

			// Check if we've reached the end of the quiz
			if (nextIndex >= questions.length) {
				setCurrentQuiz((prev) =>
					prev
						? {
								...prev,
								status: "COMPLETED" as Quiz["status"],
								endedAt: new Date(),
							}
						: null,
				);
				return;
			}

			setCurrentQuestion(nextIndex);
			setCurrentQuiz((prev) =>
				prev
					? {
							...prev,
							currentQn: nextIndex,
						}
					: null,
			);
		} catch (err) {
			console.error("Error advancing to next question:", err);
			setError(err instanceof Error ? err.message : "Failed to advance to next question");
		}
	};

	// Create the context value
	const value = {
		currentQuiz,
		gamePin,
		players,
		isLoading,
		error,
		questions,
		currentQuestion,
		playerName,
		playerId,
		setGamePin,
		setPlayerName,
		fetchQuizByPin,
		fetchQuizById,
		fetchQuestions,
		joinQuiz,
		startQuiz,
		answerQuestion,
		nextQuestion,
	};

	return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

// Custom hook to use the quiz context
export function useQuiz() {
	const context = useContext(QuizContext);

	if (context === undefined) {
		throw new Error("useQuiz must be used within a QuizProvider");
	}

	return context;
}
