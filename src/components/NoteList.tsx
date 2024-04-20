import React, { useMemo, useState } from 'react'
import { Badge, Button, Card, Col, Form, Modal, Row, Stack } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import ReactSelect from 'react-select'
import { Tag } from '../App'
import { Note } from '../App'
import styles from './NoteList.module.css'

type SimplefiedNote = {
    tags:Tag[]
    title:string
    id:string
}
type NoteListProps = {
    availableTags: Tag[]
    notes:Note[];
    deleteTag:(id:string) => void
    updateTag:(id:string,label:string) => void
    
}
type EditTagsModalProps = {
    show:boolean;
    availableTags:Tag[];
    handleClose:() => void
    deleteTag:(id:string) => void
    updateTag:(id:string,label:string) => void
}
const NoteList = ({availableTags,notes,deleteTag,updateTag}:NoteListProps) => {
    const [selectedTags,setSelectedTags] = useState<Tag[]>([])
    const [title,setTitle] = useState<string>('')
    const [editTagsModalIsOpen,setEditTagsModalIsOpen] = useState(false)
    const filteredNotes = useMemo(() => {
        return notes.filter(note => {
            return (
                (title === '' || note.title.toLowerCase().includes(title.toLowerCase())) &&
                ((selectedTags.length === 0) || selectedTags.every(tag => (
                    note.tags.some(noteTag => noteTag.id === tag.id)
                )))
            );
        });
    },[title,selectedTags,notes]);
    

  return (
    <>
    <Row className='align-items-center mb-4'>
        <Col><h1>Notes</h1></Col>
        <Col xs='auto'>
            <Stack gap={2} direction='horizontal'>
                <Link to='/new'>
                    <Button variant='primary'>Create</Button>
                </Link>
                <Button 
                variant='outline-secondary'
                onClick={() => setEditTagsModalIsOpen(true)}
                >Edit Tags</Button>
            </Stack>
        </Col>
    </Row>
    <Form>
        <Row className='mb-4'>
            <Col>
            <Form.Group controlId='title'>
                <Form.Label>Title</Form.Label>
                <Form.Control type='text' value={title} onChange={(e) => setTitle(e.target.value)}/>
            </Form.Group>
            </Col>
            <Col>
            <Form.Group controlId='tags'>
                <Form.Label controledId='Title' >Tags</Form.Label>
                <ReactSelect
                value={selectedTags.map(elem => (
                    {label:elem.label, value: elem.id}
                ))} 
                options={availableTags.map(tag => (
                    {label:tag.label,value:tag.id}
                ))}
                onChange={tags => {
                    setSelectedTags(
                        tags.map(elem => (
                            {label:elem.label,id:elem.value}
                        ))
                    )
                }}
                isMulti/>
            </Form.Group>
            </Col>
        </Row>
    </Form>
    <Row xs={1} sm={2} lg={3} xl={4} className='g-3'>
        {filteredNotes.map(note => (
            <Col key={note.id}>
                <NoteCard id={ note.id} title={note.title} tags = {note.tags} />
            </Col>
        ))}
    </Row>
    <EditTagsModal 
    show={editTagsModalIsOpen} 
    handleClose={() => setEditTagsModalIsOpen(!editTagsModalIsOpen)} 
    availableTags={availableTags}
    deleteTag={deleteTag}
    updateTag={updateTag}
    />
    </>
  )
}

const NoteCard = ({id,title,tags}:SimplefiedNote) => {
    return  (
        <Card as={Link} to={`/${id}`}
        className={`h100 text-reset text-decoration-none ${styles.card}`}>
            <Card.Body>
                <Stack gap={2} className='align-items-center justify-content-center h-100'>
                    <span className='fs-5'>{title}</span>
                    {tags.length > 0 && (
                        <Stack gap={1} direction='horizontal' className='justify-content-center flex-wrap'>
                            {tags.map(tag => (
                                <Badge key={tag.id} className='text-truncate'>{tag.label}</Badge>
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card.Body>
        </Card>
    )
}
const EditTagsModal = ({availableTags,handleClose,show,deleteTag,updateTag}:EditTagsModalProps) => {
    return <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Edit Tags</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Stack gap={2}>
                    {availableTags.map(tag => (
                        <Row key={tag.id}>
                            <Col>
                                <Form.Control type='text' value={tag.label} onChange={e => updateTag(tag.id,e.target.value)}/>
                            </Col>
                            <Col xs='auto'>
                                <Button variant='outline-danger' onClick={() => deleteTag(tag.id)}>&times;</Button>
                            </Col>
                        </Row>
                    ))}
                </Stack>
            </Form>
        </Modal.Body>
    </Modal>
}
export default NoteList