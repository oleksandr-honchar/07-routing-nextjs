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

type NotesProps = { tag: string };

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
    mutationFn: (payload: CreateNotePayload) => createNote(payload),
    onSuccess: () => {
      setSearch("");
      setPage(1);
      setCreateModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    },
  });

  const handleCreateNote = async (payload: CreateNotePayload) => {
    if (!createModalOpen) return; // blokada wielokrotnego otwarcia
    try {
      await createMutation.mutateAsync(payload);
    } catch (e) {
      console.error("Error creating note:", e);
    }
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

  const handleCloseModal = () => {
    setCreateModalOpen(false);
    setSelectedNote(null);
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
          <Pagination totalPages={totalPages} activePage={page} onPageChange={setPage} />
        )}
        <button
          className={css.button}
          onClick={() => setCreateModalOpen(true)}
          disabled={createModalOpen} 
        >
          Create note +
        </button>
      </header>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading notes</p>}

      {notes.length > 0 ? (
        <NoteList
          notes={notes}
          onNoteClick={handleNoteClick}
          onDeleteNote={handleDeleteNote}
          deletingNoteId={deletingNoteId}
        />
      ) : (
        <p>No notes found.</p>
      )}

      {createModalOpen && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onAdd={handleCreateNote} onCancel={handleCloseModal} />
        </Modal>
      )}

      {selectedNote && (
        <Modal onClose={handleCloseModal}>
          <div className={css.container}>
            <div className={css.item}>
              <div className={css.header}>
                <h2>{selectedNote.title}</h2>
                <span className={css.tag}>{selectedNote.tag}</span>
              </div>
              <p className={css.content}>{selectedNote.content}</p>
              {selectedNote.createdAt && (
                <p className={css.date}>
                  {new Date(selectedNote.createdAt).toLocaleDateString()}
                </p>
              )}
              <button className={css.backBtn} onClick={handleCloseModal}>
                ← Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
