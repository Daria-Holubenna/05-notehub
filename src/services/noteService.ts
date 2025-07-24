import axios from "axios";
const apiKey = import.meta.env.VITE_NOTEHUB_TOKEN;
import type Note from "../types/note";
import type NoteTag from "../types/NoteTag";

interface NoteHttpResp {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  search: string,
  page: number = 1,
  perPage: number = 12
): Promise<NoteHttpResp> {
  const response = await axios.get<NoteHttpResp>(
    "https://notehub-public.goit.study/api/notes",
    {
      params: {
        search,
        page,
        perPage,
      },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  return response.data;
}

export interface CreateNoteResponse {
  id: number;
  title: string;
  content: string;
  tag: string;
}
export const createNote = async (
  noteData: NoteTag
): Promise<CreateNoteResponse> => {
  const response = await axios.post<CreateNoteResponse>(
    "https://notehub-public.goit.study/api/notes",
    noteData,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  return response.data;
};

export interface DeleteNoteResponse {
  id: number;
  title: string;
  content: string;
  tag: string;
}
export const deleteNote = async (
  NoteId: number
): Promise<DeleteNoteResponse> => {
  const response = await axios.delete<DeleteNoteResponse>(
    `https://notehub-public.goit.study/api/notes/${NoteId}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  return response.data;
};
