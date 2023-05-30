// Origami.js
const COLOR_BY_CLICK_REGION = {
  'upper-right-click': 'blue',
  'upper-left-click': 'red',
  'lower-left-click': 'green',
  'lower-right-click': 'yellow',
};
const HOVER_BY_CLICK_REGION = {
  'upper-right-click': 'darkblue',
  'upper-left-click': 'darkred',
  'lower-left-click': 'darkgreen',
  'lower-right-click': 'orange',
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
  
  /**
   * Creates an SVG object called "currentSVG" and adds click listeners
   */
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
  /**
   * Function that converts ID of flap to its color.
   * @param {string} - string that identifies which flap it is on the fortune teller
   * @returns {number} - unknown if invalid input, or a string that represents color of flap
   */
  idToColor(flapID) {
    return COLOR_BY_CLICK_REGION[flapID] || 'unknown';
  }
    
  /**
   * Function that converts ID of flap to its number specifically for SVGs with numbers.
   * @param {string} - string that identifies which flap it is on the fortune teller
   * @returns {number} - 0 if invalid input, or a number that is associated with the flap
   */
  idToNum(flapID) {
    let number;

    if (this.currentSVG.data.includes('horizontally')) {
      number = NUMBER_BY_SHADOW_CLICK_REGION.horizontal[flapID];
    } else if (this.currentSVG.data.includes('vertically')) {
      number = NUMBER_BY_SHADOW_CLICK_REGION.vertical[flapID];
    }

    return (number !== undefined) ? number : 0;
  }

  /**
   * Activates and handles click logic for the initial closed fortune teller SVG.
   * @returns {Promise} - Promise object that adds a click event listener to each flap
   */
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

  /**
   * Activates and handles click logic for the open fortune teller SVGs.
   * @returns {Promise} - Promise object that adds a click event listener to each flap
   */
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

  /**
   * Function that calculates the number of times needed to alternate between horizontally and vertically opened SVGs.
   * @param {string, number} - String of color for closed SVG flap, or number for open SVG flaps with numbers
   * @returns {number} - 0 if invalid input, or a positive number that represents number of times needed to animate
   */
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
