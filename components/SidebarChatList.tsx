"use client";

import { ComponentProps, FC, useEffect, useState } from "react";
import { User } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import toast from "react-hot-toast";
import NewMessageBanner from "@/components/NewMessageBanner";

interface SidebarChatListProps extends ComponentProps<"ul"> {
  uid: UID;
  friendList: User[];
}

export interface BannerMessage extends Message {
  senderImage: string;
  senderName: string;
}

const SidebarChatList: FC<SidebarChatListProps> = ({
  uid,
  friendList,
  ...props
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${uid}:chats`));
    const bannerMessageHandler = (bannerMessage: BannerMessage) => {
      const shouldBanner =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(uid, bannerMessage.senderId)}`;
      if (!shouldBanner) return;

      toast.custom((t) => (
        <NewMessageBanner t={t} uid={uid} message={bannerMessage} />
      ));

      setUnseenMessages((currentState) => [...currentState, bannerMessage]);
    };
    pusherClient.bind("user-new-message", bannerMessageHandler);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${uid}:chats`));
      pusherClient.unbind("user-new-message", bannerMessageHandler);
    };
  }, [pathname, uid]);
  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((currentState) =>
        currentState.filter((msg) => !pathname.includes(msg.senderId))
      );
    }
  }, [pathname]);
  return (
    <ul
      id={"chat-list"}
      {...props}
      role={"list"}
      className={"space-y-3 w-full"}
    >
      {friendList.sort().map((friend) => {
        const unseenMessageCount = unseenMessages.filter(
          (unseenMsg) => unseenMsg.senderId === friend.id
        ).length;
        return (
          <li key={friend.id} className={"p-2"}>
            <Link
              href={`/dashboard/chat/${chatHrefConstructor(uid, friend.id)}`}
              className={"group  sidebar-item"}
              onClick={router.refresh}
            >
              <span className={"w-full truncate"}>{friend.name}</span>
              <span>
                {unseenMessageCount > 0 ? (
                  <div
                    className={
                      "dark:bg-amber-300 dark:text-gray-900 " +
                      "flex w-7 h-5 justify-center items-center rounded-full text-xs text-white bg-indigo-600 font-medium"
                    }
                  >
                    {unseenMessageCount}
                  </div>
                ) : null}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default SidebarChatList;
