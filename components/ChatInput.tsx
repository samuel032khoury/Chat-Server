"use client";

import { FC, useRef, useState } from "react";
import AutosizeTextarea from "react-textarea-autosize";

interface ChatInputProps {
  chatId: UID;
  otherName: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatId, otherName }) => {
  const [input, setInput] = useState<string>("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const sendMessage = () => {};
  return (
    <div
      className={
        "border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0 dark:border-gray-700"
      }
    >
      <div
        className={
          "relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 " +
          "focus-within:ring-2 focus-within:ring-indigo-600 dark:focus-within:ring-cyan-900 dark:ring-gray-500"
        }
      >
        <AutosizeTextarea
          ref={textareaRef}
          className={
            "block w-full resize-none border-0 text-gray-900 bg-transparent sm:text-sm sm:leading-6" +
            "placeholder:text-gray-400 focus:ring-0 sm:py-1.5 dark:text-white"
          }
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${otherName}...`}
        />
        <div
          className={"py2"}
          aria-hidden={"true"}
          onClick={() => textareaRef.current?.focus()}
        >
          <div className={"py-px"}>
            <div className={"h-9"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
