import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { Message, messageValidator } from "@/lib/validations/message";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export const POST = async (req: Request) => {
  try {
    const { text, chatId }: { text: string; chatId: string } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const [userId1, userId2] = chatId.split("--");
    const otherId = session.user.id === userId1 ? userId2 : userId1;
    const friendsList = await db.smembers(`user:${session.user.id}:friends`);
    if (
      (session.user.id !== userId1 && session.user.id !== userId2) ||
      !friendsList.includes(otherId)
    ) {
      return new Response("Unauthorized", { status: 401 });
    }
    const sender = (await db.get(`user:${session.user.id}`)) as DBUser;
    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      senderId: sender.id,
      text,
      timestamp,
    };
    const message = messageValidator.parse(messageData);
    // send the message
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });
    //all valid, proceed
    await Promise.all([
      // notify clients
      pusherServer.trigger(
        toPusherKey(`user:${otherId}:chats`),
        "user-new-message",
        { ...message, senderImage: sender.image, senderName: sender.name }
      ),
      // update chat window
      pusherServer.trigger(
        toPusherKey(`chat:${chatId}`),
        "chat-new-message",
        message
      ),
    ]);
    return new Response("OK");
  } catch (error) {
    if (error instanceof Error) {
      return new Response(error.message, { status: 500 });
    }
    return new Response("Internal Server Error", { status: 500 });
  }
};
