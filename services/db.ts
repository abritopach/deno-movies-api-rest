// Deno
import { readJson } from 'https://deno.land/std/fs/mod.ts';

// Project
import { FILE_PATH } from '../config/config.ts';
import { IMovie } from '../types/movie.ts';

export const fetchData = async (): Promise<IMovie[]> => {

    const data = await readJson(FILE_PATH) as {movies: Array<IMovie>};
    const movies = data.movies;

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

    return movies;
};

export const persistData = async (movies: Array<IMovie>): Promise<void> => {
    const encoder = new TextEncoder();
    await Deno.writeFile(FILE_PATH, encoder.encode(JSON.stringify(movies)));
};