import { useSelector } from "react-redux";
import { Grid, Typography, Avatar } from "@material-ui/core";
import { useToasts } from 'react-toast-notifications';
import apiService from '../../services/apiService';
import { useStyles } from "./styled";
import IconDocuments from '../../Assets/svg/IconDocuments';
import { LS_DID_KEY } from '../../Const';

const Article = (  ) => {
  const classes = useStyles();
  const articles = useSelector((state) => state.UserReducer.articles);
  const { addToast } = useToasts();
  
  const handleClick = async (url) => {
    const userId = localStorage.getItem(LS_DID_KEY)
    const response = await apiService.post('user/token',{userId});
    const token = response?.data.token;
    console.log(token)
    
    if(!token){
      console.log(response)
      addToast('Error retrieving token', 
        { 
          appearance: 'error',
          autoDismiss: true,
          autoDismissTimeout: 3000 
        }
      );
      return
    }

    if(!url.endsWith("/")){
      return window.open(`${url}/?token=${encodeURIComponent(token)}`)
    }
    return window.open(`${url}?token=${encodeURIComponent(token)}`)
  }

  return !!articles.length ?(

  <>
    <div className={classes.titleHistory}>Articles</div>
    {
      articles.map((art,index) =>(
        <Grid 
        container
        className={classes.root} 
        justifyContent='center'
        key={art.url}
        onClick={() => handleClick(art.url)}
        index={index}>
        
          <Grid 
            container 
            item xs={12} sm={11} md={9} lg={8}
            className={classes.cardContainer}
            alignItems="center"
            
          >
            <Grid item xs={2} sm={1}>
              {
                !!art?.img ? (
                  <Avatar
                    variant="square"
                    src={art.img}
                    className={classes.cardImage}
                  />
                ):(
                  <div className={classes.imageFallback}>
                    <IconDocuments
                    height={'4em'}
                    width={"3.5em"}
                    color={'#1c1c1c'}/>
                  </div>
                )
              }
            </Grid>  
            <Grid container justifyContent='flex-start' item xs={9}>
              <Typography className={classes.previewtitle} variant="h5">
                {art.title}
              </Typography>
            </Grid> 
          </Grid>   
        </Grid>

      ))
    }
    
          </>
  ) : (
  <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          textAlign: 'center',
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          color: 'rgba(0, 0, 0, 0.6)',
          fontSize: '20px',
          fontWeight: 500,
        }}
        >
        There are no articles yet
    </div>  
  )}
export default Article

