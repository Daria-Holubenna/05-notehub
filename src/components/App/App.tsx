import css from "./App.module.css";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import { useState } from "react";
import NoteList from "../NoteList/NoteList";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchNotes } from "../../services/noteService";

import NoteForm from "../NoteForm/NoteForm";
import { useDebounce } from "use-debounce";
import Pagination from "../Pagination/Pagination";

function App() {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [debouncedSearch] = useDebounce(search, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const openModalWindow = () => setShowModal(true);
  const closeModalWindow = () => {
    setShowModal(false);
    setCurrentPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", debouncedSearch, currentPage, itemsPerPage],
    queryFn: () => {
      const finalSearchTerm = debouncedSearch === "" ? " " : debouncedSearch;
      return fetchNotes(finalSearchTerm, currentPage, itemsPerPage);
    },
    placeholderData: keepPreviousData,
    // enabled: true,
  });

  const handlePageClick = (selectedItem: { selected: number }) => {
    setCurrentPage(selectedItem.selected + 1);
  };

  const handleInputChange = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
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
            currentPage={currentPage - 1}
          />
        )}

        <button className={css.button} onClick={openModalWindow}>
          Create note +
        </button>

        {showModal && (
          <Modal closeWindow={closeModalWindow}>
            <NoteForm onCancel={closeModalWindow} />
          </Modal>
        )}
      </header>
      {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes!</p>}
      {!isLoading &&
        !isError &&
        (notesToDisplay.length > 0 ? (
          <NoteList notes={notesToDisplay} />
        ) : (
          <p>No notes found. Create your first note!</p>
        ))}
    </div>
  );
}

export default App;
