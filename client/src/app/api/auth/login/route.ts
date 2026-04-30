import type { LoginRequest } from "@/features/auth/types";
import { NextResponse } from "next/server";

import { getAuthResponseByEmail, isServerError } from "../mockAuth";

export async function POST(request: Request) {
  if (isServerError) {
    return NextResponse.json({ message: "Mock server error" }, { status: 500 });
  }

  const data = (await request.json()) as LoginRequest;

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(1000);

  return NextResponse.json(getAuthResponseByEmail(data.email));
}
