import { MOCK_PLANS } from "@/lib/mock-data";

export async function GET() {
  return Response.json({ plans: MOCK_PLANS });
}