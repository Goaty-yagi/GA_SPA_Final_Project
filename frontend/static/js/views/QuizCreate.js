import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super()
        this.setTitle("Create")
    }
    async getHtml() {
        //async return HTML might be asynchronous
        return `
        <main id="main">
            <div class="main-container">
                <h1 class="title">QUIZ QREATE</h1>
                <h2 class="quiz-type">Java script</h2>
                <button class="start-button"  data-link>START</button>
            </div>
        </main>
        `
    }
    addEvent() {
        document.querySelector(".start-button").addEventListener("click",this.event)
    }
    event() {
        console.log("EVENT_CLICKED")
        history.replaceState(null, null, "create")
    }
}