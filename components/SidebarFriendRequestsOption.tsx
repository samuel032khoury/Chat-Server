"use client";

import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export interface SidebarFriendRequestsOptionProps {
  uid: string;
  initialUnseenRequestCount: number;
}

const SidebarFriendRequestsOption: FC<SidebarFriendRequestsOptionProps> = ({
  uid,
  initialUnseenRequestCount,
}: SidebarFriendRequestsOptionProps) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  );
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${uid}:incoming_friend_requests`));
    pusherClient.subscribe(toPusherKey(`user:${uid}:friends`));
    const newFriendRequestHandler = () => {
      setUnseenRequestCount((currentState) => currentState + 1);
    };
    const friendRequestResolvedHandler = ({
      resolvable,
    }: {
      resolvable: boolean;
    }) => {
      if (resolvable) setUnseenRequestCount((currentState) => currentState - 1);
    };
    pusherClient.bind("incoming_friend_requests", newFriendRequestHandler);
    pusherClient.bind("friend_added", friendRequestResolvedHandler);
    pusherClient.bind("request_voided", friendRequestResolvedHandler);
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${uid}:incoming_friend_requests`)
      );
      pusherClient.unsubscribe(toPusherKey(`user:${uid}:friends`));
      pusherClient.unbind("incoming_friend_requests", newFriendRequestHandler);
      pusherClient.unbind("friend_added", friendRequestResolvedHandler);
      pusherClient.unbind("request_voided", friendRequestResolvedHandler);
    };
  }, [uid]);
  return (
    <li key={"friend-request-sidebar-option"}>
      <Link href={"/dashboard/requests"} className={"group sidebar-item"}>
        <span className={"sidebar-icon"}>
          <User className={"h-4 w-4"} />
        </span>
        <span className={"truncate"}>Friends requests</span>
        {unseenRequestCount > 0 ? (
          <span
            className={
              "dark:bg-amber-300 dark:text-gray-900 " +
              "flex w-5 h-5 justify-center items-center rounded-full text-xs text-white bg-indigo-600"
            }
          >
            {unseenRequestCount}
          </span>
        ) : null}
      </Link>
    </li>
  );
};

export default SidebarFriendRequestsOption;
