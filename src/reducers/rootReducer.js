import userCoordinateReducer from "./userCoordinateReducer"
import followedArtistsReducer from "./followedArtistsReducer"
import topArtistsReducer from "./topArtistsReducer"
import pinnedLocationsReducer from "./pinnedLocationsReducer"
import nearbyShowsReducer from "./nearbyShowsReducer"
import spotifyTokenReducer from "./spotifyTokenReducer"
import artistSearchReducer from "./artistSearchReducer"
import {combineReducers} from "redux"


const rootReducer = combineReducers({
    nearbyShows: nearbyShowsReducer,
    followedArtists: followedArtistsReducer,
    topArtists: topArtistsReducer,
    pinnedLocations: pinnedLocationsReducer,
    userCoordinates: userCoordinateReducer,
    spotifyTokens: spotifyTokenReducer,
    spotifySearchResults: artistSearchReducer
})

export default rootReducer