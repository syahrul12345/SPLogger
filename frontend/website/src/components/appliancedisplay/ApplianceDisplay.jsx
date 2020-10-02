import React from "react";

import { Grid, Card, CardContent, Typography, Button } from "@material-ui/core";

// Redux
import { connect } from "react-redux";
import { UpdateAppliances } from "../../redux-modules/user/actions";

// API calls
import { SubmitDelete } from "../../utils/utils";

// Components
import { ConnectedEditDialog } from "../editDialog";

const ApplianceDisplay = (props) => {
  const { appliances } = props;
  const deleteCallback = (response, deletedAppliance) => {
    const {
      data: { Status },
    } = response;
    // Succesfully delete
    if (Status === true) {
      const newAppliances = appliances.filter(
        (appliance) => appliance.ID !== deletedAppliance.ID
      );
      props.dispatch(UpdateAppliances(newAppliances));
    }
  };
  const deleteFailCallback = (err) => {
    console.log("failed");
    console.log(err);
  };
  const deleteAppliance = (appliance) => {
    SubmitDelete(deleteCallback, deleteFailCallback, appliance);
  };
  return (
    <Grid container spacing={2}>
      {appliances &&
        appliances.map((appliance) => {
          return (
            <Grid item key={appliance.ID} xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Brand: {appliance.Brand}</Typography>
                  <Typography variant="h5">Model: {appliance.Model}</Typography>
                  <Typography variant="body1">
                    Status: {appliance.Status}
                  </Typography>
                  <Typography variant="subtitle2">
                    SerialNumber: {appliance.SerialNumber}
                  </Typography>
                  <Typography variant="subtitle2">
                    Date Bought: {appliance.DateBought}
                  </Typography>
                  <Typography variant="subtitle2">
                    Updated At: {appliance.CreatedAt}
                  </Typography>
                </CardContent>
                <Grid
                  container
                  style={{ paddingLeft: "1%", paddingBottom: "2%" }}
                  spacing={3}
                  justify="space-between"
                >
                  <Grid item xs={3}>
                    <ConnectedEditDialog selectedAppliance={appliance} />
                  </Grid>
                  <Grid item xs={3}>
                    <Button onClick={() => deleteAppliance(appliance)}>
                      {" "}
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          );
        })}
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    appliances: state.user.appliances,
  };
};
const ConnectApplianceDisplay = connect(mapStateToProps)(ApplianceDisplay);

export { ApplianceDisplay, ConnectApplianceDisplay };
