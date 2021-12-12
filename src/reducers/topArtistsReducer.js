
export default function topArtistsReducer(state = [], action) {
    switch (action.type) {
        case "STORE_TOP_ARTIST":
            if(action.spotifyArtist instanceof Array) return [...state, ...action.spotifyArtist]
            return [...state, action.spotifyArtist]
        case "REMOVE_TOP_ARTIST":
            return state.filter((artist) => {
                return artist.spotifyArtist.name === action.spotifyArtist.name 
            })
        default:
            return state
    }
}

export function storeTopArtist(spotifyArtist){
    return {
        type: "STORE_TOP_ARTIST",
        spotifyArtist
    }
}export function removeTopArtist(spotifyArtist){
    return {
        type: "REMOVE_TOP_ARTIST",
        spotifyArtist
    }
}