// Inngest webhook stub. In production, this verifies the signing key and queues events.
export async function POST(req: Request) {
  // eslint-disable-next-line no-console
  console.log("[inngest] event received");
  return new Response("ok");
}