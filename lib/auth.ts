// Simulated authentication functions for development purposes
// In a real app, these would use Clerk's authentication

// Mock user data
const MOCK_USERS = [
	{
		id: "user_1",
		clerkId: "user_clerk_1",
		email: "demo@brainiacwiz.com",
		name: "Demo User",
		wallet: "0x1234567890abcdef1234567890abcdef12345678",
	},
	{
		id: "user_2",
		clerkId: "user_clerk_2",
		email: "host@brainiacwiz.com",
		name: "Quiz Host",
		wallet: "0xabcdef1234567890abcdef1234567890abcdef12",
	},
];

export async function getCurrentUser() {
	// In a real app, this would check the Clerk session
	// For now, we'll just return a mock user
	// We default to the first mock user
	return MOCK_USERS[0];
}

export async function requireAuth() {
	const user = await getCurrentUser();

	if (!user) {
		throw new Error("Authentication required");
	}

	return user;
}

// Function to find or create a user record in the database
export async function getOrCreateDbUser(user: any) {
	// In a real app, this would use Prisma to find or create a user
	// For now, we'll just return the mock user data
	return {
		id: user.id,
		clerkId: user.clerkId,
		email: user.email,
		name: user.name,
		wallet: user.wallet,
	};
}

// Function to get the user ID for database operations
export async function getUserId() {
	const user = await getCurrentUser();
	if (!user) {
		throw new Error("User not authenticated");
	}
	return user.id;
}
