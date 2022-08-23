// import initialSetting from "../index.js";
import AbstractView from "./AbstractView.js";
import logo from "../../images/logo.png"
import dark from "../../images/background-dark.png"
import light from "../../images/background-light.png"
import { getUserLogin, logout } from "../../../../firebase/authentication.js";
import { getIsAuth } from "../store/index.js";

let clickedTheme = false
// initialSetting()
getUserLogin
function theme() {
    console.log('clicked')
    clickedTheme = !clickedTheme
    let body = document.querySelector("body")
    let theme = document.querySelector(".theme")
    let circle = document.querySelector(".circle-in-circle")
    if(clickedTheme) {
        document.querySelector(".circle").classList.add('clicked-circle')
        body.classList.add('body-theme')
        body.style.backgroundImage =  `url("${dark}")`;
        theme.classList.add('theme-theme')
        circle.classList.add('circle-theme')
    } else {
        document.querySelector(".circle").classList.remove('clicked-circle')
        body.classList.remove('body-theme')
        body.style.backgroundImage =  `url("${light}")`;
        theme.classList.remove('theme-theme')
        circle.classList.remove('circle-theme')
    }
}

export default class extends AbstractView {
    constructor() {
        super()
        this.userLogin = getUserLogin()
        this.isAuth = getIsAuth()
    }
    async renderHTML() {
      const headerElement = document.querySelector("#header")
      headerElement.innerHTML = `<img target-url="/" class="logo" src="${logo}" alt="logo">`
      headerElement.innerHTML += `
      <nav>
      <div aria-label="change theme" class="theme-container">
          <div class="theme-group">
            <p class="theme-title">theme</p>
            <div class="theme">
              <button class="circle">
                <div class="circle-in-circle"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>
      `
      if(this.userLogin) {
        if(this.isAuth){
          headerElement.children[1].innerHTML += `
        <div class="quiz-create nav-menu" target-url="/dashboard">DASHBOARD</div>
        `
        }
        headerElement.children[1].innerHTML += `<div class="logout nav-menu">LOGOUT</div>`
        document.querySelector(".logout").addEventListener('click',() => {
          console.log("GONNA LOGOUT")
          logout()
          history.go()
        })
      } else {
        headerElement.children[1].innerHTML += `
        <div class="login nav-menu" target-url="/login">LOGIN</div>
        `
        // <div class="signup nav-menu" target-url="/signup">SIGNUP</div>
        // document.querySelector(".signup").addEventListener('click',() => {
        //   console.log("clicked")
        // })
      }
    }
    async initialEvent(userLogin) {
      await this.renderHTML(userLogin)
      document.querySelector(".circle").addEventListener('click',theme)
      document.querySelector(".logo").addEventListener('click',() => {
          console.log("clicked")
      })
        
    }
    event() {
        
    }
}