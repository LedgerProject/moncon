import { useEffect, useState } from 'react';
import { Grid, Typography, makeStyles } from '@material-ui/core'
import apiService from '../../../Services/apiService';
import HistoryElement from './HistoryElement';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    title:{
      fontSize: '2.26rem',     
    },
    container:{
      marginBottom: theme.spacing(3),
    },
    monthTitle:{
      fontSize: '1.50rem',
      fontWeight: 'bold', 
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(2),    
    },
    monthAmount:{
        float: 'right',
        fontWeight: 500,
        fontSize: '1rem',
    },
}));

const PurchaseHistory = () => {
    const classes = useStyles();

    const [purchases, setPurchases] = useState([]);
    const [totalAmount,setTotalAmount] = useState(0.0);
    const [oldestDate,setOldestDate] = useState('');
    const [totalMonthAmount, setTotalMonthAmount] = useState([]);
    const [unlockedPerMonth,setUnlockedPerMonth] = useState([]);
    let lastDate = [];
    let indexMonth = -1;
    let monthAmount = [];
    let unloked = [];

    useEffect(() => {

        apiService.get('user/purchase').then((response) => {
        let data = response.data || [] ;
        data.sort((a,b) => (moment(b.createdAt).diff(a.createdAt)));
        setPurchases(data);
        let amount = 0;
        for (let i = 0; i < data.length; i++) {
            amount += data[i].amount;
        }
        setOldestDate(moment(data[data.length - 1].createdAt).format('DD/MM/YYYY'));
        setTotalAmount(amount);
        let date = '';
        data.forEach((content,i) => {
            if( !(moment(date).isSame(content.createdAt, 'month')) || !(moment(date).isSame(content.createdAt, 'year')) || i === 0){
                date = content.createdAt;
                monthAmount.push(content.amount);
                unloked.push(1);
            }else{
                monthAmount[monthAmount.length - 1] = monthAmount[monthAmount.length - 1] + content.amount;
                unloked[unloked.length - 1] += 1
            }
        });
        setTotalMonthAmount(monthAmount);
        setUnlockedPerMonth(unloked);
    })
    },[]);
    return(
    <>
        <Grid container item xs={12} justify='center'>
          <Grid container item xs={12} justify='center'>
            <Typography variant='h4' className={classes.title} >Purchase History</Typography>
          </Grid>
          <Grid container item xs={10} justify='center' className={classes.container}>
            <Typography variant='body2'>{`${totalAmount}€ for ${purchases.length} unlocks since ${oldestDate}`}</Typography>
          </Grid>
          <Grid container item xs={8}>
            {purchases.map((content, i) => {
                if(!(moment(lastDate).isSame(content.createdAt, 'month')) || !(moment(lastDate).isSame(content.createdAt, 'year')) || i === 0){
                    lastDate = content.createdAt
                    indexMonth++
                    return(<>
                        <Grid container item xs={12}>
                            <Grid container item xs={6} justify='flex-start'>
                                <Typography variant='h5' display='inline' className={classes.monthTitle}>
                                    {`${moment(content.createdAt).format('MMMM YYYY')}`}
                                </Typography>
                            </Grid>
                            <Grid container item xs={6} justify='flex-end'>
                                <Typography variant='caption' display='inline' className={classes.monthAmount}>
                                    {totalMonthAmount[indexMonth]}€ for {unlockedPerMonth[indexMonth]} unlocks
                                </Typography>
                            </Grid>
                        </Grid>
                        <HistoryElement content={content} displayImage={false}/>
                    </>)
                }else{
                    return(<HistoryElement content={content} displayImage={false}/>)
                }
            })
        }
          </Grid>
        </Grid>
    </>
    );
}
export default PurchaseHistory