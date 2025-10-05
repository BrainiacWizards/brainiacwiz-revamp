import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { quizId: string } }) {
	try {
		const quizId = params.quizId;

		const quiz = await prisma.quiz.findUnique({
			where: { id: quizId },
			include: {
				questions: {
					orderBy: { order: "asc" },
				},
				host: {
					select: {
						name: true,
					},
				},
			},
		});

		if (!quiz) {
			return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
		}

		return NextResponse.json(quiz);
	} catch (error) {
		console.error(`Error fetching quiz ${params.quizId}:`, error);
		return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
	}
}
