import { FC } from "react";
import { chatHrefConstructor, cn } from "@/lib/utils";
import toast, { Toast } from "react-hot-toast";
import Link from "next/link";
import { BannerMessage } from "@/components/SidebarChatList";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface NewMessageBannerProps {
  t: Toast;
  uid: string;
  message: BannerMessage;
}

const NewMessageBanner: FC<NewMessageBannerProps> = ({ t, uid, message }) => {
  const router = useRouter();
  return (
    <div
      id={"banner"}
      className={cn(
        "max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black",
        "dark:bg-gray-700 dark:ring-gray-300",
        { "animate-enter": t.visible, "animate-leave": !t.visible }
      )}
    >
      <Link
        className={"flex-1 w-0 p-4"}
        href={`/dashboard/chat/${chatHrefConstructor(uid, message.senderId)}`}
        onClick={() => {
          toast.dismiss(t.id);
          router.refresh();
        }}
      >
        <div id={"banner-content"} className={"flex items-start"}>
          <div id={"banner-image-container"} className={"flex-shrink-0 pt-0.5"}>
            <div id={"banner-image-frame"} className={"relative h-10 w-10"}>
              <Image
                fill
                sizes={"55vw"}
                referrerPolicy={"no-referrer"}
                className={"rounded-full"}
                src={message.senderImage}
                alt={`${message.senderName} profile picture`}
              />
            </div>
          </div>
          <div id={"banner-text-container"} className={"ml-3 flex-1"}>
            <p
              id={"banner-title"}
              className={"text-sm font-medium text-gray-900 dark:text-white"}
            >
              {message.senderName}
            </p>
            <p
              id={"banner-body"}
              className={"mt-1 text-sm text-gray-500 dark:text-gray-200"}
            >
              {message.text}
            </p>
          </div>
        </div>
      </Link>

      <div
        id={"banner-button"}
        className={
          "flex border-l border-gray-300 rounded-none rounded-r-lg dark:bg-gray-700"
        }
      >
        <button
          onClick={() => toast.dismiss(t.id)}
          className={
            "w-full rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium " +
            "text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 " +
            "dark:text-white dark:hover:text-gray-200"
          }
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default NewMessageBanner;
