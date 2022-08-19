
export default class {
    constructor() {

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
        const app = document.querySelector("#app")
        const observer = new MutationObserver((mutations) => {
            callback()
            observer.disconnect()
          });
        
          observer.observe(app, {
            childList: true 
          });

    }
} 