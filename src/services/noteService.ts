import axios from "axios";
const apiKey = import.meta.env.VITE_NOTEHUB_TOKEN;
import type Note from "../types/note";
import { useId } from "react";

interface NoteHttpResp {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  search: string,
  // page: number
): Promise<NoteHttpResp> {
  const response = await axios.get<NoteHttpResp>(
    "https://notehub-public.goit.study/api/notes",
    {
      params: {
        search,
        // page,
      },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  console.log('тут респонса:', response.data.notes);

  return response.data;
}

type TagType = "Todo" | "Work" | "Shopping" | "Prsonal" | "Meeting";
interface CreateNoteProps{
  title: string,
  content: string,
  tag: TagType,
}
export const createNote = async ({title, content, tag }: CreateNoteProps) =>{
  const response =  await axios.post("https://notehub-public.goit.study/api/notes");
  console.log(response.data.note.idNewNote);
  return response.data.note.idNewNote;
}