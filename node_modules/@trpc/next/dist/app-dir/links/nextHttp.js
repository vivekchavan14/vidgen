'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var client = require('@trpc/client');
var shared = require('../../shared-e49b9cdc.js');
require('@trpc/server/shared');

// ts-prune-ignore-next
function experimental_nextHttpLink(opts) {
    return (runtime)=>{
        return (ctx)=>{
            const { path , input , context  } = ctx.op;
            const cacheTag = shared.generateCacheTag(path, input);
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
            const link = opts.batch ? client.httpBatchLink({
                ...opts,
                fetch: _fetch
            }) : client.httpLink({
                ...opts,
                fetch: _fetch
            });
            return link(runtime)(ctx);
        };
    };
}

exports.experimental_nextHttpLink = experimental_nextHttpLink;
