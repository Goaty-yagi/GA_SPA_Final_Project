// import authentication, { userIsReady } from "../../../firebase/authentication.js";
import initialization from "./store/index.js";
import Dashboard from "./views/dashboard/Dashboard.js";
import Home from "./views/Home.js"
import Login from "./views/Login.js";
import Quiz from "./views/Quiz.js";
import Signup from "./views/Signup.js";
import Study from "./views/Study.js";

const body = document.querySelector("body")
const app = document.querySelector("#app")

document.querySelector("#app").innerHTML = '<div class="lds-dual-ring"></div>'
const navigateTo = (url) => {
    // DOM won't change.
    // this is like set currentURL in the history then 
    // go to the url
    history.pushState(null, null, url);
    router()
}

// why async?? will be render page so takes time
const router = async () => {
    // app.style.display = "flex"
    const routes = [
        { path: "/", view: Home},
        { path: "/quiz", view: Quiz},
        { path: "/dashboard", view: Dashboard},
        { path: "/signup", view: Signup},
        { path: "/login", view: Login},
        { path: "/study", view: Study},
    ];
    // Test each route for potential match
    const potentialMatches = routes.map(route => {
        return {
            route: route,
            isMatch : location.pathname === route.path
        }
    });
    let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch)
    
    console.log("MATCH",match)
    if(!match) {
        match = {
            route: routes[0],
            isMatch: true
        }
    }
    const view = new match.route.view()//make a new instance
    await view.beforeInitialRender()
    app.innerHTML = await view.renderHTML()// renderHTML() is async so await here
    view.initialEvent()
}
function routingEvent() {
    document.body.addEventListener("click", e => {
        if(e.target.matches("[target-url]")) {
            e.preventDefault() // prevent reload but stop routing
            navigateTo(e.target.getAttribute("target-url"))
        }
    })
    router()
}

window.addEventListener("popstate",router)
// postate excute histrical data when browser back or forward
// the data could be the data created with histry.pushState




export {
    routingEvent,
    router, 
}