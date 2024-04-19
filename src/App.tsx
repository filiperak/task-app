import React, { useMemo } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import NewNote from './components/NewNote';
import { useLocalStorage } from './utils/useLocalStorage'
import { v4 as uuidv4 } from 'uuid';
import NoteList from './components/NoteList';

export type Note = {
  id:string
}& NoteData
export type RawNote = {
  id:string
}&RawNoteData
export type RawNoteData = {
  title:string;
  markdown:string;
  tagIds:string[];
}
export type NoteData = {
  title:string;
  markdown:string;
  tags: Tag[]
}
export type Tag = {
  id:string;
  label:string;
}

function App() {
  const [notes,setNotes] = useLocalStorage<RawNote[]>('NOTES',[])
  const [tags,setTags] = useLocalStorage<Tag[]>('TAGS',[])

  const noteWithTags = useMemo(() => {
    return notes.map(note => {
      return{...note,tags:tags.filter(tag => note.tagIds.includes(tag.id))}
    })
  },[notes,tags])

  const onCreateNote = ({tags, ...data}:NoteData) => {
    setNotes(prevNotes => (
      [...prevNotes,{...data,id:uuidv4(),tagIds:tags.map(tag => tag.id)}]
    ))
  }
  const addTag = (tag:Tag) => {
    setTags(prev => [...prev,tag])
  }
  return (
    <Container className='my-4'>
    <Routes>
      <Route path='/' element={<NoteList/>}/>
      <Route path='/new' element={<NewNote onSubmit={onCreateNote} onAddTag={addTag} availableTags={tags}/>}/>
      <Route path='/:id'>
        <Route index element={<h1>show</h1>}/>
        <Route path='edit' element={<h1>edit</h1>}/>
      </Route>
      <Route path='*' element={<Navigate to={'/'}/>}/>
    </Routes>
    </Container>

  );
}

export default App;
