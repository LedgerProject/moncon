import { Grid, makeStyles } from '@material-ui/core';
import BestContents from './BestContents/BestContents';
import Info from './Info/Info'
import Chart from './Chart/Chart'
import SectionTitle from '../SectionTitle';

const useStyles = makeStyles(() => ({
  marginBottom: {
      marginBottom: 20,
  }
}));

const Publishers = () => {
  const classes = useStyles();

  return (
    <>
      <SectionTitle title="Dashboard" />
      <Grid container spacing={3} className={classes.marginBottom}>
        <Info/>
      </Grid>
      <Grid container spacing={3} className={classes.marginBottom}>
        <Grid item xs>
          <Chart></Chart>
        </Grid>
      </Grid>
      <SectionTitle title="Content with higher conversion rate" />
      <Grid container spacing={3} className={classes.marginBottom}>
        <Grid item xs>
          <BestContents/>
        </Grid>
      </Grid>
    </>
  );
}

export default Publishers;
