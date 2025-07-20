// import { useState } from 'react'
import css from './App.module.css'
import Modal from '../Modal/Modal'
import SearchBox from '../SearchBox/SearchBox'
import { useEffect, useState } from 'react'
import NoteList from '../NoteList/NoteList'
import { useQuery, keepPreviousData, useMutation } from '@tanstack/react-query';
import { fetchNotes} from '../../services/noteService'



function App() {


  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [valueInput, setValueInput] = useState('');
  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', search],
    queryFn: () => fetchNotes(search),
    placeholderData: keepPreviousData,
    enabled: !!search,
  })
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => { setValueInput(event.target.value) };
  useEffect(()=> {
  console.log(setValueInput);
})


  const notesToDisplay = data?.notes || [];


  return (
    <div className={css.app}>
      <header className={css.toolbar}>

        <SearchBox searchProps={() => handleChange} inputValue={valueInput} />
        
        {/* Пагінація */}

        <button className={css.button} onClick={() => setShowModal(true)}>
          Create note +
        </button>

        {showModal && <Modal />}
      </header>
      <NoteList notes={notesToDisplay} />
      {data && <NoteList notes={notesToDisplay} />}
    </div>

  )
}

export default App

