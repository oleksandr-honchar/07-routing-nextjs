import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import NotePreview from "./NotePreview.client";
import { fetchNoteById } from "@/lib/api";

type Props = {
  params: Promise<{ id: string }>; // params is a promise
};

export default async function NoteModalPage({ params }: Props) {
  const { id } = await params; // await the promise

  const queryClient = new QueryClient();

  // Prefetch note data on server
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}
