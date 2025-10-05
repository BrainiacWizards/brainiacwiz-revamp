import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser, getOrCreateDbUser } from "@/lib/auth";
import { Prisma } from "@/app/generated/prisma";

export async function POST(request: Request) {
	try {
		// Get current authenticated user
		const authUser = await getCurrentUser();
		if (!authUser) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Ensure user exists in our database
		const dbUser = await getOrCreateDbUser(authUser);

		// Parse the request body
		const body = await request.json();
		const { title, questions, prizePool } = body;

		// Validation
		if (!title) {
			return NextResponse.json({ error: "Quiz title is required" }, { status: 400 });
		}

		if (!questions || !Array.isArray(questions) || questions.length === 0) {
			return NextResponse.json(
				{ error: "At least one question is required" },
				{ status: 400 },
			);
		}

		for (const q of questions) {
			if (!q.text || !q.options || q.options.length < 2 || q.correctIdx === undefined) {
				return NextResponse.json(
					{
						error: "Each question must have text, at least 2 options, and a correct answer index",
					},
					{ status: 400 },
				);
			}
		}

		// Create the quiz and its questions in a transaction
		const quiz = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
			// Create the quiz
			const newQuiz = await tx.quiz.create({
				data: {
					title,
					prizePool: prizePool || 0,
					hostId: dbUser.id,
					status: "DRAFT",
				},
			});

			// Add questions
			for (let i = 0; i < questions.length; i++) {
				const q = questions[i];
				await tx.question.create({
					data: {
						quizId: newQuiz.id,
						text: q.text,
						options: q.options,
						correctIdx: q.correctIdx,
						order: i,
					},
				});
			}

			return tx.quiz.findUnique({
				where: { id: newQuiz.id },
				include: {
					questions: {
						orderBy: { order: "asc" },
					},
				},
			});
		});

		return NextResponse.json({
			message: "Quiz created successfully",
			quiz,
		});
	} catch (error) {
		console.error("Error creating quiz:", error);
		return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
	}
}

// Get all quizzes (for admin or development purposes)
export async function GET() {
	try {
		const quizzes = await prisma.quiz.findMany({
			include: {
				questions: true,
				host: {
					select: {
						name: true,
						email: true,
					},
				},
			},
		});

		return NextResponse.json(quizzes);
	} catch (error) {
		console.error("Error fetching quizzes:", error);
		return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
	}
}
