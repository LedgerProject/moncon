import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Tab, Tabs} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import AvatarMenu from './AvatarMenu';
import { useHistory } from 'react-router-dom';
import AppContext from '../../AppContext';
import { ROLES_PAGES, ROLE_PUBLISHER, ROLE_USER, ROLES_DEFAULT_ROUTES } from '../../Constants';
import moncon_negro from '../../Assets/Images/moncon_negro.png'
import Balance from './Balance'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  tabs: {
    flexGrow: 1,
  },
  logo: {
    maxWidth: 100,
  },
  button: {
    marginRight: 20,
    paddingRight: 20
  },
  offset: theme.mixins.toolbar,
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
  const [tabIndex, setTabIndex] = useState(0);
  const { userRole, logout } = useContext(AppContext);

  const FindTabIndex = () =>{
    const index = userRole && ROLES_PAGES[userRole].findIndex((value) => value.path === history.location.pathname);
    setTabIndex(index > -1 ? index : 0);
  }

  useEffect(() => {
    FindTabIndex()
  }, []); // eslint-disable-line react-hooks/exhaustive-deps


  const handleChange = (event, index) => {
    setTabIndex(index);
    history.push(ROLES_PAGES[userRole][index].path);
  }

  const handleClick = () =>{
    history.push('mycontent'); 
    FindTabIndex();
  }

  const goToDashboard = () => {
    history.push(ROLES_DEFAULT_ROUTES[userRole])
    FindTabIndex()
  };
  return (
    <div className={classes.root}>
      <AppBar position="fixed" color='secondary'>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <img src={moncon_negro} onClick={goToDashboard}
            className={classes.logo} alt="Moncon logo"/>
          </IconButton>
          <Tabs value={tabIndex} onChange={handleChange} className={classes.tabs} 
          indicatorColor="primary" textColor="primary" >
            { userRole && ROLES_PAGES[userRole].map((page) => <Tab key={page.name} label={page.name} /> )}
          </Tabs>
          {(userRole === ROLE_PUBLISHER) && <Button variant="contained" color="primary" className={classes.button}
          component="span" onClick={handleClick}>
            Monetize Content
          </Button>}
          {(userRole === ROLE_USER) && <Balance/>}
          <AvatarMenu setTabIndex={setTabIndex}/>
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </div>
  );
}
