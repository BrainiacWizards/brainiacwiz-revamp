import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	try {
		const quiz = await prisma.quiz.findUnique({
			where: { id: id },
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
		console.error(`Error fetching quiz ${id}:`, error);

		return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 });
	}
}
