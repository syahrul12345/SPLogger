import React, { useState } from 'react';
import { Grid, TextField, Button,FormControl,InputLabel,Select,MenuItem } from '@material-ui/core'

// Redux
import { connect } from 'react-redux';
import { UpdateSearchedAppliances } from '../../redux-modules/user/actions'
// API
import { SubmitSearch } from '../../utils/utils';

// Componenets
import ErrorDialog from '../errordialog';

const SearchBox = (props) => {
  const [searchTerm,setSearchTerm] = useState('');
  const [selectedFilter,setSelectedFilter] = useState('SerialNumber');
  const [openErrorDialog,setOpenErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const searchTermHandler = () => event => {
    setSearchTerm(event.target.value)
  }
  
  const searchCallback = (resp) => {
    const { data } = resp
    if(data.length === 0) {
      setErrorMessage("No objects were found")
      setOpenErrorDialog(true)
    }else {
      // Update search results into redux
      props.dispatch(UpdateSearchedAppliances(data))
    }
  }
  const searchFailCallback = (errResp) => {
    setErrorMessage("No objects were found")
    setOpenErrorDialog(true)
  }
  const search = () => {
    SubmitSearch(searchCallback,searchFailCallback,selectedFilter,searchTerm)
  }
  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value)
  }
  const clearSearch = () => {
    props.dispatch(UpdateSearchedAppliances([]))
  }
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField 
          id="standard-basic" 
          label="Search for appliance" 
          InputLabelProps={{
            shrink: true,
            style: { color: '#fff' },
          }}
          style={{width:'100%'}}
          type={ selectedFilter === 'DateBought' ? 'date' : 'text'}
          onChange={searchTermHandler()}/>
          
      </Grid>
      <Grid item xs={12}>
      <FormControl>
          <InputLabel id="demo-simple-select-label">Filter</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedFilter}
            onChange={handleFilterChange}
          >
            <MenuItem value={'SerialNumber'}> SerialNumber</MenuItem>
            <MenuItem value={'Brand'}>Brand</MenuItem>
            <MenuItem value={'Model'}>Model</MenuItem>
            <MenuItem value={'Status'}>Status</MenuItem>
            <MenuItem value={'DateBought'}>Date Purchased</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={() => search()}> Search </Button>
        <Button variant="contained" color="primary" onClick={() => clearSearch()} style={{marginLeft:'5px'}}> Clear Search </Button>
      </Grid>
      <ErrorDialog open={openErrorDialog} setOpen={setOpenErrorDialog} errorMessage={errorMessage}/>
    </Grid>
  )
}
const mapStateToProps = (state) => {
  return ({
    searchResults: state.user.searchResults,
  })
}

const ConnectedSearchBox = connect(mapStateToProps)(SearchBox);

export { SearchBox, ConnectedSearchBox }