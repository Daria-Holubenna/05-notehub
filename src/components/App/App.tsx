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
import { useDebounce } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedSearch, currentPage, itemsPerPage],
    queryFn: () => {
      const finalSearchTerm = debouncedSearch === "" ? " " : debouncedSearch;
      return fetchNotes(finalSearchTerm, currentPage, itemsPerPage);
    },
    placeholderData: keepPreviousData,
    // enabled: true,
  });

  const createMutation = useMutation({
    mutationFn: (newNoteData: NoteTag) => createNote(newNoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      closeModalWindow();
      toast.success("The note was created successfully!");
      setCurrentPage(1);
    },
    onError: (error) => {
      console.error("Ошибка создания заметки:", error);
      toast.error(
        "An error occurred while creating a note. No note was created!"
      );
    },
  });
  const deleteMutation = useMutation({
    mutationFn: (noteId: number) => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note successfully deleted!");
    },
    onError: (error) => {
      console.error("Ошибка удаления:", error);
      toast.error(
        "An error occurred while deleting a note. The note was not deleted!"
      );
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
      {notesToDisplay.length > 0 ? (
        <NoteList
          notes={notesToDisplay}
          deleteNote={(id) => deleteMutation.mutate(id)}
        />
      ) : (
        !isLoading && !isError && <p>No notes found. Create your first note!</p>
      )}
      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes!</p>}
      <Toaster />
    </div>
  );
}

export default App;
