import { IMovie } from "../types/movie.ts";

// Array movies
let movies: Array<IMovie> = [
];

// Return all movies.
const getMovies = ({ response }: { response: any }) => {
    response.body = movies;
};

// Return movie by id.
const getMovie = ({ params, response}: { params: { id: string }; response: any;}) => {
    const movie = movies.filter((movie: IMovie) => movie.id == params.id)[0];
    if (movie) {
        response.status = 200;
        response.body = movie;
    } else {
        response.status = 404;
        response.body = { message: "404 Not found." };
    }
};

// Creates new movie.
const addMovie = async ({ request, response }: { request: any; response: any;}) => {
    const body = await request.body();
    const movie: IMovie = body.value;
    movies.push(movie);
    response.body = { success: true, data: movie };
    response.status = 201;
};

// Update existing movie.
const updateMovie = async ({params, request, response }: {params: { id: string }; request: any; response: any;}) => {
    let movie = movies.filter((movie: IMovie) => movie.id == params.id)[0];
    if (movie) {
        const body = await request.body();
        movie = {...body.value}
        response.status = 200;
        response.body = {
            success: true,
            data: movie,
        };
    } else {
        response.status = 404;
        response.body = {
            success: false,
            message: "Movie not found.",
        };
    }
};

// Delete movie
const deleteMovie = ({ params, response }: { params: { id: string }; response: any; }) => {
    movies = movies.filter((movie: IMovie) => movie.id !== params.id);
    response.status = 200;
    response.body = { success: true, message: "Movie removed." };
};

export { getMovies, getMovie, addMovie, updateMovie, deleteMovie };

