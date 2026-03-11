import type { AppTestContext } from 'apps/__tests__/__helpers__'
import type { MovieDto } from 'apps/cores'
import type { TestContext } from 'testlib'
import { createAppTestContext } from 'apps/__tests__/__helpers__'
import { RecommendationService } from 'apps/applications'
import { MoviesModule } from 'apps/cores'
import { MoviesHttpController } from 'apps/gateway'
import { AssetsModule } from 'apps/infrastructures'

export type MoviesBaseContext = AppTestContext

export async function createMoviesContext(): Promise<MoviesBaseContext> {
    return createAppTestContext({
        controllers: [MoviesHttpController],
        ignoreProviders: [RecommendationService],
        imports: [MoviesModule, AssetsModule]
    })
}

export async function createUnpublishedMovie(ctx: TestContext): Promise<MovieDto> {
    const { MoviesService } = await import('apps/cores')
    const moviesService = ctx.module.get(MoviesService)

    const movie = await moviesService.create({})
    return movie
}
