import { ReactNode } from "react";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon, Icons } from "@/components/Icons";
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";
import FriendRequestsSidebarOption from "@/components/FriendRequestsSidebarOption";
import { db } from "@/lib/db";
import SidebarChatList from "@/components/SidebarChatList";

interface LayoutProps {
  children: ReactNode;
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  icon: Icon;
}

const staticSidebarOptions: SidebarOption[] = [
  { id: 1, name: "Add friends", href: "/dashboard/add", icon: "UserPlus" },
];

const getFriendsByUserId = async (id: UID) => {
  const friendsIds = (await db.smembers(`user:${id}:friends`)) as string[];
  return await Promise.all(
    friendsIds.map(
      async (friendId) => (await db.get(`user:${friendId}`)) as DBUser
    )
  );
};
const DashboardLayout = async ({ children }: LayoutProps) => {
  const session: Session | null = await getServerSession(authOptions);
  if (!session) notFound();
  const unseenRequestCount: number = (
    await db.smembers(`user:${session.user.id}:incoming_friend_requests`)
  ).length;
  const friends = await getFriendsByUserId(session.user.id);
  return (
    <div id={"container"} className={"w-full flex h-screen dark:bg-[#121517]"}>
      <div
        id={"sidebar"}
        className={
          "flex flex-1 flex-col h-full max-w-[22rem] grow gap-y-5 overflow-y-auto overflow-x-clip " +
          "border-r border-gray-200 bg-white px-6 dark:bg-[#1b2023] dark:border-neutral-600"
        }
      >
        <Link
          id={"logo"}
          href={"/dashboard"}
          className={"flex h-16 shrink-0 items-center"}
        >
          <Icons.Logo
            className={"h-8 w-auto text-indigo-600 dark:text-indigo-50"}
          />
        </Link>
        <div
          id={"scrollable-section"}
          className={"flex flex-1 flex-col overflow-y-scroll space-y-4"}
        >
          <div id={"overview-section"} className={"space-y-4 overflow-x-clip"}>
            <div
              id={"overview-label"}
              className={"text-xs font-semibold leading-6 text-gray-400 mt-3"}
            >
              Overview
            </div>
            <nav id={"sidebar-option-nav"} className={"flex flex-1 flex-col"}>
              <ul
                id={"sidebar-option-list"}
                role={"list"}
                className={"-px-2 space-y-2"}
              >
                <FriendRequestsSidebarOption
                  sessionId={session.user.id}
                  initialUnseenRequestCount={unseenRequestCount}
                />
                {staticSidebarOptions.map((option) => {
                  const Icon = Icons[option.icon];
                  return (
                    <li key={option.id}>
                      <Link href={option.href} className={"group sidebar-item"}>
                        <span className={"sidebar-icon"}>
                          <Icon className={"h-4 w-4"} />
                        </span>
                        <span className={"truncate"}>{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          {friends.length > 0 ? (
            <div id={"chat-list-section"} className={"space-y-2"}>
              <div
                id={"chat-list-label"}
                className={"text-xs font-semibold leading-6 text-gray-400"}
              >
                Your Chats
              </div>
              <nav id={"chat-nav"} className={"flex flex-1 flex-col"}>
                <SidebarChatList
                  id={"chat-list"}
                  uid={session.user.id}
                  friends={friends}
                />
              </nav>
            </div>
          ) : null}
        </div>
        <div id={"user-section"} className={"-mx-6 mt-auto flex items-center"}>
          <div
            id={"profile-handle"}
            className={
              "flex flex-1 gap-x-4 px-6 py-3 leading-6 items-center " +
              "text-sm font-semibold text-gray-900"
            }
          >
            <div
              id={"profile-image"}
              className={"relative h-8 w-8 bg-gray-50 dark:bg-neutral-800"}
            >
              <Image
                src={session.user.image || ""}
                alt={"user profile picture"}
                className={"rounded-full"}
                fill={true}
                sizes={"50vw"}
                referrerPolicy={"no-referrer"}
              />
            </div>
            <span id={"sr-text"} className={"sr-only"}>
              Your profile
            </span>
            <div id={"profile-text"} className={"flex flex-col"}>
              <span aria-hidden={"true"} className={"dark:text-white"}>
                {session.user.name}
              </span>
              <span className={"text-xs text-zinc-400"} aria-hidden={"true"}>
                {session.user.email}
              </span>
            </div>
          </div>
          <SignOutButton className={"h-full aspect-square"} />
        </div>
      </div>
      {children}
    </div>
  );
};

export default DashboardLayout;
