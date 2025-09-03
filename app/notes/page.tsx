import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import Notes from "@/app/notes/Notes.client";
import { fetchNotes } from "@/lib/api";

const PER_PAGE = 12;

export default async function NotesPage() {
  const queryClient = new QueryClient();
  const initialPage = 1;
  const initialSearch = "";

  await queryClient.prefetchQuery({
    queryKey: ["notes", initialPage, initialSearch],
    queryFn: () => fetchNotes({ page: initialPage, perPage: PER_PAGE, search: initialSearch }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Notes perPage={PER_PAGE} initialPage={initialPage} initialSearch={initialSearch}/>
    </HydrationBoundary>
  );
}



