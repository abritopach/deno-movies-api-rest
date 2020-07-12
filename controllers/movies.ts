// Deno
import { Context, helpers, Status, isHttpError} from 'https://deno.land/x/oak/mod.ts';

// Project
import { IMovie, Genre } from "../types/movie.ts";
import { service } from "../services/movies.ts";

enum OrderType {
    DESC = "desc",
    ASC = "asc"
}

enum QueryStringType {
    GENRE = "genre",
    SORT = "_sort",
    ORDER = "_order",
    LIMIT = "_limit"
}

// Return all movies.
const getMovies = async (ctx: Context) => {
    try {

        const queryString = helpers.getQuery(ctx, { mergeParams: true });

        if (Object.keys(queryString).length === 0) {
            const movies = await service.getMovies();
            sendResponse(ctx, 200, { success: true, message: "Fetched movies successfully.", data: movies});
        }
        else {

            let movies = await service.getMovies();

            Object.keys(queryString).forEach(param => {
                switch(param) {
                    case QueryStringType.LIMIT: {
                        const limit = +queryString[param];
                        movies = movies.slice(0, limit);
                        break;
                    }
                    case QueryStringType.SORT: {
                        let sort = queryString[param].split(',');
                        const orders = queryString[QueryStringType.ORDER].split(',')
                        if (sort.includes('title')) {
                            const index = sort.indexOf('title');
                            const titleOrder = orders[index];
                            const sortCondition = (m1: IMovie , m2: IMovie) => titleOrder === OrderType.ASC ? m1.title.localeCompare(m2.title) :
                            m2.title.localeCompare(m1.title);
                            movies = movies.sort(sortCondition);
                        }
                        if (sort.includes('year')) {
                            const index = sort.indexOf('year');
                            const yearOrder = orders[index];
                            const sortCondition = (m1: IMovie , m2: IMovie) => yearOrder === OrderType.ASC ? m1.year - m2.year :
                            m2.year - m1.year
                            movies = movies.sort(sortCondition);
                        }
                        break;
                    }
                    case QueryStringType.GENRE: {
                        const filterCondition = (movie: IMovie) => movie.genre === queryString[param];
                        movies = movies.filter(filterCondition);
                        break;
                    }
                }
            });

            sendResponse(ctx, 200, { success: true, message: "Fetched movies successfully.", data: movies});
        }
    } catch(error) {
        handleError(error)
    }
}

// Return movie by id.
const getMovie = async (ctx: Context) => {
    try {
        const { id } = helpers.getQuery(ctx, { mergeParams: true });

        const movie = await service.getMovie(id);
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

