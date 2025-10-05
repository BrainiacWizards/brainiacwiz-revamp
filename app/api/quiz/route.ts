import { NextRequest, NextResponse } from "next/server";
import { Difficulty, QuizStatus } from "@/lib/generated/prisma";

import prisma from "@/lib/prisma";
import { getCurrentUser, getOrCreateDbUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
	try {
		// Get current authenticated user
		const currentUser = await getCurrentUser();

		if (!currentUser) {
			return NextResponse.json({ error: "Authentication required" }, { status: 401 });
		}

		// Ensure user exists in our database
		const dbUser = await getOrCreateDbUser(currentUser);

		// Parse the request body
		const body = await request.json();
		const {
			title,
			description = "",
			questions,
			prize = 0,
			category = "general",
			difficulty = "EASY",
			timePerQn = 30,
			imageUrl = "",
		} = body;

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

		// Generate a random 6-digit game pin
		const gamePin = Math.floor(100000 + Math.random() * 900000).toString();

		// Create the quiz and its questions in a transaction
		const quiz = await prisma.$transaction(async (tx) => {
			// Create the quiz
			const newQuiz = await tx.quiz.create({
				data: {
					title,
					description,
					gamePin,
					hostId: dbUser.id,
					hostName: dbUser.name || "Quiz Host",
					status: "DRAFT",
					prize: parseFloat(prize.toString()),
					totalQns: questions.length,
					difficulty,
					timePerQn,
					category,
					imageUrl,
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

// Get all quizzes (with filtering options)
export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);

		// Extract filter parameters
		const hostId = searchParams.get("hostId");
		const status = searchParams.get("status") as QuizStatus | null;
		const difficulty = searchParams.get("difficulty") as Difficulty | null;
		const category = searchParams.get("category");
		const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10;
		const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0;

		// Build the query filters with proper type handling
		const where: any = {};

		if (hostId) where.hostId = hostId;
		if (status) where.status = status;
		if (difficulty) where.difficulty = difficulty;
		if (category) where.category = category;

		// Get count of matching quizzes
		const totalCount = await prisma.quiz.count({ where });

		// Get the quizzes with pagination
		const quizzes = await prisma.quiz.findMany({
			where,
			include: {
				host: {
					select: {
						name: true,
						email: true,
					},
				},
				_count: {
					select: {
						submissions: true,
					},
				},
			},
			orderBy: { createdAt: "desc" },
			skip: offset,
			take: limit,
		});

		return NextResponse.json({
			quizzes,
			pagination: {
				total: totalCount,
				offset,
				limit,
				hasMore: offset + quizzes.length < totalCount,
			},
		});
	} catch (error) {
		console.error("Error fetching quizzes:", error);

		return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
	}
}
