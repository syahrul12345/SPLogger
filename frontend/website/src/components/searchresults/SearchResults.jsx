import React from "react";

import { Grid, Card, CardContent, Typography } from "@material-ui/core";
// Redux
import { connect } from "react-redux";

const SearchResults = (props) => {
  const { searchResults } = props;
  return (
    <>
      <Typography variant="h5"> Search Results</Typography>
      <Grid container spacing={3}>
        {searchResults.map((result) => {
          return (
            <Grid key={result.Brand} item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h5">Brand: {result.Brand}</Typography>
                  <Typography variant="h5">Model: {result.Model}</Typography>
                  <Typography variant="body1">
                    Status: {result.Status}
                  </Typography>
                  <Typography variant="subtitle2">
                    Serial Number: {result.SerialNumber}
                  </Typography>
                  <Typography variant="subtitle2">
                    Date Bought: {result.DateBought}
                  </Typography>
                  <Typography variant="subtitle2">
                    Updated At: {result.CreatedAt}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    searchResults: state.user.searchResults,
  };
};

const ConnectedSearchResults = connect(mapStateToProps)(SearchResults);
export { SearchResults, ConnectedSearchResults };
