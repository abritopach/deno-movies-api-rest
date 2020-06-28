// Deno
import { Context, helpers, Status, isHttpError} from 'https://deno.land/x/oak/mod.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';

// Project
import { IMovie } from "../types/movie.ts";
import { DB_PATH } from '../config/config.ts';
import { service } from "../services/movies.ts";

// Return all movies.
const getMovies = async (ctx: Context) => {
    try {
        const movies = await service.getMovies();
        ctx.response.status = 200;
        ctx.response.body = {
            success: true,
            message: "Fetched movies successfully.",
            data: movies
        };
    } catch(error) {
        handleError(error)
    }
}

// Return movie by id.
const getMovie = async (ctx: Context) => {
    try {
        const { id } = helpers.getQuery(ctx, { mergeParams: true });
        console.log('id', id);

        // const movie = movies.filter((movie: IMovie) => movie.id === id).pop();
        const movie = await service.getMovie(id);
        console.log('movie', movie);
        if (movie) {
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                message: "Fetched movie successfully.",
                data: movie
            };
        } else {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "Movie not found.",
                data: []
            };
        }
    } catch(error) {
        handleError(error);
    }
}

// Creates new movie.
const addMovie = async (ctx: Context) => {
    try {
        const { value } = await ctx.request.body();

        const movie: IMovie = await service.addMovie(value);
        console.log('addMovie movie', movie);

        if (movie) {
            ctx.response.status = 201;
            ctx.response.body = {
                success: true,
                message: "Movie created successfully.",
                data: movie
            };
        }
    } catch(error) {
        handleError(error);
    }
}

// Update existing movie.
const updateMovie = async (ctx: Context) => {

    /*
    try {
        const { id } = helpers.getQuery(ctx, { mergeParams: true });

        const movieIndex = movies.findIndex(movie => movie.id === id);
        if (movieIndex !== -1) {
            const {value} = await ctx.request.body();
            movies[movieIndex] = {...value};
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                message: "Movie updated successfully.",
                data: movies[movieIndex],
            };
        } else {
            ctx.response.status = 404;
            ctx.response.body = {
                success: false,
                message: "Movie not found.",
                data: []
            };
        }
    } catch(error) {
        handleError(error);
    }
    */
};

// Delete movie.
const deleteMovie = (ctx: Context) => {
    /*
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    movies = movies.filter((movie: IMovie) => movie.id !== id);
    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
        message: "Movie removed successfully.",
        data: []
    };
    */
};

const handleError = (err: any) => {
    console.log('handleError', err);
    if (isHttpError(err)) {
        switch (err.status) {
            case Status.NotFound:
                // handle NotFound
                break;
            case Status.InternalServerError:
                // handle InternalServerError
                break;
            default:
            // handle other statuses
        }
    } else {
        // rethrow if you can't handle the error
        throw err;
    }
}

export { getMovies, getMovie, addMovie, updateMovie, deleteMovie };

