import logo from './logo.svg';
import './App.css';
import AppHeader from "./components/AppHeader"
import Account from "./pages/Account"
import ShowFinder from "./pages/ShowFinder"
import Artists from "./pages/Artists"
import Navigation from "./components/Navigation"
import Login from "./pages/Login"
import Shows from "./pages/Shows"
import { checkForLogin } from "./reducers/userCoordinateReducer"
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import Amplify, { Auth } from "@aws-amplify/auth"
import { storeCoordinate, clearCoordinate } from "./reducers/userCoordinateReducer"
import { storeTokens } from "./reducers/spotifyTokenReducer"
import { storeTopArtist, removeTopArtist } from "./reducers/topArtistsReducer"
import { addNearbyShow } from "./reducers/nearbyShowsReducer"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect
} from "react-router-dom";
import { followArtist } from './reducers/followedArtistsReducer';


function App() {

  const dispatch = useDispatch()


    useEffect(() => {
      (async function () {
        const queryParams = window.location.search ? new URLSearchParams(window.location.search) : null

        // first check to see if there are tokens in the query params from a redirect
        // if not tokens were found in the query param, check local storage

        let spotifyAccessToken
        let spotifyRefreshToken

        console.log(queryParams?.get("access_token"), "HERES THE ACCESS TOKEN PARAM", queryParams?.get("refresh_token"))
        if((localStorage.getItem("accessToken") !== "undefined") && (localStorage.getItem("refreshToken") !== "undefined")){ // first check local storage
          console.log(spotifyRefreshToken, spotifyAccessToken)
          spotifyAccessToken = localStorage.getItem("accessToken")
          spotifyRefreshToken = localStorage.getItem("refreshToken")
        }
        if(queryParams?.get("access_token") && queryParams?.get("refresh_token")){
          console.log("tokens are in query params")
          spotifyAccessToken = queryParams?.get("access_token")
          spotifyRefreshToken = queryParams?.get("refresh_token")
          localStorage.setItem("accessToken", spotifyAccessToken)
          localStorage.setItem("refreshToken", spotifyRefreshToken)
        }

        if (spotifyAccessToken && spotifyRefreshToken) {

          console.log(localStorage.getItem("accessToken") !== "undefined")

          const parsedBody = await fetch(`https://sonarbackend.herokuapp.com/spotify/authorize/user?refresh_token=${spotifyRefreshToken}`) // if we have a refresh token, use it to get a new access token so we know its up to date
            .then(response => response.json())
          console.log(parsedBody)
          const topArtists = await fetch(`https://sonarbackend.herokuapp.com/spotify/topartists?access_token=${parsedBody.access_token}`)
            .then(response => response.json())

          dispatch(storeTokens(parsedBody.access_token, spotifyRefreshToken)) // store the new token along with the old refresh token
          dispatch(storeTopArtist(topArtists.items))
          
          var currentUser = await Auth.currentAuthenticatedUser()
          var followedArtistsResponse = await fetch(`https://sonarbackend.herokuapp.com/spotify/followedartists?access_token=${parsedBody.access_token}&userid=${currentUser.attributes["custom:uuid"]}`).then(response => response.json())
          console.log(followedArtistsResponse.artists)
          dispatch(followArtist(followedArtistsResponse.artists))

          let nearbyShows = await fetch(`https://sonarbackend.herokuapp.com/user/shows?userid=${currentUser.attributes["custom:uuid"]}`).then(response => response.json())
          dispatch(addNearbyShow(nearbyShows.filteredShows))
          console.log(nearbyShows)
        }
      })()
    }, [])

    useEffect(() => {
      if (navigator.geolocation) {
        // console.log("geolocation is defined")
        navigator.geolocation.getCurrentPosition(position => {
          dispatch(storeCoordinate(position.coords.latitude, position.coords.longitude))
        },
          () => {
            // console.log("error while retrieving location :(")
          })
      }
      else {
        // console.log("NAVIGATOR IS NOT AVAILABLE")
      }
    }, [])


    return (
      <div className="App">
        <AppHeader></AppHeader>

        <Router>
          <Switch>
            <Route exact path="">

            </Route>
          </Switch>
          <Switch>
            <Route exact path="/">
              <Redirect to="/login"></Redirect>
            </Route>
            <Route exact path="/login">
              <Login></Login>
            </Route>
            <Route exact path="/artists">
              <Navigation></Navigation>
              <Artists></Artists>
            </Route>
            <Route exact path="/shows">
              <Navigation></Navigation>
              <Shows></Shows>
            </Route>
            <Route exact path="/locations">
              <Navigation></Navigation>
              <ShowFinder></ShowFinder>
            </Route>
          </Switch>
        </Router>
      </div>
    );
  }

export default App;
