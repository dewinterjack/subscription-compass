import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import type { inferRouterOutputs, inferRouterInputs } from "@trpc/server";
import { subscriptionRouter } from "./routers/subscriptions";
import { accountRouter } from "./routers/account";
import { userRouter } from "./routers/user";


/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  subscription: subscriptionRouter,
  account: accountRouter,
  user: userRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type OutputType = inferRouterOutputs<AppRouter>;
export type InputType = inferRouterInputs<AppRouter>;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
