import type { CreateReactUtilsProxy, DecoratedProcedureRecord, TRPCUseQueries } from '@trpc/react-query/shared';
import type { AnyRouter, ProtectedIntersection } from '@trpc/server';
import type { NextPageContext } from 'next/types';
import type { WithTRPCNoSSROptions, WithTRPCSSROptions } from './withTRPC';
import { withTRPC } from './withTRPC';
/**
 * @internal
 */
export interface CreateTRPCNextBase<TRouter extends AnyRouter, TSSRContext extends NextPageContext> {
    /**
     * @deprecated renamed to `useUtils` and will be removed in a future tRPC version
     *
     * @see https://trpc.io/docs/client/react/useUtils
     */
    useContext(): CreateReactUtilsProxy<TRouter, TSSRContext>;
    /**
     * @see https://trpc.io/docs/client/react/useUtils
     */
    useUtils(): CreateReactUtilsProxy<TRouter, TSSRContext>;
    withTRPC: ReturnType<typeof withTRPC<TRouter, TSSRContext>>;
    useQueries: TRPCUseQueries<TRouter>;
}
/**
 * @internal
 */
export type CreateTRPCNext<TRouter extends AnyRouter, TSSRContext extends NextPageContext, TFlags> = ProtectedIntersection<CreateTRPCNextBase<TRouter, TSSRContext>, DecoratedProcedureRecord<TRouter['_def']['record'], TFlags>>;
export declare function createTRPCNext<TRouter extends AnyRouter, TSSRContext extends NextPageContext = NextPageContext, TFlags = null>(opts: WithTRPCNoSSROptions<TRouter> | WithTRPCSSROptions<TRouter>): CreateTRPCNext<TRouter, TSSRContext, TFlags>;
//# sourceMappingURL=createTRPCNext.d.ts.map