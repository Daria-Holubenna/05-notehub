import axios from "axios";
const apiKey = import.meta.env.VITE_NOTEHUB_TOKEN;
import type Note from "../types/note";

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

// console.log(fetchNotes('A'));
