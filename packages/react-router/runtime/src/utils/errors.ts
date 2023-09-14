export function createErrorResponse(
    options: {
        message?: string;
        status?: number;
        error?: Error;
    } = {}
): Response {
    const statusText = options?.message || "Bad Request";
    const status = options?.status || 400;
    return new ErrorResponse(statusText, { status, statusText, error: options.error });
}

export function createUnauthorizedResponse(
    options: {
        message?: string;
        error?: Error;
    } = {}
): Response {
    return createErrorResponse({ status: 401, message: options?.message || "Unauthorized", error: options.error });
}


export function createBadRequestResponse(
    options: {
        message?: string;
        error?: Error;
    } = {}
): Response {
    return createErrorResponse({ status: 400, message: options?.message || "Bad Request", error: options.error });
}

export function createUnexpectedErrorResponse(
    options: {
        message?: string;
        error?: Error;
    } = {}
): Response {
    return createErrorResponse({ status: 500, message: options?.message || "An error has occurred", error: options.error });
}

export function createNotFoundResponse(
    options: {
        message?: string;
        error?: Error;
    } = {}
): Response {
    return createErrorResponse({ status: 404, message: options?.message || "Not Found", error: options.error });
}

export class ErrorResponse extends Response {
    error?: Error;
    constructor(body?: BodyInit | null, init?: ResponseInit & { error?: Error }) {
        super(body, init);
        this.error = init?.error;
    }
}

export function isErrorResponse(
    error: unknown
  ): error is ErrorResponse {
    return (error instanceof ErrorResponse 
        && typeof error.status === "number"
        && typeof error.statusText === "string") ?? false;
  }