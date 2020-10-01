import React, { useState, useEffect } from 'react';
import { 
  Button, 
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';


// React-redux
import { connect } from 'react-redux'; 
// API calls
import { AddAppliance } from '../../utils/utils';
import { UpdateAppliances } from '../../redux-modules/user/actions';

// Componenets
import ErrorDialog from '../errordialog';
 
const FormDialog = (props) => {
  const { appliances } = props;
  const [open, setOpen] = useState(false);
  const [openErrorDialog,setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [disableButton,setDisableButton] = useState(true);
  const [applianceToAdd,setApplianceToAdd] = useState({
    SerialNumber: "",   
    Brand: "",         
    Status: "",         
    Model: "", 
    DateBought:"",
  })
  const [validationErrors,setValidationErrors] = useState({
    SerialNumber: true,   
    Brand: true,         
    Status: true,         
    Model: true, 
    DateBought:true,
  })

  const onApplianceFieldChange = (field) => event => {
    setApplianceToAdd({
      ...applianceToAdd,
      [field]: event.target.value
    })
    setValidationErrors({
      ...validationErrors,
      [field]: event.target.value === "",
    })
  }

  useEffect(() => {
     // If no validation errors,we enable the confirm button
    if(validationErrors.SerialNumber === false && validationErrors.Brand === false && validationErrors.Status === false && validationErrors.Model === false && validationErrors.DateBought === false) {
      setDisableButton(false)
    }
  },[validationErrors])



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // Clear the field
    setApplianceToAdd({
      SerialNumber: "",   
      Brand: "",         
      Status: "",         
      Model: "", 
      DateBought:"",
    })
    setValidationErrors({
      SerialNumber: true,   
      Brand: true,         
      Status: true,         
      Model: true, 
      DateBought:true,
    })
    // Set all as false 
    setOpen(false);
  };

  // Callback when we succesfully add the appliance. It should update the redux
  const addApplianceCallback = (res) => {
    const { data } = res
    const newAppliances = [...appliances,data]
    // Update redux
    props.dispatch(UpdateAppliances(newAppliances))
    setOpen(false)
  }
  
  // Callback when we succesfully fail the appliance callback
  const failAddApplianceCallback = (errResponse) => {
    const { data } = errResponse
    const errors = {
      [`pq: duplicate key value violates unique constraint "appliances_serial_number_key"`]: "An object with the same serial number exists",
      [`pq: duplicate key value violates unique constraint "appliances_brand_key"`]: "An object with the same brand exists",
      [`pq: duplicate key value violates unique constraint "appliances_appliance_model_key"`]: "An object with the model exists",
    }
    setErrorMessage(errors[data])
    setOpenErrorDialog(true)
  }

  const handleConfirm = () => {
    AddAppliance(addApplianceCallback,failAddApplianceCallback,applianceToAdd)
    
  }

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Add New
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add New Appliance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add new appliance to track. Please ensure that that the Serial Number, Brand or Model is unique.
          </DialogContentText>
          <TextField
            autoFocus
            error={validationErrors.SerialNumber}
            helperText="Cannot Be empty"
            margin="dense"
            id="serialNumber"
            label="Serial Number"
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            onChange={onApplianceFieldChange('SerialNumber')}
            type="alphanumeric"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="brand"
            error={validationErrors.Brand}
            helperText="Cannot Be empty"
            label="Brand"
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            onChange={onApplianceFieldChange('Brand')}
            type="alphanumeric"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="model"
            error={validationErrors.Model}
            helperText="Cannot Be empty"
            label="Model"
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            onChange={onApplianceFieldChange('Model')}
            type="alphanumeric"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            id="status"
            error={validationErrors.Status}
            helperText="Cannot Be empty"
            label="Status"
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            onChange={onApplianceFieldChange('Status')}
            type="alphanumeric"
            fullWidth
          />
          <TextField
            autoFocus
            margin="dense"
            error={validationErrors.DateBought}
            helperText="Cannot Be empty"
            id="dateBought"
            label="Date Bought"
            InputLabelProps={{
              shrink: true,
              style: { color: '#fff' },
            }}
            onChange={onApplianceFieldChange('DateBought')}
            type="date"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button id="cancelBtn" onClick={handleClose} variant="contained" color="primary">
            Cancel
          </Button>
          <Button id="confirmBtn" onClick={handleConfirm} variant="contained" color="primary" disabled={disableButton}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <ErrorDialog open={openErrorDialog} setOpen={setOpenErrorDialog} errorMessage={errorMessage}/>
    </div>
  );
}
const mapStateToProps = (state) =>  {
  return({
    appliances: state.user.appliances,
  })
}
const ConnectedFormDialog = connect(mapStateToProps)(FormDialog)

export { FormDialog, ConnectedFormDialog}