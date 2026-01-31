import { NextResponse } from "next/server";

/**
 * Success response helper
 */
export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status }
  );
}

/**
 * Error response helper
 */
export function errorResponse(message: string, status = 500, code?: string) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code: code || `ERROR_${status}`,
      },
    },
    { status }
  );
}

/**
 * Validation error response
 */
export function validationError(errors: Record<string, string[]>) {
  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Validation failed",
        code: "VALIDATION_ERROR",
        details: errors,
      },
    },
    { status: 400 }
  );
}

/**
 * Unauthorized error response
 */
export function unauthorizedError(message = "Unauthorized") {
  return errorResponse(message, 401, "UNAUTHORIZED");
}

/**
 * Not found error response
 */
export function notFoundError(resource = "Resource") {
  return errorResponse(`${resource} not found`, 404, "NOT_FOUND");
}

/**
 * Forbidden error response
 */
export function forbiddenError(message = "Forbidden") {
  return errorResponse(message, 403, "FORBIDDEN");
}
