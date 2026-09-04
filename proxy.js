import { updateSession } from "./lib/supabase/proxy";

export async function proxy(request) {
  return await updateSession(request);
}

export const config = {
  matcher: ["/dashboard/:path*", "/create/:path*", "/api/script"]
};
