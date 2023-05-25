import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { messageHistoryValidator } from "@/lib/validations/message";
import Image from "next/image";
import Messages from "@/components/Messages";
import ChatInput from "@/components/ChatInput";

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
  const otherUser = (await db.get(`user:${otherId}`)) as DBUser;
  const messageHistory = await getMessageHistory(chatId);
  return (
    <div
      id={"chat-window"}
      className={
        "flex flex-1 flex-col h-full max-h-[calc(100vh-6rem)] justify-between"
      }
    >
      <div
        id={"top-bar"}
        className={
          "flex py-3 border-b-2 border-gray-200 sm:items-center justify-between dark:border-gray-700"
        }
      >
        <div
          id={"contact-section"}
          className={"relative flex items-center space-x-4"}
        >
          <div
            id={"contact-avatar"}
            className={"relative w-8 sm:w-12 h-8 sm:h-12"}
          >
            <Image
              src={otherUser.image}
              alt={`${otherUser.name} profile image`}
              fill
              sizes={"55vw"}
              referrerPolicy={"no-referrer"}
              className={"rounded-full"}
            />
          </div>
          <div id={"contact-info"} className={"flex flex-col leading-tight"}>
            <div id={"contact-title"} className={"flex text-xl items-center"}>
              <span
                id={"contact-name"}
                className={"mr-3 text-gray-700 font-semibold dark:text-white"}
              >
                {otherUser.name}
              </span>
            </div>
            <div
              id={"contact-subtitle"}
              className={"text-sm text-gray-600 dark:text-gray-300"}
            >
              <span id={"contact-email"}>{otherUser.email}</span>
            </div>
          </div>
        </div>
      </div>
      <Messages uid={session.user.id} messageHistory={messageHistory} />
      <ChatInput chatId={chatId} otherName={otherUser.name} />
    </div>
  );
};

export default Chat;
