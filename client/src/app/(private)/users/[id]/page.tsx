import { UserView } from "@/entities/user/ui/userView";

type TProps = {
  params: {
    id: string;
  };
};

export default async function UserPage({ params }: TProps) {
  const { id } = await params;

  return <UserView id={id} />;
}
