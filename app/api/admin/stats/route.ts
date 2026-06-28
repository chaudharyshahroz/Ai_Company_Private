import { getCurrentUser } from "@/lib/data";

// Demo admin stats — in production, aggregate from the DB.
export async function GET() {
  const user = await getCurrentUser();
  return Response.json({
    stats: {
      totalUsers: 524,
      newUsersToday: 12,
      activeSubscribers: 198,
      tasksRunToday: 1842,
      tasksRunThisMonth: 41209,
      mrr: 15842,
      arr: 190104,
      mau: 387,
      churnThisMonth: 9,
      avgTasksPerUser: 78,
      totalTokens: 42183729,
      growthDelta: 18.2,
    },
    isAdmin: user.role === "admin",
  });
}