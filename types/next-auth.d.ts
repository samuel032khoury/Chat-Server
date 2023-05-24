// Have an export so that this is treated as a module
export {}

declare module "next-auth/jwt" {
  interface JWT {
    id: UID;
  }
}

declare module "next-auth" {
  interface Session {
    user: DBUser;
  }
}
