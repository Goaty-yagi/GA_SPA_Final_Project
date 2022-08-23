import { getUserLogin } from "../../../firebase/authentication.js";
import initialization from "./store/index.js";
import Dashboard from "./views/dashboard/Dashboard.js";
import Home from "./views/Home.js";
import Login from "./views/Login.js";
import Quiz from "./views/Quiz.js";
import Signup from "./views/Signup.js";
import Study from "./views/Study.js";

const app = document.querySelector("#app");
const routes = [
  { path: "/", view: Home },
  { path: "/quiz", view: Quiz },
  { path: "/dashboard", view: Dashboard, auth: { userLogin: true } },
  { path: "/signup", view: Signup, auth: { userLogin: false } },
  { path: "/login", view: Login, auth: { userLogin: false } },
  { path: "/study", view: Study },
];
let withParams = false
// let authKeyArray = getAuthKeyArray()

app.innerHTML = '<div class="lds-dual-ring"></div>';

// function getAuthKeyArray() {
//     //automatically set authKeys
//     const tempArray  = routes.map(route => {
//         if("auth" in route) {
//             console.log(route.auth)
//             return Object.keys(route.auth)
//         }
//     })
//     const set = new Set
//     tempArray.forEach(each => {
//         if(Array.isArray(each)){
//             for(let i= 0; i < each.length; i++) {
//                 set.add(each[i])
//             }
//         }
//     })
//     return Array.from(set)
// }

// why async?? will be render page so takes time
const router = async (url) => {

  const CheckedUrl = parameterCheck(url)

  const userLogin = getUserLogin();

   // Test each route for potential match
  const potentialMatches = routes.map((route) => {
    let isMatch;
    if ("auth" in route && route.path === CheckedUrl) {
      Object.keys(route.auth).forEach((key) => {
        if (key === "userLogin") {
          isMatch = route.auth.userLogin === userLogin;
        }
      });
    } else {
      isMatch = CheckedUrl === route.path;
    }
    return {
      route: route,
      isMatch: isMatch,
    };
  });

  let match = potentialMatches.find((potentialMatch) => potentialMatch.isMatch);

  if (!match) {
    // this avoids browser reload
    // if clicked, got to HOME
    match = {
      route: routes[0],
      isMatch: true,
    };
  }
  const updatedUrl = match.route.path;
  if(withParams) {
    history.pushState(null, null, url);
  } else {
    history.pushState(null, null, updatedUrl);
  }
  // routing is done

  // start dom manipulation
  const view = new match.route.view(); //make a new instance
  await view.beforeInitialRender();
  app.innerHTML = await view.renderHTML(); // renderHTML() is async so await here
  view.initialEvent();
};

function routingEvent() {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[target-url]")) {
      e.preventDefault(); // prevent reload but stop routing
      router(e.target.getAttribute("target-url"));
    }
  });
  router();
}

function parameterCheck(url) {
    if(url) {
        if (url.indexOf('?') !== -1) {
            withParams = true
            return url.split("?")[0]
        } else {
            return url
        }
    }
}

window.addEventListener("popstate", router);
// postate excute histrical data when browser back or forward
// the data could be the data created with histry.pushState

export { routingEvent, router };
