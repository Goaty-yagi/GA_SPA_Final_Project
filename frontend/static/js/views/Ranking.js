import { userData, userLogin } from "../../../../firebase/authentication.js";
import { getSessionItem } from "../store/index.js";
import AbstractView from "./AbstractView.js";

const url = "http://localhost:5000";
const path = "/api/score";
const params = "/type=js";
const endpoint = url + path + params;

async function getScoreData() {
  return fetch(endpoint)
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      return data;
    });
}
export default class extends AbstractView {
  constructor() {
    super();
    this.scoreData;
    this.rankingContainer = document.createElement("div")
    this.rankingContainer.className = "rank-section"
    this.rankWrapper = document.createElement("div")
    this.rankWrapper.className = "rank-wrapper"
    this.rankingContainer.append(this.rankWrapper)
    // this.setTitle(" Ranking")
  }
  async getHtml() {
    this.scoreData = await getScoreData();
    this.rankWrapper.innerHTML += "<h1>RANKING</h1>"
    console.log("LOGIN_CHECK",userLogin)
    if(userLogin) {
      const username = userData.name
      const currentScore = getSessionItem("currentScore")
      const welcome = `
      <div class="welcome-container">
      <div>WELCOME ${username}!
      <p>Your Max Score is ${currentScore}</p>
      </div>
      </div>`

      this.rankWrapper.innerHTML += welcome
    }
    this.scoreData.forEach((elem, index) => {
      let awardFont
      if(index + 1 === 1) {
        awardFont = `<i class="fas fa-crown rank-font"><div class="rank-order">${index + 1}</div></i>`
      } else if (index + 1 === 2) {
        awardFont = `<i class="fas fa-award second-award rank-font rank-font"><div class="rank-order second-third">${index + 1}</div></i>`
      } else if (index + 1 === 3) {
        awardFont = `<i class="fas fa-award third-award rank-font rank-font"><div class="rank-order second-third">${index + 1}</div></i>`
      }
      console.log("loop");
      this.rankWrapper.innerHTML += `
            <section class="ranking-container">
            <div class="rank">${awardFont}</div>
            <div class="rank-name">${elem.username}</div>
            <div class="score">${elem.score}</div>
            </section>
            `;
    });
    console.log("RANKING",this.rankingContainer)
    return this.rankingContainer
  }
  addEvent() {
    // this.event()
    this.getHtml();
    // document.querySelector(".start-button").addEventListener("click",this.event)
  }
  event() {
    console.log("EVENT_CLICKED");
    this.getHtml();
  }
  async getScoreData() {
    return fetch(this.endpoint)
      .then((result) => {
        return result.json();
      })
      .then((data) => {
        return data;
      });
  }
}
