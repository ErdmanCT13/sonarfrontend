import "./Map.scss"
import { useState } from "react"
import { GoogleMap, useJsApiLoader, useLoadScript, Marker, OverlayView } from "@react-google-maps/api"
import mapStyles from "../mapStyles"
import { addPinnedLocation } from "../reducers/pinnedLocationsReducer"
import { addNearbyShow } from "../reducers/nearbyShowsReducer"
import { useSelector, useDispatch } from "react-redux"



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
    const dispatch = useDispatch()

    // var [selected, setSelected] = useState(null)
    // var [markers, setMarkers] = useState([])

    if (loadError) return <div>Error while loading map :(</div>
    if (!isLoaded) return <div>Loading Map :)</div>

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={8}
            center={center}
            options={options}
            onClick={(event) => {
                try {
                    dispatch(getEventsNearLocation({ lat: event.latLng.lat(), lng: event.latLng.lng(), radius: 50 }))
                }
                catch (err) {
                    console.log(err)
                }
                dispatch(addPinnedLocation({ locationName: "Milwaukee", radius: 50, lat: event.latLng.lat(), lng: event.latLng.lng() }))
            }}
        >

            {pinnedLocations.map((marker, index) =>
                <CustomMapMarker
                    key={index + "Map Marker"}
                    position={{ lat: marker.lat, lng: marker.lng }}
                ></CustomMapMarker>)}
        </GoogleMap>
    )
}

// async function getEvents(lat, lng, radius){
//     return fetch(`http://localhost:4000/?lat=${lat}&long=${lng}&radius=${radius}&email=erdman_carl@hotmail.com&postalCode=53704`).then(response => response.json()).then(console.log)
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
        var eventsResponse = await fetch(`http://localhost:4000/shows?lat=${location.lat}&long=${location.lng}&radius=${location.radius}&email=erdman_carl@hotmail.com&postalCode=53704`).then(response => response.json())
        console.log(eventsResponse)
        dispatch(addNearbyShow(eventsResponse.events)) // store the shows we get back
    }
}