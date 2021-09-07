import { Card, Grid, makeStyles, Paper, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import apiService from "../../../Services/apiService";

const useStyles = makeStyles(() => ({
  infoBox: {
    padding: 50,
  },
  infoNumber: {
    fontWeight: 700,
    lineHeight: "2",
  },
  currency: {
    fontWeight: 400,
    lineHeight: "21,79px",
    fontSize: "1.4rem",
  },
  infoText: {
    fontWeight: 400,
    lineHeight: "24,52px",
  },
}));

const Info = () => {
  const [info, setInfo] = useState({
    incomes: "",
    contents: "",
    visits: "",
    conversion: "",
  });
  const classes = useStyles();

  const labels = {
    incomes: "Total Income",
    contents: "Unlocked Content",
    visits: "Total Visits",
    conversion: "Conversion",
  };

  const suffixes = {
    incomes: <span className={classes.currency}>€</span>,
    conversion: <span className={classes.currency}>%</span>,
  };

  useEffect(() => {
    apiService.get("/publisher/info").then((response) => {
      if (response && response.data) {
        setInfo(response.data);
      }
    });
  }, []);

  return (
    <>
      {Object.keys(info).map((infoKey) => (
        <Grid item xs={6} md={3} className={classes.root} key={infoKey}>
          <Card>
            <Paper className={classes.infoBox}>
              <Typography
                className={classes.infoNumber}
                variant="h3"
                align="center"
              >
                {info[infoKey] === ""
                  ? 0
                  : `${Number(info[infoKey]).toLocaleString()}`}
                {suffixes[infoKey] || ""}
              </Typography>
              <Typography
                className={classes.infoText}
                variant="h6"
                align="center"
              >
                {labels[infoKey]}
              </Typography>
            </Paper>
          </Card>
        </Grid>
      ))}
    </>
  );
};

export default Info;
