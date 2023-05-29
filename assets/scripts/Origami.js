// Origami.js
const COLOR_BY_CLICK_REGION = {
  'upper-right-click': 'blue',
  'upper-left-click': 'red',
  'lower-left-click': 'green',
  'lower-right-click': 'yellow',
};

const NUMBER_BY_SHADOW_CLICK_REGION = {
  'horizontal': {
    'shadow-top-right-click': 1,
    'shadow-bottom-left-click': 5,
    'shadow-bottom-right-click': 3,
    'shadow-top-left-click': 7,
  },

  'vertical': {
    'shadow-top-right-click': 2,
    'shadow-bottom-left-click': 6,
    'shadow-bottom-right-click': 4,
    'shadow-top-left-click': 8,
  },
};

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
    // this number will change when we add SVG
    this.svgPath = svgPath;
  }
  generateSVG() {
    const svg = document.createElement('object');
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
    if (this.currentSVG.data.endsWith('closed-new.svg')) {
      this.activateClosedHandler();
    } else if (this.currentSVG.data.endsWith('-nums.svg')) {
      this.activateNumsHandler();
    }
  }
  idToColor(flapID) {
    return COLOR_BY_CLICK_REGION[flapID] || 'unknown';
  }

  idToNum(flapID) {
    let number;

    if (this.currentSVG.data.includes('horizontally')) {
      number = NUMBER_BY_SHADOW_CLICK_REGION.horizontal[flapID];
    } else if (this.currentSVG.data.includes('vertically')) {
      number = NUMBER_BY_SHADOW_CLICK_REGION.vertical[flapID];
    }

    return (number !== undefined) ? number : 0;
  }

  activateClosedHandler() {
    return new Promise((resolve) => {
      this.currentSVG.addEventListener('load', () => {
        const svgDocument = this.currentSVG.contentDocument;
        const closedFlaps = svgDocument.querySelectorAll('g[id$="-flap-d"] path[id$="-click"]');
        closedFlaps.forEach((flap) => {
          flap.addEventListener('click', (event) => {
            const flapID = flap.id;
            const flapColorClicked = this.idToColor(flapID);
            resolve(flapColorClicked);
          });
        });
      });
    });
  }
  activateNumsHandler() {
    return new Promise((resolve) => {
      this.currentSVG.addEventListener('load', () => {
        const svgDocument = this.currentSVG.contentDocument;
        const numFlaps = svgDocument.querySelectorAll('path[id$="-click"]');
        numFlaps.forEach((flap) => {
          flap.addEventListener('click', (event) => {
            const flapID = flap.id;
            const flapNumClicked = this.idToNum(flapID);
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
    if (typeof flapClicked === 'number' && Number.isInteger(flapClicked)) {
      return flapClicked;
    } else if (typeof flapClicked === 'string') {
      return flapClicked.length;
    }

    return 0;
  }

  getCurrentSVG() {
    return this.svgPath;
  }
}
