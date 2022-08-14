// import authentication, { userIsReady } from "../../../firebase/authentication.js";
import { userData } from "../../../../firebase/authentication.js";
import { routingEvent } from "../index.js";
import Nav from "../views/Nav.js";
import Ranking from "../views/Ranking.js";

let initialized = false;
export default async function initialization(userLogin,uid) {
    console.log("IN_INITIALIZE",userLogin,uid)
    if(uid) {
        fetchScoreData(uid)
    }
  if (!initialized) {
    routingEvent();
    const nav = new Nav();
    nav.addEvent(userLogin);
    const ranking = new Ranking();
    ranking.addEvent();
    
    initialized = true;
    console.log("INITIALIZED",userLogin,uid)
  }
}
async function fetchScoreData(uid) {
  const url = "http://localhost:5000";
  const scorePath = `/api/score-id/:id=${userData.UID}`;
  const scoreEndpoint = url + scorePath;
  await fetch(scoreEndpoint, {})
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      setSessionStorage("currentScore", data.score);
    });
}

function setSessionStorage(key, val) {
  sessionStorage.setItem(key, val);
}
function getSessionItem(key) {
  return sessionStorage.getItem(key);
}
function removeSessionItem(key) {
  sessionStorage.removeItem(key);
}

export { 
    setSessionStorage, 
    getSessionItem, 
    removeSessionItem,
    fetchScoreData };
