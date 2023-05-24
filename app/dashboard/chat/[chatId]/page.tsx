import { getServerSession, User } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { messageHistoryValidator } from "@/lib/validations/message";

interface PageProps {
  params: {
    chatId: string;
  };
}

const getMessageHistory = async (chatId: string) => {
  try {
    const response: string[] = await db.zrange(
      `chat:${chatId}:messages`,
      0,
      -1
    );
    const messageHistory = response
      .map((entry) => JSON.parse(entry) as Message)
      .reverse();
    return messageHistoryValidator.parse(messageHistory);
  } catch (error) {
    notFound();
  }
};
const Chat = async ({ params }: PageProps) => {
  const { chatId } = params;
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const { user } = session;

  const [userId1, userId2] = chatId.split("--");
  if (user.id !== userId1 && user.id !== userId2) notFound();
  const otherId = user.id === userId1 ? userId2 : userId1;
  const otherUser = (await db.get(`user:${otherId}`)) as User;
  const messageHistory = await getMessageHistory(chatId);
  return <div>Message Window</div>;
};

export default Chat;
