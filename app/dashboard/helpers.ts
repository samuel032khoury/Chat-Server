import { db } from "@/lib/db";

export const getFriendsByUserId = async (id: UID) => {
  const friendsIds = (await db.smembers(`user:${id}:friends`)) as string[];
  return await Promise.all(
    friendsIds.map(
      async (friendId) => (await db.get(`user:${friendId}`)) as DBUser
    )
  );
};
