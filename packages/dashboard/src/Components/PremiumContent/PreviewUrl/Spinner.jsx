import { makeStyles, Grid } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    spinner: {
      padding: 20,
      marginBottom: 30,
      border: '4px solid rgba(0,0,0,0.1)',
      width: theme.spacing(7),
      height: theme.spacing(7),
      borderRadius: '50%',
      borderLeftColor: '#09f',
      animation: '$spin 1s linear infinite',
    },
    "@keyframes spin": {
        "0%": {
        	transform: "rotate(0deg)"
        },
        "100%": {
        	transform: "rotate(360deg)"
        },
    }
  }));

const Spinner = () =>{
	const classes = useStyles()
	return (
		<Grid container justify='center'>
			<div className={classes.spinner}></div>
		</Grid>
	);
}
export default Spinner