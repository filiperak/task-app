import React, { useRef ,FormEvent, useState} from 'react'
import { Button, Col, Form , Row,Stack} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CreatableReactSelect from 'react-select/creatable'
import { NoteData,Tag } from '../App'
import { v4 as uuidv4 } from 'uuid'

type NoteFormProps = {
    onSubmit: (data:NoteData) => void;
    onAddTag:(tag:Tag) => void
    availableTags:Tag[];
} & Partial<NoteData>
const NoteForm = ({onSubmit,
    onAddTag,
    availableTags,
    title='',
    markdown='',
    tags=[]
    }:NoteFormProps) => {
    const navigate = useNavigate();
    const titleRef = useRef<HTMLInputElement>(null)
    const markdownRef = useRef<HTMLTextAreaElement>(null)
    const [selectedTags,setSelectedTags] = useState<Tag[]>(tags)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        onSubmit({
            title:titleRef.current!.value,
            markdown:markdownRef.current!.value,
            tags:selectedTags
        })
        navigate(-1)
    }

  return (
    <Form onSubmit={handleSubmit}>
        <Stack gap={4}>
            <Row>
                <Col>
                    <Form.Group controlId='title'>
                        <Form.Label controledId='Title' >Title</Form.Label>
                        <Form.Control required ref={titleRef} defaultValue={title}/>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId='tags'>
                        <Form.Label controledId='Title' >Tags</Form.Label>
                        <CreatableReactSelect
                        onCreateOption={label => {
                            const newTag = {id:uuidv4(),label}
                            onAddTag(newTag)
                            setSelectedTags(prev => [...prev,newTag])
                        }}
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
            <Form.Group controlId='markdown'>
                <Form.Label>Body</Form.Label>
                <Form.Control required as='textarea' rows={15} ref={markdownRef} defaultValue={markdown}/>
            </Form.Group>
            <Stack direction='horizontal' gap={2} className='justify-content-end'>
                <Button type='submit' variant='primary'>
                    Save
                </Button>
                <Link to='..'>
                    <Button type='button' variant='outline-primary'>
                        Cancel
                    </Button>
                </Link>
            </Stack>
        </Stack>
    </Form>
  )
}

export default NoteForm