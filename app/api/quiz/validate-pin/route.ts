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
				OR: [
					{ status: "LIVE" },
					{ status: "DRAFT" }, // Allow joining draft quizzes as well for lobby waiting
				],
			},
			select: {
				id: true,
				title: true,
				hostId: true,
				hostName: true,
				status: true,
			},
		});

		if (!quiz) {
			return NextResponse.json(
				{ error: "Quiz not found or no longer active" },
				{ status: 404 },
			);
		}

		// Return success with quiz ID
		return NextResponse.json({
			message: "Game pin validated successfully",
			quizId: quiz.id,
			quizTitle: quiz.title,
			hostName: quiz.hostName,
			status: quiz.status,
		});
	} catch (error) {
		console.error("Error validating game pin:", error);

		return NextResponse.json(
			{ error: "An error occurred while validating the game pin" },
			{ status: 500 },
		);
	}
}
