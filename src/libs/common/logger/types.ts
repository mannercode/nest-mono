export type HttpErrorLog = {
    contextType: 'http'
    request: { body: any; method: string; url: string }
    response: object | string
    stack: string[]
    statusCode: number
}

export type HttpSuccessLog = {
    contextType: 'http'
    duration: string
    request: { body: any; method: string; url: string }
    statusCode: number
}
