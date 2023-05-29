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
  }
  generateSVG() {
    const svg = document.createElement("object");
    svg.data = this.svgPath;
    document.body.appendChild(svg);
    this.currentSVG = svg;
    this.#addClickListeners();
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
      this.activateNumsHandler();
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
  idToNum(flapID) {
    if(this.currentSVG.data.includes('horizontally')) {
      switch(flapID) {
        case 'shadow-top-right-click':
          return 1;
        case 'shadow-bottom-left-click':
          return 5;
        case 'shadow-bottom-right-click':
          return 3;
        case 'shadow-top-left-click':
          return 7;
        default:
          return 0;
      }
    }      
    else if(this.currentSVG.data.includes('vertically')) {
      switch(flapID) {
        case 'shadow-top-right-click':
          return 2;
        case 'shadow-bottom-left-click':
          return 6;
        case 'shadow-bottom-right-click':
          return 4;
        case 'shadow-top-left-click':
          return 8;
        default:
          return 0;
      }
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
            let flapColorClicked = this.idToColor(flapID);
            resolve(flapColorClicked);
          });
        });
      });
    });
  }
  activateNumsHandler() {
    return new Promise((resolve) => {
      this.currentSVG.addEventListener('load', () => {
        let svgDocument = this.currentSVG.contentDocument;
        const numFlaps = svgDocument.querySelectorAll('path[id$="-click"]');
        numFlaps.forEach((flap) => {
          flap.addEventListener('click', (event) => {
            let flapID = flap.id;
            let flapNumClicked = this.idToNum(flapID);
            resolve(flapNumClicked);
          });
        });
      });
    });
  }
  async getFlapColorClicked() {
    return await this.activateClosedHandler();
  }
  async getFlapNumClicked() {
    return await this.activateNumsHandler();
  }

  getNumAnimations(flapClicked) {
    if(typeof flapClicked === 'number' && Number.isInteger(flapClicked)) {
      return flapClicked;
    }
    else if(typeof flapClicked === 'string') {
      return flapClicked.length;
    }
    
    return 0;
  }

  getCurrentSVG() {
    return this.svgPath
  }
}
