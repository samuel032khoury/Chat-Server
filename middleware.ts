import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { getToken, JWT } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(
    req: NextRequestWithAuth
  ): Promise<NextResponse | undefined> {
    const pathname: string = req.nextUrl.pathname;

    // Manage route protection
    const isAuth: JWT | null = await getToken({ req });
    const isLoginPage: boolean = pathname.startsWith("/login");

    const sensitiveRoutes: string[] = ["/dashboard"];
    const isAccessingSensitiveRoute: boolean = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isLoginPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth && isAccessingSensitiveRoute) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: async (): Promise<boolean> => true,
    },
  }
);

export const config = {
  matcher: ["/", "/login", "/dashboard/:path*"],
};
