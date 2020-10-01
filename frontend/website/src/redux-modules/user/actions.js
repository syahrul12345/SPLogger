export const UpdateAppliances = (appliances) => ({
  type: 'UPDATE_APPLIANCE_ACTION',
  payload: {
   appliances
  },
});

export const UpdateSearchedAppliances = (searchResults) => ({
  type: 'UPDATE_SEARCH_RESULTS',
  payload: {
    searchResults
  }
})