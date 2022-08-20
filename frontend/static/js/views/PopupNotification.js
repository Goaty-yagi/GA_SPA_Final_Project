
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(messageArray, notificationTitle, node, type) {
        super()
        this.messageArray = messageArray
        this.type = type //error for error, green for success
        this.notificationTitle = notificationTitle
        this.mainNode = node
    }

    async renderHTML() {        
    }
    async beforeInitialRender() {
       
    }
    async initialEvent() {
        const Title = `<div class="${this.type}-title">${this.notificationTitle}</div>`
        const noteSection = document.createElement("div")
        noteSection.className = `${this.type}-section`
        noteSection.innerHTML += Title
        this.messageArray.forEach(err => {
            noteSection.innerHTML += `<li class="each-${this.type}">${err}</li>`
        })
        this.mainNode.append(noteSection)
        setTimeout(() => {
            this.mainNode.removeChild(noteSection)
        }, 4000)
    }    
}