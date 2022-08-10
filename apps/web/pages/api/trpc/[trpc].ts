import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "trpc-server/src";
import { createContext } from "trpc-server/src/server/context";

export default trpcNext.createNextApiHandler({
	router: appRouter,
	createContext: createContext,
});
