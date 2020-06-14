// Deno
import { Context, helpers, Status, isHttpError} from 'https://deno.land/x/oak/mod.ts';
import { v4 } from 'https://deno.land/std/uuid/mod.ts';

// Project
import { IMovie, Genre } from "../types/movie.ts";

// Array movies
let movies: Array<IMovie> = [
    {
        "id": v4.generate(),
        "title": "Test Movie 2",
        "year": 2018,
        "director": "",
        "cast": "",
        "genre": Genre.Comedy,
        "notes": "Test movie notes modified",
        "poster": "https://about.canva.com/wp-content/uploads/sites/3/2015/01/school_poster.png"
    },
    {
        "id": v4.generate(),
        "title": "Test Movie 4 modified",
        "year": 2018,
        "director": "",
        "cast": "",
        "genre": Genre.Comedy,
        "notes": "",
        "poster": "https://images-na.ssl-images-amazon.com/images/I/51YdMLhgROL.jpg",
        "genreImage": "assets/movies-genres/comedy.png",
        "comments": [
            "Prueba",
            "Test"
        ],
        "rate": 5,
        "numVotes": 1
    }
];

// Return all movies.
const getMovies = (ctx: Context) => {
    ctx.response.status = 200;
    ctx.response.body = movies;
}

// Return movie by id.
const getMovie = (ctx: Context) => {
    const { id } = helpers.getQuery(ctx, { mergeParams: true });
    const movie = movies.filter((movie: IMovie) => movie.id == id).pop();
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
        let movie = movies.filter((movie: IMovie) => movie.id == id).pop();
        if (movie) {
            const {value} = await ctx.request.body();
            movie = {...value}
            ctx.response.status = 200;
            ctx.response.body = {
                success: true,
                message: "Movie updated successfully.",
                data: movie,
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

// Delete movie
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

