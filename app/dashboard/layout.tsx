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

const DashboardLayout = async ({ children }: LayoutProps) => {
  const session: Session | null = await getServerSession(authOptions);
  const unseenRequestCount: number = (
    await db.smembers(`user:${session?.user.id}:incoming_friend_requests`)
  ).length;
  if (!session) notFound();
  return (
    <div id={"container"} className={"w-full flex h-screen"}>
      <div
        id={"sidebar"}
        className={
          "flex flex-1 flex-col h-full max-w-[22rem] grow gap-y-5 overflow-y-auto overflow-x-clip " +
          "border-r border-gray-200 bg-white px-6"
        }
      >
        <Link
          id={"home-btn"}
          href={"/dashboard"}
          className={"flex h-16 shrink-0 items-center"}
        >
          <Icons.Logo className={"h-8 w-auto text-indigo-600"} />
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
                className={"-mx-2 space-y-2"}
              >
                <FriendRequestsSidebarOption
                  sessionId={session.user.id}
                  initialUnseenRequestCount={unseenRequestCount}
                />
                {staticSidebarOptions.map((option) => {
                  const Icon = Icons[option.icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className={
                          "group flex text-sm text-gray-700 gap-3 p-2 leading-6 font-semibold " +
                          "rounded-md hover:text-indigo-600 hover:bg-gray-50"
                        }
                      >
                        <span
                          className={
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg " +
                            "text-[0.625rem] font-medium text-gray-400 border-gray-200 border " +
                            "group-hover:border-indigo-600 group-hover:text-indigo-600"
                          }
                        >
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
          <div id={"chat-list-section"} className={"space-y-4"}>
            <div
              id={"chat-list-label"}
              className={"text-xs font-semibold leading-6 text-gray-400"}
            >
              Your Chats
            </div>
            <nav id={"chat-nav"} className={"flex flex-1 flex-col"}>
              <ul
                id={"chat-list"}
                role={"list"}
                className={"space-y-5 overflow-x-clip whitespace-nowrap w-full"}
              >
                <li className={"truncate"}>## chats that this user has</li>
              </ul>
            </nav>
          </div>
        </div>
        <div id={"user-section"} className={"-mx-6 mt-auto flex items-center"}>
          <div
            id={"profile-handle"}
            className={
              "flex flex-1 gap-x-4 px-6 py-3 leading-6 items-center " +
              "text-sm font-semibold text-gray-900"
            }
          >
            <div className={"relative h-8 w-8 bg-gray-50"}>
              <Image
                src={session.user.image || ""}
                alt={"user profile picture"}
                className={"rounded-full"}
                fill={true}
                sizes={"50vw"}
                referrerPolicy={"no-referrer"}
              />
            </div>
            <span className={"sr-only"}>Your profile</span>
            <div className={"flex flex-col"}>
              <span aria-hidden={"true"}>{session.user.name}</span>
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
