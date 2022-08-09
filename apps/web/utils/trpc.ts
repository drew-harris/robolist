import { createReactQueryHooks } from '@trpc/react';
import { appRouter, AppRouter } from 'trpc-server/src/index';
import { createSSGHelpers } from '@trpc/react/ssg';
import { createContext } from 'trpc-server/src/server/context';
import superjson from "superjson"
import { middleware } from '../middleware';

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}
