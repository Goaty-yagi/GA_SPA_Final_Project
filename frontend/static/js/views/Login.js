import {login} from "../../../../firebase/authentication.js";
import { router } from "../index.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Login")
    }
    async getHtml() {
        //async return HTML might be asynchronous
        return `
        <div class="signup-wrapper"">
            <form onsubmit="return false" class="main-container">
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
        document.querySelector(".submit-button").addEventListener("click",this.loginUser)
    }
    event() {
        console.log("EVENT_CLICKED")
    }
    async loginUser() {
        const inputValues = document.querySelectorAll(".text-input")
        const user = {
            email: inputValues[0].value,
            password: inputValues[1].value
        }
        login(user).then((result) => {
            console.log("CCHECK", result)
            if(result) {
                // history.pushState(null, null, "/")
                history.go()
                // router()
            }
        })
    }
}