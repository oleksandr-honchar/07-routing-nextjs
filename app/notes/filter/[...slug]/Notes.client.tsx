"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import css from "@/components/NotesPage/NotesPage.module.css";
import type { CreateNotePayload, FetchNotesResponse } from "@/lib/api";
import { fetchNotes, createNote } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";

type NotesProps = {
  perPage: number;
  initialPage: number;
  initialSearch: string;
  initialTag: string;
};

export default function Notes({ perPage, initialPage, initialSearch, initialTag }: NotesProps) {
  const [search, setSearch] = useState(initialSearch);
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(initialPage);
  const [isModalOpen, setModalOpen] = useState(false);
  const [tag] = useState(initialTag);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", page, debouncedSearch, tag],
    queryFn: () =>
      fetchNotes({
        page,
        perPage,
        search: debouncedSearch,
        tag: tag === "all" ? "" : tag,
      }),
    placeholderData: keepPreviousData,
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const createMutation = useMutation({
    mutationFn: (note: CreateNotePayload) => createNote(note),
    onSuccess: () => {
      setSearch("");
      setPage(1);
      setModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
  });

  const handleCreateNote = (note: CreateNotePayload) => {
    createMutation.mutate(note);
    setModalOpen(false);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination
            totalPages={totalPages}
            activePage={page}
            onPageChange={setPage}
          />
        )}
        <button className={css.button} onClick={() => setModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {notes.length > 0 && (
        <NoteList notes={notes} />
      )}

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <NoteForm onCancel={() => setModalOpen(false)} onAdd={handleCreateNote} />
        </Modal>
      )}
    </div>
  );
}
