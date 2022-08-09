import { createReactQueryHooks } from '@trpc/react';
import { appRouter, AppRouter } from 'trpc-server/src/index';
import { createSSGHelpers } from '@trpc/react/ssg';
import { createContext } from 'trpc-server/src/server/context';
import superjson from "superjson"
import { middleware } from '../middleware';

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}



const getHelpers = async () => {
  const {
    prefetchQuery,
    prefetchInfiniteQuery,
    fetchQuery,
    fetchInfiniteQuery,
    dehydrate,
    queryClient,
  } = createSSGHelpers({
    router: appRouter,
    transformer: superjson, // optional - adds superjson serialization
    ctx: { user: null },
  });
}