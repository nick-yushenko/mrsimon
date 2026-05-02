import { UserDetailsView } from "@/widgets/user/ui/userDetailsView";

type TProps = {
  params: {
    id: string;
  };
};

export default async function UserPage({ params }: TProps) {
  const { id } = await params;

  return <UserDetailsView id={id} />;
}
