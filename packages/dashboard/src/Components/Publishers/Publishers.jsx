import { useEffect, useState } from "react";
import { Grid, makeStyles } from "@material-ui/core";
import BestContents from "./BestContents/BestContents";
import Info from "./Info/Info";
import Chart from "./Chart/Chart";
import SectionTitle from "../SectionTitle";
import apiService from "../../Services/apiService";

const useStyles = makeStyles(() => ({
  marginBottom: {
    marginBottom: 20,
  },
}));

const Publishers = () => {
  const classes = useStyles();
  const [contents, setContents] = useState([]);

  useEffect(() => {
    apiService.get("/publisher/bestContents").then((response) => {
      setContents(response.data);
    });
  }, []);
  return (
    <>
      <SectionTitle title="Dashboard" />
      <Grid container spacing={3} className={classes.marginBottom}>
        <Info />
      </Grid>
      <Grid container spacing={3} className={classes.marginBottom}>
        <Grid item xs>
          <Chart/>
        </Grid>
      </Grid>
        {
          !!contents.length && 
            <SectionTitle title="Content with higher conversion rate" />
        }
      <Grid container spacing={3} className={classes.marginBottom}>
        <Grid item xs>
          <BestContents />
        </Grid>
      </Grid>
    </>
  );
};

export default Publishers;
