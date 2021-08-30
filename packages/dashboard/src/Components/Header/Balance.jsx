import apiService from '../../Services/apiService';
import { useState, useEffect } from 'react';
import { Typography, makeStyles, Grid } from '@material-ui/core';
import { getBrowserLocale } from '../../Services/utilsService';

const useStyles = makeStyles(()=>({
    root: {
        marginRight: 20,
    },
    container:{
        padding: 10,
    },
}));

const Balance = ()=> {
    const classes = useStyles()
    const [balance, setBalance] = useState('');
    const [currency, setCurrency] = useState('');

    useEffect(()=>{
        apiService.get('/user/balance')
        .then((response) => {
            setBalance(response.data.balance);
            setCurrency(response.data.currency);
        });
        
    },[]);

    return(
        <div>
            <Grid container direction="column" alignItems="flex-end" alignContent="center" className={classes.root}>
                <Grid item xs>
                    <Typography display='inline' variant='body1'>{currency && new Intl.NumberFormat(getBrowserLocale(), {style: 'currency', currency: currency}).format((balance / 100) || 0)}</Typography>
                </Grid>
                <Grid item xs>
                    <Typography display='inline' variant='caption'>this month</Typography>
                </Grid>
            </Grid>
        </div>
    );

}
export default Balance