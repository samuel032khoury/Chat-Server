import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Icon, Icons } from "@/components/Icons";
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";

interface LayoutProps {
  children: ReactNode;
}

interface SidebarOption {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const sidebarOptions: SidebarOption[] = [
  { id: 1, name: "Add friend", href: "/dashboard/add", Icon: "UserPlus" },
];

const DashboardLayout = async ({ children }: LayoutProps) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();
  return (
    <div id={"container"} className={"w-full flex h-screen"}>
      <div
        id={"sidebar"}
        className={
          "flex flex-1 flex-col h-full w-full max-w-xs grow gap-y-5 overflow-y-auto overflow-x-hidden " +
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
          className={"flex flex-1 flex-col overflow-y-scroll overflow-x-hidden"}
        >
          <div
            id={"chat-list-section"}
            className={"space-y-4 overflow-x-hidden"}
          >
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
                className={
                  "space-y-5 overflow-x-hidden whitespace-nowrap text-ellipsis"
                }
              >
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>
                  ## chats that this user has
                  longlonglonglonglonglonglonglonglonglonglong
                </li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
                <li>## chats that this user has</li>
              </ul>
            </nav>
          </div>
          <div id={"overview-section"} className={"space-y-4"}>
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
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className={
                          "group flex text-sm text-gray-700 gap-3 px-2 leading-6 font-semibold " +
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
        </div>
        <div id={"user-section"} className={"-mx-6 mt-auto flex items-center"}>
          <div
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
          <SignOutButton />
        </div>
      </div>
      {children}
    </div>
  );
};

export default DashboardLayout;
