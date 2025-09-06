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
  tag: string;
};

export type CreateNotePayload = {
  title: string;
  content: string;
  tag: string;
};

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
  tag
}: FetchNotesParams): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = { page, perPage };
  if (search) params.search = search;
  if (tag && tag.toLowerCase() !== "all") {
    const tagMap: Record<string, string> = {
      todo: "Todo",
      work: "Work",
      personal: "Personal",
      meeting: "Meeting",
      shopping: "Shopping",
    };
    const backendTag = tagMap[tag.toLowerCase()];
    if (backendTag) params.tag = backendTag;
  }
  console.log("➡ API params:", params);
  const res = await api.get<FetchNotesResponse>("/notes", { params });
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