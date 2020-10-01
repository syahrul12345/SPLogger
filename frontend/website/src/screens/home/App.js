import React from 'react';
import { Grid } from '@material-ui/core';

// Redux
import { connect } from 'react-redux'
import { UpdateAppliances } from '../../redux-modules/user/actions';

// Components
import { ConnectedSearchBox } from '../../components/searchbox';
import  { ConnectApplianceDisplay } from '../../components/appliancedisplay';

// Api calls
import { GetAll } from '../../utils/utils';
import { ConnectedFormDialog } from '../../components/adddialog/AddDialog';
import { ConnectedSearchResults } from '../../components/searchresults/';

const App = React.memo((props) => {
  const { searchResults } = props
  // Call the api to get list of all appliances.
  const setAppliances = (receivedAppliances) => {
    // Update all appliances.
    props.dispatch(UpdateAppliances(receivedAppliances))
  }
  
  GetAll(setAppliances)
  return (
    <Grid
      container
      justify="center"
      alignContent="center"
      alignItems="center"
      spacing={2}
      style={{minHeight:'50vh',paddingLeft:'5%',paddingRight:'5%'}}>
        <Grid item xs={12}>
          <ConnectedSearchBox/>
        </Grid>
        <Grid item xs={12}>
          {/* Dont show search result area if there are no search results */}
          {searchResults.length !== 0 ? <ConnectedSearchResults/> : <></>}
          
        </Grid>
        <Grid item xs={12}>
          <ConnectedFormDialog/>
        </Grid>
        <Grid item xs={12}>
          <ConnectApplianceDisplay/>
        </Grid>
      </Grid>
  );
})

const mapStateToProps = (state) =>  {
  return ({
    searchResults: state.user.searchResults,
  })
}

export default connect(mapStateToProps)(App);
