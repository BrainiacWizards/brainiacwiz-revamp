import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";

// Update a question
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params;
		const user = await requireAuth();

		// Parse the request body
		const body = await request.json();
		const { text, options, correctIdx, order } = body;

		// Find the question and check if the user has permission
		const question = await prisma.question.findUnique({
			where: { id },
			include: {
				quiz: {
					select: { hostId: true },
				},
			},
		});

		if (!question) {
			return NextResponse.json({ error: "Question not found" }, { status: 404 });
		}

		// Verify user has permission (is the quiz host)
		if (question.quiz.hostId !== user.id) {
			return NextResponse.json(
				{ error: "You don't have permission to update this question" },
				{ status: 403 },
			);
		}

		// Update the question
		const updatedQuestion = await prisma.question.update({
			where: { id },
			data: {
				...(text !== undefined && { text }),
				...(options !== undefined && { options }),
				...(correctIdx !== undefined && { correctIdx }),
				...(order !== undefined && { order }),
			},
		});

		return NextResponse.json({
			message: "Question updated successfully",
			question: updatedQuestion,
		});
	} catch (error) {
		console.error(`Error updating question:`, error);
		return NextResponse.json({ error: "Failed to update question" }, { status: 500 });
	}
}

// Delete a question
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params;
		const user = await requireAuth();

		// Find the question and check if the user has permission
		const question = await prisma.question.findUnique({
			where: { id },
			include: {
				quiz: {
					select: { id: true, hostId: true },
				},
			},
		});

		if (!question) {
			return NextResponse.json({ error: "Question not found" }, { status: 404 });
		}

		// Verify user has permission (is the quiz host)
		if (question.quiz.hostId !== user.id) {
			return NextResponse.json(
				{ error: "You don't have permission to delete this question" },
				{ status: 403 },
			);
		}

		// Delete the question
		await prisma.question.delete({
			where: { id },
		});

		// Update the quiz's total questions count
		await prisma.quiz.update({
			where: { id: question.quiz.id },
			data: { totalQns: { decrement: 1 } },
		});

		// Reorder remaining questions to ensure continuous ordering
		const remainingQuestions = await prisma.question.findMany({
			where: {
				quizId: question.quizId,
				order: {
					gt: question.order,
				},
			},
			orderBy: { order: "asc" },
		});

		// Update the order of remaining questions
		for (let i = 0; i < remainingQuestions.length; i++) {
			await prisma.question.update({
				where: { id: remainingQuestions[i].id },
				data: { order: question.order + i },
			});
		}

		return NextResponse.json({
			message: "Question deleted successfully",
		});
	} catch (error) {
		console.error(`Error deleting question:`, error);
		return NextResponse.json({ error: "Failed to delete question" }, { status: 500 });
	}
}

// Get a specific question
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params;

		const question = await prisma.question.findUnique({
			where: { id },
		});

		if (!question) {
			return NextResponse.json({ error: "Question not found" }, { status: 404 });
		}

		return NextResponse.json(question);
	} catch (error) {
		console.error(`Error fetching question:`, error);
		return NextResponse.json({ error: "Failed to fetch question" }, { status: 500 });
	}
}
