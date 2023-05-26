import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id: uid } = z.object({ id: z.string() }).parse(body);
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    if (await db.sismember(`user:${session.user.id}:friends`, uid)) {
      return new Response("Already friended", { status: 400 });
    }

    if (
      !(await db.sismember(
        `user:${session.user.id}:incoming_friend_requests`,
        uid
      ))
    ) {
      return new Response("Invalid Operation", { status: 400 });
    }
    const [currUser, newFriend] = (await Promise.all([
      db.get(`user:${session.user.id}`),
      db.get(`user:${uid}`),
    ])) as [DBUser, DBUser];
    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${session.user.id}:friends`),
        "friend_added",
        { newFriend, resolvable: true }
      ),
      pusherServer.trigger(toPusherKey(`user:${uid}:friends`), "friend_added", {
        newFriend: currUser,
        resolvable: false,
      }),
      db.sadd(`user:${session.user.id}:friends`, uid),
      db.sadd(`user:${uid}:friends`, session.user.id),
      db.srem(`user:${session.user.id}:incoming_friend_requests`, uid),
      db.srem(`user:${uid}:incoming_friend_requests`, session.user.id),
      db.srem(`user:${session.user.id}:friend_requests_history`, uid),
      db.srem(`user:${uid}:friend_requests_history`, session.user.id),
    ]);
    return new Response("OK", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
