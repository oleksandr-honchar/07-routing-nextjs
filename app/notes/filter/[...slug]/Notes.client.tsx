"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import css from "@/components/NotesPage/NotesPage.module.css";
import { fetchNotes, fetchNoteById, deleteNote, createNote } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import type { Note } from "@/types/note";
import type { CreateNotePayload, FetchNotesResponse } from "@/lib/api";

type NotesProps = {
  tag: string;
};

export default function Notes({ tag }: NotesProps) {
  const perPage = 12;
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [page, setPage] = useState(1);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

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
  });

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 1;

  const createMutation = useMutation({
    mutationFn: (note: CreateNotePayload) => createNote(note),
    onSuccess: () => {
      setSearch("");
      setPage(1);
      setCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
  });

  const handleCreateNote = (note: CreateNotePayload) => {
    createMutation.mutate(note);
  };

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onMutate: (id: string) => setDeletingNoteId(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notes"], exact: false }),
    onSettled: () => setDeletingNoteId(null),
  });

  const handleDeleteNote = (id: string) => deleteMutation.mutate(id);

  const handleNoteClick = async (note: Note) => {
    const fullNote = await fetchNoteById(note.id);
    setSelectedNote(fullNote);
  };

  const handleCloseDetails = () => setSelectedNote(null);

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && <Pagination totalPages={totalPages} activePage={page} onPageChange={setPage} />}
        <button className={css.button} onClick={() => setCreateModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {notes.length > 0 && (
        <NoteList
          notes={notes}
          onNoteClick={handleNoteClick}
          onDeleteNote={handleDeleteNote}
          deletingNoteId={deletingNoteId}
        />
      )}

   {createModalOpen && (
  <Modal onClose={() => setCreateModalOpen(false)}>
    <NoteForm
      onAdd={handleCreateNote}      
      onCancel={() => setCreateModalOpen(false)} 
    />
  </Modal>
)}

      {selectedNote && (
        <Modal onClose={handleCloseDetails}>
          <div className={css.container}>
            <div className={css.item}>
              <div className={css.header}>
                <h2>{selectedNote.title}</h2>
                <span className={css.tag}>{selectedNote.tag}</span>
              </div>
              <p className={css.content}>{selectedNote.content}</p>
              {selectedNote.createdAt && (
                <p className={css.date}>{new Date(selectedNote.createdAt).toLocaleDateString()}</p>
              )}
              <button className={css.backBtn} onClick={handleCloseDetails}>
                ← Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
