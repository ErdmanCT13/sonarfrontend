export default function pinnedlocationsReducer(state = [], action) {
    switch (action.type) {
        case "STORE_TOKENS":
            localStorage.setItem("refreshToken", action.refreshToken)
            localStorage.setItem("accessToken", action.accessToken)
            return { refreshToken: action.refreshToken, accessToken: action.accessToken }
        default:    
            return state
    }
}

export function storeTokens(access, refresh) {
    return {
        type: "STORE_TOKENS",
        refreshToken: refresh,
        accessToken: access
    }
}
