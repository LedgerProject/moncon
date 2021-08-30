import { Grid, Typography, makeStyles } from '@material-ui/core';
import { useEffect, useState } from 'react';
import apiService from '../../Services/apiService';
import Purchases from './Purchases/Purchases';

const useStyles = makeStyles((theme) => ({
    title:{
      fontSize: '2.26rem',     
    },
    container:{
      marginBottom: theme.spacing(3),
    }
}));

const Users = () => {
  const [purchases,setPurchases] = useState([]);
  const classes = useStyles();

  useEffect(() => {
    apiService.get('user/purchase').then((response) => {
      let data = response.data || []
      setPurchases(data)
    })
  }, [])

  return (
      <Grid container justify='center' >
        <Grid container item xs={10} justify='center' className={classes.container}>
          <Grid container item xs={5} justify='flex-start'>
            <Typography variant='h4' className={classes.title} >Unlocked Content</Typography>
          </Grid>
          <Grid container item xs={12} justify='center'>
            <Grid container item xs={5} justify='flex-start'>
              <Typography variant='body2'>{`${purchases.length} Articles`}</Typography>
            </Grid>
          </Grid>
        </Grid>
        {purchases.map((content) => <Purchases content={content}/>)}
      </Grid>
  );
}

export default Users;
