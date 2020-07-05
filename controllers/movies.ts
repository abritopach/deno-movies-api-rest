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
            return;
        } else {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "Movie not found.",
                data: []
            };
            return;
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

    try {
        const { id } = helpers.getQuery(ctx, { mergeParams: true });

        const { value } = await ctx.request.body();

        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "Invalid movie id.",
                data: []
            };
            return;
        }

        if (!value) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "Invalid movie data.",
                data: []
            };
            return;
        }

        const updatedMovie = await service.updateMovie(id, value);

        ctx.response.status = 200;
        ctx.response.body = {
            success: true,
            message: "Movie updated successfully.",
            data: updatedMovie,
        };

    } catch(error) {
        handleError(error);
    }
};

// Delete movie.
const deleteMovie = async (ctx: Context) => {
    try {
        const { id } = helpers.getQuery(ctx, { mergeParams: true });

        if (!id) {
            ctx.response.status = 400;
            ctx.response.body = {
                success: false,
                message: "Invalid movie id.",
                data: []
            };
            return;
        }

        const foundMovie = await service.getMovie(id);
        console.log('foundMovie', foundMovie);
        if (!foundMovie) {
            ctx.response.status = 404;
            ctx.response.body = {
                success: false,
                message: `Movie with ID ${id} not found`,
                data: []
            };
            return;
        }

        await service.deleteMovie(id);
        ctx.response.status = 200;
        ctx.response.body = {
            success: true,
            message: "Movie removed successfully.",
            data: []
        };
    } catch(error) {
        handleError(error);
    }
};


const handleError = (err: any) => {
    console.log('handleError', err);
    if (isHttpError(err)) {
        switch (err.status) {
            case Status.NotFound:
                // Handle NotFound.
                break;
            case Status.InternalServerError:
                // Handle InternalServerError.
                break;
            default:
            // Handle other statuses.
        }
    } else {
        // Rethrow if you can't handle the error.
        throw err;
    }
}

export { getMovies, getMovie, addMovie, updateMovie, deleteMovie };

