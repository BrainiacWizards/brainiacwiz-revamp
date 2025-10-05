import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// Get a specific question
export async function GET(
	request: NextRequest,
	{ params }: { params: { quizId: string; id: string } },
) {
	const { quizId, id } = params;

	try {
		// Find the question
		const question = await prisma.question.findUnique({
			where: { id, quizId },
		});

		if (!question) {
			return NextResponse.json({ error: "Question not found" }, { status: 404 });
		}

		return NextResponse.json(question);
	} catch (error) {
		console.error(`Error fetching question ${id}:`, error);
		return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
	}
}

// Update a question
export async function PUT(
	request: NextRequest,
	{ params }: { params: { quizId: string; id: string } },
) {
	const { quizId, id } = params;

	try {
		// Get authenticated user
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Verify the question exists in this quiz
		const question = await prisma.question.findUnique({
			where: { id, quizId },
			select: { id: true },
		});

		if (!question) {
			return NextResponse.json({ error: "Question not found" }, { status: 404 });
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
				{ error: "Only the host can update questions" },
				{ status: 403 },
			);
		}

		// Parse the request body
		const body = await request.json();
		const { text, options, correctIdx } = body;

		// Validate the updated question
		if (
			options &&
			correctIdx !== undefined &&
			(correctIdx < 0 || correctIdx >= options.length)
		) {
			return NextResponse.json({ error: "Invalid correct answer index" }, { status: 400 });
		}

		// Update the question
		const updatedQuestion = await prisma.question.update({
			where: { id, quizId },
			data: {
				...(text !== undefined && { text }),
				...(options !== undefined && { options }),
				...(correctIdx !== undefined && { correctIdx }),
			},
		});

		return NextResponse.json({
			message: "Question updated successfully",
			question: updatedQuestion,
		});
	} catch (error) {
		console.error(`Error updating question ${id}:`, error);
		return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
	}
}

// Delete a question
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { quizId: string; id: string } },
) {
	const { quizId, id } = params;

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
				{ error: "Only the host can delete questions" },
				{ status: 403 },
			);
		}

		// Get the question to check its order
		const question = await prisma.question.findUnique({
			where: { id, quizId },
			select: { order: true },
		});

		if (!question) {
			return NextResponse.json({ error: "Question not found" }, { status: 404 });
		}

		// Use a transaction to delete the question and update the quiz
		await prisma.$transaction(async (tx) => {
			// Delete the question
			await tx.question.delete({
				where: { id, quizId },
			});

			// Update the quiz total questions count
			await tx.quiz.update({
				where: { id: quizId },
				data: { totalQns: { decrement: 1 } },
			});

			// Reorder the remaining questions to keep order consistent
			const remainingQuestions = await tx.question.findMany({
				where: {
					quizId,
					order: {
						gt: question.order,
					},
				},
				orderBy: { order: "asc" },
			});

			for (let i = 0; i < remainingQuestions.length; i++) {
				await tx.question.update({
					where: { id: remainingQuestions[i].id },
					data: { order: question.order + i },
				});
			}
		});

		return NextResponse.json({
			message: "Question deleted successfully",
		});
	} catch (error) {
		console.error(`Error deleting question ${id}:`, error);
		return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
	}
}
