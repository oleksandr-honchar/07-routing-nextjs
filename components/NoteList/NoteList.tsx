"use client";

import css from "./NoteList.module.css";
import type { Note } from "@/types/note";

type NoteListProps = {
  notes: Note[];
  onNoteClick: (note: Note) => void;
  onDeleteNote: (id: string) => void;
  deletingNoteId: string | null;
};

export default function NoteList({ notes, onNoteClick, onDeleteNote, deletingNoteId }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.listItem}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => onDeleteNote(note.id)}
              disabled={deletingNoteId === note.id}
            >
              {deletingNoteId === note.id ? "Deleting..." : "Delete"}
            </button>
            <button className={css.button} onClick={() => onNoteClick(note)}>
              View details
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
