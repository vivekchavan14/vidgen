import { httpBatchLink, httpLink } from '@trpc/client';
import { g as generateCacheTag } from '../../shared-f6996341.mjs';
import '@trpc/server/shared';

// ts-prune-ignore-next
function experimental_nextHttpLink(opts) {
    return (runtime)=>{
        return (ctx)=>{
            const { path , input , context  } = ctx.op;
            const cacheTag = generateCacheTag(path, input);
            // Let per-request revalidate override global revalidate
            const requestRevalidate = typeof context.revalidate === 'number' || context.revalidate === false ? context.revalidate : undefined;
            const revalidate = requestRevalidate ?? opts.revalidate ?? false;
            const _fetch = (url, fetchOpts)=>{
                return fetch(url, {
                    ...fetchOpts,
                    // cache: 'no-cache',
                    next: {
                        revalidate,
                        tags: [
                            cacheTag
                        ]
                    }
                });
            };
            const link = opts.batch ? httpBatchLink({
                ...opts,
                fetch: _fetch
            }) : httpLink({
                ...opts,
                fetch: _fetch
            });
            return link(runtime)(ctx);
        };
    };
}

export { experimental_nextHttpLink };
