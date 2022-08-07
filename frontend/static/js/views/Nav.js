// import initialSetting from "../index.js";
import AbstractView from "./AbstractView.js";

let clickedTheme = false

// initialSetting()

function theme() {
    console.log('clicked')
    clickedTheme = !clickedTheme
    let body = document.querySelector("body")
    let theme = document.querySelector(".theme")
    let circle = document.querySelector(".circle-in-circle")
    if(clickedTheme) {
        document.querySelector(".circle").classList.add('clicked-circle')
        body.classList.add('body-theme')
        body.style.backgroundImage =  'url("./static/images/background-dark.png")';
        theme.classList.add('theme-theme')
        circle.classList.add('circle-theme')
    } else {
        document.querySelector(".circle").classList.remove('clicked-circle')
        body.classList.remove('body-theme')
        body.style.backgroundImage =  'url("./static/images/background-light.png")';
        theme.classList.remove('theme-theme')
        circle.classList.remove('circle-theme')
    }
}

export default class extends AbstractView {
    constructor() {
        super()
    }
    get getHtml() {
        //async return HTML might be asynchronous
        return `
        <img class="logo" src="./static/images/logo.png" alt="logo" data-link>
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
          <div class="quiz-create" data-link>CREATE</div>
          <div class="login">LOGIN</div>
          <div class="signup">SIGNUP</div>
        </nav>
        `
    }
    addEvent() {
        // const html = this.getHtml
        document.querySelector("#header").innerHTML = this.getHtml
        document.querySelector(".circle").addEventListener('click',theme)
        document.querySelector(".logo").addEventListener('click',() => {
            console.log("clicked")
            history.replaceState(null, null, "/")
        })
        document.querySelector(".quiz-create").addEventListener('click',() => {
          console.log("clicked")
          history.replaceState(null, null, "/create")
        })
    }
    event() {
        
    }
}