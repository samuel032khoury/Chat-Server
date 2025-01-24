import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import { getFriendsByUserId } from "@/app/dashboard/helpers";
import { db } from "@/lib/db";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { chatHrefConstructor } from "@/lib/utils";
import {cookies} from "next/headers";

const Dashboard = async () => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  const friends = await getFriendsByUserId(session.user.id);
  const friendsWithLastMessage = await Promise.all(
    friends.map(async (friend) => {
      const [lastMessage] = (await db.zrange(
        `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`,
        -1,
        -1
      )) as Message[];
      return {
        ...friend,
        lastMessage,
      };
    })
  );
  return (
    <div className={"container py-12"}>
      <h1 className={"font-bold text-5xl mb-8"}>Recent chats</h1>
      {friendsWithLastMessage.length === 0 ? (
        <p className={"text-sm text-zinc-500"}>Nothing to show here...</p>
      ) : (
        friendsWithLastMessage.map((friend) => (
          <div
            key={friend.id}
            id={`${friend.id}-entry-item`}
            className="relative bg-zinc-50 dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-500 p-3 rounded-md"
          >
            <div className={"flex absolute right-4 inset-y-0 items-center"}>
              <ChevronRight className={"h-7 w-7 text-zinc-400"} />
            </div>

            <Link
              href={`/dashboard/chat/${chatHrefConstructor(
                session.user.id,
                friend.id
              )}`}
              className={"relative sm:flex"}
            >
              <div
                id={`${friend.id}-avatar-section`}
                className={"mb-4 flex-shrink-0 sm:mb-0 sm:mr-4"}
              >
                <div
                  id={`${friend.id}-avatar-container`}
                  className={"relative h-6 w-6"}
                >
                  <Image
                    src={friend.image}
                    alt={`${friend.name} avatar`}
                    className={"rounded-full"}
                    fill
                    sizes={"50vw"}
                    referrerPolicy={"no-referrer"}
                  />
                </div>
              </div>
              <div id={`${friend.id}-info-section`}>
                <h4 className={"text-lg font-semibold"}>{friend.name}</h4>
                <p className="mt-1 max-w-md">
                  <span className="text-zinc-400">
                    {friend.lastMessage.senderId === session.user.id
                      ? "You: "
                      : ""}
                    {friend.lastMessage.text}
                  </span>
                </p>
              </div>
            </Link>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
