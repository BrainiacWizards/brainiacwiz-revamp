import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// Get all questions for a quiz
export async function GET(request: NextRequest, { params }: { params: { quizId: string } }) {
	const { quizId } = params;

	try {
		// Validate quiz exists
		const quiz = await prisma.quiz.findUnique({
			where: { id: quizId },
			select: { id: true },
		});

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		// Get questions ordered by their order field
		const questions = await prisma.question.findMany({
			where: { quizId },
			orderBy: { order: "asc" },
		});

		return NextResponse.json({
			questions,
			count: questions.length,
		});
	} catch (error) {
		console.error(`Error fetching questions for quiz ${quizId}:`, error);
		return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
	}
}

// Add a new question to a quiz
export async function POST(request: NextRequest, { params }: { params: { quizId: string } }) {
	const { quizId } = params;

	try {
		// Get authenticated user
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Verify quiz exists and user is the host
		const quiz = await prisma.quiz.findUnique({
			where: { id: quizId },
			select: { hostId: true },
		});

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		// Verify user is the host
		if (quiz.hostId !== currentUser.id) {
			return NextResponse.json({ error: "Only the host can add questions" }, { status: 403 });
		}

		// Parse the request body
		const body = await request.json();
		const { text, options, correctIdx } = body;

		// Validate the question
		if (!text || !options || !Array.isArray(options) || options.length < 2) {
			return NextResponse.json(
				{ error: "Question must have text and at least 2 options" },
				{ status: 400 },
			);
		}

		if (correctIdx === undefined || correctIdx < 0 || correctIdx >= options.length) {
			return NextResponse.json({ error: "Invalid correct answer index" }, { status: 400 });
		}

		// Get the current highest order
		const highestOrder = await prisma.question.findFirst({
			where: { quizId },
			orderBy: { order: "desc" },
			select: { order: true },
		});

		const order = highestOrder ? highestOrder.order + 1 : 0;

		// Create the new question
		const question = await prisma.question.create({
			data: {
				quizId,
				text,
				options,
				correctIdx,
				order,
			},
		});

		// Update the quiz total questions count
		await prisma.quiz.update({
			where: { id: quizId },
			data: { totalQns: { increment: 1 } },
		});

		return NextResponse.json({
			message: "Question added successfully",
			question,
		});
	} catch (error) {
		console.error(`Error adding question to quiz ${quizId}:`, error);
		return NextResponse.json({ error: "Failed to add question" }, { status: 500 });
	}
}

// Update the order of questions
export async function PATCH(request: NextRequest, { params }: { params: { quizId: string } }) {
	const { quizId } = params;

	try {
		// Get authenticated user
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Verify quiz exists and user is the host
		const quiz = await prisma.quiz.findUnique({
			where: { id: quizId },
			select: { hostId: true },
		});

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		// Verify user is the host
		if (quiz.hostId !== currentUser.id) {
			return NextResponse.json(
				{ error: "Only the host can reorder questions" },
				{ status: 403 },
			);
		}

		// Parse the request body
		const body = await request.json();
		const { questionOrder } = body;

		// Validate questionOrder is an array of question IDs
		if (!Array.isArray(questionOrder)) {
			return NextResponse.json(
				{ error: "Question order must be an array of question IDs" },
				{ status: 400 },
			);
		}

		// Update the order of each question in a transaction
		await prisma.$transaction(
			questionOrder.map((questionId, index) =>
				prisma.question.update({
					where: { id: questionId, quizId },
					data: { order: index },
				}),
			),
		);

		// Get the updated questions
		const questions = await prisma.question.findMany({
			where: { quizId },
			orderBy: { order: "asc" },
		});

		return NextResponse.json({
			message: "Question order updated successfully",
			questions,
		});
	} catch (error) {
		console.error(`Error reordering questions for quiz ${quizId}:`, error);
		return NextResponse.json({ error: "Failed to reorder questions" }, { status: 500 });
	}
}
