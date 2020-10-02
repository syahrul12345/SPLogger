import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

// React-redux
import { connect } from "react-redux";
import { UpdateAppliances } from "../../redux-modules/user/actions";

// API calls
import { EditAppliance } from "../../utils/utils";

// Componenets
import ErrorDialog from "../errordialog";

const EditDialog = (props) => {
  const { appliances, selectedAppliance } = props;
  const [open, setOpen] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [disableButton, setDisableButton] = useState(true);
  const [applianceToAdd, setAppliaceneToEdit] = useState(selectedAppliance);
  const [validationErrors, setValidationErrors] = useState({
    SerialNumber: false,
    Brand: false,
    Status: false,
    Model: false,
    DateBought: false,
  });

  const onApplianceFieldChange = (field) => (event) => {
    setAppliaceneToEdit({
      ...applianceToAdd,
      [field]: event.target.value,
    });
    setValidationErrors({
      ...validationErrors,
      [field]: event.target.value === "",
    });
  };

  useEffect(() => {
    // If no validation errors,we enable the confirm button
    if (
      validationErrors.SerialNumber === false &&
      validationErrors.Brand === false &&
      validationErrors.Status === false &&
      validationErrors.Model === false &&
      validationErrors.DateBought === false
    ) {
      setDisableButton(false);
    } else {
      setDisableButton(true);
    }
  }, [validationErrors]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    // Clear the field
    setValidationErrors({
      SerialNumber: false,
      Brand: false,
      Status: false,
      Model: false,
      DateBought: false,
    });
    // Set all as false
    setOpen(false);
  };

  // Callback when we succesfully add the appliance. It should update the redux
  const editApplianceCallback = (res) => {
    const { data } = res;
    // If we succesfully manage to edit, it returns the newly edited object
    // We have to delete the old object, and then add the new object
    let newAppliances = appliances.filter(
      (appliance) => appliance.ID !== data.ID
    );
    newAppliances = [...newAppliances, data];
    // Update redux
    props.dispatch(UpdateAppliances(newAppliances));
    setOpen(false);
  };

  // Callback when we succesfully fail the appliance callback
  const failEditApplianceCallback = (errResponse) => {
    const { data } = errResponse;
    const errors = {
      [`pq: duplicate key value violates unique constraint "appliances_serial_number_key"`]: "An object with the same serial number exists",
      [`pq: duplicate key value violates unique constraint "appliances_brand_key"`]: "An object with the same brand exists",
      [`pq: duplicate key value violates unique constraint "appliances_appliance_model_key"`]: "An object with the model exists",
    };
    setErrorMessage(errors[data]);
    setOpenErrorDialog(true);
  };

  const handleConfirm = () => {
    EditAppliance(
      editApplianceCallback,
      failEditApplianceCallback,
      applianceToAdd
    );
  };
  return (
    <div>
      <Button onClick={handleClickOpen}>Edit</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit</DialogTitle>
        {selectedAppliance ? (
          <DialogContent>
            <DialogContentText>Edit the current appliance</DialogContentText>
            <TextField
              autoFocus
              error={validationErrors.SerialNumber}
              helperText="Cannot Be empty"
              margin="dense"
              id="serialNumber"
              label="Serial Number"
              InputLabelProps={{
                style: { color: "#fff" },
              }}
              defaultValue={selectedAppliance.SerialNumber}
              onChange={onApplianceFieldChange("SerialNumber")}
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
                style: { color: "#fff" },
              }}
              defaultValue={selectedAppliance.Brand}
              onChange={onApplianceFieldChange("Brand")}
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
                style: { color: "#fff" },
              }}
              defaultValue={selectedAppliance.Model}
              onChange={onApplianceFieldChange("Model")}
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
                style: { color: "#fff" },
              }}
              defaultValue={selectedAppliance.Status}
              onChange={onApplianceFieldChange("Status")}
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
                style: { color: "#fff" },
              }}
              defaultValue={selectedAppliance.DateBought}
              onChange={onApplianceFieldChange("DateBought")}
              type="date"
              fullWidth
            />
          </DialogContent>
        ) : (
          <></>
        )}
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            disabled={disableButton}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <ErrorDialog
        open={openErrorDialog}
        setOpen={setOpenErrorDialog}
        errorMessage={errorMessage}
      />
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    appliances: state.user.appliances,
  };
};

const ConnectedEditDialog = connect(mapStateToProps)(EditDialog);

export { EditDialog, ConnectedEditDialog };
