import { Typography , TextField, Button, Paper, makeStyles, Grid } from "@material-ui/core";
import { useEffect, useState } from 'react';
import apiService from '../../../Services/apiService.js';

const useStyles = makeStyles((theme) => ({
    root: {
        padding:20,
    },
    description: {
        marginBottom: 20,
    },
    textField: {
        width: '60%',
    },
}));

const PaymentSettings = ()=>{
    const classes = useStyles()
    const [ paymentPointer, setPaymentPointer ] = useState('');

    useEffect(() => {
        apiService.get('/publisher/paymentPointer')
            .then((response) => {
                setPaymentPointer(response.data);
            });
    }, []);

    const handlePaymentPointChange = (event) => {
        setPaymentPointer(event.target.value);
    }

    const savePaymentPointer = () => {
        const response = apiService.post('/publisher/paymentPointer', { paymentPointer });
        console.log(response.data);
    }

    return(
            <Paper className={classes.root} elevation={0} >
                <Grid className={classes.description}>
                    <Typography variant='h6'>Add Your Payment point</Typography>
                    <Typography variant='subtitle2' >Create and account on Uphold and insert here 
                    your payment point to recive your payments</Typography>
                </Grid>
                <Grid>
                    <TextField label="Insert payment point" 
                    value={paymentPointer} className={classes.textField} onChange={handlePaymentPointChange}/>
                    <Button variant="contained" color="primary" component="span" onClick={savePaymentPointer} >
                        Save
                    </Button>
                </Grid>
            </Paper>
    );
}
export default PaymentSettings