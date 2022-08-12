import { createUser, getUserData } from "../../../../firebase/authentication.js";
import AbstractView from "./AbstractView.js";
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
    }
    async getHtml() {
        //async return HTML might be asynchronous
        return `
        <div class="signup-wrapper"">
            <form onsubmit="return false" class="main-container">
                <div>Username</div>
                <input class="text-input" type="text" name="text" aria-label="username" value="">
                <div>E-MAIL</div>
                <input class="text-input" type="mail" name="text" aria-label="mail" value="">
                <div>Password</div>
                <input class="text-input" type="password" name="text" aria-label="password" value="">
                <button class="submit-button" aria-label="Signup">Signup</button>
            </form>
        </div>
        `
    }
    addEvent() {
        document.querySelector(".submit-button").addEventListener("click",() => this.signupUser(this.userEndpoint, this.scoreEndpoint))
    }
    event() {
        console.log("EVENT_CLICKED")
        // history.replaceState(null, null, "quiz")
    }
    async signupUser(userEndpoint, scoreEndpoint) {
        console.log("ENTER",this.userEndpoint)
        const inputValues = document.querySelectorAll(".text-input")
        const user = {
            username :inputValues[0].value,
            email: inputValues[1].value,
            password: inputValues[2].value,
        }
        createUser(user)
        .then((e) => {
            console.log("CR",e)
            const userData = getUserData()
            const uid = userData.uid
            console.log("ENDPOINT_CHECK",this.userEndpoint)
            fetch(scoreEndpoint, {
                method:"POST",
                body: JSON.stringify({
                    UUID: uid,
                    username: user.username,
                    quiz_type: "js",
                    score: this.score
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            fetch(this.userEndpoint, {
                method:"POST",
                body: JSON.stringify({
                    UUID: uid,
                    user: user.username,
                    mail: user.email
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
        }).catch((e) => {
            console.log("CATCH", e)
        })  
    }
}