export enum Genre {
    ScienceFiction = 'Science fiction',
    Westerns = 'Westerns',
    Crime = 'Crime',
    Romance = 'Romance',
    Comedy = 'Comedy',
    Drama = 'Drama',
    Cartoon = 'Cartoon',
    Action = 'Action',
    Adventure = 'Adventure',
    Thriller = 'Thriller',
    Fantasy = 'Fantasy',
    Horror = 'Horror'
}

/**
 * Description [Interface to define movie.]
 *
 * @author abritopach
 * @version 0.0.1
 *
 * @interface
 */
export interface IMovie {
    id: string;
    title: string;
    year: number;
    director: string;
    cast: string;
    genre: Genre;
    notes?: string;
    poster?: string;
    genreImage?: string;
    comments?: string[];
    rate?: number;
    numVotes?: number;
}