import "./Navigation.scss"
import { useState } from "react"
import Avatar from "boring-avatars"
import React from "react";
import { useSelector } from "react-redux"
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink
} from "react-router-dom";



export default function Navigation() {

    var nearbyShows = useSelector(state => state.nearbyShows)

    return (
        <div className="navigation">
            <div className="navigation__avatar">
                <Avatar
                    size={40}
                    name="Dick"
                    variant="marble"
                    colors={["hsl(156, 100%, 50%)", "#6666ff", "hsl(156, 100%, 30%)", "hsl(0, 0%, 90%)", "hsl(0, 0%, 40%)"]}
                ></Avatar>
                <div className="navigation__avatar-alerts">{nearbyShows.length}</div>
            </div>
            <NavLink activeClassName="active" to="/shows">
                <div className="navigation__tab navigation__tab--concerts"><div></div></div>
            </NavLink>
            <NavLink activeClassName="active" to="/artists">
                <div className="navigation__tab navigation__tab--artists"><div></div></div>
            </NavLink>
            <NavLink activeClassName="active" to="/locations">
                <div className="navigation__tab navigation__tab--finder"><div></div></div>
            </NavLink>
        </div>
    )
}

function NavigationButton(props) {

    let [selected, setSelected] = useState(props.selected)

    return (
        <Link to={props.to}>
            <div className={`navigation__tab`}>

            </div>
        </Link>
    )
}