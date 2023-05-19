import { NextAuthOptions } from "next-auth";
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { db } from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import {Session} from "next-auth";
function getGoogleCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || clientId.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_ID");
  }

  if (!clientSecret || clientSecret.length === 0) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET");
  }

  return { clientId, clientSecret };
}

const { clientId, clientSecret } = getGoogleCredentials();
export const authOptions: NextAuthOptions = {
  adapter: UpstashRedisAdapter(db),
  callbacks: {
    jwt: async ({ token, user }): Promise<JWT> => {
      const dbUser = (await db.get(`user:${token.id}`)) as DBUser | null;
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.id,
      };
    },
    session: async ({ token, session }): Promise<Session> => {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name ?? "Unknown User";
        session.user.email = token.email ?? "";
        session.user.image = token.picture ?? "";
      }
      return session;
    },
    redirect: async (): Promise<string> => {
      return '/dashboard'
    }
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  session: {
    strategy: "jwt",
  },
};
