"use client";

import { FC, useEffect, useState } from "react";
import { Check, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { pusherClient } from "@/lib/pusher";

interface FriendRequestsListProps {
  uid: string;
  incomingFriendRequests: IncomingFriendRequest[];
}

const FriendRequestsList: FC<FriendRequestsListProps> = ({
  uid,
  incomingFriendRequests,
}) => {
  const router = useRouter();
  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  useEffect(() => {
    const newFriendRequestHandler = ({
      senderId,
      senderEmail,
    }: IncomingFriendRequest) => {
      setFriendRequests((currentState) => [
        ...currentState,
        { senderId, senderEmail },
      ]);
    };
    pusherClient.bind("incoming_friend_requests", newFriendRequestHandler);
    return () => {
      pusherClient.unbind("incoming_friend_requests", newFriendRequestHandler);
    };
  }, [uid]);

  const acceptFriend = async (id: string) => {
    await axios.post("/api/friending/accept", { id });
    setFriendRequests((currentState) =>
      currentState.filter((request) => request.senderId !== id)
    );
    router.refresh();
  };
  const denyFriend = async (id: string) => {
    await axios.post("/api/friending/deny", { id });
    setFriendRequests((currentState) =>
      currentState.filter((request) => request.senderId !== id)
    );
    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className={"text-sm text-zinc-500"}>Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className={"flex gap-4 items-center"}>
            <UserPlus className={"text-black dark:text-white"} />
            <p className={"font-medium text-lg"}>{request.senderEmail}</p>
            <button
              aria-label={"Accept friend request"}
              className={
                "grid w-8 h-8 bg-indigo-600 place-items-center rounded-full transition " +
                "hover:bg-indigo-700 hover:shadow-md"
              }
              onClick={() => acceptFriend(request.senderId)}
            >
              <Check className={"font-semibold text-white w-3/4 h-3/4"} />
            </button>
            <button
              aria-label={"Deny friend request"}
              className={
                "grid w-8 h-8 bg-red-600 place-items-center rounded-full transition " +
                "hover:bg-red-700 hover:shadow-md"
              }
              onClick={() => denyFriend(request.senderId)}
            >
              <X className={"font-semibold text-white w-3/4 h-3/4"} />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequestsList;
