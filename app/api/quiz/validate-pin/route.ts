import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		// Get current user (optional - not required for joining a quiz)
		const currentUser = await getCurrentUser();

		// Parse the request body to get the game pin
		const body = await request.json();
		const { gamePin } = body;

		// Validate request
		if (!gamePin) {
			return NextResponse.json({ error: "Game pin is required" }, { status: 400 });
		}

		// Check if the game pin is in the correct format (6 digits)
		if (!/^\d{6}$/.test(gamePin)) {
			return NextResponse.json(
				{ error: "Game pin must be a 6-digit number" },
				{ status: 400 },
			);
		}

		// Find quiz by game pin
		const quiz = await prisma.quiz.findFirst({
			where: {
				gamePin: gamePin,
				status: "LIVE", // Only allow joining active quizzes
			},
		});

		if (!quiz) {
			return NextResponse.json(
				{ error: "Quiz not found or no longer active" },
				{ status: 404 },
			);
		}

		// Create player session or record if needed
		// Note: In a real implementation, you might want to create a player session here

		// Return success with quiz ID
		return NextResponse.json({
			message: "Game pin validated successfully",
			quizId: quiz.id,
			// You might want to return additional data about the quiz here
		});
	} catch (error) {
		console.error("Error validating game pin:", error);

		return NextResponse.json(
			{ error: "An error occurred while validating the game pin" },
			{ status: 500 },
		);
	}
}
