export default function artistSearchReducer(state = null, action){
    switch(action.type){
        case "STORE_ARTIST_SEARCH":
            return {searchValue: action.searchValue, searchResults: action.searchResults}
        default:    
            return state
    }
}


export function storeSearch(searchValue, searchResults){
    return {
        type: "STORE_ARTIST_SEARCH",
        searchValue,
        searchResults
    }
}