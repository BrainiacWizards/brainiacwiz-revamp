import { Question } from "@/lib/generated/prisma/wasm";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

export type iQuizCategory =
	| "All"
	| "Crypto"
	| "Blockchain"
	| "NFTs"
	| "DeFi"
	| "Gaming"
	| "Technology"
	| "Science"
	| "History"
	| "General";

export interface iPlayer {
	id: string;
	name: string;
	avatar: string;
}

export interface iQuiz {
	id: string;
	title: string;
	description?: string;
	hostName: string;
	gamePin: string;
	questions?: Question[];
	currentQuestion?: number;
	status: "NOT_STARTED" | "LIVE" | "PAUSED" | "ENDED";
	players?: iPlayer[];
}
