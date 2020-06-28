import { IMovie } from "../types/movie.ts";
import { fetchData, persistData } from "./db.ts";

const getMovies = async (): Promise<IMovie[]> => {
    const movies = await fetchData();

    // Sort by name.
    return movies.sort((a: IMovie, b: IMovie) => a.title.localeCompare(b.title));
};

export const getMovie = async (movieId: string): Promise<IMovie | undefined> => {
    const movies = await fetchData();
    return movies.find(({ id }) => id === movieId);
};

export const addMovie = async (movieData: IMovie): Promise<IMovie> => {
    const movies = await fetchData();
    const newMovie: IMovie = {...movieData};
    console.log('addMovie service', newMovie);
    await persistData([...movies, newMovie]);
    return newMovie;
};

export const service = {
    getMovies,
    getMovie,
    addMovie
}