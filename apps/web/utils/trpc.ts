import { createReactQueryHooks } from '@trpc/react';
import type { AppRouter } from 'trpc-server/src/index';

export const trpc = createReactQueryHooks<AppRouter>();
// => { useQuery: ..., useMutation: ...}
