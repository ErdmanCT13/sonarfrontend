
export default function followedArtistsReducer(state = [], action) {
    switch (action.type) {
        case "FOLLOW_ARTIST":
            if(action.artist instanceof Array) return [...state, ...action.artist]
            return [...state, action.artist]
        case "UNFOLLOW_ARTIST":
            return state.filter((artist) => {
                return artist.id !== action.artist.id
            })
        default:
            return state
    }
}

export function unfollowArtist(artist){
    return {
        type: "UNFOLLOW_ARTIST",
        artist
    }
}

export function followArtist(artist){
    return {
        type: "FOLLOW_ARTIST",
        artist
    }
}