export default function pinnedlocationsReducer(state = [], action) {
    switch (action.type) {
        case "SAVE_LOCATION":
            console.log("SAVING LOCATION", action.location)
            return [...state, action.location]
        case "REMOVE_LOCATION":
            return state.filter((location) => {
                console.log(location.locationId, action.location.locationId)
                console.log(location.locationId !== action.location.locationId)
                return location.locationId !== action.location.locationId
            })
        case "UPDATE_LOCATION":
            let updateIndex = state.findIndex((location) => { // find the index of the location we need to update
                return location.locationId === action.location.locationId
            })
            state[updateIndex] = state.location // insert the new location over top of the old one
            return [...state]
        default: 
            return state
    }
}

export function addPinnedLocation(location){
    return {
        type: "SAVE_LOCATION",
        location
    }
}

export function removePinnedLocation(location){
    return {
        type: "REMOVE_LOCATION",
        location
    }
}

export function updatePinnedLocation(location){
    return {
        type: "UPDATE_LOCATION",
        location
    }
}