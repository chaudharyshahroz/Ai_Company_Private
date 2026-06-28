import { getCurrentUser, listBoardReports } from "@/lib/data";

export async function GET() {
  const user = await getCurrentUser();
  const reports = await listBoardReports(user.id);
  return Response.json({ reports });
}