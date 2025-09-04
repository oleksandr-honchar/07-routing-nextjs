
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import Notes from "./Notes.client";
import SidebarNotes from "@/app/notes/filter/@sidebar/SidebarNotes";
import { fetchNotes } from "@/lib/api";

type Props = {
  params: { slug?: string[] };
};

export default async function FilteredNotesPage({ params }: Props) {
  const slug = params.slug?.[0];
  const tag = slug?.toLowerCase() === "all" ? "" : slug ?? "";

  const perPage = 12;
  const initialPage = 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", initialPage, "", tag],
    queryFn: () =>
      fetchNotes({
        page: initialPage,
        perPage,
        search: "",
        tag,
      }),
  });

  return (
    <div style={{ display: "flex", gap: "2rem" }}>

      <SidebarNotes />


      <HydrationBoundary state={dehydrate(queryClient)}>
        <Notes
          perPage={perPage}
          initialPage={initialPage}
          initialSearch=""
          initialTag={tag}
        />
      </HydrationBoundary>
    </div>
  );
}
