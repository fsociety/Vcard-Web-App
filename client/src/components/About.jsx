import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams } from "react-router-dom";
import sanitizeHtml from 'sanitize-html-react'
import { ContextProvider } from '../context';
import { 
Container,
Typography,
styled,
Avatar,
IconButton
} from '@mui/material';
import {
    Edit,
    Save
} from '@mui/icons-material';

const h1 = {
    fontSize: '3.2em',
    textAlign: 'center',
    mx:'auto',
    color:'#000',
}

export default function About() {
    const [contentEditable, setContentEditable] = useState(false)
    const [aboutContent, setAboutContent] = useState(null);
    const { vcardValues } = useContext(ContextProvider)
    let { vcardId } = useParams();

    const Content = styled('div')({
        marginTop: '24px',
        color:'#000',
        'p': {
            marginBottom: '20px'
        },
        position: 'relative',
        '& > div': {
            userSelect: 'text',
            outline: 'none',
            boxShadow: `${contentEditable ? ' 0px 0px 0px 4px rgba(0,0,0,0.75)' : '0'}`,
        }
    });

    const handleContent = () => {
        const el = document.getElementById("aboutContent");
        if(contentEditable === true){
            const txt = sanitizeHtml(el.innerHTML,{
                allowedTags: ['p']
            });
            axios.post('/vcard/save-about',{about: txt})
            .then(() => setAboutContent(txt))
            .catch(err => console.log(err))
        }
        setContentEditable(!contentEditable);
    }

    useEffect(() => {
        setAboutContent(vcardValues?.about);
    }, [vcardValues])

    return (
        <Container sx={{ py:3, overflow: 'auto' }}>
            <Avatar 
            sx={{
                width:'175px',
                height:'175px',
                mx:'auto',
                mb: '20px',
                border:'5px solid #ccc'
            }}
            variant="circular"
            alt={ vcardValues?.name } 
            src={ vcardValues?.profilePicture } />
            <Typography variant='h1' component="h1" sx={h1} fontWeight={400}>
                { vcardValues?.name }
            </Typography>
            <Typography variant='subtitle1' component="small" color="#000" align='center' mx="auto" display="block" fontSize="24px">
                { vcardValues?.title }
            </Typography>
            <Content>
            { !vcardId && (
                <IconButton 
                onClick={handleContent}
                sx={{
                    position:'absolute',
                    right: 0,
                    top:'-50px',
                    color:'#000',
                    border:'1px solid #ccc'
                }}>
                   {contentEditable ? <Save /> : <Edit />} 
                </IconButton>
            ) }
            <div
            id="aboutContent" 
            suppressContentEditableWarning={true}
            dangerouslySetInnerHTML={{ __html: aboutContent }}
            contentEditable={contentEditable}
            >
            </div>
            </Content>
        </Container>
    )
}
