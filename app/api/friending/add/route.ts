import { addFriendValidator } from "@/lib/validations/add-friend";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = addFriendValidator.parse(body.email);
    const uid: string | null = await db.get(
      `user:email:${email.toLowerCase()}`
    );
    const session = await getServerSession(authOptions);
    // Check valid session
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }
    const sessionUID = session.user.id;
    // Check user existence
    if (!uid) {
      return new Response("This user doesn't exist!", { status: 400 });
    }
    // Check user is other
    if (uid === sessionUID) {
      return new Response("You cannot add yourself as a friend!", {
        status: 400,
      });
    }
    // Check request history
    if (
      await db.sismember(`user:${uid}:incoming_friend_requests`, sessionUID)
    ) {
      return new Response("A friending request had been sent earlier!", {
        status: 400,
      });
    }
    // Check friends list
    if (await db.sismember(`user:${sessionUID}:friends`, uid)) {
      return new Response("This user is already your friend!", {
        status: 400,
      });
    }
    // valid request, send friend request
    await Promise.all([
      pusherServer.trigger(
        toPusherKey(`user:${uid}:incoming_friend_requests`),
        "incoming_friend_requests",
        {
          senderId: sessionUID,
          senderEmail: session.user.email,
        }
      ),
      db.sadd(`user:${uid}:incoming_friend_requests`, sessionUID),
      db.sadd(`user:${sessionUID}:friend_requests_history`, uid),
    ]);
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 });
    }
    return new Response("Invalid request", { status: 400 });
  }
}
