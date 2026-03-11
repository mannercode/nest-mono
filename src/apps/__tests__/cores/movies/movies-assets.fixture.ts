import type { TestAsset } from 'apps/__tests__/__helpers__'
import type { AssetsService } from 'apps/infrastructures'
import type { TestContext } from 'testlib'
import { buildCreateAssetDto, testAssets, uploadAsset } from 'apps/__tests__/__helpers__'
import type { MoviesBaseContext } from './create-movies-context'
import { createMoviesContext } from './create-movies-context'

export type MoviesAssetsFixture = MoviesBaseContext & {
    asset: TestAsset
    assetsService: AssetsService
}

export { createUnpublishedMovie } from './create-movies-context'

export async function createMovieAsset(ctx: TestContext, movieId: string, file: TestAsset) {
    const { MoviesService } = await import('apps/cores')
    const moviesService = ctx.module.get(MoviesService)

    const createDto = buildCreateAssetDto(file)
    const upload = await moviesService.createAsset(movieId, createDto)

    return upload
}

export async function createMoviesAssetsFixture() {
    const ctx = await createMoviesContext()

    const { AssetsService } = await import('apps/infrastructures')
    const assetsService = ctx.module.get(AssetsService)

    return { ...ctx, asset: testAssets.image, assetsService }
}

export async function uploadAndFinalizeMovieAsset(ctx: TestContext, movieId: string) {
    const { MoviesService } = await import('apps/cores')
    const moviesService = ctx.module.get(MoviesService)

    const { assetId } = await uploadMovieAsset(ctx, movieId)

    await moviesService.finalizeUpload(movieId, assetId)
    return assetId
}

export async function uploadMovieAsset(ctx: TestContext, movieId: string) {
    const { image } = testAssets

    const upload = await createMovieAsset(ctx, movieId, image)
    const uploadResponse = await uploadAsset(image.path, upload)

    expect(uploadResponse.ok).toBe(true)

    return upload
}
