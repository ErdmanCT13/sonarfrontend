
import Amplify, {Auth} from "@aws-amplify/auth"

export default function userCoordinateReducer(state = null, action){
    switch(action.type){
        case "STORE_COORDINATE":
            return {
                latitude: action.latitude,
                longitude: action.longitude
            }
        case "CLEAR_COORDINATE":
            return null
        default: 
            return state
    }
}

export function storeCoordinate(latitude, longitude){
    return {
        latitude,
        longitude,
        type: "STORE_COORDINATE"
    }
}

export function clearCoordinate(){
    return {
        type: "CLEAR_COORDINATE"
    }
}

// export function checkForLogin(){
//     return function(dispatch){
//         Auth.currentAuthenticatedUser()
//             .then(user => {
//                 dispatch(loginAs(user))
//             })
//     }
// }

// export function loginAs(user){
//     return {
//         type: "LOGIN", 
//         user
//     }
// }

// export function logout(){
//     return {
//         type: "LOGOUT"
//     }
// }

// export function signUp(email, password){
//     return function(dispatch){
//         console.log("SIGNING USER UP!")
//     }
// }

// export function updateUser(user){
//     return {
//         type: "UPDATE_USER",
//         user
//     }
// }