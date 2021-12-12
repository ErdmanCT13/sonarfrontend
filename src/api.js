import { Auth } from "@aws-amplify/auth"


export function storeUser(parameters) {
    return fetch(`https://sonarbackend.herokuapp.com/user/signup?email=${parameters.email}&radius=${parameters.radius}&postalcode=${parameters.postalCode}&lat=${parameters.lat}&lng=${parameters.lng}`, {
        method: "POST"
    })
        .then(response => response.json())
}

export function getUser(parameters) {
    return fetch(`https://sonarbackend.herokuapp.com/user?email=${parameters.email}`)
        .then(response => response.json())
}

export function getFollowedArtists(parameters) {
    return fetch(`https://sonarbackend.herokuapp.com/user/artists?userid=${parameters.userId}`)
        .then(response => response.json())
}

export function followArtist(parameters) {
    return fetch(`https://sonarbackend.herokuapp.com/user/artists?userid=${parameters.userId}&artistname=${parameters.artistName}`, {
        method: "POST"
    })
        .then(response => response.json())
}

export function pinLocation(parameters) {
    return fetch(`https://sonarbackend.herokuapp.com/user/locations?locationname=${parameters.locationName}&userid=${parameters.userId}&lat=${parameters.lat}&lng=${parameters.lng}&radius=${parameters.radius}`, {
        method: "POST"
    })
        .then(response => response.json())
}

export function deletePinnedLocation(parameters) {

}