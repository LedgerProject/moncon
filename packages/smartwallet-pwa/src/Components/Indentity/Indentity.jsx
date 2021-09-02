import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useStyles } from "./styled";
import { v4 as uuidv4 } from 'uuid';
import { post } from "../../services/apiHandler.js";
import { Fab, Button, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import IconEdit from "../../Assets/svg/IconEdit";
import Check from "../../Assets/svg/Check";
import { useToasts } from 'react-toast-notifications'
import Field from "./Field";
import DinamycField from "./DinamycField";
import LoadingButton from "../Utils/LoadingButton";
import {
  credential_mobil,
  credential_email,
  credential_address,
  credential_birthday,
  LS_DID_KEY
} from "../../Const";

const Identity = () => {
  const { addToast } = useToasts()
  const classes = useStyles();
  const dispatchUserData = useDispatch();
  const [data, setData] = useState(null);
  const name = useSelector((state) => state.UserReducer.name.value);
  const lastName = useSelector((state) => state.UserReducer.lastName.value);  
  const dinamycFields = useSelector((state) => state.UserReducer.dynamicFields);
  const address = useSelector(
    (state) => state.UserReducer[credential_address].value.address
  );
  const id = useSelector((state) => state.UserReducer[credential_address].id);
  const userId = localStorage.getItem(LS_DID_KEY);
  
  const credential = async () => {
    let credentialSubject;
    if(!userId){
      let id = `did:moncon:${uuidv4()}`;
      localStorage.setItem(LS_DID_KEY,id);
      credentialSubject = {
        id: id,
         credential: {
          id: `did:moncon:${uuidv4()}`,
        },
      };
    }else{
      credentialSubject = {
        id: userId,
        credential: {
          id: `did:moncon:${uuidv4()}`,
        },
      };
    }
    if(!address){
      return addToast('Add a value to the identity', { appearance: 'error',autoDismiss: true, autoDismissTimeout: 4000 });
    }
    credentialSubject.credential[address] = address
    const res = await post(credentialSubject)
    let data = res.data;
    setData(data);
    console.log(res);

    console.log(res.data)
    const payload = {id: `${id}`};
    if(hasCredentials !== 'true'){
      payload.status = 'true'
    }
      if(data !== undefined){
   dispatchUserData({
      type: 'update',
      payload 
    })  } else {
addToast('An error has occurred, check the data!', { appearance: 'error',autoDismiss: true, autoDismissTimeout: 4000 })
    }
  } 

 const [stateIn, setState] = useState({
        loading: false,
        finished: false,
    credential
    });

    const {loading, finished} = stateIn;

    const onClick = () => {
        setState({ ...stateIn, loading: true });

        setTimeout(() => {
          
            setState({ ...stateIn, loading: false });
        }, 1800);
    }

    useEffect(() => {
      if (data) {
        localStorage.setItem(credential_address, JSON.stringify(data));
 addToast('Verified credential', { appearance: 'success',autoDismiss: true, autoDismissTimeout: 2000 });
      }
    }, [data,addToast]);

const hasCredentials = localStorage.hasOwnProperty(`credential_address`) || Boolean(data)

  return (
    <>
      <div className={classes.root}>
        <h1 className={classes.titleH1}>Personal</h1>
        <div className={classes.contentPersonal}>
          <Fab
            component={Link}
            to="/identity/edit/name"
            color="secondary"
            aria-label="edit"
            className={classes.fab}
          >
            <IconEdit />
          </Fab>
          <div>
            <p className={classes.titleName}>Give Name</p>

            <h1 className={classes.name}>{name || "---"}</h1>

            <p className={classes.titleName}>Family Name</p>
            <h1 className={classes.name}>{lastName || "---"}</h1>
          </div>
        </div>

        <div>
          <h1 className={classes.titleH1}>Contact</h1>
          <Field to="/identity/edit/email" path={credential_email} title="Email" field="email"/>          
          <Field to="/identity/edit/mobile" path={credential_mobil} title="Mobile Phone" field="mobil"/>          
          <Field to="/identity/edit/datebirth" path={credential_birthday} title="Date Birth" field="birthday"/>            

          <div className={classes.contentPersonal}>
            <Fab
              component={Link}
              to="/identity/edit/postal"
              color="secondary"
              aria-label="edit"
              className={classes.fab}
            >
              <IconEdit />
            </Fab>
            <div
              style={{
                flexGrow: 1,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                alignItems: "center",
              }}
            >
              <div>
                <p className={classes.titleName}>Postal Address</p>
                <Link to="/identity/edit/postal" style={{ textDecoration: 'none' }}>
                  <h1 className={classes.name}>
                    {address || <span className={classes.add}>+ add</span>}
                  </h1>
                </Link>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                {hasCredentials !== true ? (
                  <div>
                     <LoadingButton
                      loading={loading} 
                     done={finished}
                      className={classes.button}
                      variant="contained"
                      color="primary"
                      type="submit"
                       onClick={()=>{
                  onClick();
                  credential();
                }}
                    >
                      Ask Credential
                    </LoadingButton>
                  </div>
                ) : (
                  <div className={classes.check}>
                    <Check />
                  </div>
                )}
              </div>
            </div>
          </div>

          {dinamycFields.map((values, index) => {
            return(
           <DinamycField values={values} key={index} />)
          })}
        </div>
        <Grid container item xs justifyContent="center">
          <Link to="/identity/add/field">
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              type="submit"
            >
              ADD
            </Button>
          </Link>
        </Grid>
      </div>
    </>
  );
};
export default Identity;
