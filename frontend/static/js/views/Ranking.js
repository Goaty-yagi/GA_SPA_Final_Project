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
    // this.url = "http://localhost:5000";
    // this.path = "/api/score";
    // this.params = "/type=js"
    // this.endpoint = this.url + this.path + this.params;
    this.scoreData;
    this.aside = document.querySelector("#aside");
    // this.setTitle(" Ranking")
  }
  async getHtml() {
    this.scoreData = await getScoreData();
    // const scoreMarkup =
    console.log(this.scoreData.length);
    this.aside.innerHTML += "<h1>RANKING</h1>"
    this.scoreData.forEach((elem, index) => {
      console.log("loop");
      this.aside.innerHTML += `
            <section class="ranking-wrapper">
            <div class="rank">${index + 1}</div>
            <div class="rank-name">${elem.username}</div>
            <div class="score">${elem.score}</div>
            </section>
            `;
    });
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
