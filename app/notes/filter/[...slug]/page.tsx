
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import Notes from "./Notes.client";
import { fetchNotes } from "@/lib/api";

type Props = {
  params: Promise<{ slug: string[] }>;
};

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;
  const tag = slug?.[0]?.toLowerCase() === "all" ? "" : slug?.[0] ?? "";

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
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Notes
          tag={tag}
        />
      </HydrationBoundary>
    </div>
  );
}
