
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor() {
        super()
    }

    async renderHTML() {
        return `
        <footer>
            <div class="creater-section">
                <div class="creater-title">
                Who Built App?
                </div>
                <div class="footer-font-container">
                <i class="fab fa-github-square footer-font"></i>
                <i class="fab fa-linkedin footer-font"></i>
                </div>
            </div>
        </footer>
        `
    }
    async beforeInitialRender() {
    }
    async initialEvent() {
    }
}