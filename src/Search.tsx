import React from "react";
import { useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query");

  return (
    <div>
      <h2>Search Results</h2>
      {query ? (
        <p>You searched for: {query}</p>
        // Add logic here to fetch and display results based on the query
      ) : (
        <p>No search query provided.</p>
      )}
    </div>
  );
}

export default Search;