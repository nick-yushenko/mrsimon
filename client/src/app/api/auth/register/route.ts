import type { RegisterRequest } from "@/features/auth/types";

import { NextResponse } from "next/server";

import { isServerError, registerMockUser } from "../mockAuth";

export async function POST(request: Request) {
  if (isServerError) {
    return NextResponse.json({ message: "Mock server error" }, { status: 500 });
  }

  const data = (await request.json()) as RegisterRequest;

  return NextResponse.json(registerMockUser(data));
}
