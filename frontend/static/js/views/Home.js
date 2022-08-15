
import AbstractView from "./AbstractView.js";
import Ranking from "./Ranking.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Home")
    }

    async getHtml() {
        const title = "Quiz Ranking"
        const quizType= "Java script"
        const description = "Test your knowledge and Beat your rival!"
        return `
        <main id="main">
            <div class="main-container">
                <div class="home-each-section">
                    <h1 class="title">${title}</h1>
                    <h2 class="quiz-type">${quizType}</h2>
                    <p>${description}</p>
                    <button class="start-button" target-url="/quiz">START</button>
                </div>
                <div class="home-each-section-fa-cog">
                <i class="fas fa-cog big-cog"></i>
                <div class="small-cogs">
                <i class="fas fa-cog small-cog"></i>
                <i class="fas fa-cog small-cog"></i>
                </div
                </div>
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