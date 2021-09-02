import React, { useContext, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Tab, Tabs} from '@material-ui/core';
import AvatarMenu from './AvatarMenu';
import { useHistory } from 'react-router-dom';
import AppContext from '../../AppContext';
import { ROLES_PAGES, ROLE_PUBLISHER, ROLES_DEFAULT_ROUTES } from '../../Constants';
import moncon_negro from '../../Assets/Images/moncon_negro.png'
import Balance from './Balance'
import { AppBar, Toolbar, useMediaQuery, Button } from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu";
import Link from '../Link/Link';
import MuiMenu from './MuiMenu';
import MuiMenuItem from './MuiMenuItem';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    cursor: 'pointer',
    marginTop: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
  },
  contentNav:{
    display: 'flex',
    justifyContent: 'flex-end',
    justifyItems: 'end',
    alignContent: 'flex-end',
    textAlign: 'left',
    marginLeft: 'auto',
  },
  tabs: {
    flexGrow: 1,
    display: 'block',
    "@media screen and (max-width: 800px)": {

      display: 'none'
    },
  },
  logo: {
    maxWidth: 100,

  },
  button: {
    marginRight: 20,
    paddingRight: 20
  },
  avatar: {
    marginTop: '10px'
  },
  link:{
    textDecoration: 'none'
  },
  offset: theme.mixins.toolbar,
}));

export default function Header() {
  const classes = useStyles();
  const history = useHistory();
  const [tabIndex, setTabIndex] = useState(0);
  const { userRole } = useContext(AppContext);

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
    history.push(`${window.domain}/mycontent`); 
    FindTabIndex();
  }

  const [anchor, setAnchor] = React.useState(null);
  const open = Boolean(anchor);

  /* Creating a function to handle menu: */
  const handleMenu = (event) => {
    setAnchor(event.currentTarget);
  };

  const link = (route) =>  {
    setAnchor(null);
    history.push(route);
  }

  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("800"));
  const goToDashboard = () => {
    history.push(ROLES_DEFAULT_ROUTES[userRole])
    FindTabIndex()
  };
  return (
    <div className={classes.root}>
      <AppBar position="fixed" color='secondary'>
        <Toolbar>
          <div  className={classes.menuButton}>
            <img src={moncon_negro} onClick={goToDashboard}
            className={classes.logo} alt="Moncon logo"/>
          </div>
          <Tabs value={tabIndex} onChange={handleChange} className={classes.tabs} 
          indicatorColor="primary" textColor="primary" component={Link}>
            { userRole && ROLES_PAGES[userRole].map((page) => <Tab key={page.name} label={page.name} /> )}
          </Tabs>
          
          <div className={classes.contentNav}>
          {
            !isMobile && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  className={classes.button}
                  component="span" 
                  onClick={handleClick}
                >
                  Monetize Content
                </Button>
              )
          }
            <AvatarMenu setTabIndex={setTabIndex}  className={classes.avatar}/>
            {
              !!isMobile && (
                <>
                  <div 
                    onClick={handleMenu} 
                    style={{marginTop: '13px',marginLeft: '15px',cursor: 'pointer'}}
                  >
                    <MenuIcon />
                  </div>

                  <MuiMenu
                    id="menu-appbar"
                    anchorEl={anchor}
                    className={classes.link}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                    KeepMounted
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right"
                    }}
                    open={open}
                  >
                    <div>
                      <MuiMenuItem
                        onClick={() => link('/publishers')} 
                      >
                        DASHBOARD 
                      </MuiMenuItem>
                    </div>
                    <div>
                      <MuiMenuItem
                        onClick={() => link('/mycontent')}
                      >
                        MY CONTENT
                      </MuiMenuItem>
                    </div>

                  </MuiMenu>
                </>
              )
            }
          </div>
        </Toolbar>
      </AppBar>
      <div className={classes.offset} />
    </div>
  );
}
