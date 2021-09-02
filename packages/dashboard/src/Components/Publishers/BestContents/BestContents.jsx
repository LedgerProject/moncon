import { Grid } from '@material-ui/core';
import { useEffect, useState } from 'react';
import apiService from '../../../Services/apiService';
import { addNewContent, deleteContent } from '../../../Services/contentsService';
import CustomSort from './CustomSort';
import Content from './Content'

const BestContents = ()=> {

    const [bestContent,setBestContent] = useState([]);

    useEffect(() => {
        loadBestContent();
    }, [])

    const loadBestContent = async () => {
        const response = await apiService.get('/publisher/bestContents');
        setBestContent(response.data.sort(CustomSort));
    }

    const changeContentStatus = async (content) => {
        if (content.status === 'ACTIVE') {
          await deleteContent(content);
        } else if (content.status === 'DELETED') {
          await addNewContent(content);
        }
        loadBestContent();
    }

    return (
        <Grid container spacing={4}>
            {bestContent.map((content)=> <Content key={content.url} content={content} changeContentStatus={changeContentStatus} showMetrics />)}
        </Grid>
    );
}

export default BestContents
