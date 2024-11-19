import { useLocation, useEffect, useState } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "../amplify/data/resource";

const client = generateClient<Schema>();   


function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("q");

  const   
 [forums, setForums] = useState<Array<Schema["Forum"]["type"]>>([]);

  useEffect(() => {
    if (query) {
      const searchForums = async () => {
        // Replace 'name' with the field you want to search against
        const results = await client.models.Forum.query({ name: { match: query } });
        setForums(results.items);
      };

      searchForums();
    }
  }, [query]);

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      {forums.length > 0 ? (
        <ul>
          {forums.map((forum) => (
            <li key={forum.id}>
              <Link to={`/forum/${forum.id}`}>{forum.name}</Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No forums found matching your search.</p>
      )}
    </div>
  );
}

export default Search;