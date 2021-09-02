import { useEffect, useState } from 'react';
import { Button, makeStyles, TextField, Typography, Grid, Paper, ThemeProvider, createMuiTheme } from '@material-ui/core';
import apiService from "../../Services/apiService";
import { addNewContent, deleteContent, previewNewUrl } from '../../Services/contentsService';
import Content from '../Publishers/BestContents/Content';
import SectionTitle from '../SectionTitle';
import PreviewUrl from './PreviewUrl/PreviewUrl';
import Successful from '../Successful';
const useStyles = makeStyles((theme) => ({
  containerAddUrl: {
    padding: 20,
    marginBottom: 30,
  "@media screen and (max-width: 800px)": {
      flexDirection: "column",
      textAlign: "center",
      margin: "0 0px"
    }
  },
  buttonMargin: {
  "@media screen and (max-width: 800px)": {
      marginTop: "10px"
    },
  },
}));

const theme = createMuiTheme({
  palette: {
    type:'dark',
    primary: {
      main:"#fff"
    },
    secondary:{
      main:"#1c1c1c"
    },
    background: {
      paper: '#1c1c1c'
    }
  },
})

const PremiumContent = () => {
  const classes = useStyles();
  const [ contents, setContents ] = useState([]);
  const [ newUrl, setNewUrl ] = useState('');
  const [ previewUrl, setPreviewUrl ] = useState( {} );
  const [ displayPreviewUrl, setDisplayPreviewUrl ] = useState(false);
  const [ loadingPreviewUrl, setLoadingPreviewUrl ] = useState(false);
  const [isSuccessful,setSuccessful] = useState(false)
const [ stripeAccountId, setStripeAccountId ] = useState('');
  useEffect(() => {
    apiService.get('/publisher/premiumContent')
      .then((response) => {
        setContents(response.data);
      })
  }, []);


  useEffect(() => {
        apiService.get('/publisher/account')
            .then((response) => {
                setStripeAccountId(response.data.stripeAccountId);
              console.log(response.data.stripeAccountId)
            });
    }, []);

  const handleNewUrlChange = (event) => {
    setNewUrl(event.target.value);
  }

  const handlePreviewUrl = async (url) => {
    try {
      setLoadingPreviewUrl(true);
      setDisplayPreviewUrl(true);
      const previewUrl = await previewNewUrl(url);
      const newState = {
        url: previewUrl.data.url,
        title:previewUrl.data.title,
        image: previewUrl.data.image,
        domain:previewUrl.data.domain,
      }
      setPreviewUrl(newState)
      setLoadingPreviewUrl(false)

    } catch(err) {
      alert(err.response?.data?.error || err.message);
    }
  }

  const handleAddNewContent = async (content) => {
    try {
      const response = await addNewContent(content);
      setNewUrl('');
      setContents(response.data);
      setDisplayPreviewUrl(false);
      setSuccessful(true);

   
    } catch (err) {
      alert(err.response?.data.error);
    }
  }

  const changeContentStatus = async (content) => {
    let response;
    try {
      if (content.status === 'ACTIVE') {
        response = await deleteContent(content);
      } else if (content.status === 'DELETED') {
        response = await addNewContent(content);
      }
      setContents(response.data);
    } catch (err) {
      alert(err.response?.data.error || 'Error deleting content');
    }
  }

  return (
    <>
      {!isSuccessful && (
        <>
         <Grid container>
        <Grid item xs={true}>
          <ThemeProvider theme={theme}>
            <Paper>
              <Grid container alignItems="center" className={classes.containerAddUrl}>
                <Grid item xs={0} sm={3} >
                  <Typography variant="h5" >Monetize your content</Typography>
                </Grid>
                <Grid item xs={7}>
                  <TextField
                    label="Insert your URL here"
                    value={newUrl}
                    fullWidth
                    onChange={handleNewUrlChange}
                  />
                </Grid>
                <Grid item xs={2} className={classes.buttonMargin}>
                  <Grid container justify="center">
                    <Button variant="contained" component="span" disabled={!newUrl.length} onClick={() => handlePreviewUrl(newUrl)}>
                      ADD
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </ThemeProvider>
          {displayPreviewUrl && 
            <PreviewUrl previewUrl ={previewUrl} addUrl={handleAddNewContent} loading={loadingPreviewUrl} stripeAccountId={stripeAccountId}/>
          }
        </Grid>
      </Grid>
       { !!contents.length &&
      <SectionTitle title="Your blocked content" />}
      <Grid container spacing={3} className={classes.marginBottom}>
        <Grid item xs={12}>
          <Grid container spacing={4}>
            { contents.map((content => <Content key={content.url} content={content} changeContentStatus={changeContentStatus} />)) }
          </Grid>
        </Grid>
      </Grid>
          </>
      )}
      {isSuccessful && <Successful  previewUrl={previewUrl}/>}
         </>
  )
}

export default PremiumContent;
