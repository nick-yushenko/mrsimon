import { ProfileView } from "@/widgets/profile/profileView";

type TProps = {
  params: {
    id: string;
  };
};

export default async function UserPage({ params }: TProps) {
  const { id } = await params;

  return <ProfileView id={id} />;
}
