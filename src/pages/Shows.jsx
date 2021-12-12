import "./Shows.scss"
import { useSelector, useDispatch } from "react-redux"
import { motion } from "framer-motion"

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

export default function Shows(props) {

    const shows = useSelector(state => state.nearbyShows)
    const followedArtists = useSelector(state => state.followedArtists)

    return (
        <div className="nearby-shows">
            <div className="nearby-shows__header">
                Shows Near You
            </div>
            <motion.div
                initial="hidden"
                animate="visible"
                variants={artistTransition}
                className="nearby-shows__overflow"
            >
                <div className="nearby-shows__grid">
                    <div className="nearby-shows__banner">
                        Here are some shows <span>you</span> might want to see
                        <div className="nearby-shows__banner-icon"></div>
                        <div className=""></div>
                    </div>
                    {shows.map(show => {
                        let matchingArtist = followedArtists.find(artist => {
                            let artistNameRegex = new RegExp(artist.name)
                            return artistNameRegex.test(show.name)
                        })
                        return <Show artist={matchingArtist} show={show}></Show>
                    })}
                </div>
            </motion.div>
        </div>
    )
}



function Show(props) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={artistTransition}
            className="nearby-shows__show">
            <div className="nearby-shows__show-inner">
                <img src={props.artist.images[0]?.url} style={{ display: "flex" }} />
                <div className="nearby-shows__show-content">
                    <div className="nearby-shows__show-date">{props.show.dates.start.localDate}</div>
                    <div className="nearby-shows__show-header">{props.show.name}</div>
                    <div className="nearby-shows__show-location">{props.show._embedded.venues[0].name} <span>{` ${props.show.distance} miles way`}</span></div>
                    <a href={props.show.url}><div className="nearby-shows__show-tickets"></div></a>
                </div>
            </div>
        </motion.div>
    )
}