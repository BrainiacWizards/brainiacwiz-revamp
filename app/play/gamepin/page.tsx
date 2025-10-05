"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Input } from "@heroui/input";
import { Spinner } from "@heroui/spinner";
import { addToast } from "@heroui/toast";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { KeyRound, Shield, Lock, CheckCircle2, AlertCircle, Hash } from "lucide-react";
import { useQuiz } from "@/lib/contexts/quiz-context";

const GamePinPage = () => {
	// Use our quiz context
	const { fetchQuizByPin, isLoading, error } = useQuiz();

	const [localPin, setLocalPin] = useState("");
	const [isPinSecure, setIsPinSecure] = useState(false);
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!localPin) {
			addToast({
				title: "Error",
				description: "Please enter a game pin",
				color: "danger",
			});

			return;
		}

		try {
			// Use the context function to validate the pin
			await fetchQuizByPin(localPin);

			// Show success message
			addToast({
				title: "Success!",
				description: "Joining quiz lobby...",
				color: "success",
			});

			// Redirect to the lobby
			setTimeout(() => {
				router.push("/play/lobby");
			}, 1000);
		} catch (err) {
			console.error("Error handling game pin submission:", err);
		}
	};

	// Check pin security when it changes
	const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;

		setLocalPin(value);
		// Simple validation: consider pin "secure" if it's 6 digits
		setIsPinSecure(value.length === 6 && /^\d{6}$/.test(value));
	};

	return (
		<div className="flex items-center justify-center min-h-[80vh] px-4">
			<Card className="max-w-md w-full border-none shadow-xl backdrop-blur-sm bg-default-50/80">
				<CardHeader className="flex flex-col items-center gap-3 py-8">
					<div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2">
						<KeyRound className="text-primary" size={28} />
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
						Join Quiz
					</h1>
					<p className="text-default-500 text-center">
						Enter the secure game pin provided by your quiz host
					</p>
				</CardHeader>

				<CardBody className="px-8">
					<form className="flex flex-col gap-5" onSubmit={handleSubmit}>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label className="text-sm font-medium" htmlFor="gamePin">
									Secure Game Pin
								</label>
								<Tooltip content="Your connection is encrypted and secure">
									<div className="flex items-center gap-1 text-xs">
										<Lock className="text-success" size={12} />
										<span className="text-success">Secure connection</span>
									</div>
								</Tooltip>
							</div>

							<Input
								autoComplete="off"
								errorMessage={error || ""}
								id="gamePin"
								inputMode="numeric"
								isInvalid={!!error}
								label=""
								labelPlacement="outside"
								maxLength={6}
								pattern="[0-9]*"
								placeholder="Enter 6-digit game pin"
								size="lg"
								startContent={
									<div className="pointer-events-none flex items-center">
										<Hash className="text-default-400" size={18} />
									</div>
								}
								value={localPin}
								variant="bordered"
								onChange={handlePinChange}
							/>

							{/* Pin security indicator */}
							<div className="flex items-center gap-2 mt-1 h-5">
								{localPin.length > 0 && (
									<>
										{isPinSecure ? (
											<div className="flex items-center gap-2 text-xs text-success">
												<CheckCircle2 className="text-success" size={14} />
												<span>Valid pin format</span>
											</div>
										) : (
											<div className="flex items-center gap-2 text-xs text-warning">
												<AlertCircle className="text-warning" size={14} />
												<span>Pin must be exactly 6 digits</span>
											</div>
										)}
									</>
								)}
							</div>
						</div>
					</form>
				</CardBody>

				<div className="px-8 pb-3">
					<Divider className="my-2" />
					<div className="flex items-center justify-center gap-2 py-3">
						<Shield className="text-default-500" size={16} />
						<p className="text-xs text-default-500">
							BrainiacWiz uses secure encryption to protect your quiz session
						</p>
					</div>
				</div>

				<CardFooter className="justify-center pb-8 pt-2 px-8">
					<Button
						className="w-full font-medium"
						color="primary"
						disabled={!localPin || isLoading || !isPinSecure}
						isLoading={isLoading}
						size="lg"
						spinner={<Spinner color="current" size="sm" />}
						spinnerPlacement="start"
						startContent={!isLoading && <Lock className="text-white" size={18} />}
						onClick={handleSubmit}>
						{isLoading ? "Joining..." : "Join Secure Quiz"}
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
};

export default GamePinPage;
