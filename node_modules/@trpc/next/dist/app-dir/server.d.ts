import type { AnyProcedure, AnyRootConfig, AnyRouter, MaybePromise, Simplify } from '@trpc/server';
import type { TRPCResponse } from '@trpc/server/rpc';
import type { ActionHandlerDef, CreateTRPCNextAppRouterOptions, inferActionDef } from './shared';
import type { NextAppDirDecoratedProcedureRecord } from './types';
export declare function experimental_createTRPCNextAppDirServer<TRouter extends AnyRouter>(opts: CreateTRPCNextAppRouterOptions<TRouter>): NextAppDirDecoratedProcedureRecord<TRouter["_def"]["record"]>;
/**
 * @internal
 */
export type TRPCActionHandler<TDef extends ActionHandlerDef> = (input: FormData | TDef['input']) => Promise<TRPCResponse<TDef['output'], TDef['errorShape']>>;
export declare function experimental_createServerActionHandler<TInstance extends {
    _config: AnyRootConfig;
}>(t: TInstance, opts: {
    createContext: () => MaybePromise<TInstance['_config']['$types']['ctx']>;
    /**
     * Transform form data to a `Record` before passing it to the procedure
     * @default true
     */
    normalizeFormData?: boolean;
}): <TProc extends AnyProcedure>(proc: TProc) => TRPCActionHandler<Simplify<inferActionDef<TProc>>>;
export declare function experimental_revalidateEndpoint(req: Request): Promise<Response>;
//# sourceMappingURL=server.d.ts.map