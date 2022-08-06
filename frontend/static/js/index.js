import Home from "./views/Home.js"
import Nav from "./views/Nav.js";
import Quiz from "./views/Quiz.js";

const nav = new Nav()
nav.addEvent()
const navigateTo = (url) => {
    // DOM won't change.
    // this is like set currentURL as histry then 
    // go to the url
    history.pushState(null, null, url);
    router()
}


// why async?? will be render page so tikes time
const router = async () => {
    const routes = [
        { path: "/", view: Home},
        { path: "/quiz", view: Quiz},
        // { path: "/register", view: () => console.log("view register")}
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

    document.querySelector("#app").innerHTML = await view.getHtml()// getHtml() is async so await here
    view.addEvent()
    // match.route.view()
}

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        const allReset = new Quiz()
        allReset.allReset()
        console.log("E_TEST",e.target, e.target.matches("[data-link]"))
        if(e.target.matches("[data-link]")) { //check if element has argument
            e.preventDefault() // prevent reload but stop routing
            navigateTo(e.target.href)
            console.log('E',e.target,e)
        }
    })
    router()
})

window.addEventListener("popstate", router)
// postate excute histrical data when browser back or forward
// the data could be the data created with histry.pushState