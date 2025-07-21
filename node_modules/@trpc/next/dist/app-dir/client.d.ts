import type { CreateTRPCProxyClient } from '@trpc/client';
import type { AnyRouter } from '@trpc/server';
import type { CreateTRPCNextAppRouterOptions } from './shared';
export { experimental_createActionHook, experimental_serverActionLink, type UseTRPCActionResult, type inferActionResultProps, } from './create-action-hook';
export declare function experimental_createTRPCNextAppDirClient<TRouter extends AnyRouter>(opts: CreateTRPCNextAppRouterOptions<TRouter>): CreateTRPCProxyClient<TRouter>;
//# sourceMappingURL=client.d.ts.map