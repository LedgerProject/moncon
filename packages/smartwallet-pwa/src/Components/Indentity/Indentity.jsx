import { useState } from "react";
import { Link } from "react-router-dom";
import { Fab, Button, Grid } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import Field from "./Field";
import DinamycField from "./DinamycField";
import LoadingButton from "../Utils/LoadingButton";
import { createRequestToIssuer } from "../../services/apiHandler.js";
import apiService from '../../services/apiService.js';
import { useStyles } from "./styled";
import IconEdit from "../../Assets/svg/IconEdit";
import Check from "../../Assets/svg/Check";
import PendingDocument from "../../Assets/svg/PendingDocument";
import {
  credential_mobil,
  credential_email,
  credential_country,
  credential_birthday,
  credential_region,
  LS_DID_KEY,
  BYTES_TO_MB,
  MAX_IMAGE_SIZE
} from "../../Const";

const Identity = () => {
  
  const { addToast } = useToasts();
  const classes = useStyles();
  const dispatchUserData = useDispatch();
  const [file,setFile] = useState(null);
  const name = useSelector((state) => state.UserReducer.name.value);
  const lastName = useSelector((state) => state.UserReducer.lastName.value);
  const dinamycFields = useSelector((state) => state.UserReducer.dynamicFields);
  const country = useSelector(
    (state) => state.UserReducer[credential_country].value
  );
  const id = useSelector((state) => state.UserReducer[credential_country].id);
  const status = useSelector((state) => state.UserReducer[credential_country].status);
  const pending = useSelector((state) => state.UserReducer[credential_country].pending);
  const userId = localStorage.getItem(LS_DID_KEY);

  const credential = async (file) => {

    if (!country) {
      return addToast("Add a value to the identity", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 4000,
      });
    }

    console.log("image size", BYTES_TO_MB(file.size) + "mb")
    console.log("max image size", BYTES_TO_MB(MAX_IMAGE_SIZE) - 1 +"mb")


    if(file.size > MAX_IMAGE_SIZE){
      return addToast(
        `The image should not be bigger than ${BYTES_TO_MB(MAX_IMAGE_SIZE)-1} mb`,
        {
          appearance: "error",
          autoDismiss: true,
          autoDismissTimeout: 4000,
        }
      )
    }

    const formData = new FormData();
      
    try{
      formData.append("image", file);
      console.log('formData',formData.getAll("image"));

      const url = `/user/upload-image?userId=${userId}&credential_type=${credential_country}`
      const image = await apiService.post(url , formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('image',image)

      await createRequestToIssuer(credential_country, userId, image.data.image, country);

    }catch(err){
      console.log(err)
      return addToast("Some error has occurred, please check your internet connection", {
        appearance: "error",
        autoDismiss: true,
        autoDismissTimeout: 4000,
      })
    }

    const payload = { id: `${id}`, value: country, pending: true };

    dispatchUserData({
      type: "update",
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
          <Field
            to="/identity/edit/email"
            path={credential_email}
            title="Email"
            field="email"
          />
          <Field
            to="/identity/edit/mobile"
            path={credential_mobil}
            title="Mobile Phone"
            field="mobile"
          />
          <Field
            to="/identity/edit/datebirth"
            path={credential_birthday}
            title="Date Birth"
            field="birthday"
          />

          <div className={classes.contentPersonal}>
            <Fab
              component={Link}
              to="/identity/edit/country"
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
                <p className={classes.titleName}>Country of Residence</p>
                <Link
                  to="/identity/edit/country"
                  style={{ textDecoration: "none" }}
                >
                  <h1 className={classes.name}>
                    {country || <span className={classes.add}>+ add</span>}
                  </h1>
                </Link>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                      inputId={credential_country}
                    >
                      Ask for credential
                    </LoadingButton>
                  )
                }
              </div>
            </div>
          </div>
          
          <Field
            to="/identity/edit/region"
            path={credential_region}
            title="Region of Residence"
            field="region"
          />

          {dinamycFields.map((values, index) => {
            return <DinamycField values={values} index={index} key={index} />;
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
