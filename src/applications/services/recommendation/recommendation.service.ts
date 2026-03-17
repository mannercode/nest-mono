import { Injectable } from '@nestjs/common'
import { DateUtil, OrderDirection } from 'common'
import { MovieDto, MoviesService, ShowtimesService, WatchRecordsService } from 'cores'
import { Rules } from 'shared'
import { MovieRecommender } from './domain'

@Injectable()
export class RecommendationService {
    constructor(
        private readonly showtimesService: ShowtimesService,
        private readonly moviesService: MoviesService,
        private readonly watchRecordsService: WatchRecordsService
    ) {}

    async searchRecommendedMovies(customerId: null | string) {
        const startTime = DateUtil.add({ minutes: Rules.Ticket.purchaseCutoffMinutes })

        const showingMovieIds = await this.showtimesService.searchMovieIds({
            startTimeRange: { start: startTime }
        })

        const showingMovies = await this.moviesService.getMany(showingMovieIds)
        let watchedMovies: MovieDto[] = []

        if (customerId) {
            const { items } = await this.watchRecordsService.searchPage({
                customerId,
                orderby: { direction: OrderDirection.Desc, name: 'watchDate' },
                take: 50
            })
            const movieIds = items.map((record) => record.movieId)
            watchedMovies = await this.moviesService.getMany(movieIds)
        }

        const recommendedMovies = MovieRecommender.recommend(showingMovies, watchedMovies)
        return recommendedMovies
    }
}
