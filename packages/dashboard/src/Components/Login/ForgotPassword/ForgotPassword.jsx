import { TextField, Button, Grid, Typography, makeStyles, FormHelperText } from '@material-ui/core';
import { useContext, useEffect, useState } from 'react'
import firebaseService from '../../../Services/firebaseService';

export const useStyles = makeStyles((theme) =>({
    subTitle:{
        padding: '0 20px 10px',
        fontWeight: 'bold',
    },
    recoverButton:{
        textAlign: 'center',
        marginBottom: theme.spacing(2),
        marginTop: theme.spacing(2),
    },
    labels:{
        color:'#a3a9ae',
        marginBottom: 10,
        cursor: 'pointer',
    },
    contactLink:{
    	textDecoration:'underline',
    },
    contactText:{
    	color:'#a3a9ae',
        marginBottom: 20,
    },
}))

const ForgotPassword = ({close}) => {
	const [email,setEmail] = useState('');
	const [emailSended,setEmailSended] = useState(false);
	const [error, setError] = useState(null)
	const auth = firebaseService.auth();

	const handleRecoverPassword = () => {
		if(email == ''){
			setError('you need to write and email');
			return;
		}
		auth.useDeviceLanguage();
		auth.sendPasswordResetEmail(email).then(function() {
			setEmailSended(true);
}		).catch(function(error) {
 			 setError(error.message);
 			 setEmailSended(false);
		});
	};
	const classes = useStyles();
	return(
		<>
			<Grid container justify='center'>
				<Typography variant='subtitle1' className={classes.subTitle}>
					{emailSended ? 'We send you and email with your recover password link' :'Recover your password'}
				</Typography>
			</Grid>
            {emailSended? (
				<Grid container justify='center'>
					<Typography variant='body2' className={classes.contactText}>
						If you don't see it check your spam or <span className={classes.contactLink}>contact us </span>
					</Typography>
				</Grid>            
            ):
            (<>
				<Grid container justify='center'>
	                <TextField label='Your email addres' value={email} onChange={(event) => setEmail(event.target.value)} className={classes.textField}></TextField>
	            </Grid>
	            <Grid container justify='center'>
                	<FormHelperText error={error} className={classes.error}>{error || ' '}</FormHelperText>
                </Grid>
				<Grid container justify='center'>
					<Button variant="contained" color="primary" className={classes.recoverButton} onClick={handleRecoverPassword}>Recover password</Button>
				</Grid>

            </>	)
            }
			<Grid container justify='center'>
				<Typography variant='body2' className={classes.labels} onClick={() => close(false)}>Back to Login</Typography>
			</Grid>
		</>
	);
}

export default ForgotPassword