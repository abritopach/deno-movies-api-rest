// Deno
import { readJson } from 'https://deno.land/std/fs/mod.ts';

// Project
import { DB_PATH } from '../config/config.ts';
import { IMovie } from '../types/movie.ts';

export const fetchData = async (): Promise<IMovie[]> => {
    try {
        /*
        const data = await readJson(DB_PATH) as {movies: Array<IMovie>};
        const movies = data.movies;
        return movies;
        */

        const data = await Deno.readFile(DB_PATH);
        const decoder = new TextDecoder('utf-8');
        const decodedData = decoder.decode(data);
        const result = JSON.parse(decodedData) as {movies: Array<IMovie>};
        return result.movies;
    } catch(error) {
        console.error(error);
        return [];
    }
};

export const persistData = async (data: Array<IMovie>): Promise<void> => {
    try {
        const jsonObject = {
            movies: [...data]
        };
        const json = JSON.stringify(jsonObject);
        const encoder = new TextEncoder().encode(json);
        // await Deno.writeFile(DB_PATH, encoder, { append: true });
        return await Deno.writeFile(DB_PATH, encoder);
    } catch(error) {
        console.error(error);
    }
};