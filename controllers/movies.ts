// Deno
import { Context, helpers, Status, isHttpError} from 'https://deno.land/x/oak/mod.ts';

// Project
import { IMovie } from "../types/movie.ts";
import { service } from "../services/movies.ts";

// Return all movies.
const getMovies = async (ctx: Context) => {
    try {
        const movies = await service.getMovies();
        sendResponse(ctx, 200, { success: true, message: "Fetched movies successfully.", data: movies});
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
            sendResponse(ctx, 200, {success: true, message: "Fetched movie successfully.", data: movie});
            return;
        } else {
            sendResponse(ctx, 400, {success: false, message: "Movie not found.", data: []});
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
            sendResponse(ctx, 201, {success: true, message: "Movie created successfully.", data: movie});
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
            sendResponse(ctx, 400, {success: false, message: "Invalid movie id.", data: []});
            return;
        }

        if (!value) {
            sendResponse(ctx, 400, {success: false, message: "Invalid movie data.", data: []});
            return;
        }

        const updatedMovie = await service.updateMovie(id, value);

        sendResponse(ctx, 200, {success: true, message: "Movie updated successfully.", data: updatedMovie});

    } catch(error) {
        handleError(error);
    }
};

// Delete movie.
const deleteMovie = async (ctx: Context) => {
    try {
        const { id } = helpers.getQuery(ctx, { mergeParams: true });

        if (!id) {
            sendResponse(ctx, 400, {success: false, message: "Invalid movie id.", data: []});
            return;
        }

        const foundMovie = await service.getMovie(id);
        console.log('foundMovie', foundMovie);
        if (!foundMovie) {
            sendResponse(ctx, 404, {success: false, message: `Movie with ID ${id} not found`, data: []});
            return;
        }

        await service.deleteMovie(id);
        sendResponse(ctx, 200, {success: true, message: "Movie removed successfully.", data: []});
    } catch(error) {
        handleError(error);
    }
};

const sendResponse = (ctx: Context, status: number, body: {success: boolean, message: string, data: IMovie | IMovie[]}) => {
    ctx.response.status = status;
    ctx.response.body = body;
}


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

