import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, requireAuth } from "@/lib/auth";

// Create a new question
export async function POST(request: NextRequest) {
	try {
		// Ensure user is authenticated
		const user = await requireAuth();

		// Parse the request body
		const body = await request.json();
		const { quizId, text, options, correctIdx, order } = body;

		// Validation
		if (!quizId || !text || !Array.isArray(options) || correctIdx === undefined) {
			return NextResponse.json(
				{
					error: "Missing required fields: quizId, text, options array, and correctIdx required",
				},
				{ status: 400 },
			);
		}

		if (options.length < 2) {
			return NextResponse.json({ error: "At least 2 options are required" }, { status: 400 });
		}

		if (correctIdx < 0 || correctIdx >= options.length) {
			return NextResponse.json(
				{ error: "Correct answer index is out of range" },
				{ status: 400 },
			);
		}

		// Verify the quiz exists and user has permission
		const quiz = await prisma.quiz.findUnique({
			where: { id: quizId },
			select: { id: true, hostId: true },
		});

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		// Check if user owns the quiz (only hosts can add questions)
		if (quiz.hostId !== user.id) {
			return NextResponse.json(
				{ error: "You don't have permission to add questions to this quiz" },
				{ status: 403 },
			);
		}

		// Determine order if not provided
		let questionOrder = order;
		if (questionOrder === undefined) {
			const highestOrder = await prisma.question.findFirst({
				where: { quizId },
				orderBy: { order: "desc" },
				select: { order: true },
			});

			questionOrder = highestOrder ? highestOrder.order + 1 : 0;
		}

		// Create the question
		const question = await prisma.question.create({
			data: {
				quizId,
				text,
				options,
				correctIdx,
				order: questionOrder,
			},
		});

		// Update the quiz's total questions count
		await prisma.quiz.update({
			where: { id: quizId },
			data: { totalQns: { increment: 1 } },
		});

		return NextResponse.json({
			message: "Question created successfully",
			question,
		});
	} catch (error) {
		console.error("Error creating question:", error);
		return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
	}
}

// Get all questions (for admin purposes)
export async function GET() {
	try {
		// This endpoint should probably be restricted to admins
		const user = await requireAuth();

		const questions = await prisma.question.findMany({
			orderBy: { quizId: "asc" },
		});

		return NextResponse.json({
			questions,
			count: questions.length,
		});
	} catch (error) {
		console.error("Error fetching questions:", error);
		return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
	}
}
