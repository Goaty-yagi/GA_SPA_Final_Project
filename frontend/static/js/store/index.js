// import authentication, { userIsReady } from "../../../firebase/authentication.js";
import { routingEvent } from "../index.js";
import Nav from "../views/Nav.js";
import Ranking from "../views/Ranking.js";

let initialized = false
export default async function initialization(userLogin) {
    if(!initialized){
        routingEvent()
        const nav = new Nav()
        nav.addEvent(userLogin)
        const ranking = new Ranking
        ranking.addEvent()
        initialized = true
    }
}
function setSessionStorage(key, val) {
        sessionStorage.setItem(key, val)
}
function getSessionItem(key) {
        return sessionStorage.getItem(key)
}
function removeSessionItem(key) {
        sessionStorage.removeItem(key)
}

export {setSessionStorage, getSessionItem, removeSessionItem}