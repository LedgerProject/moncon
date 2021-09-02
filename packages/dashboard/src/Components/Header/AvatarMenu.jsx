import { Menu, MenuItem, Avatar, Typography, makeStyles } from "@material-ui/core"
import { useContext, useState } from 'react'
import AppContext from '../../AppContext';
import { useHistory } from 'react-router-dom';
import { ROLES_DEFAULT_ROUTES } from '../../Constants'

const useStyles = makeStyles(() => ({
    pointer: {
        cursor: 'pointer',
      marginTop: '5px',
    },
}));

const AvatarMenu = (props) => {
    const classes = useStyles();
    const { userPhoto, userRole, logout } = useContext(AppContext);
    const history = useHistory();
    const [anchorEl,setAnchorEl] = useState(null);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const handleClose = () =>{
        setAnchorEl(null);
    }
    const handleLogout = () =>{
        handleClose();
        logout();
    }
    const handleSettings = () =>{
        handleClose();
        history.push(ROLES_DEFAULT_ROUTES[userRole]  + "/settings")
        props.setTabIndex(ROLES_DEFAULT_ROUTES[userRole].length)
    }

    return(
        <>
            <Avatar src={userPhoto} onClick={handleClick} 
            aria-haspopup="true" alt='user image' className={classes.pointer} />
            <Menu anchorEl={anchorEl} 
            keepMounted open={Boolean(anchorEl)}
                  
            onClose={handleClose}>
                <MenuItem>
                    <Typography variant='body2' onClick={handleSettings}>Settings</Typography>
                </MenuItem>
                <MenuItem >
                    <Typography variant='body2' onClick={handleLogout}>Logout</Typography>
                </MenuItem>
            </Menu>
        </>
    );
}

export default AvatarMenu;
