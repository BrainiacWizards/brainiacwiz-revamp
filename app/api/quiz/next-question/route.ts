import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// Advance to the next question
export async function POST(request: NextRequest) {
	try {
		// Get authenticated user
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Parse the request body
		const body = await request.json();
		const { quizId } = body;

		if (!quizId) {
			return NextResponse.json({ error: "Quiz ID is required" }, { status: 400 });
		}

		// Verify the quiz exists and user is the host
		const quiz = await prisma.quiz.findUnique({
			where: { id: quizId },
			include: {
				questions: {
					orderBy: { order: "asc" },
				},
			},
		});

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		// Verify user is the host
		if (quiz.hostId !== currentUser.id) {
			return NextResponse.json(
				{ error: "Only the host can advance the quiz" },
				{ status: 403 },
			);
		}

		// Ensure quiz is in progress
		if (quiz.status !== "LIVE") {
			return NextResponse.json({ error: "Quiz is not in progress" }, { status: 400 });
		}

		// Calculate next question index
		const currentIndex = quiz.currentQn !== null ? quiz.currentQn : -1;
		const nextIndex = currentIndex + 1;

		// Check if we've reached the end of the quiz
		if (nextIndex >= quiz.questions.length) {
			// Complete the quiz
			const completedQuiz = await prisma.quiz.update({
				where: { id: quizId },
				data: {
					status: "COMPLETED",
					endedAt: new Date(),
				},
			});

			return NextResponse.json({
				message: "Quiz completed",
				quiz: completedQuiz,
				isComplete: true,
			});
		}

		// Advance to next question
		const updatedQuiz = await prisma.quiz.update({
			where: { id: quizId },
			data: {
				currentQn: nextIndex,
			},
		});

		return NextResponse.json({
			message: "Advanced to next question",
			quiz: updatedQuiz,
			currentQuestion: nextIndex,
			totalQuestions: quiz.questions.length,
			isComplete: false,
		});
	} catch (error) {
		console.error("Error advancing to next question:", error);
		return NextResponse.json({ error: "Failed to advance to next question" }, { status: 500 });
	}
}
