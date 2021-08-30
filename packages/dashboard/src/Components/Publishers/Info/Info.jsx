import { Card, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { useEffect, useState } from 'react';
import apiService from '../../../Services/apiService';

const useStyles = makeStyles(() => ({
        infoBox: {
            padding: 50,
        }
    }
));

const Info = () => {
    const [info, setInfo] = useState({
        incomes: '',
        contents: '',
        visits: '',
        conversion: ''
    });
    const classes = useStyles();

    const labels = {
        incomes: 'Total Income',
        contents: 'Unlocked Content',
        visits: 'Total Visits',
        conversion: 'Conversion',
    };

    const suffixes = {
        incomes: '€',
        conversion: '%',
    };

    useEffect(() => {
        apiService.get('/publisher/info')
        .then((response)=>{
            if(response && response.data){
                setInfo(response.data);
            }
        });

    }, [])

    return(
        <>
            {Object.keys(info).map((infoKey) => (
                <Grid item xs={6} md={3} className={classes.root}>
                    <Card>
                        <Paper className={classes.infoBox}>
                            <Typography variant="h3" align="center">{info[infoKey] === '' ? 0 : `${Number(info[infoKey]).toLocaleString()}${suffixes[infoKey] || ''}`}</Typography>
                            <Typography variant="h6" align="center">{labels[infoKey]}</Typography>
                        </Paper>
                    </Card>
                </Grid>
            ))}
        </>
    );
}

export default Info;
