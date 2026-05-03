import { StudyGroupDetailsView } from "@/widgets/studyGroup/ui/studyGroupDetailsView";

type TProps = {
  params: {
    id: string;
  };
};

export default async function GroupPage({ params }: TProps) {
  const { id } = await params;

  return <StudyGroupDetailsView id={id} />;
}
