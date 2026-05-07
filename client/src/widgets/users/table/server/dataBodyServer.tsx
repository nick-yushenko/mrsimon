import type { PagedResult } from "@/shared/api/types";
import type { UserListItem } from "@/entities/user/model/types";

import { UsersDataBody } from "../ui/dataBody";

type UsersDataBodyServerProps = {
  dataPromise: Promise<PagedResult<UserListItem>>;
};

export const UsersDataBodyServer = async ({ dataPromise }: UsersDataBodyServerProps) => {
  const data = await dataPromise;

  return <UsersDataBody data={data} />;
};
