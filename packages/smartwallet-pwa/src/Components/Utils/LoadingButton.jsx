import React from 'react';
import PropTypes from 'prop-types';
import { Button } from "@material-ui/core";
import {SpinnerButton} from '../Loaded/Spinner';



const LoadingButton = ({ loading, text , done, ...other }) => {
 
  if (done) {
    return (
      <Button    {...other} disabled>
       
      </Button>
    );
  }
  else if (loading) {
    return (
      <Button   {...other} >
        Ask Credential 
         <SpinnerButton />
      </Button>
    );
  } else {
    return (
      <Button   {...other} />
    );
  }
}

LoadingButton.defaultProps = {
  loading: false,
  done: false,
  };

LoadingButton.propTypes = {
  loading: PropTypes.bool,
  done: PropTypes.bool,
};

export default (LoadingButton);
