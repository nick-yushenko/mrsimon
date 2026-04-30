import { NextRequest, NextResponse } from "next/server";
import type { PagedResult } from "@/shared/api/types";
import type { UserListItem } from "@/entities/user/model/types";
import { mockUsers } from "@/shared/api/mock/users";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 20);
  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";

  const safePage = Math.max(page, 1);
  const safePageSize = Math.min(Math.max(pageSize, 1), 100);

  const sortedUsers = [...mockUsers].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const filteredUsers = search
    ? sortedUsers.filter((u) => {
        const haystack = `${u.id} ${u.name} ${u.lastName} ${u.email}`.toLowerCase();
        return haystack.includes(search);
      })
    : sortedUsers;

  const totalCount = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / safePageSize));
  const normalizedPage = Math.min(safePage, totalPages);

  const start = (normalizedPage - 1) * safePageSize;
  const end = start + safePageSize;

  const items: UserListItem[] = filteredUsers.slice(start, end).map((user) => ({
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));

  const result: PagedResult<UserListItem> = {
    items,
    page: normalizedPage,
    pageSize: safePageSize,
    totalCount,
    totalPages,
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  await sleep(200);

  return NextResponse.json(result);
}
