import css from "./App.module.css";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import { useEffect, useState } from "react";
import NoteList from "../NoteList/NoteList";
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import NoteForm from "../NoteForm/NoteForm";
import type NoteTag from "../../types/NoteTag";
import { useDebounce } from 'use-debounce';
import Pagination from "../Pagination/Pagination";


function App() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
 const [debouncedSearch] = useDebounce(search, 500); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; 


  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedSearch, currentPage, itemsPerPage],
    queryFn:   ()=>{const finalSearchTerm = debouncedSearch === "" ? " " : debouncedSearch;


        console.log("Calling fetchNotes with:");
        console.log("  search:", finalSearchTerm, " (type:", typeof finalSearchTerm, ")");
        console.log("  currentPage:", currentPage, " (type:", typeof currentPage, ")");
        console.log("  itemsPerPage:", itemsPerPage, " (type:", typeof itemsPerPage, ")");
         console.log("Calling fetchNotes with:");
        console.log("  search:", finalSearchTerm);
        console.log("  currentPage:", currentPage);
        console.log("  itemsPerPage:", itemsPerPage);


        return fetchNotes(finalSearchTerm, currentPage, itemsPerPage)},
    placeholderData: keepPreviousData,
    // enabled: true,
  });

  const createMutation = useMutation({
    mutationFn: (newNoteData: NoteTag) => createNote(newNoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeModalWindow();
    },
    onError: (error) => {
      console.error("Ошибка создания заметки:", error);
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (noteId: number) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] }); 
    },
    onError: (error) => {
      console.error("Ошибка удаления:", error);
    },
  });

  const handleInputChange = (valueInput: string) => {
    setSearch(valueInput);
     setCurrentPage(1); 
  };
    const closeModalWindow = () => {
    setShowModal(false);
  };
  useEffect(() => {
    if (showModal) {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          closeModalWindow();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [showModal]);

   const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1);
  };

 const notesToDisplay = data?.notes || [];
  const totalPages = data?.totalPages || 0; 


  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearchChange={handleInputChange} />

       {totalPages > 1 && (
  <Pagination
    pageCount={totalPages}
    onPageChange={handlePageClick} 
    currentPage={currentPage}
  />
)}

        <button className={css.button} onClick={() => setShowModal(true)}>
          Create note +
        </button>

        {showModal && (
          <Modal closeWindow={closeModalWindow}>
            <NoteForm
              cancelButton={closeModalWindow}
              onSubmit={(values) => createMutation.mutate(values)}
            />
          </Modal>
        )}
      </header>
      <p>your text is: {search}</p>
      {notesToDisplay.length > 0 ? (
              <NoteList notes={notesToDisplay} deleteNote={(id) => deleteMutation.mutate(id)} />

      ) : (
        !isLoading && !isError && <p>No notes found. Create your first note!</p>
      )}
      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes!</p>}
    </div>
  );
}

export default App;
