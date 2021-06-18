import accountReducer from "./accountReducer"
import followedArtistsReducer from "./followedArtistsReducer"
import pinnedLocationsReducer from "./pinnedLocationsReducer"
import nearbyShowsReducer from "./nearbyShowsReducer"
import {combineReducers} from "redux"


const rootReducer = combineReducers({
    nearbyShows: nearbyShowsReducer,
    followedArtists: followedArtistsReducer,
    pinnedLocations: pinnedLocationsReducer,
    user: accountReducer
})

export default rootReducer