import type { MoviesService } from 'apps/cores'
import type { MoviesBaseContext } from './create-movies-context'
import { createMoviesContext } from './create-movies-context'

export type MoviesFixture = MoviesBaseContext & { moviesService: MoviesService }

export async function createMoviesFixture() {
    const ctx = await createMoviesContext()

    const { MoviesService } = await import('apps/cores')
    const moviesService = ctx.module.get(MoviesService)

    return { ...ctx, moviesService }
}
