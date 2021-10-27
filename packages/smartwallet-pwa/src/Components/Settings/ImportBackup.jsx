import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Container, Button, TextField, Grid, Typography, } from "@material-ui/core";
import { useHistory } from "react-router";
import { useToasts } from "react-toast-notifications";
import apiService from "../../services/apiService";
import { useStyles } from "./styled";
import ArrowLeft from "../../Assets/svg/ArrowLeft";
import { decrypt } from "../../services/backupService" ;

const errOptions = {
  appearance: "error",
  autoDismiss: true,
  autoDismissTimeout: 5000,
};

const ImportBackup = () => {
  const classes = useStyles();
  const { addToast } = useToasts();
  const history = useHistory();
  const [encryptedData, setEncryptedData] = useState({});
  const [pbkdf, setPbkdf] = useState({})
  const [questions, setQuestions] = useState(null);
  const [inputData, setInputData] = useState({
    "question1":"",
    "question2":"",
    "question3":"",
    "question4":"",
    "question5":""
  });
  const dispatchUserData = useDispatch();

  useEffect(() => {
    const getQuestions = async () => {
      let response = {};
      try{
        response =  await apiService.get('/user/backup-questions');
        console.log(response)
      }catch(err){
        console.log(err)
        addToast("Error fetching questions",errOptions)
      }

      const arrayOfData = Object.entries(response.data);

      setQuestions(arrayOfData);
    }
    getQuestions();
  },[]);

  const handleReturn = () => {
    if (history.length <= 2) {
      history.push("/settings");
    } else {
      history.goBack();
    }
  };

  const handleChange = (question) => (e) => {
    setInputData((questions) => ({ ...questions, [question]: e.target.value }));
  };

  const handleClick = async (event) => {
    event.preventDefault();

    if(!encryptedData || !pbkdf){
      addToast('You need to submit the info',errOptions);
      return
    }

    let response = {};
    let answers = {};
    let decryptionKeys = {}
    const keys = Object.keys(inputData);
    let numOfAnswers = 0;

    keys.forEach((question) => {
      if(inputData[question].trim()){
        numOfAnswers++; 
      }
      answers[question] = inputData[question].trim() || "null";
    });

    if(numOfAnswers !== 3){
      return addToast("You should answer 3 questions",errOptions);
    }

    if(!pbkdf){
      return addToast("Error, theres no PBKDF",errOptions);
    }

    try{
      console.log(pbkdf)
      response = await apiService.post("/user/keypair",{
        pbkdf: pbkdf.key_derivation,
        answers
      })
      decryptionKeys = response.data;
    } catch(err){
      console.log(err)
      return addToast("Error re-generating the keypair",errOptions);
    }

    let decryptedData = {}
    try{
      const decrypResult = await decrypt(encryptedData, decryptionKeys)
      decryptedData = JSON.parse(decrypResult);
    }catch(err){
      return addToast("Incorrect PBKDF",errOptions);
    }

    if(!decryptedData){
      return addToast("Incorrect PBKDF",errOptions);
    }

    console.log('dispatching')
    dispatchUserData({type:'import',payload:decryptedData});

    handleReturn();
  };

  const handleEncryptedData = async (event) => {
    const file = await event.currentTarget.files[0].text();

    setEncryptedData(JSON.parse(file));
  }

  const handlePBKDF = async (event) => {
    const file = await event.currentTarget.files[0].text();

    setPbkdf(JSON.parse(file));
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          color: "rgba(0, 0, 0, 0.6)",
          fontSize: "20px",
          background: "#272727",
          fontWeight: 500,
          height: "120%",
        }}
      >
        <Container className={classes.mnemonicRoot}>
          <div onClick={handleReturn} className={classes.mnemonicReturn}>
            <ArrowLeft /> <p style={{ marginLeft: "15px" }}>Return</p>
          </div>
          <Typography color='secondary' variant='h1' className={classes.title}>
            Import Backup
          </Typography>
          <form className={classes.mnemonicRoot} noValidate autoComplete="off">
            <br />
            <Grid container item xs={12} justifyContent='center'>
              <Grid container item xs={12} justifyContent='center'>
                <Button
                  component="label"
                  className={classes.mnemonicButtonBlue}
                  variant="contained"
                  color="primary"
                >
                  <Grid container item xs={12} justifyContent='center'>

                    <Grid container item xs={12} justifyContent='center'>
                      <Typography 
                        variant='body1'
                        className={classes.uploadImageLabel} 
                        display='inline'
                      >
                        Upload Backup
                      </Typography>
                    </Grid> 
                  </Grid> 
                  <input
                    onChange={handleEncryptedData}
                    type="file"
                    accept='.json'
                    hidden
                  />
                </Button>
              </Grid>
              <Grid container item xs={12} justifyContent='center'>
                <Button
                  component="label"
                  className={classes.mnemonicButtonBlue}
                  variant="contained"
                  color="primary"
                >
                  <Grid container item xs={12} justifyContent='center'>

                    <Grid container item xs={12} justifyContent='center'>
                      <Typography 
                        variant='body1'
                        className={classes.uploadImageLabel} 
                        display='inline'
                      >
                        Upload PBKDF
                      </Typography>
                    </Grid> 
                  </Grid> 
                  <input
                    onChange={handlePBKDF}
                    type="file"
                    accept='.json'
                    hidden
                  />
                </Button>
              </Grid>
            </Grid>
              <Grid 
              container
              justifyContent='center'
              spacing={3}
              className={classes.margin}
            >
              {
                questions && questions.map((question) => (
                  <Grid 
                    container
                    justifyContent='center'
                    item 
                    xs={10}
                    key={question[0]}
                  >
                    <TextField
                      id={question[0]}
                      label={question[1]}
                          value={inputData[question[0]]}
                          onChange={handleChange(question[0])}
                          fullWidth
                          InputProps={{
                            style:{
                              color:"#fff",
                              fontSize: "1.8rem",
                            },
                          }}
                    />
                  </Grid>
                ))
              }
            </Grid>
            <Button
              onClick={handleClick}
              className={classes.mnemonicButtonBlue}
              variant="contained"
              color="primary"
              type="submit"
              disabled={!Object.keys(encryptedData).length > 0 || !Object.keys(pbkdf).length > 0}
            >
              Continue
            </Button>
          </form>
        </Container>
      </div>
    </>
  );
};
export default ImportBackup;
