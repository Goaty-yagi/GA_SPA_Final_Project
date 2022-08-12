import { createUser, getUserData } from "../../../../firebase/authentication.js";
import AbstractView from "./AbstractView.js";
// import { correctNum } from "./quiz.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Signup")
        this.score = document.location.search.substring(1).split("=")[1]
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
        document.querySelector(".submit-button").addEventListener("click",this.signupUser)
    }
    event() {
        console.log("EVENT_CLICKED")
        // history.replaceState(null, null, "quiz")
    }
    async signupUser() {
        const inputValues = document.querySelectorAll(".text-input")
        const user = {
            username :inputValues[0].value,
            email: inputValues[1].value,
            password: inputValues[2].value,
        }
        await createUser(user)
        .then(() => {
            const userData = getUserData()
            console.log(userData)
        })
    }
}