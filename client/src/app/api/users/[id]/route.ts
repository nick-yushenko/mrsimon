import { NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/shared/api/mock/users";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const user = mockUsers.find((item) => item.id === id);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}
