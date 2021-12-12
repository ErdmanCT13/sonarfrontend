import "./Login.scss"
import Amplify, { Auth } from "@aws-amplify/auth"
import { useDispatch, useSelector } from "react-redux"
import { loginAs } from "../reducers/userCoordinateReducer"
import { followArtist } from "../reducers/followedArtistsReducer"
import { storeUser, getUser } from "../api"
import awsconfig from "../aws-exports"
import { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from "react-router-dom";

Amplify.configure(awsconfig)
Auth.configure({ storage: window.sessionStorage })

export default function Login() {

    const [signedIn, setSignedIn] = useState(false)
    const [formType, setFormType] = useState("signIn")
    const [signUpPasswordsMatch, setSignUpPasswordsMatch] = useState(false)
    const [signUpErrorFlag, setSignUpErrorFlag] = useState(false)
    const [confirmationCodeErrorFlag, setConfirmationCodeErrorFlag] = useState(false)
    const [signInErrorFlag, setSignInErrorFlag] = useState(false)
    const [passwordPendingConfirmation, setPasswordPendingConfirmation] = useState()
    const [emailPendingConfirmation, setEmailPendingConfirmation] = useState(null)
    const dispatch = useDispatch()

    // useEffect(() => {
    //     Auth.currentAuthenticatedUser()
    //         .then(user => {
    //             console.log(user)
    //             if (user) {
    //                 return getUser({email: user.attributes.email})
    //             }
    //         })
    //         .then((userFromDB) => {
    //             console.log(userFromDB)
    //             // dispatch(loginAs(userFromDB))
    //             setSignedIn(true)
    //         })
    //         .catch(error => {console.log(error)})
    // }, [])

    const signInEmailInput = useRef()
    const signInPasswordInput = useRef()
    const signUpEmailInput = useRef()
    const signUpPasswordInput = useRef() // we'll want direct access to the value stored in these later
    const signUpConfirmPasswordInput = useRef()
    const confirmationCodeInput = useRef()

    return (
        <div className="login">
            {
                formType === "signedIn" && (
                    <Redirect push to="/locations"></Redirect>
                )
            }
            {
                formType === "signIn" && (
                    <div className="login__sign-in">
                        <div className="login__header">
                            SONAR
                        </div>
                        <div className="login__input login__input--username">
                            <input ref={signInEmailInput} placeholder="Username" type="text" />
                        </div>
                        <div className="login__input login__input--password">
                            <input ref={signInPasswordInput} placeholder="Password" type="text" />
                        </div>
                        <div className="login__button login__button--sign-in"
                            onClick={async () => {
                                console.log("SIGNING IN")
                                try {
                                    const user = await Auth.signIn(signInEmailInput.current.value, signInPasswordInput.current.value)
                                    setFormType("signedIn")
                                    // console.log(user.attributes.email, user)
                                    // // const DBuser = await getUser({ email: user.attributes.email })
                                    // console.log(DBuser)
                                    // dispatch(loginAs(DBuser))
                                    console.log(user)
                                }
                                catch (err) {
                                    console.log(err, err.code)
                                    if (err.code === "UserNotConfirmedException") {
                                        // console.log(signInEmailInput)
                                        // setEmailPendingConfirmation(signInEmailInput.current.value)
                                        // setFormType("confirmSignUp")
                                    }
                                }
                            }}
                        >Sign in</div>
                        <div className="login__button login__button--google-sign-in">Sign in with Google</div>
                        <div className="login__button login__button--sign-up"
                            onClick={async () => {
                                setFormType("signUp")
                            }}
                        >Sign up</div>
                    </div>
                )

            }
            {
                formType === "signUp" && (
                    <div className="login__sign-up">
                        <div className="login__header">
                        </div>
                        <div className="login__input login__input--username">
                            <input ref={signUpEmailInput} placeholder="Enter your email" type="text" />
                        </div>
                        <div className={`login__input login__input--password ${signUpPasswordsMatch ? "login__input--valid" : ""}`}>
                            <input
                                onChange={
                                    () => {
                                        console.log("new character", signUpPasswordInput.current)
                                        if (signUpPasswordInput.current.value === signUpConfirmPasswordInput.current.value) {
                                            console.log("NEW MATCH")
                                            setSignUpPasswordsMatch(true)
                                            return
                                        }
                                        if (signUpPasswordsMatch) setSignUpPasswordsMatch(false)
                                    }}
                                ref={signUpPasswordInput}
                                placeholder="Enter password"
                                type="text" />
                        </div>
                        <div className={`login__input login__input--confirm-password ${signUpPasswordsMatch ? "login__input--valid" : ""}`}>
                            <input
                                onChange={
                                    () => {
                                        console.log("new character", signUpPasswordInput.current)
                                        if (signUpPasswordInput.current.value === signUpConfirmPasswordInput.current.value) {
                                            console.log("NEW MATCH")
                                            setSignUpPasswordsMatch(true)
                                            return
                                        }
                                        if (signUpPasswordsMatch) setSignUpPasswordsMatch(false) // only rerender if the flag is set to true
                                    }}
                                ref={signUpConfirmPasswordInput}
                                placeholder="Confirm Password"
                                type="text" />
                        </div>
                        <div className="login__button login__button--submit-sign-up"
                            onClick={
                                async () => {
                                    if (signUpPasswordsMatch) {
                                        try {
                                            console.log(signUpEmailInput.current.value)
                                            const { user } = await Auth.signUp({
                                                username: signUpEmailInput.current.value,
                                                password: signUpConfirmPasswordInput.current.value,
                                                attributes: {
                                                    "custom:uuid": uuidv4() // generate a unique id for db use
                                                }
                                            })
                                            console.log(user)
                                            setPasswordPendingConfirmation(signUpConfirmPasswordInput.current.value) // store the password/email so we can sign in once the user confirms
                                            setEmailPendingConfirmation(signUpEmailInput.current.value)
                                            setFormType("confirmSignUp")
                                        }
                                        catch (err) {
                                            console.log(err)
                                        }
                                    }
                                }
                            }>
                            Create account
                            </div>
                    </div>
                )
            }
            {
                formType === "confirmSignUp" && (
                    <div className="login_confirm-sign-up">
                        <div className="login__header">
                        </div>
                        <div className="login__input login__input--confirmation-code">
                            <input
                                ref={confirmationCodeInput}
                                placeholder="Confirmation code"
                            />
                        </div>
                        <div className="login__button login__button--submit-confirmation-code" onClick={
                            async () => {
                                try {
                                    await Auth.confirmSignUp(emailPendingConfirmation, confirmationCodeInput.current.value)
                                    const user = await Auth.signIn(emailPendingConfirmation, passwordPendingConfirmation)
                                    setFormType("signedIn")
                                    console.log(user)
                                }
                                catch (err) {
                                    console.log(err)
                                }
                            }
                        }>Submit code</div>
                    </div>
                )
            }
        </div>
    )
}