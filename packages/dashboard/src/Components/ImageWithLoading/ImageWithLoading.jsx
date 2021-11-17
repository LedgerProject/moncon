import React from "react";
import { StateProvider, ObjectWatcher } from "reenhance-components";
import {  CircularProgress, Grid, makeStyles } from "@material-ui/core";
const LoadedState = StateProvider(false);
const ImageRefWatcher = ObjectWatcher(React.createRef());

const useStyles = makeStyles((theme) => ({
  spinnerContainer: {
    marginTop: theme.spacing(4),
  },
}));

const DefaultLoader = () => {
  const classes = useStyles();

  return (
    <Grid container justify="center" className={classes.spinnerContainer}>
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
  )
}

const ImageWithLoading = ({ src, alt, className, Loader }) => (
  
  <LoadedState>
    {({ state: loaded, setState: setLoaded }) => (
      <ImageRefWatcher watch="current">
        {(imageRef) => {
          const complete = imageRef.current && imageRef.current.complete;
          return (
            <div>
              {!complete ? 
                  Loader? 
                    <Loader/> 
                  : 
                    <DefaultLoader/> 
                : 
                  null
              }
              <img
                src={src}
                style={!complete ? { visibility: 'hidden' } : {}}
                ref={imageRef}
                alt={alt || ""}
                className={className || ""}
                onLoad={() => setLoaded(true)}
                />
            </div>
          );
        }}
      </ImageRefWatcher>
    )}
  </LoadedState>

);

export default ImageWithLoading