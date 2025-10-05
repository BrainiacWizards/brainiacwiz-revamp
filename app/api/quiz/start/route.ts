import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// Start a quiz
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
			select: { hostId: true, status: true },
		});

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		// Verify user is the host
		if (quiz.hostId !== currentUser.id) {
			return NextResponse.json(
				{ error: "Only the host can start the quiz" },
				{ status: 403 },
			);
		}

		// Ensure quiz is in DRAFT status
		if (quiz.status !== "DRAFT") {
			return NextResponse.json(
				{
					error: "Cannot start a quiz that is already in progress or completed",
				},
				{ status: 400 },
			);
		}

		// Start the quiz
		const updatedQuiz = await prisma.quiz.update({
			where: { id: quizId },
			data: {
				status: "LIVE",
				currentQn: 0,
				startedAt: new Date(),
			},
		});

		return NextResponse.json({
			message: "Quiz started successfully",
			quiz: updatedQuiz,
		});
	} catch (error) {
		console.error("Error starting quiz:", error);
		return NextResponse.json({ error: "Failed to start quiz" }, { status: 500 });
	}
}
