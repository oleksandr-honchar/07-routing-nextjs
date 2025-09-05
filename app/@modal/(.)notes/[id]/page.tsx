import NotePreview from "./NotePreview.client"

export default function Page({ params }: { params: { id: string } }) {
  return <NotePreview id={params.id} />
}
