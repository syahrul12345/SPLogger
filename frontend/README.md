# Frontend

## Quickstart

Clone the repo, change the working directory into frontend and simply run `docker-compose`

```
git clone https://github.com/syahrul12345/splogger
cd splogger/frontend
docker-compose up -d
```

If this doesnt work (or there is no docker engine installed), we can simply run the development server from javascript:

```
cd appliance/frontend
yarn
yarn start
```

## Frameworks used

Frontend Frameworks:

1. React
2. Material-ui
3. Redux + React-Redux
4. Axios

The frontend is served using a simple go webserver, with no web frameworks. We use the standard `net/http` library to keep things lightweight as we are only serving one page.

## Environments used

We define all environments, the port the app is served as well as the URL of the backend service in the `.env` file.This allows us to quickly change URLs if the IP address of the backend service changes.

This `.env` file is loaded by `docker` and will be available during the build process.

## Build process

I have choosen to use a multi stage build, orchestrated by docker-compose to simply to the build process to one line. There are a total of three stages as defined in the docker file:

1. Build and tests the Go webserver binary in a Golang Container
2. Build and tests the React App in a Node container
3. Copies the binary from step 1 and built html/css/js files from step 2 into a lightweight alpine linux container

As a result, the final image is less than <30mb

## Testing

Each components has a test file which before building in the docer image. For example, the search component will search for the presence of subcompoennts.

File structure of a compoennet

```
- /SearchBox
  - SearchBox.jsx
  - SearchBox-test.jsx
  - index.js
```

## Frontend design

This section will go indepth regarding the the design choices taken for the front end

### Redux

The frontend uses redux to store the state, as well as redux-persist to persist the state. Redux actions and reducers are stored in `website/redux-modules`. I have choosen to use redux instead of state hooks because it is easier to have a global state and share it with different components.

We connect redux in `index.js`, the entry point for the react app. It can be located at `website/src/index.js`. This entry point imports the
main [screen](#screens) `/screens/home/app.js`.

### Utilities

The API's is designed around an `Appliance` object. The `Appliance` object is just a database object returned by the Go backend server as is. This allows us to directly edit this `Appliance` object according to our needs

In this app, components do not directly make API calls to the backend. Instead, the provide a callback to the methods imported from utils which do the calls to the backend server. The utils file lives in `utils/utils.js`

In this file, there are several methods which make API calls to the backend server:

1. `GetAll`. Accepts a callback, and returns the Appliances currently saved. Makes a `GET` request to the backend server. Returns a list of `Appliance` objects for rendering.

2. `SubmitDelete`. Accpets a callback, failcallback and an `Appliance` object to be deleted. Makes a `DELETE` request to the server to delete the provided appliace, and then returns whether the delete was succesful or not. It is implemented in the [ApplianceDisplay](#appliancedisplay) component.

3. `AddAppliance`. Accpets a callback,failcallback and an object representing an appliance to be added to the database. It makes a `POST` with the
   data of the appliance as the payload:

```
{
	"SerialNumber": "1",
	"Brand": "starbucks",
	"Status": "new",
	"Model": "cup",
	"DateBought": "today"
}
```

If succesful it returns the saved `Appliance` object and sets it in the callback. An example of it's implementation can be seen in the [AddDialog].(#add) component.

4. `EditAppliance`. Accepts an `Appliance` object. The fields in this `Appliance` object can be changed freely except for the `ID` value. This method makes a `POST` request to the backend server, editing the `Appliance` object with the new data in the database

5. `SubmitSearch`. Accpets a callback,failcallback,searchFitler and searchTerm. It makes a get request with url query parameters : `${baseURL}/api/search?filter=${searchFilter}&search=${searchTerm}`. Any objects matching the search term is returned as a list of `Appliance` objects.

### Screens

There is only one screen, which is the home screen. The home screen import different components which provide interactivity.
The next section will disucss the components.

### Components

These are the components:

1. [SearchBox Component](#searchbox).
2. [SearchResult component](#searchresults)
3. [Add Appliance Component](#add)
4. [Appliance Display Component](#appliancedisplay)

These are three main components. However, each component also imports sub components which will be explained in their subsections.

#### SearchBox

SearchBox controls the search filters. Based on the search filters, we can query the database. It makes an api call to the backend with the selected filter and search term which is provided to the input field. Upon receiving the result from the backend, the SearchBox component updates the redux store with the search results as such:

```
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
  <!-- Submit request to the backend service -->
  SubmitSearch(searchCallback,searchFailCallback,selectedFilter,searchTerm)
}
```

SearchBox imports the MaterialUI textfield and buttons.

### SearchResult

Search box automatically rerenders when they is an update to the `searchResults` array in the `redux-store`. It automatically renders cards based on the search results that appear.

The SearchResult lives in `components/searchresults`.

### Add

The add component adds functionality to make a `POST` request to the backend to store an additional appliace. Upon making a post request, it handles the error when the user attempts to create a new application with the same `SerialNumber`, `Model` or `Brand`. This error is returned by the backend, and this `Add` component handles it accordingly.

```
// Callback when we succesfully add the appliance. It should update the redux. If fail, show popup error.
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
```

If the new appliance has sucesfully been added to the database, it updates the `appliances` state in the `redux-store`, forcing a rerender of the `ApplianceDisplay` [component](#appliancedisplay). Otherwise, an ErrorMessage pops up.

### Appliance Display

The ApplianceDisplay component renders all appliances currently being tracked. Upon initial render, it makes a `GET` request to get all the current appliances. Upon success, it updates the redux-store accordingly, and this component will re-render with the Appliance Cards shown.

```
const setAppliances = (receivedAppliances) => {
    // Update all appliances.
    props.dispatch(UpdateAppliances(receivedAppliances))
  }

GetAll(setAppliances)
```

Individual cards in the ApplianceDisplay also has a `delete` functionality. This is achieved by binding a delete method to individual cards' delete button.

```
const deleteCallback = (response,deletedAppliance) => {
  const { data: { Status }  } = response
    // Succesfully delete
    if (Status === true) {
      const newAppliances = appliances.filter(appliance => appliance.ID !== deletedAppliance.ID )
      props.dispatch(UpdateAppliances(newAppliances))
    }
  }
  const deleteFailCallback = (err) => {
    console.log("failed")
    console.log(err)
  }
  const deleteAppliance = (appliance) => {
    SubmitDelete(deleteCallback, deleteFailCallback,appliance)
  }
...
<!-- Bind to the component -->
<Button onClick={() => deleteAppliance(appliance)}> Delete</Button>
```

Individual cards also has an `edit` functionality, by importing the `ConnectedEditDialog` [component](#edit).It's implementation can be seen below:

```
<Grid item xs={3}>
  <ConnectedEditDialog selectedAppliance={appliance}/>
</Grid>
```

### Edit

The edit dialog, upon activation activates a pop up form, pre-populated wil the `Appliance` object values. This edit dialog lives in `components/editdialog`. The Edit dialog binds the methods to edit the provided `Appliance Object`

```
  // Callback when we succesfully add the appliance. It should update the redux
  const editApplianceCallback = (res) => {
    const { data } = res
    // If we succesfully manage to edit, it returns the newly edited object
    // We have to delete the old object, and then add the new object
    let newAppliances = appliances.filter(appliance => appliance.ID !== data.ID)
    newAppliances = [...newAppliances,data]
    // Update redux
    props.dispatch(UpdateAppliances(newAppliances))
    setOpen(false)
  }

  // Callback when we succesfully fail the appliance callback
  const failEditApplianceCallback = (errResponse) => {
    const { data } = errResponse
    const errors = {
      [`pq: duplicate key value violates unique constraint "appliances_serial_number_key"`]: "An object with the same serial number exists",
      [`pq: duplicate key value violates unique constraint "appliances_brand_key"`]: "An object with the same brand exists",
      [`pq: duplicate key value violates unique constraint "appliances_appliance_model_key"`]: "An object with the model exists",
    }
    setErrorMessage(errors[data])
    setOpenErrorDialog(true)
  }
```
