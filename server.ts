import { Application } from 'https://deno.land/x/oak/mod.ts';
import router from './routes/routes.ts';
import { green, yellow } from 'https://deno.land/std@0.53.0/fmt/colors.ts';
import { APP_HOST, APP_PORT } from './config/config.ts';

const app = new Application();

// Routes.
app.use(router.routes())
app.use(router.allowedMethods())

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

console.log(`${yellow("Welcome to the Movies API built with Deno:")} ${green(APP_HOST)}:${green(APP_PORT.toString())}`);
await app.listen(`${APP_HOST}:${APP_PORT}`);
