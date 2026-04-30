import { NextResponse } from "next/server";

import { getUserByAccessToken, isAuth, isServerError } from "../mockAuth";

export async function GET(request: Request) {
  if (isServerError) {
    return NextResponse.json({ message: "Mock server error" }, { status: 500 });
  }

  if (!isAuth) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json(getUserByAccessToken(request.headers.get("authorization")));
}
