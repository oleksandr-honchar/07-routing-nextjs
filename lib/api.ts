import axios from "axios";
import type { Note } from "../types/note";

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export type FetchNotesParams = {
  page: number;
  perPage: number;
  search: string;
};

export type CreateNotePayload = {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
};

// Базовий URL та токен для SSR і клієнта
const API_URL = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    "Content-Type": "application/json",
  },
});

export async function fetchNotes({
  page,
  perPage,
  search,
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const res = await api.get<FetchNotesResponse>("/notes", { params: { page, perPage, search } });
  return res.data;
}

export async function createNote(payload: CreateNotePayload): Promise<Note> {
  const res = await api.post<Note>("/notes", payload);
  return res.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<Note>(`/notes/${id}`);
  return res.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<Note>(`/notes/${id}`);
  return res.data;
}