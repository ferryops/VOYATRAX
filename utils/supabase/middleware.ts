import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get logged in user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Block unauthenticated user
  if (
    !user &&
    !request.nextUrl.pathname.startsWith("/login") &&
    !request.nextUrl.pathname.startsWith("/auth")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Hanya jika sudah login
  if (user) {
    // Ambil role dari table users
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = userData?.role;

    // Cegah ADMIN akses ke /tickets dan /orders
    if (
      role === "admin" &&
      (request.nextUrl.pathname.startsWith("/tickets") ||
        request.nextUrl.pathname.startsWith("/orders"))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/"; // Redirect ke home, atau bisa ke halaman lain
      return NextResponse.redirect(url);
    }

    // Cegah USER akses ke semua /admins/*
    if (role === "user" && request.nextUrl.pathname.startsWith("/admin/")) {
      const url = request.nextUrl.clone();
      url.pathname = "/"; // Redirect ke home
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

// Apply middleware to all routes
export const config = {
  matcher: [
    /*
      Protect all pages except static and public
      You can specify your own matcher as needed
    */
    "/((?!_next/static|_next/image|favicon.ico|logo.png|public|api/auth).*)",
  ],
};
