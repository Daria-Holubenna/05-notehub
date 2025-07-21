// import { useState } from 'react'
import css from './App.module.css'
import Modal from '../Modal/Modal'
import SearchBox from '../SearchBox/SearchBox'
import { useEffect, useState } from 'react'
import NoteList from '../NoteList/NoteList'
import { useQuery, keepPreviousData, useMutation } from '@tanstack/react-query';
import { fetchNotes} from '../../services/noteService'
import { createNote } from '../../services/noteService'
import NoteForm from '../NoteForm/NoteForm'



function App() {


  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [search, setSearch] = useState(' ');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', search],
    queryFn: () => fetchNotes(search),
    placeholderData: keepPreviousData,
    // enabled: !!search,
  })
  const handleInputChange = (valueInput:string) => {
    setSearch(valueInput);
  }
  console.log(createNote);
  
  useEffect(() => {
    if (search) {
      console.log('dont empty');
    };
    // return () => {
    //   setSearch('');
    //   console.log('Очистка эффекта');
    // };
  }, [search]);
// useEffect(()=>{
//   if(!showModal){
//     return null;
//   } 
// })

useEffect(()=>{
  const closeModalWindow = (showModal, setShowModal)=>{
  const handleKeyDown = (event) => {
    if(event.key === 'Escape'){
      setShowModal(false);
    }

  }
}
  if(showModal){
    document.addEventListener('keydown', closeModalWindow);
  } 
   return () => {
      document.removeEventListener('keydown', closeModalWindow);
    };
}, [showModal])



  const notesToDisplay = data?.notes || [];


  return (
    <div className={css.app}>
      <header className={css.toolbar}>

        <SearchBox  onSearchChange={handleInputChange} />

        {/* Пагінація */}

        <button className={css.button} onClick={() => setShowModal(true)}>
          Create note +
        </button>
      
        {showModal && <Modal><NoteForm/></Modal>}
      </header>
        {isLoading && <p>Loading notes...</p>}
      {isError && <p>Error loading notes!</p>}
        <p>your text is: {search}</p>
      {data && <NoteList notes={notesToDisplay} />}
    </div>

  )
}

export default App

