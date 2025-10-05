// page for a game host to create a new quiz game with all the settings
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const CreateGamePage = () => {
	const [quizTitle, setQuizTitle] = useState("");
	const [numQuestions, setNumQuestions] = useState(10);
	const [timePerQuestion, setTimePerQuestion] = useState(30);
	const router = useRouter();

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Here you would typically send this data to your backend to create the game
		console.log("Creating game with settings:", {
			quizTitle,
			numQuestions,
			timePerQuestion,
		});
		// Redirect to the host quiz management page after creation
		router.push("/host/quiz");
	};

	return (
		<div>
			<h1>Create a New Quiz Game</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label>Quiz Title:</label>
					<input
						type="text"
						value={quizTitle}
						onChange={(e) => setQuizTitle(e.target.value)}
						required
					/>
				</div>
				<div>
					<label>Number of Questions:</label>
					<input
						type="number"
						value={numQuestions}
						onChange={(e) => setNumQuestions(Number(e.target.value))}
						min={1}
						required
					/>
				</div>
				<div>
					<label>Time per Question (seconds):</label>
					<input
						type="number"
						value={timePerQuestion}
						onChange={(e) => setTimePerQuestion(Number(e.target.value))}
						min={5}
						required
					/>
				</div>
				<button type="submit">Create Game</button>
			</form>
		</div>
	);
};

export default CreateGamePage;
