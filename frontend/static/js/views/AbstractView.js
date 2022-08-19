
export default class {
    constructor() {
        this.app = document.querySelector("#app")
    };
    setTitle(title) {
        document.title = title
    };
    async renderHTML() {
        return ""
    }
    initialEvent() {
        // this will be rendered with HTML together
        return ""
    }
    async beforeInitialRender() {
        console.log("before_initial_render")
        return ""

    }
    hideAppNode() {
        this.app.style.visibility = "hidden"
    }
    showAppNode() {
        this.app.style.visibility = ""
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