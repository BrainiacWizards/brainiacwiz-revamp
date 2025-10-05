"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import { Pagination } from "@heroui/pagination";
import { FilterIcon, SearchIcon, SortIcon } from "@/components/icons";
import Link from "next/link";
import { iQuizCategory } from "@/types";
import { sampleQuizzes } from "@/lib/data";
import { Difficulty, Quiz } from "@/lib/generated/prisma";

// Sample quiz data (will be replaced with API call)

export default function GamesPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState<iQuizCategory>("All");
	const [sortOrder, setSortOrder] = useState<"newest" | "prize" | "players">("newest");
	const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "all">("all");
	const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>(sampleQuizzes);
	const [page, setPage] = useState(1);
	const rowsPerPage = 8;

	// Apply filters and sorting
	useEffect(() => {
		let result = [...sampleQuizzes];

		// Apply search filter
		if (searchQuery) {
			result = result.filter(
				(quiz) =>
					quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					(quiz.description &&
						quiz.description.toLowerCase().includes(searchQuery.toLowerCase())),
			);
		}

		// Apply category filter
		if (selectedCategory !== "All") {
			result = result.filter((quiz) => quiz.category === selectedCategory);
		}

		// Apply difficulty filter
		if (selectedDifficulty !== "all") {
			result = result.filter((quiz) => quiz.difficulty === selectedDifficulty);
		}

		// Apply sorting
		switch (sortOrder) {
			case "newest":
				result.sort(
					(a, b) =>
						new Date(b.createdAt || "").getTime() -
						new Date(a.createdAt || "").getTime(),
				);
				break;
			case "prize":
				result.sort((a, b) => b.prize - a.prize);
				break;
			case "players":
				result.sort((a, b) => b.totalPlayers - a.totalPlayers);
				break;
		}

		setFilteredQuizzes(result);
		setPage(1); // Reset to first page when filters change
	}, [searchQuery, selectedCategory, sortOrder, selectedDifficulty]);

	// Calculate pages
	const pages = Math.ceil(filteredQuizzes.length / rowsPerPage);
	const paginatedItems = filteredQuizzes.slice((page - 1) * rowsPerPage, page * rowsPerPage);

	// Get difficulty color
	const getDifficultyColor = (difficulty?: string) => {
		switch (difficulty) {
			case "easy":
				return "success";
			case "medium":
				return "warning";
			case "hard":
				return "danger";
			default:
				return "default";
		}
	};

	return (
		<section className="container mx-auto px-4 py-8">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col sm:flex-row justify-between items-center gap-4">
					<h1 className="text-4xl font-bold">Browse Quizzes</h1>

					<div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
						{/* Search Input */}
						<Input
							aria-label="Search quizzes"
							classNames={{
								base: "w-full sm:w-72",
								inputWrapper: "bg-default-100 h-10",
							}}
							placeholder="Search quizzes..."
							startContent={<SearchIcon className="text-base text-default-400" />}
							value={searchQuery}
							onValueChange={setSearchQuery}
						/>

						{/* Category Dropdown */}
						<Dropdown>
							<DropdownTrigger>
								<Button
									className="h-10"
									startContent={<FilterIcon className="text-base" />}
									variant="flat">
									{selectedCategory}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="Quiz Categories"
								selectedKeys={[selectedCategory]}
								onAction={(key) => setSelectedCategory(key as iQuizCategory)}>
								<DropdownItem key="All">All Categories</DropdownItem>
								<DropdownItem key="Crypto">Cryptocurrency</DropdownItem>
								<DropdownItem key="Blockchain">Blockchain</DropdownItem>
								<DropdownItem key="NFTs">NFTs</DropdownItem>
								<DropdownItem key="DeFi">DeFi</DropdownItem>
								<DropdownItem key="Gaming">Gaming</DropdownItem>
								<DropdownItem key="Technology">Technology</DropdownItem>
								<DropdownItem key="Science">Science</DropdownItem>
								<DropdownItem key="History">History</DropdownItem>
								<DropdownItem key="General">General Knowledge</DropdownItem>
							</DropdownMenu>
						</Dropdown>

						{/* Difficulty Dropdown */}
						<Dropdown>
							<DropdownTrigger>
								<Button className="h-10 capitalize" variant="flat">
									{selectedDifficulty === "all"
										? "All Difficulties"
										: selectedDifficulty}
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="Quiz Difficulty"
								selectedKeys={[selectedDifficulty]}
								onAction={(key) =>
									setSelectedDifficulty(key as Difficulty | "all")
								}>
								<DropdownItem key="all">All Difficulties</DropdownItem>
								<DropdownItem key="easy">Easy</DropdownItem>
								<DropdownItem key="medium">Medium</DropdownItem>
								<DropdownItem key="hard">Hard</DropdownItem>
							</DropdownMenu>
						</Dropdown>

						{/* Sort Dropdown */}
						<Dropdown>
							<DropdownTrigger>
								<Button
									className="h-10"
									startContent={<SortIcon className="text-base" />}
									variant="flat">
									Sort
								</Button>
							</DropdownTrigger>
							<DropdownMenu
								aria-label="Sort Options"
								selectedKeys={[sortOrder]}
								onAction={(key) =>
									setSortOrder(key as "newest" | "prize" | "players")
								}>
								<DropdownItem key="newest">Newest First</DropdownItem>
								<DropdownItem key="prize">Highest Prize</DropdownItem>
								<DropdownItem key="players">Most Players</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
				</div>

				{/* Results count */}
				<div className="text-default-500">
					Showing {filteredQuizzes.length}{" "}
					{filteredQuizzes.length === 1 ? "quiz" : "quizzes"}
					{selectedCategory !== "All" && ` in ${selectedCategory}`}
					{searchQuery && ` matching "${searchQuery}"`}
				</div>

				{/* Quiz cards grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8">
					{paginatedItems.length > 0 ? (
						paginatedItems.map((quiz) => (
							<Card
								key={quiz.id}
								className="h-full hover:scale-[1.02] transition-transform">
								<CardHeader className="p-0">
									<Image
										alt={quiz.title}
										className="object-cover h-48 max-h-48 w-full"
										height={300}
										src={quiz.imageUrl || ""}
										width={500}
									/>
								</CardHeader>
								<CardBody className="flex flex-col gap-2">
									<div className="flex justify-between items-start">
										<h3 className="font-bold text-xl">{quiz.title}</h3>
										<Chip
											className="capitalize"
											color={getDifficultyColor(quiz.difficulty)}
											size="sm"
											variant="flat">
											{quiz.difficulty || "All Levels"}
										</Chip>
									</div>
									<p className="text-default-500 line-clamp-2 text-sm">
										{quiz.description}
									</p>
									<div className="flex gap-2 mt-2">
										<Chip size="sm" variant="flat">
											{quiz.totalQns} questions
										</Chip>
										<Chip size="sm" variant="flat">
											{quiz.category}
										</Chip>
									</div>
								</CardBody>
								<Divider />
								<CardFooter className="flex justify-between items-center">
									<div className="flex flex-col">
										<span className="text-xs text-default-500">Prize pool</span>
										<span className="font-bold text-success">
											${quiz.prize} cUSD
										</span>
									</div>
									<Link href={`/play/gamepin?quizId=${quiz.id}`}>
										<Button color="primary" size="sm">
											Play Now
										</Button>
									</Link>
								</CardFooter>
							</Card>
						))
					) : (
						<div className="col-span-full text-center py-12">
							<p className="text-xl text-default-500">
								No quizzes found matching your criteria
							</p>
							<Button
								className="mt-4"
								color="primary"
								variant="flat"
								onPress={() => {
									setSearchQuery("");
									setSelectedCategory("All");
									setSelectedDifficulty("all");
								}}>
								Reset Filters
							</Button>
						</div>
					)}
				</div>

				{/* Pagination */}
				{pages > 1 && (
					<div className="flex justify-center my-8">
						<Pagination
							classNames={{
								cursor: "bg-primary",
							}}
							page={page}
							total={pages}
							onChange={setPage}
						/>
					</div>
				)}
			</div>
		</section>
	);
}
