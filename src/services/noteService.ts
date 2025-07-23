import axios from "axios";
const apiKey = import.meta.env.VITE_NOTEHUB_TOKEN;
import type Note from "../types/note";
import type NoteTag from "../types/NoteTag";

interface NoteHttpResp {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  search: string
  // page: number
): Promise<NoteHttpResp> {
  const response = await axios.get<NoteHttpResp>(
    "https://notehub-public.goit.study/api/notes?page=1&perPage=12",
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
  console.log("тут респонса:", response.data.notes);
  return response.data;
}

export const createNote = async (noteData: NoteTag) => {
  const response = await axios.post(
    "https://notehub-public.goit.study/api/notes",
    noteData,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
  console.log(response.data.note.idNewNote);  
  return response.data.note.idNewNote;
};

export const deleteNote = async (NoteId:number)=> {
  const response = await axios.delete(`https://notehub-public.goit.study/api/notes/${NoteId}`,
     {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );
    console.log(response.data.message);
  return response.data.message
}