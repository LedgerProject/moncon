import { useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "@material-ui/core";
import { SpinnerButton } from "../Loaded/Spinner";

const LoadingButton = ({ loading, text, done, handleFile, inputId, ...other }) => {
  const hiddenFileInput = useRef(null);
  
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  if (done) {
    return <Button {...other} disabled></Button>;
  } else if (loading) {
    return (
      <Button {...other} disabled>
        Ask Credential
        <SpinnerButton />
      </Button>
    );
  } else {
    return (
        <>
          <input
            ref={hiddenFileInput}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            id={inputId}
            onChange={handleFile}
          />
          <label htmlFor={inputId}>
            <Button {...other} onClick={handleClick}>
              {other.children}
            </Button>
          </label>
        </>
      )
  }
};

LoadingButton.defaultProps = {
  loading: false,
  done: false,
};

LoadingButton.propTypes = {
  loading: PropTypes.bool,
  done: PropTypes.bool,
};

export default LoadingButton;