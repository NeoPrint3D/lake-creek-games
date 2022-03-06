import { useState, useEffect } from "react";
import algoliasearch from "algoliasearch";

const searchClient = algoliasearch(
    import.meta.env.VITE_ALGOLIA_APP_ID,
    import.meta.env.VITE_ALGOLIA_API_KEY
);


//make a hook that returns the search results
export default function useSearchResults(search: string) {
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        console.log("searching for: ", search);
        getResults();
    }, [search])

    async function getResults() {
        const index = searchClient.initIndex('games');

        if (search.length === 0 || search.length >= 3) {
            const searchResults = await index.search(search, {
                attributesToRetrieve: [
                    "authorName",
                    "authorPhoto",
                    "createdAt",
                    "description",
                    "dislikes",
                    "downloads",
                    "title",
                    "thumbnail",
                    "objectID",
                    "likes",
                    "views",
                ],
                hitsPerPage: 10,
            })
            console.log(searchResults.hits);
            setResults(searchResults.hits);
        }
    }
    return results;
}

