import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { generateClient } from "aws-amplify/data"; // Import generateClient to work with your schema
import { Schema } from "../amplify/data/resource"; // Assuming you have the Schema defined

const client = generateClient<Schema>();

function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q"); // Query parameter from URL
  const [forums, setForums] = useState<Array<Schema["Forum"]["type"]>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Observe forums and filter based on the query
    const forumSubscription = client.models.Forum.observeQuery().subscribe({
      next: async (data: { items: Schema["Forum"]["type"][] }) => { // Explicitly typing 'data'
        if (query) {
          // Filter forums based on the query string
          const filteredForums = data.items.filter(forum =>
            forum.name?.toLowerCase().includes(query.toLowerCase())
          );
          setForums(filteredForums); // Update forums state
        } else {
          setForums(data.items); // If no query, display all forums
        }
        setLoading(false); // Stop loading after data is fetched
      },
      error: (error: any) => { // Type for error (could be GraphQLResult or error object)
        console.error("Error fetching forums:", error);
        setLoading(false);
      },
    });

    return () => {
      forumSubscription.unsubscribe(); // Clean up subscription on unmount
    };
  }, [query]); // Re-run the effect if the query changes

  return (
    <div>
      <h2>Search Results</h2>
      {loading ? (
        <p>Loading...</p>
      ) : query ? (
        <>
          <p>You searched for: {query}</p>
          {forums.length > 0 ? (
            <ul>
              {forums.map((forum) => (
                <Link to={`/forum/${forum.id}`}>
                  <li key={forum.id}>
                    <h3>{forum.name}</h3>
                    <p>{forum.description}</p>
                  </li>
                </Link>
              ))}
            </ul>
          ) : (
            <p>No forums found matching your query.</p>
          )}
        </>
      ) : (
        <p>No search query provided.</p>
      )}
    </div>
  );
}

export default Search;