export default function nearbyShowsReducer(state = [], action){
    switch(action.type){
        case "ADD_NEARBY_SHOW":
            return action.show instanceof Array ? [...state, ...action.show] : [...state, action.show]
        case "CLEAR_SHOWS":
            return state.filter(show => show.locationId !== action.location.locationId)
        default: 
            return state 
    }
}

export function addNearbyShow(show){
    return {
        type: "ADD_NEARBY_SHOW",
        show
    }
}

export function clearShows(location){
    return {
        type: "CLEAR_SHOWS",
    }
}