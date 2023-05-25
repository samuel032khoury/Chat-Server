"use client";

import { FC, useRef, useState } from "react";
import { Message } from "@/lib/validations/message";
import { cn } from "@/lib/utils";

interface MessagesProps {
  uid: UID;
  messageHistory: Message[];
}

const Messages: FC<MessagesProps> = ({ uid, messageHistory }) => {
  const [messages, setMessages] = useState<Message[]>(messageHistory);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  return (
    <div
      id={"messages"}
      className={
        "flex flex-1 flex-col-reverse h-full gap-4 p-3 overflow-y-auto" +
        " scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2"
      }
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const messageSenderIsMe = message.senderId === uid;
        const messageContinued =
          messages[index - 1]?.senderId === messages[index].senderId;
        return (
          <div key={`${message.id}`} id={`message-${message.id}-container`}>
            <div
              id={`message-${message.id}-arranger`}
              className={cn("flex items-end", {
                "justify-end": messageSenderIsMe,
              })}
            >
              <div
                id={`message-${message.id}-block`}
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": messageSenderIsMe,
                    "order-2 items-start": !messageSenderIsMe,
                  }
                )}
              >
                <div
                  id={`message-${message.id}-bubble`}
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": messageSenderIsMe,
                    "bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-gray-200":
                      !messageSenderIsMe,
                    "rounded-br-none": !messageContinued && messageSenderIsMe,
                    "rounded-lr-none": !messageContinued && !messageSenderIsMe,
                  })}
                >
                  <span
                    id={`message-${message.id}-text`}
                  >{`${message.text} `}</span>
                  <span
                    id={`message-${message.id}-ts`}
                    className={"ml-2 text-xs text-gray-400"}
                  >
                    {message.timestamp}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
