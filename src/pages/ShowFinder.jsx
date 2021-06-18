import "./ShowFinder.scss"
import Map from "../components/Map.jsx"
import {useDispatch, useSelector} from "react-redux"
import {removePinnedLocation} from "../reducers/pinnedLocationsReducer"

export default function ShowFinder() {

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
            <div className="show-finder__pin-location">{props.location.lat.toFixed(2)}, {props.location.lng.toFixed(2)}</div>
            <div className="show-finder__pin-radius">Shows within {props.location.radius} miles</div>
            <div className="show-finder__pin-controls">
                <div className="show-finder__edit-pin"
                    onClick={() => {
                        dispatch()
                    }}
                >Edit</div>
                <div className="show-finder__delete-pin"
                    onClick={() => {
                        console.log("remove the pin")
                        dispatch(removePinnedLocation(props.location))
                    }}
                >Remove</div>
            </div>
        </div>
    )
}