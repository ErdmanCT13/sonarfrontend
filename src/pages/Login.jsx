import "./Login.scss"
import Amplify, { Auth } from "@aws-amplify/auth"
import { useDispatch, useSelector } from "react-redux"
import awsconfig from "../aws-exports"
import { useState, useRef, useEffect } from "react"

Amplify.configure(awsconfig)

export default function Login() {

    const [formType, setFormType] = useState("signIn")
    const [signUpPasswordsMatch, setSignUpPasswordsMatch] = useState(false)
    const [signUpErrorFlag, setSignUpErrorFlag] = useState(false)
    const [confirmationCodeErrorFlag, setConfirmationCodeErrorFlag] = useState(false)
    const [signInErrorFlag, setSignInErrorFlag] = useState(false)
    const dispatch = useDispatch()
    const signUpPasswordInput = useRef() // we'll want direct access to the value stored in these later
    const signUpConfirmPasswordInput = useRef()

    return (
        <div className="login">
            <div className="login__header">
                SONAR
            </div>

            {
                formType === "signIn" && (
                    <div className="login__sign-in">
                        <div className="login__input login__input--username">
                            <input placeholder="Username" type="text" />
                        </div>
                        <div className="login__input login__input--password">
                            <input placeholder="Password" type="text" />
                        </div>
                        <div className="login__button login__button--sign-in">Sign in</div>
                        <div className="login__button login__button--google-sign-in">Sign in with Google</div>
                        <div className="login__button login__button--sign-up"
                            onClick={() => {
                                setFormType("signUp")
                            }}
                        >Sign up</div>
                    </div>
                )

            }
            {
                formType === "signUp" && (
                    <div className="login__sign-up">
                        <div className="login__sign-in">
                            <div className="login__input login__input--username">
                                <input placeholder="Enter your email" type="text" />
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
                                        if(signUpPasswordsMatch){
                                            setFormType("confirmSignUp")
                                            console.log("CREATE ACCOUNT")
                                        }
                                    }
                                }>
                                Create account
                            </div>
                        </div>
                    </div>
                )
            }
            {
                formType === "confirmSignUp" && (
                    <div className="login_confirm-sign-up">
                        <div className="login__input login__input--confirmation-code">
                            <input
                                placeholder="Confirmation code"
                            />
                        </div>
                        <div className="login__button login__button--submit-confirmation-code" onClick={
                            async () => {
                                console.log("SUBMIT CONFIRMATION CODE!")
                            }
                        }>Submit code</div>
                    </div>
                )
            }
        </div>
    )
}