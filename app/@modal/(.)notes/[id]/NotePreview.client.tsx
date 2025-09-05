"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import * as React from "react";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./NotePreview.module.css";

type Props = {
  params: Promise<{ id: string }>;
};

export default function NotePreview({ params }: Props) {
  const router = useRouter();
  const { id } = React.use(params); // ✅ unwrap promise with React.use()

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  const handleClose = () => router.back();

  if (isLoading) {
    return <Modal onClose={handleClose}>Loading...</Modal>;
  }

  if (isError || !note) {
    return <Modal onClose={handleClose}>Error loading note</Modal>;
  }

  return (
    <Modal onClose={handleClose}>
      <div className={css.container}>
        <div className={css.item}>
          <div className={css.header}>
            <h2>{note.title}</h2>
            <span className={css.tag}>{note.tag}</span>
          </div>

          <p className={css.content}>{note.content}</p>

          {note.createdAt && (
            <p className={css.date}>
              {new Date(note.createdAt).toLocaleDateString()}
            </p>
          )}

          <button className={css.backBtn} onClick={handleClose}>
            ← Back
          </button>
        </div>
      </div>
    </Modal>
  );
}
