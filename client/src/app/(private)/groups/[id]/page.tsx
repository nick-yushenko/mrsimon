import { StudyGroup } from "@/widgets/studyGroups/item/studyGroup";

type TProps = {
  params: {
    id: string;
  };
};

export default async function GroupPage({ params }: TProps) {
  const { id } = await params;

  return <StudyGroup id={id} />;
}
