import "./ShowFinder.scss"
import Map from "../components/Map.jsx"
import { useDispatch, useSelector } from "react-redux"
import { removePinnedLocation, addPinnedLocation } from "../reducers/pinnedLocationsReducer"
// import {setNearbyShows} from "../reducers/nearbyShowsReducer"
import { useEffect } from "react"
import { Auth } from "@aws-amplify/auth"
import { setNearbyShows } from "../reducers/nearbyShowsReducer"

export default function ShowFinder() {

    const dispatch = useDispatch()

    useEffect(() => {
        Auth.currentAuthenticatedUser()
            .then(user => {
                return fetch(`https://sonarbackend.herokuapp.com/user/locations?userid=${user.attributes["custom:uuid"]}`).then(response => response.json())
            })
            .then(parsedBody => {
                console.log(parsedBody)
                dispatch(addPinnedLocation(parsedBody))
            })

    }, [])

    let locations = useSelector(state => state.pinnedLocations)

    return (
        <div className="show-finder">
            <div className="show-finder__column">
                <div className="show-finder__pins">
                    {locations.map((location, index) => {
                        return <ShowPin key={index + "location_pin"} location={location}></ShowPin>
                    })}
                </div>
            </div>
            <div className="show-finder__map">
                <Map></Map>
            </div>
        </div>
    )
}

function ShowPin(props) {

    const dispatch = useDispatch()

    return (
        <div className="show-finder__pin">
            <div className="show-finder__pin-header">{props.location.locationName}</div>
            <div className="show-finder__pin-location">{parseFloat(props.location.latitude).toFixed(2)}, {parseFloat(props.location.longitude).toFixed(2)}</div>
            <div className="show-finder__pin-radius">Shows within {props.location.radius} miles</div>
            <div className="show-finder__pin-controls">
                <div className="show-finder__edit-pin"
                    onClick={async () => {

                    }}
                >Edit</div>
                <div className="show-finder__delete-pin"
                    onClick={async () => {
                        console.log("remove the pin")
                        var authenticatedUser = Auth.currentAuthenticatedUser()
                        var removedLocation = fetch(`https://sonarbackend.herokuapp.com/user/locations?userid=${authenticatedUser.attributes["custom:uuid"]}&locationid=${props.location.locationId}`, {
                            method: "DELETE"
                        }).then(response => response.json())

                        dispatch(removePinnedLocation(props.location))
                        let nearbyShows = await fetch(`https://sonarbackend.herokuapp.com/user/shows?userid=${authenticatedUser.attributes["custom:uuid"]}`).then(response => response.json())
                        dispatch(setNearbyShows(nearbyShows.filteredShows))
                    }}
                >Remove</div>
            </div>
        </div>
    )
}