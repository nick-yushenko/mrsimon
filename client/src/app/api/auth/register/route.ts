import type { RegisterRequest } from "@/features/auth/types";
import { NextResponse } from "next/server";

import { isServerError, registerMockUser } from "../mockAuth";

export async function POST(request: Request) {
  if (isServerError) {
    return NextResponse.json({ message: "Mock server error" }, { status: 500 });
  }

  const data = (await request.json()) as RegisterRequest;

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(5000);
  return NextResponse.json(registerMockUser(data));
}
