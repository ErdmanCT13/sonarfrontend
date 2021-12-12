import "./Artists2.scss"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import spotifyLogo from "../assets/Spotify_Logo_RGB_Green.png"
import SpotifyWebApi from "spotify-web-api-node"
import Avatar from "boring-avatars"
import { storeTokens } from "../reducers/spotifyTokenReducer"
import { followArtist, unfollowArtist } from "../reducers/followedArtistsReducer"
import { addNearbyShow, setNearbyShows } from "../reducers/nearbyShowsReducer"
import { storeSearch } from "../reducers/artistSearchReducer"
import { Auth } from "@aws-amplify/auth"
import { motion, AnimateSharedLayout } from "framer-motion"




var artistTransition = {
    hidden: {
        opacity: 0,
        y: 100
    },
    visible: {
        opacity: 1,
        y: 0
    }
}


export default function Artists() {

    // const [searchedArtists, setSearchedArtists] = useState([])
    // const [likeSongsArtists, setLikedSongsArtists] = useState([])
    // const [topArtists, setTopArtists] = useState([])
    // const [discoverWeeklyArtists, setDiscoverWeeklyArtists] = useState([])

    // const accessToken = useSelector(state => state.spotifyTokens?.accessToken)
    // const refreshToken = useSelector(state => state.spotifyTokens?.refreshToken)
    const accessToken = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")

    let followedArtists = useSelector(state => state.followedArtists)
    let topArtists = useSelector(state => state.topArtists)

    // let [isViewingTopArtists, setIsViewingTopArtists] = useState(false)
    // let [isViewingFollowedArtists, setIsViewingFollowedArtists] = useState(true)
    // let [isViewingSearchedArtists, setIsSearchedArtists] = useState(false)
    let [sectionViewed, setSectionViewed] = useState("followedArtists")

    const dispatch = useDispatch()

    const searchValue = useSelector(state => state.spotifySearchResults?.searchValue ? state.spotifySearchResults.searchValue : "")
    const searchedArtists = useSelector(state => state.spotifySearchResults?.searchResults ? state.spotifySearchResults.searchResults : [])

    const artistSearchInput = useRef()
    const artistSearchTimeout = useRef(null)

    useEffect(() => {
        artistSearchInput.current.value = searchValue
    })

    return (
        <div className="artists">
            <div className="artists__header">
                {/* <div className="artists__search-spotify">
                    <input
                        ref={artistSearchInput}
                        placeholder="Find artists..."
                        onChange={async (event) => {

                            if (artistSearchTimeout.current) clearTimeout(artistSearchTimeout.current) // if the timeout is set we clear it on every keystroke
                            if (!artistSearchInput.current.value.length) return // if there are no characters in the input we abandon the search after clearing the callback
                            artistSearchTimeout.current = setTimeout(async () => { // and then we reset it and wait half a second
                                const artistsToDisplay = await fetch("https://sonarbackend.herokuapp.com/spotify/search" +
                                    `?search=${artistSearchInput.current.value}`).then(response => response.json())
                                console.log(artistsToDisplay)
                                dispatch(storeSearch(artistSearchInput.current.value, artistsToDisplay.artists.items))
                                // setSearchedArtists(artistsToDisplay.artists.items.map(spotifyArtist => ({spotifyArtist})))
                            }, 1000)

                        }} />
                </div> */}
                <AnimateSharedLayout>
                    <div
                        className="artists__artist-search-button"
                        onClick={() => {
                            setSectionViewed("searchArtists")
                        }}
                    >
                        {sectionViewed === "searchArtists" ?
                            <motion.div
                                initial={{ borderWidth: "2px", borderColor: "transparent", borderStyle: "solid", boxSizing: "border-box" }}
                                animate={{ borderColor: "hsl(0, 0%, 50%)" }}
                                layoutId="artist__artist-tab-background"
                                className="artists__artist-tab-background"
                            ></motion.div>
                            : null
                        }
                        <motion.input
                            animate={{ width: sectionViewed === "searchArtists" ? "300px" : "auto" }}
                            ref={artistSearchInput}
                            placeholder="Search Spotify"
                            onChange={async (event) => {

                                if (artistSearchTimeout.current) clearTimeout(artistSearchTimeout.current) // if the timeout is set we clear it on every keystroke
                                if (!artistSearchInput.current.value.length) return // if there are no characters in the input we abandon the search after clearing the callback
                                artistSearchTimeout.current = setTimeout(async () => { // and then we reset it and wait half a second
                                    const artistsToDisplay = await fetch("https://sonarbackend.herokuapp.com/spotify/search" +
                                        `?search=${artistSearchInput.current.value}`).then(response => response.json())
                                    console.log(artistsToDisplay)
                                    dispatch(storeSearch(artistSearchInput.current.value, artistsToDisplay.artists.items))
                                    // setSearchedArtists(artistsToDisplay.artists.items.map(spotifyArtist => ({spotifyArtist})))
                                }, 1000)

                            }} />
                    </div>
                    <div
                        className="artists__followed-artists-button"
                        onClick={() => {
                            console.log("button")
                            setSectionViewed("followedArtists")
                        }}
                    >
                        {sectionViewed === "followedArtists" ? <motion.div layoutId="artist__artist-tab-background" className="artists__artist-tab-background"></motion.div> : null}
                        Followed
                    </div>
                    <div
                        className="artists__top-artists-button"
                        onClick={() => {
                            setSectionViewed("topArtists")
                        }}
                    >
                        {sectionViewed === "topArtists" ? <motion.div layoutId="artist__artist-tab-background" className="artists__artist-tab-background"></motion.div> : null}
                        Top Artists
                    </div>
                </AnimateSharedLayout>

                <a href="https://sonarbackend.herokuapp.com/spotify/authorize/user">
                    <div className="artists__link-spotify-account">
                        Link your spotify account
                    <img alt="WHUT" src={spotifyLogo} />
                    </div>
                </a>
            </div>

            {
                sectionViewed === "searchArtists" ?
                    <div className="artists__section artists__section--search-artists">
                        <div className="artists__section-header">Search Results for <span>{artistSearchInput.current?.value}</span></div>
                        <div className="artists__overflow">
                            {
                                searchedArtists.length > 0 ?
                                    <motion.div
                                        className="artists__already-followed"
                                        initial="hidden"
                                        animate="visible"
                                        variants={artistTransition}
                                    >
                                        <div className="artists__section-banner">
                                            We found <span>these</span> results for you
                                <div className="artists__section-icon"></div>
                                        </div>
                                        {
                                            searchedArtists.length > 0 ? searchedArtists.map(artist => <Artist2 artist={artist} followed={followedArtists.some(followedArtist => followedArtist.id === artist.id)} />) : null
                                        }
                                    </motion.div> :
                                    <div className="artists__no-artists">
                                        {artistSearchInput.current.value ? `No results for "${artistSearchInput.current.value}"` : "Try searching for an artist on Spotify"}
                                        {artistSearchInput.current.value ? <span>Make sure your spelling is correct or try different keywords</span> : null}
                                    </div>
                            }
                        </div>
                    </div> : null
            }

            {
                sectionViewed === "followedArtists" ?
                    <div className="artists__section artists__section--followed-artists">
                        <div className="artists__section-header">Artists You Follow</div>
                        <div className="artists__overflow">
                            {
                                followedArtists.length > 0 ?
                                    <motion.div
                                        className="artists__already-followed"
                                        initial="hidden"
                                        animate="visible"
                                        variants={artistTransition}
                                    >
                                        <div className="artists__section-banner">
                                            We'll let you know when these artists are playing near <span>you</span>
                                            <div className="artists__section-icon"></div>
                                        </div>
                                        {
                                            followedArtists.length > 0 ? followedArtists.map(artist => <Artist2 artist={artist} followed={true} />) : null
                                        }
                                    </motion.div> :
                                    <div className="artists__no-artists">
                                        Looks like you're not following any artists :(
                                        <span>Try Searching for artists or check out your top artists from Spotify</span>
                                    </div>
                            }

                        </div>

                    </div> : null
            }

            {
                sectionViewed === "topArtists" ?
                    <div className="artists__section artists__section--top-artists">
                        <div className="artists__section-header">Your Top Artists</div>
                        <div className="artists__overflow">
                            {
                                topArtists.length > 0 ?
                                    <motion.div
                                        className="artists__already-followed"
                                        initial="hidden"
                                        animate="visible"
                                        variants={artistTransition}
                                        transition={{
                                            delay: .5
                                        }}
                                    >

                                        <div className="artists__section-banner">
                                            All your favorite <span>Spotify</span> artists in <span>one place</span>
                                            <div className="artists__section-icon"></div>
                                        </div>
                                        {
                                            topArtists.length > 0 ? topArtists.map(artist => <Artist2 artist={artist} followed={followedArtists.some(followedArtist => followedArtist.id === artist.id)} />) : null

                                        }
                                    </motion.div> :
                                    <div className="artists__no-artists">
                                        Follow your
                                        <span>Try following some of your favorite artists &#128512;</span>
                                    </div>
                            }
                        </div>
                    </div> : null
            }

        </div>

    )
}


function Artist(props) {

    const [followed, setFollowed] = useState(props.followed ? true : false)
    const dispatch = useDispatch()


    return (
        <motion.div
            className="artists__followed-artist"
        // animate={{
        //     y: -50,
        //     opacity: 0
        // }}
        >
            <div className="artists__content-row">
                <div className="artists__artist-image">
                    {props.artist.images.length > 0 ?
                        <img alt="" src={props.artist.images[props.artist.images.length - 1]?.url}></img> :
                        <div></div>
                    }
                </div>
                <div className="artists__artist-info">
                    <div className="artists__artist-name">{props.artist.name}</div>
                    <div className="artists__artist-followed-since"></div>
                </div>
                <div className="artists__artist-controls">
                    <div className={`artists__artist-followed-button ${props.followed ? "artists__artist-followed-button--followed" : ""}`}
                        onClick={async event => {
                            try {
                                var authenticatedUser = await Auth.currentAuthenticatedUser()
                                var dbArtist = await fetch(`https://sonarbackend.herokuapp.com/user/artists?userid=${authenticatedUser.attributes["custom:uuid"]}&artistname=${props.artist.name}&spotifyid=${props.artist.id}`, {
                                    method: followed ? "DELETE" : "POST"
                                }).then(response => response.json())
                                setFollowed(!followed)
                                dispatch(followed ? unfollowArtist(props.artist) : followArtist(props.artist))
                                console.log(dbArtist)

                            }
                            catch (err) {
                                console.log(err)
                            }

                        }}></div>
                    <div className="artists__artist-listen"></div>
                </div>
            </div>
        </motion.div>
    )
}


function Artist2(props) {

    const [followed, setFollowed] = useState(props.followed ? true : false)
    const dispatch = useDispatch()

    return (
        <div className="artist-2">
            <div className="artist-2__inner">
                <img src={props.artist.images[0]?.url} style={{ display: "flex" }} />
                <div className="artist-2__content">
                    <div className="artist-2__name">{props.artist.name}</div>
                    <div className="artists__artist-controls">
                        <div className={`artists__artist-followed-button ${props.followed ? "artists__artist-followed-button--followed" : ""}`}
                            onClick={async event => {
                                try {
                                    var authenticatedUser = await Auth.currentAuthenticatedUser()
                                    var dbArtist = await fetch(`https://sonarbackend.herokuapp.com/user/artists?userid=${authenticatedUser.attributes["custom:uuid"]}&artistname=${props.artist.name}&spotifyid=${props.artist.id}`, {
                                        method: followed ? "DELETE" : "POST"
                                    }).then(response => response.json())
                                    setFollowed(!followed)
                                    dispatch(followed ? unfollowArtist(props.artist) : followArtist(props.artist))
                                    console.log(dbArtist)
                                    let nearbyShows = await fetch(`https://sonarbackend.herokuapp.com/user/shows?userid=${authenticatedUser.attributes["custom:uuid"]}`).then(response => response.json())
                                    dispatch(setNearbyShows(nearbyShows.filteredShows))

                                }
                                catch (err) {
                                    console.log(err)
                                }

                            }}></div>
                        <div className="artists__artist-listen"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}