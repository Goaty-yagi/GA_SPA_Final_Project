import { createUser, getUserData } from "../../../../firebase/authentication.js";
import { setSessionStorage } from "../store/index.js";
import AbstractView from "./AbstractView.js";
import PopupNotification from "./PopupNotification.js";
// import { correctNum } from "./quiz.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Signup")
        this.score = document.location.search.substring(1).split("=")[1]
        this.app = document.querySelector("#app");
        this.url = "http://localhost:5000";
        this.userPath = "/api/user";
        this.scorePath = "/api/score";
        this.userEndpoint = this.url + this.userPath;
        this.scoreEndpoint = this.url + this.scorePath
        this.formError = []
        this.inputValues
        this.mainNode
        this.submitButton
    }
    async renderHTML() {
        //async return HTML might be asynchronous
        return `
        <div class="signup-wrapper">
            <form onsubmit="return false" class="signup-form">
                <div class="signup-text">Username</div>
                <input class="signup-text-input" required type="text" name="text" aria-label="username" value="">
                <div class="signup-text">E-MAIL</div>
                <input class="signup-text-input" required type="mail" name="text" aria-label="mail" value="">
                <div class="signup-text">Password</div>
                <input class="signup-text-input" required type="password" name="text" aria-label="password" value="">
                <button class="signup-submit-button" aria-label="Signup">Signup</button>
            </form>
        </div>
        `
    }
    initialEvent() {
        this.submitButton = document.querySelector(".signup-submit-button")
        this.submitButton.addEventListener("click",(e) => this.signupUser(e,this.scoreEndpoint))
        this.mainNode = document.querySelector(".signup-wrapper")
    }
    _checkForm(inputValues) {

        for(let i = 0; i < inputValues.length; i++) {
            if(!inputValues[i].value) {
                this.formError.push(`${inputValues[i].ariaLabel} is empty.` )
            }
        }
        if(this.formError.length) {
            return false
        } else {
            return true
        }
    }
    async signupUser(e) {
        console.log("ENTER",e,this.userEndpoint)
        e.preventDefault();
        this.submitButton.setAttribute("disabled", true)
        this.inputValues = document.querySelectorAll(".signup-text-input")
        const formCheck = this._checkForm(this.inputValues)
        const user = {
            username :this.inputValues[0].value,
            email: this.inputValues[1].value,
            password: this.inputValues[2].value,
        }
        if(formCheck) {
            await createUser(user)
            .then((e) => {
                console.log("CR",this.score,user)
                const userData = getUserData()
                console.log("USERDATA",userData)
                user["uid"] = userData.UID
                console.log("ENDPOINT_CHECK",this.userEndpoint)
                fetch(scoreEndpoint, {
                    method:"POST",
                    body: JSON.stringify({
                        UUID: user.uid,
                        username: user.username,
                        quiz_type: "js",
                        score: this.score
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
            }).then( async () => {
                await fetch(this.userEndpoint, {
                    method:"POST",
                    body: JSON.stringify({
                        UUID: user.uid,
                        user: user.username,
                        mail: user.email
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                console.log("GONNAGET_SCORE")
                setSessionStorage("currentScore", this.score)
            })
            .then(() => history.go())
            .catch((e) => {
                console.log("CATCH", e)
            })  
        } else {
            const title = 'ERROR OCCURRED'
            const color = "error"
            console.log("mainnnode",this.mainNode)
            const notify = new PopupNotification(
                this.formError, 
                title,
                this.mainNode,
                color)
            await notify.initialEvent()
                console.log("BEFORE_DISABLE")
                this.submitButton.disabled = false
        }
        this.formError = []
    }
}