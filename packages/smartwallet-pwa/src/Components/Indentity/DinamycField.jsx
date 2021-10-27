import { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Fab } from "@material-ui/core";
import { useToasts } from "react-toast-notifications";
import { createRequestToIssuer } from "../../services/apiHandler.js";
import apiService from '../../services/apiService.js';
import LoadingButton from "../Utils/LoadingButton";
import { useStyles } from "./styled";
import { LS_DID_KEY } from "../../Const";
import IconEdit from "../../Assets/svg/IconEdit";
import Check from "../../Assets/svg/Check";
import PendingDocument from "../../Assets/svg/PendingDocument";

export default function DinamycField({ values, index }) {
  const classes = useStyles();
  const [file,setFile] = useState(null);
  const dispatchUserData = useDispatch();
  const { addToast } = useToasts();
  const userId = localStorage.getItem(LS_DID_KEY);
  const status = useSelector((state) => state.UserReducer.dynamicFields[index].status);
  const pending = useSelector((state) => state.UserReducer.dynamicFields[index].pending);

  const credential = async (file) => {
    if(!values.value){
      return addToast("Add a value to the identity", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 4000,
      });
    }
    const formData = new FormData();
      
    try{
      formData.append("image", file);
      console.log('formData',formData.getAll("image"));
      const url = `/user/upload-image?userId=${userId}&credential_type=${values.id}`
      const image = await apiService.post(url , formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('image',image)
      await createRequestToIssuer(values.id, userId, image.data.image, values.value);
    }catch(err){
      console.log(err)
      return addToast("Some error has occurred, please check your internet connection", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 4000,
      })
    }
    const payload = { value: `${values.value}`, id: `${values.id}`,status:false, pending:true };
    
    dispatchUserData({
      type: "update-dynamic-field",
      payload,
    });

    return addToast("Request created, please wait until the data is validated", {
      appearance: "success",
      autoDismiss: true,
      autoDismissTimeout: 4000,
    })
  };

  const [stateIn, setState] = useState({
    loading: false,
    finished: false,
    credential,
  });

  const { loading, finished } = stateIn;

  const onClick = () => {
    setState({ ...stateIn, loading: true });
    setTimeout(() => {
      setState({ ...stateIn, loading: false });
    }, 1800);
  };


  const handleFile = (event) => {
    event.preventDefault()
    console.log('handleFile')
    const _file = event.target.files[0];
    console.log(event.target.files)
    console.log(_file)
    if(!_file){
      return addToast("You need to upload a document to verify the information!", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 4000,
      });
    }
    setFile(_file);
    onClick();
    credential(_file);
  }

  return (
    <div className={classes.contentPersonal} key={index}>
      <Fab
        component={Link}
        to={`/identity/edit/field/${values.id}`}
        color="secondary"
        aria-label="edit"
        className={classes.fab}
      >
        <IconEdit />
      </Fab>
      <div style={{ flexGrow: 1, marginLeft: "1px" }}>
        <p className={classes.titleName}>{values.id}</p>
        <h1 className={classes.name}>{values.value}</h1>
      </div>
      {
        pending ? (
          <div className={classes.check}>
            <PendingDocument />
          </div>
        ) : status ? (
          <div className={classes.check}>
            <Check />
          </div>
        ): (
          <LoadingButton
            loading={loading}
            done={finished}
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
            handleFile={handleFile}
            inputId={values.id}
          >
            Ask for credential
          </LoadingButton>
        )
      }
    </div>
  );
}
