import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { getUserFromJWT } from "../utils";

// The app's context - is generated for each incoming request
export async function createContext(opts?: trpcNext.CreateNextContextOptions) {
  async function getUserFromHeader() {
    if (opts?.req.cookies.jwt) {
      const user = await getUserFromJWT(opts.req.cookies.jwt);
      return user;
    }
    return null;
  }

  const user = await getUserFromHeader();

  return {
    user,
  };
}
type Context = trpc.inferAsyncReturnType<typeof createContext>;

// Helper function to create a router with your app's context
export function createRouter() {
  return trpc.router<Context>();
}