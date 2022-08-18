import { application } from "express"

export default class {
    constructor() {

    };
    setTitle(title) {
        document.title = title
    };
    async renderHTML() {
        // return document-element so rendering will be
        // app.append(component.renderHTML)
        return ""
    }
    initialEvent() {
        // this will be rendered with HTML together
        return ""
    }
    beforeunload() {
        return ""
    }
    popState() {
        //import defaultPopStateFunction from index to be invoked
        return ""
    }

} 