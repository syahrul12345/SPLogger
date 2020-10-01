const userInitialState = {
  fetched: false,
  appliances: [],
  searchResults: [],
};

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case 'UPDATE_APPLIANCE_ACTION':
      const { appliances } = action.payload;
      return {
        ...state,
        fetched: true,
        appliances,
      };
    case 'UPDATE_SEARCH_RESULTS':
      const { searchResults } = action.payload;
      return {
        ...state,
        searchResults,
      }
    default:
      return state;
  }
}

export default userReducer;
