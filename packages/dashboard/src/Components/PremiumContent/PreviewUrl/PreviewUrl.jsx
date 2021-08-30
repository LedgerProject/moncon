import { Paper, Grid, Typography, Button, makeStyles, Avatar,TextField } from '@material-ui/core'
import { useState } from 'react'
import Spinner from './Spinner';

const useStyles = makeStyles((theme) => ({
    containerAddUrl: {
      padding: 20,
      marginBottom: 30,
    },
    itemImage: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    }
  }));

const PreviewUrl=({ previewUrl, addUrl, loading }) =>{
    const classes = useStyles()
    const [amount,setAmount] = useState(0)
    const handleAmountChange = (event) =>{
        setAmount(event.target.value)
    }
    const handleBlockClick = () =>{
        if(isNaN(amount) || amount === 0){
            alert('The price should contain only number and should be greater than 0')
            return;
        }
        let info = Object(previewUrl)
        info.amount = parseFloat(amount)
        addUrl(info)
        setAmount(0)
    }
    return(
        <>
            {loading ?
            <Spinner/>
            :
            <Paper>
                <Grid container alignItems="center" className={classes.containerAddUrl}>
                    <Grid item xs="1">
                        <Avatar src={previewUrl.image} variant='square' className={classes.itemImage} />
                    </Grid>
                    <Grid item xs={7}>
                        <Grid container direction="column">
                            <Grid item xs={12}>
                                <Typography variant="caption" gutterBottom display="inline">{previewUrl.domain}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h5" display="inline">{previewUrl.title}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={1}>
                        <TextField
                        label="Price"
                        value={amount}
                        fullWidth
                        onChange={handleAmountChange}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        <Grid container justify='flex-end'>
                            <Button variant="contained" component="span" color='primary'
                            onClick={handleBlockClick}>
                                BLOCK
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            }
        </>
    );
}
export default PreviewUrl