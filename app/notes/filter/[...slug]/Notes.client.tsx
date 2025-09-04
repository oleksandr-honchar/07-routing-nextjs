// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
// import { useDebounce } from "use-debounce";
// import css from "@/components/NotesPage/NotesPage.module.css";
// import type { CreateNotePayload, FetchNotesResponse} from "@/lib/api";
// import { fetchNotes, createNote, fetchNoteById } from "@/lib/api";
// import NoteList from "@/components/NoteList/NoteList";
// import Pagination from "@/components/Pagination/Pagination";
// import { SearchBox } from "@/components/SearchBox/SearchBox";
// import Modal from "@/components/Modal/Modal";
// import NoteForm from "@/components/NoteForm/NoteForm";
// import type { Note } from "@/types/note";

// type NotesProps = {
//   perPage: number;
//   initialPage: number;
//   initialSearch: string;
//   initialTag: string;
// };

// export default function Notes({ perPage, initialPage, initialSearch, initialTag }: NotesProps) {
//   const [search, setSearch] = useState(initialSearch);
//   const [debouncedSearch] = useDebounce(search, 500);
//   const [page, setPage] = useState(initialPage);
//   const [isModalOpen, setModalOpen] = useState(false);
//   const [selectedNote, setSelectedNote] = useState<Note | null>(null);
//   const [tag] = useState(initialTag);

//   const queryClient = useQueryClient();

//   const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
//     queryKey: ["notes", page, debouncedSearch, tag],
//     queryFn: () =>
//       fetchNotes({
//         page,
//         perPage,
//         search: debouncedSearch,
//         tag: tag === "all" ? "" : tag,
//       }),
//         placeholderData: keepPreviousData,
//   });

//   const notes = data?.notes ?? [];
//   const totalPages = data?.totalPages ?? 1;

// const createMutation = useMutation({
//   mutationFn: (note: CreateNotePayload) => createNote(note),
//   onSuccess: () => {
//     setSearch("");
//     setPage(1);
//     setModalOpen(false);
//     queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
//   },
// });

// const handleCreateNote = (note: CreateNotePayload) => {
//   createMutation.mutate(note);
//   setModalOpen(false);
// };


//   const handleSearchChange = (val: string) => {
//     setSearch(val);
//     setPage(1);
//   };

//   const handleNoteClick = async (note: Note) => {
//     const fullNote = await fetchNoteById(note.id);
//     setSelectedNote(fullNote);
//   };

//   const handleCloseDetails = () => setSelectedNote(null);

//   return (
//     <div className={css.app}>
//       <header className={css.toolbar}>
//         <SearchBox value={search} onChange={handleSearchChange} />
//         {totalPages > 1 && (
//           <Pagination totalPages={totalPages} activePage={page} onPageChange={setPage} />
//         )}
//         <button className={css.button} onClick={() => setModalOpen(true)}>
//           Create note +
//         </button>
//       </header>

//       {isLoading && <p>Loading...</p>}
//       {isError && <p>Error loading notes</p>}

//       {notes.length > 0 && (
//         <NoteList notes={notes} onNoteClick={handleNoteClick} />
//       )}

// {isModalOpen && (
//   <Modal onClose={() => setModalOpen(false)}>
//     <NoteForm onCancel={() => setModalOpen(false)} onAdd={handleCreateNote} />
//   </Modal>
// )}


//       {selectedNote && (
//         <Modal onClose={handleCloseDetails}>
//           <div className={css.container}>
//             <div className={css.item}>
//               <div className={css.header}>
//                 <h2>{selectedNote.title}</h2>
//                 <span className={css.tag}>{selectedNote.tag}</span>
//               </div>
//               <p className={css.content}>{selectedNote.content}</p>
//               {selectedNote.createdAt && (
//                 <p className={css.date}>
//                   {new Date(selectedNote.createdAt).toLocaleDateString()}
//                 </p>
//               )}
//               <button className={css.backBtn} onClick={handleCloseDetails}>
//                 ← Close
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import css from "@/components/NotesPage/NotesPage.module.css";
import type { CreateNotePayload, FetchNotesResponse} from "@/lib/api";
import { fetchNotes, createNote, fetchNoteById, deleteNote } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import { SearchBox } from "@/components/SearchBox/SearchBox";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import type { Note } from "@/types/note";

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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [tag] = useState(initialTag);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Завантаження нотаток
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

  // Створення нотатки
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

  // Видалення нотатки
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onMutate: (id: string) => {
      setDeletingNoteId(id);
    },
    onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
  },
    onSettled: () => {
      setDeletingNoteId(null);
    },
  });

  const handleDeleteNote = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  // Перегляд деталей нотатки
  const handleNoteClick = async (note: Note) => {
    const fullNote = await fetchNoteById(note.id);
    setSelectedNote(fullNote);
  };

  const handleCloseDetails = () => setSelectedNote(null);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearchChange} />
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} activePage={page} onPageChange={setPage} />
        )}
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
          <NoteForm onCancel={() => setCreateModalOpen(false)} onAdd={handleCreateNote} />
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
                <p className={css.date}>
                  {new Date(selectedNote.createdAt).toLocaleDateString()}
                </p>
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
