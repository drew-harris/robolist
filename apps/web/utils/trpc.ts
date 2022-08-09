import { createTRPCClient } from '@trpc/client';
import { createReactQueryHooks } from '@trpc/react';
import absoluteUrl from 'next-absolute-url';
import type { AppRouter } from 'trpc-server/src/index';
import superjson from "superjson";

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}


export const vanilla = createTRPCClient<AppRouter>({
  url: "http://localhost:3000/api/trpc/",
  transformer: superjson,
});

