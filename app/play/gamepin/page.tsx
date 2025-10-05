"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";

const GamePinPage = () => {
	const [gamePin, setGamePin] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!gamePin) {
			setError("Please enter a game pin");

			return;
		}

		setIsLoading(true);
		setError("");

		try {
			// Make API call to validate the game pin
			const response = await fetch(`/api/quiz/validate-pin`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ gamePin }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Failed to validate game pin");
			}

			// Show success message
			addToast({
				title: "Success!",
				description: "Joining quiz lobby...",
				color: "success",
			});

			// Redirect to the lobby with the quiz ID
			setTimeout(() => {
				router.push(`/play/lobby?quizId=${data.quizId}&gamePin=${gamePin}`);
			}, 1000);
		} catch (err) {
			console.error("Error validating game pin:", err);
			setError(err instanceof Error ? err.message : "Failed to validate game pin");
			addToast({
				title: "Error",
				description: err instanceof Error ? err.message : "Failed to validate game pin",
				color: "danger",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-[80vh] px-4">
			<Card className="max-w-md w-full border-none shadow-md">
				<CardHeader className="flex flex-col items-center gap-2 py-6">
					<h1 className="text-3xl font-bold">Join Quiz</h1>
					<p className="text-default-500 text-center">
						Enter the game pin provided by your quiz host
					</p>
				</CardHeader>

				<CardBody>
					<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
						<Input
							autoComplete="off"
							errorMessage={error}
							inputMode="numeric"
							isInvalid={!!error}
							label="Game Pin"
							labelPlacement="outside"
							maxLength={6}
							pattern="[0-9]*"
							placeholder="Enter 6-digit game pin"
							size="lg"
							startContent={
								<div className="pointer-events-none flex items-center">
									<span className="text-default-400 text-small">#</span>
								</div>
							}
							value={gamePin}
							variant="bordered"
							onChange={(e) => setGamePin(e.target.value)}
						/>
					</form>
				</CardBody>

				<CardFooter className="justify-center py-6">
					<Button
						className="w-full font-medium"
						color="primary"
						disabled={!gamePin || isLoading}
						isLoading={isLoading}
						size="lg"
						spinner={<Spinner color="current" size="sm" />}
						spinnerPlacement="start"
						onClick={handleSubmit}>
						{isLoading ? "Joining..." : "Join Quiz"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default GamePinPage;
