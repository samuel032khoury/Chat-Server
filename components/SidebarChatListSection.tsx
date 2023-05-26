"use client";

import { FC, useEffect, useState } from "react";
import SidebarChatList from "@/components/SidebarChatList";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

interface SidebarChatListSectionProps {
  uid: UID;
  friends: DBUser[];
}

const SidebarChatListSection: FC<SidebarChatListSectionProps> = ({
  uid,
  friends,
}) => {
  const [friendList, setFriendList] = useState<DBUser[]>(friends);
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${uid}:friends`));
    const friendAddedHandler = ({ newFriend }: { newFriend: DBUser }) => {
      setFriendList((currentState) => [...currentState, newFriend]);
    };
    pusherClient.bind("friend_added", friendAddedHandler);
    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${uid}:friends`));
      pusherClient.unbind("friend_added", friendAddedHandler);
    };
  }, [uid]);

  return friendList.length > 0 ? (
    <div id={"chat-list-section"} className={"space-y-2"}>
      <div
        id={"chat-list-label"}
        className={"text-xs font-semibold leading-6 text-gray-400"}
      >
        Your Chats
      </div>
      <nav id={"chat-nav"} className={"flex flex-1 flex-col"}>
        <SidebarChatList uid={uid} friendList={friendList} />
      </nav>
    </div>
  ) : null;
};

export default SidebarChatListSection;
