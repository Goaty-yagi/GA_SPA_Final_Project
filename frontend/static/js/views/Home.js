
import AbstractView from "./AbstractView.js";
import Ranking from "./Ranking.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Home")
    }

    async getHtml() {
        return `
        <main id="main">
            <div class="main-container">
                <h1 class="title">Quiz Ranking</h1>
                <h2 class="quiz-type">Java script</h2>
                <button class="start-button" target-url="/quiz">START</button>
            </div>
        </main>
        `
    }
    async addEvent() {
        document.querySelector(".start-button").addEventListener("click",this.event)
        const ranking = new Ranking();
        document.querySelector("#main").append(await ranking.getHtml())
    }
    event() {
        console.log("EVENT_CLICKED")
    }
}