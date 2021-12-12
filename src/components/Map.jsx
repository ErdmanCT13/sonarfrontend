import "./Map.scss"
import { useState } from "react"
import { GoogleMap, useJsApiLoader, useLoadScript, Marker, OverlayView } from "@react-google-maps/api"
import mapStyles from "../mapStyles"
import { addPinnedLocation, removePinnedLocation } from "../reducers/pinnedLocationsReducer"
import { addNearbyShow } from "../reducers/nearbyShowsReducer"
import { useSelector, useDispatch } from "react-redux"
import { Auth } from "@aws-amplify/auth"




const containerStyle = {
    height: '100%',
    flex: 1,
    border: "none"

};

const center = {
    lat: -3.745,
    lng: -38.523
};

const options = {
    styles: mapStyles,
    disableDefaultUI: true,
    zoomControl: false,
    fullscreenControl: false,
    mapTypeControl: false,
    streetViewControl: false
}


export default function Map() {

    const { loadError, isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAW1bmzuhD5y2jt4FBBJwYMskWA60TvW1w"
    })

    const pinnedLocations = useSelector(state => state.pinnedLocations)
    const userCoordinates = useSelector(state => state.userCoordinates)
    const dispatch = useDispatch()

    // var [selected, setSelected] = useState(null)
    // var [markers, setMarkers] = useState([])

    if (loadError) return <div>Error while loading map :(</div>
    if (!isLoaded) return <div>Loading Map :)</div>

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={8}
            center={{lat: userCoordinates.latitude, lng: userCoordinates.longitude}}
            options={options}
            onClick={(event) => {
                try {
                    // dispatch(getEventsNearLocation({ lat: event.latLng.lat(), lng: event.latLng.lng(), radius: 50 }))
                }
                catch (err) {
                    console.log(err)
                }
                Auth.currentAuthenticatedUser().then(user => {
                    console.log("HERES THE USER", user)
                    console.log("USER ID IS RIGHT HERE", user.attributes["custom:uuid"])
                    return fetch(`https://sonarbackend.herokuapp.com/user/locations?userid=${user.attributes["custom:uuid"]}&locationname=${"Milwaukee"}&radius=${50}&lat=${event.latLng.lat()}&lng=${event.latLng.lng()}`, {
                        method: "POST"
                    })
                    .then(response => response.json())
                })
                .then(parsedBody => {
                    console.log("asdj;faslkjdflajksdjf;kasjkdlf;jaklsdf;lkjasd;jlk", parsedBody)
                    //dispatch(addPinnedLocation({ locationName: "Milwaukee", radius: 50, latitude: parsedBody., lng: event.latLng.lng() }))
                    dispatch(addPinnedLocation({
                        userId: parsedBody.userId,
                        locationName: parsedBody.locationName,
                        locationId: parsedBody.locationId,
                        radius: parsedBody.radius,
                        latitude: parseFloat(parsedBody.latitude).toFixed(10),
                        longitude: parseFloat(parsedBody.longitude).toFixed(10)
                    }))
                })
                
            }}
        >

            {pinnedLocations.map((marker, index) =>
                <CustomMapMarker
                    key={index + "Map Marker"}
                    position={{ lat: marker.latitude, lng: marker.longitude }}
                ></CustomMapMarker>)}
        </GoogleMap>
    )
}

// async function getEvents(lat, lng, radius){
//     return fetch(`https://sonarbackend.herokuapp.com/?lat=${lat}&long=${lng}&radius=${radius}&email=erdman_carl@hotmail.com&postalCode=53704`).then(response => response.json()).then(console.log)
// }


function CustomMapMarker(props) {
    return (
        <OverlayView
            mapPaneName="markerLayer"
            position={props.position}
        >
            <div className="map-marker">
                <div></div>

            </div>
        </OverlayView>
    )
}

function getEventsNearLocation(location) {
    console.log("gettings events")
    return async function (dispatch) {
        console.log("getting events")
        var eventsResponse = await fetch(`https://sonarbackend.herokuapp.com/shows?lat=${location.lat}&long=${location.lng}&radius=${location.radius}&email=erdman_carl@hotmail.com&postalCode=53704`).then(response => response.json())
        console.log(eventsResponse)
        dispatch(addNearbyShow(eventsResponse.events)) // store the shows we get back
    }
}