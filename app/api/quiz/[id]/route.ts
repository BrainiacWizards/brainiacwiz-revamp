import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;

	try {
		// Fetch the quiz with its questions, ordered by question order
		const quiz = await prisma.quiz.findUnique({
			where: { id },
			include: {
				host: {
					select: {
						id: true,
						name: true,
						email: true,
					},
				},
			},
		});

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		return NextResponse.json(quiz);
	} catch (error) {
		console.error(`Error fetching quiz ${id}:`, error);
		return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
	}
}

// Update a quiz
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;

	try {
		// Get authenticated user
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Get quiz to check ownership
		const quiz = await prisma.quiz.findUnique({
			where: { id },
			select: { hostId: true },
		});

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		// Verify ownership
		if (quiz.hostId !== currentUser.id) {
			return NextResponse.json(
				{ error: "You don't have permission to update this quiz" },
				{ status: 403 },
			);
		}

		// Parse request body
		const body = await request.json();

		// Fields that can be updated
		const {
			title,
			description,
			status,
			prize,
			timePerQn,
			difficulty,
			category,
			imageUrl,
			currentQn,
		} = body;

		// Update the quiz
		const updatedQuiz = await prisma.quiz.update({
			where: { id },
			data: {
				...(title !== undefined && { title }),
				...(description !== undefined && { description }),
				...(status !== undefined && { status }),
				...(prize !== undefined && { prize: parseFloat(prize) }),
				...(timePerQn !== undefined && { timePerQn: parseInt(timePerQn) }),
				...(difficulty !== undefined && { difficulty }),
				...(category !== undefined && { category }),
				...(imageUrl !== undefined && { imageUrl }),
				...(currentQn !== undefined && { currentQn: parseInt(currentQn) }),
			},
		});

		return NextResponse.json({
			message: "Quiz updated successfully",
			quiz: updatedQuiz,
		});
	} catch (error) {
		console.error(`Error updating quiz ${id}:`, error);
		return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 });
	}
}

// Delete a quiz
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
	const { id } = params;

	try {
		// Get authenticated user
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Get quiz to check ownership
		const quiz = await prisma.quiz.findUnique({
			where: { id },
			select: { hostId: true },
		});

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		// Verify ownership
		if (quiz.hostId !== currentUser.id) {
			return NextResponse.json(
				{ error: "You don't have permission to delete this quiz" },
				{ status: 403 },
			);
		}

		// Delete the quiz and related records in a transaction
		await prisma.$transaction([
			// Delete questions
			prisma.question.deleteMany({ where: { quizId: id } }),
			// Delete submissions
			prisma.submission.deleteMany({ where: { quizId: id } }),
			// Delete the quiz
			prisma.quiz.delete({ where: { id } }),
		]);

		return NextResponse.json({
			message: "Quiz deleted successfully",
		});
	} catch (error) {
		console.error(`Error deleting quiz ${id}:`, error);
		return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 });
	}
}
