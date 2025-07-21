import type { HTTPBatchLinkOptions, HTTPLinkOptions, TRPCLink } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';
interface NextLinkBaseOptions {
    revalidate?: number | false;
    batch?: boolean;
}
interface NextLinkSingleOptions extends NextLinkBaseOptions, Omit<HTTPLinkOptions, 'fetch'> {
    batch?: false;
}
interface NextLinkBatchOptions extends NextLinkBaseOptions, Omit<HTTPBatchLinkOptions, 'fetch'> {
    batch: true;
}
export declare function experimental_nextHttpLink<TRouter extends AnyRouter>(opts: NextLinkSingleOptions | NextLinkBatchOptions): TRPCLink<TRouter>;
export {};
//# sourceMappingURL=nextHttp.d.ts.map