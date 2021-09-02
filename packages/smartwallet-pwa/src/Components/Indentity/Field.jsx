import React, { useEffect,useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useStyles } from "./styled";
import { post } from "../../services/apiHandler.js";
import { Fab } from "@material-ui/core";
import { Link } from "react-router-dom";
import IconEdit from "../../Assets/svg/IconEdit";
import Check from "../../Assets/svg/Check";
import { useSelector, useDispatch } from "react-redux";
import { useToasts } from 'react-toast-notifications'
import LoadingButton from "../Utils/LoadingButton";
import { LS_DID_KEY } from "../../Const";

export default function Field({ to, path, title, field }) {

  const { addToast } = useToasts()
  const [data, setData] = useState(null);
  const state = useSelector((state) => state.UserReducer[path].value);
  const id = useSelector((state) => state.UserReducer[path].id);
  const [hasCredentials, sethasCredentials] = useState(localStorage.hasOwnProperty(`credential_${field}`))
  const userId = localStorage.getItem(LS_DID_KEY);
  const dispatchUserData = useDispatch();
  const classes = useStyles();

  const credential = async () => {
    if(state !== ''){
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
      credentialSubject.credential[field] = state;
      const res = await post(credentialSubject);
      let data = res.data;
      setData(data);
      console.log(res.data);
      const payload = {id: `${id}`,value: `${state}`};
   

      if(data !== undefined){
 localStorage.setItem(`credential_${field}`, JSON.stringify(data));
 sethasCredentials(true)

      }

      if(hasCredentials !== true){
        payload.status = 'true'
      }
      if(data !== undefined){
        dispatchUserData({
          type: 'update',
          payload 
        })
      } else { 
        return addToast('An error has occurred, check the data!', 
          { 
            appearance: 'error',
            autoDismiss: true, 
            autoDismissTimeout: 4000 
          }
        )
      }
    } else {
      addToast('Add a value to the identity', 
        { 
          appearance: 'error',
          autoDismiss: true, 
          autoDismissTimeout: 4000 
        }
      );
    }
 


    //storage res data
  };

    useEffect(() => {
      if (data) {
        localStorage.setItem(`credential_${field}`, JSON.stringify(data));
 addToast('Verified credential', { appearance: 'success',autoDismiss: true, autoDismissTimeout: 2000 });

      }


    }, [data,addToast,field]);


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




  return (
    <>
      <div className={classes.contentPersonal}>
        <Fab
          component={Link}
          to={to}
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
            <p className={classes.titleName}> {title}</p>
            <Link to={to} className={classes.link} style={{ textDecoration: 'none' }}>
              <h1 className={classes.name}>
                {state || <span className={classes.add}>+ add</span>}
              </h1>
            </Link>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            {hasCredentials !== true ? (
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
                }}              >
                Ask Credential
              </LoadingButton>

            ) : (
              <div className={classes.check}>
                <Check />
              
              </div>

            )}

          </div>
        </div>
      </div>
    </>
  );
}
