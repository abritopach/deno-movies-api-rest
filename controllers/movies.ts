// Deno
import { Context, helpers, Status, isHttpError} from 'https://deno.land/x/oak/mod.ts';
import { readJson } from 'https://deno.land/std/fs/mod.ts';

// Project
import { IMovie } from "../types/movie.ts";
import { FILE_PATH } from '../config/config.ts';

// Array movies
let data = await readJson(FILE_PATH) as {movies: Array<IMovie>};
let movies = data.movies;

// console.log('movies', movies)
/*
let movies: Array<IMovie> = []
try {
    const decoder = new TextDecoder();
    const data = await Deno.readFile(FILE_PATH);
    const movies = JSON.parse(decoder.decode(data)) as Array<IMovie>;
    console.log('movies', movies)
} catch(error) {
    console.error(error)
}
*/

// Return all movies.
const getMovies = (ctx: Context) => {
    try {
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
const getMovie = (ctx: Context) => {
    try {
        const { id } = helpers.getQuery(ctx, { mergeParams: true });
        console.log('id', id);
        ctx.response.status = 200;

        const movie = movies.filter((movie: IMovie) => movie.id === id).pop();
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
        const movie: IMovie = {...value};
        movies.push(movie);
        ctx.response.status = 201;
        ctx.response.body = {
            success: true,
            message: "Movie created successfully.",
            data: movie
        };
    } catch(error) {
        handleError(error);
    }
}

// Update existing movie.
const updateMovie = async (ctx: Context) => {
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
};

// Delete movie.
const deleteMovie = (ctx: Context) => {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    movies = movies.filter((movie: IMovie) => movie.id !== id);
    ctx.response.status = 200;
    ctx.response.body = {
        success: true,
        message: "Movie removed successfully.",
        data: []
    };
};

const handleError = (err: any) => {
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

