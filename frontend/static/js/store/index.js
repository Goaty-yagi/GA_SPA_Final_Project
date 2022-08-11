// import authentication, { userIsReady } from "../../../firebase/authentication.js";
import Nav from "../views/Nav.js";

export default async function initialization(userLogin) {
        const nav = new Nav()
        nav.addEvent(userLogin)
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