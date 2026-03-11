import type { AppTestContext } from 'apps/__tests__/__helpers__'
import type { MovieDto } from 'apps/cores'
import type { TestContext } from 'testlib'
import {
    createAndLoginCustomer,
    createAppTestContext,
    createMovie,
    createShowtimes,
    createWatchRecord
} from 'apps/__tests__/__helpers__'
import { RecommendationModule } from 'apps/applications'
import {
    CustomersModule,
    MoviesModule,
    ShowtimesModule,
    WatchRecordsModule
} from 'apps/cores'
import { CustomerJwtStrategy, MoviesHttpController } from 'apps/gateway'
import { AssetsModule } from 'apps/infrastructures'
import { DateUtil } from 'common'

export type RecommendationFixture = AppTestContext & {}

export async function createRecommendationFixture(): Promise<RecommendationFixture> {
    const ctx = await createAppTestContext({
        controllers: [MoviesHttpController],
        imports: [
            MoviesModule,
            AssetsModule,
            CustomersModule,
            ShowtimesModule,
            WatchRecordsModule,
            RecommendationModule
        ],
        providers: [CustomerJwtStrategy]
    })

    return { ...ctx }
}

export async function createShowingMovies(ctx: TestContext, dtos: Partial<MovieDto>[]) {
    const movies = await Promise.all(dtos.map((dto) => createMovie(ctx, dto)))

    const createShowtimesDtos = movies.map((movie) => ({
        movieId: movie.id,
        startTime: DateUtil.add({ days: 1 })
    }))

    await createShowtimes(ctx, createShowtimesDtos)

    return movies
}

export async function createWatchedMovies(ctx: TestContext, dtos: Partial<MovieDto>[]) {
    const movies = await Promise.all(dtos.map((dto) => createMovie(ctx, dto)))

    const { accessToken, customer } = await createAndLoginCustomer(ctx)

    const watchRecords = await Promise.all(
        movies.map((movie) =>
            createWatchRecord(ctx, { customerId: customer.id, movieId: movie.id })
        )
    )

    return { accessToken, customer, movies, watchRecords }
}
