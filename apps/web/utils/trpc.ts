import { createTRPCClient } from '@trpc/client';
import { createReactQueryHooks } from '@trpc/react';
import absoluteUrl from 'next-absolute-url';
import type { AppRouter } from 'trpc-server/src/index';
import superjson from "superjson";

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}


export const vanilla = createTRPCClient<AppRouter>({
  url: `${getBaseUrl()}/api/trpc`,
  transformer: superjson,
});


export function getBaseUrl() {
  if (typeof window !== 'undefined') {
    return '';
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // reference for render.com
  if (process.env.RENDER_INTERNAL_HOSTNAME) {
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}