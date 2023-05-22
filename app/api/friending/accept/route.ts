import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id } = z.object({ id: z.string() }).parse(body);
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (await db.sismember(`user:${session.user.id}:friends`, id)) {
      return new Response("Already friended", { status: 400 });
    }

    if (
      !(await db.sismember(
        `user:${session.user.id}:incoming_friend_requests`,
        id
      ))
    ) {
      return new Response("Invalid Operation", { status: 400 });
    }
    await db.sadd(`user:${session.user.id}:friends`, id);
    await db.sadd(`user:${id}:friends`, session.user.id);
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, id);
    await db.srem(`user:${id}:incoming_friend_requests`, session.user.id);
    await db.srem(`user:${session.user.id}:friend_requests_history`, id);
    await db.srem(`user:${id}:friend_requests_history`, session.user.id);
    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
