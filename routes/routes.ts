import { Router } from 'https://deno.land/x/oak/mod.ts'
import { getMovies, getMovie, addMovie, updateMovie, deleteMovie } from '../controllers/movies.ts'

const router = new Router()

router.get('/api/v1/movies', getMovies)
    .get('/api/v1/movies/:id', getMovie)
    .get('/api/v1/movies/')
    .post('/api/v1/movies', addMovie)
    .put('/api/v1/movies/:id', updateMovie)
    .delete('/api/v1/movies/:id', deleteMovie)

export default router
