import { makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  title: {
      marginBottom: 20,
  }
}));

const SectionTitle = ({ title }) => {
  const classes = useStyles();
 
  return (
    <Typography variant="h4" className={classes.title}>{title}</Typography>
  )
}

export default SectionTitle;
