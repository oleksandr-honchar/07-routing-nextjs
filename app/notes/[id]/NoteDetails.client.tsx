"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import { Note } from "@/types/note";
import css from "@/components/NoteDetails/NoteDetails.module.css";

export default function NoteDetailsClient({ id }: { id: string }) {
  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading note...</p>;
  if (isError || !note) return <p>Something went wrong</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
              <h2>{note.title}</h2>
        </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>Created at: {note.createdAt}</p>
      </div>
    </div>
    
  );
};