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
    <Link
      href={"/dashboard/requests"}
      className={
        "group flex items-center p-2 leading-6 gap-x-3 rounded-md " +
        "font-semibold text-sm text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
      }
    >
      <div
        className={
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white " +
          "border border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 " +
          "text-gray-400 text-[0.625rem] font-medium"
        }
      >
        <User className={"h-4 w-4"} />
      </div>
      <p className={"truncate"}>Friend requests</p>
      {unseenRequestCount > 0 ? (
        <div
          className={
            "flex w-5 h-5 justify-center items-center rounded-full text-xs text-white bg-indigo-600"
          }
        >
          {unseenRequestCount}
        </div>
      ) : null}
    </Link>
  );
};

export default FriendRequestsSidebarOption;
