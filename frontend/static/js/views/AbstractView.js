
export default class {
    constructor() {
        this.dualRing = document.createElement("div")
        this.dualRing.className = "lds-dual-ring"
        this.dualRing.style.position = "absolute"
        this.body = document.querySelector("body")
        this.app = document.querySelector("#app")
    };
    setTitle(title) {
        document.title = title
    };
    async renderHTML() {
        return ""
    }
    initialEvent() {
        // this will be rendered after renderHTML rendered
        return ""
    }
    async beforeInitialRender() {
        console.log("before_initial_render")
        return ""

    }
    hideAppNode() {
        this.app.style.visibility = "hidden"
        this.body.appendChild(this.dualRing)
        this.body.style.display = "flex"
        this.body.style.justifyContent = "center"
        this.body.style.alignItems = "center"
        // debugger
        console.log("APPENDED")

    }
    showAppNode() {
        this.app.style.visibility = ""
        this.body.removeChild(this.dualRing)
        this.body.style.display = ""
        this.body.style.justifyContent = ""
        this.body.style.alignItems = ""
    }
    beforeunload(callback) {
        // happens before reload(when browser reload button pressed)
        window.addEventListener("beforeunload", callback)
    }
    popState(callback) {
        //happens after browser back or forward button pressed)
        window.addEventListener("popstate", callback)
    }
    mutationObserver(callback) {
        // happens when app dom child is changed.
        // this controls manual url change regarding to
        // target-url in HTML tab
        const observer = new MutationObserver((mutations) => {
            callback()
            observer.disconnect()
          });
        
          observer.observe(this.app, {
            childList: true 
          });

    }
} 