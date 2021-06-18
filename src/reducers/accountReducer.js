
import Amplify, {Auth} from "@aws-amplify/auth"

export default function accountReducer(state = null, action){
    switch(action.type){
        case "LOGIN":
            return action.user
        case "LOGOUT":
            return null
        case "UPDATE_USER":
            return 
        default:    
            return state
    }
}

export function loginAs(user){
    return {
        type: "LOGIN", 
        user
    }
}
export function logout(){
    return {
        type: "LOGOUT"
    }
}

export function signUp(email, password){
    return function(dispatch){
        console.log("SIGNING USER UP!")
    }
}

export function updateUser(user){
    return {
        type: "UPDATE_USER",
        user
    }
}