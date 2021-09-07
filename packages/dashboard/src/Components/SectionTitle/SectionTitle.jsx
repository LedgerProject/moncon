import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  title: {
    marginBottom: 20,
    fontWeight: 700,
    lineHeight: "43,58px",
    "@media screen and (max-width: 800px)": {
      marginTop: "10px",
      textAlign: "center",
    },
  },
}));

const SectionTitle = ({ title }) => {
  const classes = useStyles();

  return (
    <Typography variant="h4" className={classes.title}>
      {title}
    </Typography>
  );
};

export default SectionTitle;
