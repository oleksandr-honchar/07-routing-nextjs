import NotePreview from "@/components/NotePreview/NotePreview";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function NotePage({ params }: Props) {
  const { id } = await params; // unwrap the promise
  return <NotePreview noteId={id} />;
}
