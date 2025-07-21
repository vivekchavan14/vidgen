import type { TRPCLink } from '@trpc/client';
import type { AnyRouter, inferRouterContext } from '@trpc/server';
type NextCacheLinkOptions<TRouter extends AnyRouter> = {
    router: TRouter;
    createContext: () => Promise<inferRouterContext<TRouter>>;
    /** how many seconds the cache should hold before revalidating */
    revalidate?: number | false;
};
export declare function experimental_nextCacheLink<TRouter extends AnyRouter>(opts: NextCacheLinkOptions<TRouter>): TRPCLink<TRouter>;
export {};
//# sourceMappingURL=nextCache.d.ts.map