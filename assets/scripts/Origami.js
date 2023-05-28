// Origami.js
/*
  A class to support origami SVG selection,
  display, operation

  w/ suggested approach guidance as comments
*/
export class Origami {
  /**
   * @constructor
   * @param {*} svgPaths - array of svg paths
   */
  constructor(svgPaths) {
    //this number will change when we add SVG
    if(svgPaths.length !== 5){
      throw new Error("Not All Paths Fetched Here.");
    }
    this.fortuneSVGs = [];
    this.clickableSVGs = [];
    this.#init(); 

  }

  #init() {
    this.clickableSVG.push("./assets/images/origami/closed.svg");
    this.clickableSVG.push("./assets/images/origami/horizontally-opened-nums.svg");
    this.clickableSVG.push("./assets/images/origami/vertically-opened-nums.svg");
    this.#generateSVG();
    //this.clickableSVG.push("lastfigma of all 8 fortunes to select");
  }
  #generateSVG() {
    const closed = document.createElement("object");
    closed.data = this.clickableSVG[0];
    this.container.appendChild(closed);
  }
  /*
      TODO: for an example, see SideBar.js

      in short, if the constructor stored the different SVGs, you
        can iterate on them to set events for each click layer. there
        are a lot of different ways to implement this so go with
        whatever makes the most sense
  */
  setClosedClickHandler() {
    const closedFortune = this.clickableSVG[0];
    const closedFortuneFlaps = closedFortune.querySelectorAll('g[id$="-default"]');
    closedFortuneFlaps.forEach((flap) => {
      let flapClick = flap.querySelector('[id$="-click"]');
      flapClick.addEventListener("click", () => {
        console.log("This is working");
        //add what we want to happen when u click
      });
    });
    
  }

  // }

  /*
    TODO: when Origami.getSVG is called, it could return
      the current mode's origami as an SVG HTMLElement
    
    an alternate approach would be to take a container as an constructor
    parameter and modify that instead
  */
  // getSVG(){

  // }

  /*
    TODO: when Origami.setMode is called, it could
      update the current display mode and then
      replace the currently displayed origami in
      this.container with the one matching the input
      parameter
    TODO: decide on mode parameter type, maybe string,
      or even consider having a function for each mode select
      e.g. Origami.close() Origami.displayNumbers() etc
  */
  // setMode(newMode){
  //   //  make sure the newMode is valid
  //   //  if it is, set the current mode to it
  // }
}
