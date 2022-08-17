// import authentication, { userIsReady } from "../../../firebase/authentication.js";
import { userData } from "../../../../firebase/authentication.js";
import { routingEvent } from "../index.js";
import Nav from "../views/Nav.js";
// import Ranking from "../views/Ranking.js";

let initialized = false;
export default async function initialization(userLogin,uid) {
    console.log("IN_INITIALIZE",userLogin,uid)
    if(uid) {
        await fetchScoreData(uid)
        // await getUserData(uid)
    }
  if (!initialized) {
    routingEvent();
    const nav = new Nav();
    nav.initialEvent(userLogin);
    
    initialized = true;
    console.log("INITIALIZED",userLogin,uid)
  }
}
async function fetchScoreData(uid) {
  const url = "http://localhost:5000";
  const scorePath = `/api/score-id/:id=${uid}`;
  const scoreEndpoint = url + scorePath;
  await fetch(scoreEndpoint, {})
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log("FETCHED_SCORE",data);
      setSessionStorage("currentScore", data.score);
    });
}

// async function getUserData(uid) {
//   const url = "http://localhost:5000";
//   const userPath = `"/api/user-id/:id=${uid}`;
//   const userEndpoint = url + userPath;
//   await fetch(userEndpoint, {})
//     .then((result) => {
//       return result.json();
//     })
//     .then((data) => {
//       console.log(data);
//       setSessionStorage("isAuth", data.isAuthenticated);
//     });
// }

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
