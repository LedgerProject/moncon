import { useEffect, useState } from "react";
import apiService from "../../Services/apiService";
import {
  Avatar,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  TextField,
  Typography,
  Button,
  FormHelperText
} from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import SectionTitle from "../SectionTitle";

const useStyles = makeStyles((theme) =>({
  table: {
    minWidth: 650,
  },
  claimError: {
    backgroundColor: "red",
    color: "#fff",
    padding: 10,
  },

  root: {
    padding: 20,
  },
  texField: {
    margin: 20,
  },
  button: {
    margin: 20,
    paddingRight: 85,
    paddingLeft: 85,
  },
  paper: {
    width: theme.spacing(40),
    borderRadius: 10,
    padding: "30px 0",
  },
}));

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const { addToast } = useToasts();

  const classes = useStyles();

  const getUsersData = () => {
    return apiService.get("/admin/users").then((response) => {
      setUsers(response.data);
    });
  }

  const createIssuer = async () => {
    setError(null)
    if(!password.trim()){
      return setError('You need to enter a password')
    }
    if(!email.trim()){
      return setError('You need to enter a email')
    }

    addToast("Creating issuer, please wait",{
      appearance: "info",
      autoDismiss: true,
      autoDismissTimeout: 5000,
    });
    
    const response = await apiService.post('/admin/create-issuer',{password, email});

    if(!response?.data?.success){
      console.log(response)
      return setError(response.data.error);
    }

    getUsersData();

    return addToast('issuer created',{
      appearance: "success",
      autoDismiss: true,
      autoDismissTimeout: 5000,
    })

  }

  useEffect(() => {
    getUsersData()
  }, []);

  return (
    <>
      <SectionTitle title="Admin Dashboard" />
      <Grid container spacing={3}>
        <TableContainer component={Paper}>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Display Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last Sign In</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Photo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((row) => (
                <TableRow key={row.uid}>
                  <TableCell component="th" scope="row">
                    {row.displayName}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.metadata.creationTime}</TableCell>
                  <TableCell>{row.metadata.lastSignInTime}</TableCell>
                  <TableCell>
                    {row.customClaims ? (
                      Object.keys(row.customClaims)[0]
                    ) : (
                      <span className={classes.claimError}>ERROR!</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Avatar alt={row.displayName} src={row.photoURL} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
      <Grid container spacing={3} justify="center" className={classes.root}>
        <SectionTitle title="Create Issuer Account" />
        <Grid container item xs={9} justify="center">
          <Paper className={classes.paper}>
              <Grid container justify="center">
                <TextField
                  label="Your email addres"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={classes.textField}
                />
              </Grid>
              <Grid container justify="center">
                <TextField
                  label="Your password"
                  value={password}
                  type="password"
                  onChange={(event) => setPassword(event.target.value)}
                  className={classes.textField}
                />
              </Grid>
              <Grid container justify="center">
                <FormHelperText error={error}>
                  {error || ''}
                </FormHelperText>
              </Grid>
              <Grid container justify="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={createIssuer}
                  className={classes.button}
                >
                  Create Issuer
                </Button>
              </Grid>
          </Paper>
        </Grid>
      </Grid>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
    </>
  );
};

export default Admin;
