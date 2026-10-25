import "server-only";

import { NextResponse } from "next/server";
import { AiRateLimitError } from "@/lib/ai-rate-limit";
import { OwnerStoreError } from "@/lib/store-error";

export function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function failure(error: unknown) {
  if (error instanceof AiRateLimitError) {
    return NextResponse.json(
      { error: error.message },
      {
        status: error.status,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(error.retryAfterSec),
        },
      },
    );
  }
  if (error instanceof OwnerStoreError) {
    return json({ error: error.message }, error.status);
  }
  console.error(error);
  return json({ error: "Something went wrong." }, 500);
}
