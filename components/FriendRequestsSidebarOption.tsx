"use client";

import { FC, useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";

export interface FriendRequestsSidebarOptionProps {
  sessionId: string;
  initialUnseenRequestCount: number;
}

const FriendRequestsSidebarOption: FC<FriendRequestsSidebarOptionProps> = ({
  sessionId,
  initialUnseenRequestCount,
}: FriendRequestsSidebarOptionProps) => {
  const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
    initialUnseenRequestCount
  );
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

export default FriendRequestsSidebarOption;
