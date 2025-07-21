import css from "./App.module.css";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import { useEffect, useState } from "react";
import NoteList from "../NoteList/NoteList";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";
import NoteForm from "../NoteForm/NoteForm";
import PaginatedItems from "../Pagination/Pagination";



function App() {
  const [search, setSearch] = useState(" ");
  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", search],
    queryFn: () => fetchNotes(search),
    placeholderData: keepPreviousData,
    // enabled: !!search,
  });
  const handleInputChange = (valueInput: string) => {
    setSearch(valueInput);
  };
  useEffect(() => {
    if (search) {
      console.log("dont empty");
    }
    // return () => {
    //   setSearch('');
    //   console.log('Очистка эффекта');
    // };
  }, [search]);
  const notesToDisplay = data?.notes || [];

  const [showModal, setShowModal] = useState(false);
  const closeModalWindow = () => {
    setShowModal(false);
  };
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModalWindow();
      }
    };
    if (showModal) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showModal]);

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearchChange={handleInputChange} />

        <PaginatedItems />

        <button className={css.button} onClick={() => setShowModal(true)}>
          Create note +
        </button>

        {showModal && (
          <Modal>
            <NoteForm cancelButton={closeModalWindow} />
          </Modal>
        )}
      </header>
      <p>your text is: {search}</p>
      {notesToDisplay.length > 0 ? (
        <NoteList notes={notesToDisplay} />
      ) : (
        !isLoading && !isError && <p>No notes found. Create your first note!</p>
      )}
      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes!</p>}
    </div>
  );
}

export default App;
