import { Application } from 'https://deno.land/x/oak/mod.ts';

// Set Host and Port.
const HOST = "127.0.0.1";
const PORT = 3000;

const app = new Application();

// Logger.
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
});

// Timing
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

console.log(`Welcome to the Movies API built with Deno:) ${HOST}:${PORT}...`);
await app.listen(`${HOST}:${PORT}`);
