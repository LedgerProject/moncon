import React ,{useRef,useState} from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default function SellDialog({sellToken}) {
  const [value, setvalue] = useState(0.005)
  const [open, setOpen] = React.useState(false);
  const ref = useRef("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onChange = () => {
    if(parseFloat(ref.current.value)>0.005)
      setvalue(ref.current.value)
    else
    setvalue(0.005)
    
  };

  return (
    <div>
      <Button variant="outlined" size="small" color="primary" onClick={handleClickOpen}>
        sell
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <TextField            
            inputRef={ref}
            onChange={onChange}            
            autoFocus
            margin="dense"            
            label="set prices example: 1 BNB"
            type="number"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{
            sellToken(value)        
            handleClose()
          }
            
            } small={true} color="primary">
          confirm
          </Button>          
        </DialogActions>
      </Dialog>
    </div>
  );
}