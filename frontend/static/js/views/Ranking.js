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
    // // const scoreMarkup =
    // console.log(this.scoreData.length);
    this.rankWrapper.innerHTML += "<h1>RANKING</h1>"
    this.scoreData.forEach((elem, index) => {
      console.log("loop");
      this.rankWrapper.innerHTML += `
            <section class="ranking-container">
            <div class="rank">${index + 1}</div>
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
