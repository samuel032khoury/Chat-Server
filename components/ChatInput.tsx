"use client";

import { FC, useRef, useState } from "react";
import AutosizeTextarea from "react-textarea-autosize";
import Button from "@/components/ui/Button";
import axios from "axios";
import toast from "react-hot-toast";

interface ChatInputProps {
  chatId: string;
  otherName: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatId, otherName }) => {
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const sendMessage = async () => {
    if (!input) return;
    setIsLoading(true);
    try {
      await axios.post("/api/message/send", { text: input, chatId });
      setInput("");
      textareaRef.current?.focus();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      id={"input-container"}
      className={
        "border-t border-gray-200 px-4 pt-4 mb-2 sm:mb-0 dark:border-gray-700"
      }
    >
      <div
        id={"input-style"}
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
              sendMessage().then();
            }
          }}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${otherName}...`}
        />
        <div
          id={"padding"}
          className={"py-2"}
          aria-hidden={"true"}
          onClick={() => textareaRef.current?.focus()}
        >
          <div className={"py-px"}>
            <div className={"h-9"} />
          </div>
        </div>
        <div
          id={"send-btn-container"}
          className={
            "absolute flex right-0 bottom-0 justify-between py-2 pl-3 pr-2"
          }
        >
          <div id={"send-btn-constraint"} className={"flex-shrink-0"}>
            <Button
              onClick={sendMessage}
              type={"submit"}
              isLoading={isLoading}
              disabled={input === "" || isLoading}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
