import { NextRequest, NextResponse } from "next/server";

const SSO_AUTH_URL = process.env.SSO_AUTH_URL ?? "";
const SSO_AUTH_LOGIN_URL = process.env.SSO_AUTH_LOGIN_URL;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/auth/login") {
    return await loginCallback(request);
  }
  return await authenticationGateway(request);
}

async function auth(session: string) {
  const res = await fetch(SSO_AUTH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ session }),
  });
  return await res.json();
}

async function loginCallback(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const token = searchParams.get("token");
    if (token) {
      const response = NextResponse.redirect(new URL("/", request.url));
      response.cookies.set({
        name: "__access__token",
        value: token,
        httpOnly: true,
        expires: undefined,
      });
      return response;
    }
    return NextResponse.next();
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

async function authenticationGateway(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const authURL = `${SSO_AUTH_LOGIN_URL}?redirectURL=${request.url}`;
    const cookie = request.cookies.get("__access__token")?.value;
    if (!cookie) {
      return NextResponse.redirect(new URL(authURL, request.url));
    }
    const user = await auth(cookie);
    const isApiRequst = pathname.startsWith("/api");
    if (isApiRequst) {
      if (user) {
        // audit ...
        return NextResponse.next();
      } else {
        return new NextResponse(null, { status: 401 });
      }
    } else {
      return user
        ? NextResponse.next()
        : NextResponse.redirect(new URL(authURL, request.url));
    }
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

export const config = {
  matcher: ["/", "/api"],
  // matcher: [
  //   "/((?!error|_next/static|_next/image|favicon.ico|robots.txt|images$).*)",
  // ],
};
