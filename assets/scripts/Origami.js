// Origami.js
/*
  A class to support origami SVG selection,
  display, operation

  w/ suggested approach guidance as comments
*/
export class Origami {
  /**
   * @constructor
   * @param {>} svgPath - an svg path
   */
  constructor(svgPath) {
    //this number will change when we add SVG
    this.svgPath = svgPath;
    this.flapColorClicked = null;
    this.#init();
  }
  #init() {
    this.generateSVG();
    this.#addClickListeners();
  }
  generateSVG() {
    const svg = document.createElement("object");
    svg.data = this.svgPath;
    document.body.appendChild(svg);
    this.currentSVG = svg;
  }

  removeCurrentSVG() {
    this.currentSVG.remove();
    this.currentSVG = null;
  }

  #addClickListeners() {
    if(this.currentSVG.data.endsWith('closed-new.svg')){
      this.activateClosedHandler();
    }
    else if(this.currentSVG.data.endsWith('-nums.svg')){
      //activateNumsHandler();
    }
  }
  idToColor(flapID) {
    switch(flapID) {
      case 'upper-right-click':
        return "blue";
      case 'upper-left-click':
        return "red";
      case 'lower-left-click':
        return "green";
      case 'lower-right-click':
        return "yellow";
      default:
        return "unknown";
    }
  }
  activateClosedHandler() {
    return new Promise((resolve) => {
      this.currentSVG.addEventListener('load', () => {
        let svgDocument = this.currentSVG.contentDocument;
        const closedFlaps = svgDocument.querySelectorAll('g[id$="-flap-d"] path[id$="-click"]');
        closedFlaps.forEach((flap) => {
          flap.addEventListener('click', (event) => {
            let flapID = flap.id;
            this.flapColorClicked = this.idToColor(flapID);
            resolve(this.flapColorClicked);
          });
        });
      });
    });
  }

  async getFlapColorClicked() {
    return await this.activateClosedHandler();
  }

  startAnimation(flapColor) {
    return flapColor.length;
  }
}
