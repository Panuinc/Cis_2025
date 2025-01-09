import { NextResponse } from "next/server";
import logger from "@/lib/logger";

export function handleRateLimitExceeded(ip) {
  logger.warn({ message: "Too many requests", ip });
  return NextResponse.json(
    { error: "Too many requests, please try again later" },
    { status: 429 }
  );
}

export function handleZodError(error) {
  logger.error({ message: "Invalid data", details: error.errors });
  return NextResponse.json(
    {
      error: "Invalid data",
      details: error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    },
    { status: 400 }
  );
}

export function handleUnauthorizedError() {
  return NextResponse.json({ error: "Access denied" }, { status: 401 });
}

export function handleGenericError(error, context = "An error occurred") {
  logger.error({ message: context, error: error.message });
  return NextResponse.json({ error: context }, { status: 500 });
}

export function handleErrors(error, ip, context = "An error occurred") {
  if (error.message === "RateLimitExceeded") return handleRateLimitExceeded(ip);
  if (error.name === "ZodError") return handleZodError(error);
  if (error.status === 401) return handleUnauthorizedError();
  return handleGenericError(error, context);
}

export function handleGetErrors(error, ip, context = "An error occurred") {
  if (error.message === "RateLimitExceeded") return handleRateLimitExceeded(ip);
  if (error.status === 401) return handleUnauthorizedError();
  return handleGenericError(error, context);
}
