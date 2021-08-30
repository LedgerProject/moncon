import { useEffect, useState } from 'react';
import apiService from '../../Services/apiService';
import { Avatar, makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  claimError: {
    backgroundColor: 'red',
    color: '#fff',
    padding: 10
  },
});

const Admin = () => {
  const [users, setUsers] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    apiService.get('/admin/users')
      .then((response) => {
        setUsers(response.data);
      });
  }, []);

  return (
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
                <TableCell>{row.customClaims ? Object.keys(row.customClaims)[0] : <span className={classes.claimError}>ERROR!</span>}</TableCell>
                <TableCell><Avatar alt={row.displayName} src={row.photoURL} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  )
}

export default Admin;
