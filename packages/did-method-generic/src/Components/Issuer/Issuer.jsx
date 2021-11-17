import { useEffect, useState, useRef } from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import SectionTitle from "../SectionTitle";
import UserRequest from './UserRequest';
import apiService from "../../Services/apiService";

const useStyles = makeStyles(() => ({
  marginBottom: {
    marginBottom: 20,
  },
}));

const Issuer = () => {
  const classes = useStyles();
  const [pendingRequest, setPendingRequest] = useState([]);
  const socketRef = useRef();

  //aggregated all the request from the same id
  const jointRequest = (_pendingRequest) => {
    //just to keep track of the performance
    console.time('request');
    let totalIterations = 0;
    let orderIterations = 0;
    const n = _pendingRequest.length;
    
    const usersId = [];
    const formatedRequest = [];
    let i = -1
    //fill the usersId array with the id of the users that make a request
    _pendingRequest.forEach((request) => {
      if(!usersId.includes(request.userId)){
        usersId.push(request.userId);
        totalIterations++;
      }
    });

    //for each id look all the request and if they have the same
    //user id add it to an array inside the same object
    //this can be improved in something that does not run in exponential time
    usersId.forEach((id) => {
      formatedRequest.push({userId:id, request:[]});
      i++

      _pendingRequest.forEach((request) => {

        if(id === request.userId){
          const {userId, ...data} = request
          formatedRequest[i].request.push({...data})
        }
        totalIterations++
        orderIterations++
      })

      console.timeLog('request',{totalIterations,orderIterations,n});

    })
    console.timeEnd('request');
    return formatedRequest;
  }

  const getData = async () => {
    const response = await apiService.get("/issuer/pending-credential-request")
    console.log('pending-credential-request',response)
    const formatedData = jointRequest(response.data);
    console.log(formatedData)
    setPendingRequest(formatedData || []);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <SectionTitle title="Pending credentials request" />
      <Grid container spacing={3} className={classes.marginBottom}>
      </Grid>
      {
        !pendingRequest.length ?(
            <SectionTitle title="There are no pending request" />
          ) : pendingRequest.map(user => (
              <UserRequest
                user={user}
                key={user.userId} 
              />
          ))
      }
    </>
  );
};

export default Issuer;