import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return response;
  }

  try {
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // ✅ Allow password reset page without login
    if (request.nextUrl.pathname.startsWith("/reset-password")) {
      return response;
    }

    if (request.nextUrl.pathname === "/login") {
      if (user) {
        const r = NextResponse.redirect(new URL("/dashboard", request.url));
        response.cookies.getAll().forEach((c) => r.cookies.set(c.name, c.value));
        return r;
      }
      return response;
    }

    if (!user) {
      const r = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.getAll().forEach((c) => r.cookies.set(c.name, c.value));
      return r;
    }

    return response;
  } catch {
    return response;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
