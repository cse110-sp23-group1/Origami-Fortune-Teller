// Origami.js
import { saveFortunesOnClick } from './SideBar.js'
const COLOR_BY_CLICK_REGION = {
  '#0D6E8E': 'blue',
  '#BF3858': 'red',
  '#04AB80': 'green',
  '#CCA751': 'yellow',
};
const svgPaths = [
  'assets/images/origami/closed.svg',
  'assets/images/origami/horizontally-opened-nums.svg',
  'assets/images/origami/vertically-opened-nums.svg',
  'assets/images/origami/horizontally-opened.svg',
  'assets/images/origami/vertically-opened.svg',
  'assets/images/origami/opened.svg',
  'assets/images/origami/1-opened.svg',
  'assets/images/origami/2-opened.svg',
  'assets/images/origami/3-opened.svg',
  'assets/images/origami/4-opened.svg',
  'assets/images/origami/5-opened.svg',
  'assets/images/origami/6-opened.svg',
  'assets/images/origami/7-opened.svg',
  'assets/images/origami/8-opened.svg',
];

/*
  A class to support origami SVG selection,
  display, operation
*/
export class Origami {
  /**
   * @constructor
   * @param {>} svgPath - an svg path
   */
  constructor() {
    // this number will change when we add SVG
    this.CLOSEDSVG = svgPaths[0];
    this.OPENEDHORIZONTALNUMS = svgPaths[1];
    this.OPENEDVERTICALNUMS = svgPaths[2];
    this.OPENEDHORIZONTAL = svgPaths[3];
    this.OPENEDVERTICAL = svgPaths[4];
    this.OPENEDALL = svgPaths[5];
    /*
    Currently not being used 6 - 13, not sure if I should try to use them for style
      or take them out completley? 
    */
    this.OPENED1 = svgPaths[6];
    this.OPENED2 = svgPaths[7];
    this.OPENED3 = svgPaths[8];
    this.OPENED4 = svgPaths[9];
    this.OPENED5 = svgPaths[10];
    this.OPENED6 = svgPaths[11];
    this.OPENED7 = svgPaths[12];
    this.OPENED8 = svgPaths[13];
    this.currentSVGPath = null;
    this.CURRENTSVG = null;
    this.currentTurn = 0;
    this.currFlapColor = null;
    this.fortunes = null;
    this.isAnimationRunning = false;
    this.#init();
  }
  #init() {
    this.generateSVG(this.CLOSEDSVG);
  }
  /**
   * Creates an SVG object called "currentSVG" and adds click listeners
   */
  generateSVG(currentSVGPath) {
    this.currentSVGPath = currentSVGPath;
    this.CURRENTSVG = document.querySelector('object');
    if(this.CURRENTSVG.hasAttribute('data')){
      this.CURRENTSVG.removeAttribute('data');
    }
    this.CURRENTSVG.data = this.currentSVGPath;
    this.#addClickListeners();
  }

  #addClickListeners() {
    if(this.isClosed() || this.isHorizontalWithNums() || this.isVerticalWithNums()) {
      this.activateHandler();
    }
  }
  activateHandler() {
    this.CURRENTSVG.addEventListener('load', () => {
      const flaps = this.CURRENTSVG.contentDocument.querySelectorAll('path[id$="-click"]');
      flaps.forEach((flap) => {
        flap.addEventListener('click', this.handleFlapClick);
        flap.addEventListener('mouseover', this.handleFlapMouseOver);
        flap.addEventListener('mouseout', this.handleFlapMouseOut);
      });
    });
  }

  handleFlapMouseOver = (event) => {
    let currColor = event.target.getAttribute('fill');
    this.currFlapColor = currColor;
    let darkerShade = this.getDarkerShade(currColor);
    event.target.setAttribute('fill', darkerShade);
  };

  handleFlapMouseOut = (event) => {
    event.target.setAttribute('fill', this.currFlapColor);
  }

  handleFlapClick = (event) => {
    event.target.removeEventListener('click', this.handleFlapClick);
    if(this.CURRENTSVG.data.endsWith('closed.svg')) {
      this.fortunes = saveFortunesOnClick();
      let numAnimations = COLOR_BY_CLICK_REGION[event.target.getAttribute('fill')].length;
      let sideBar = document.querySelector('.sidebar');
      if(sideBar) {
        sideBar.style.display = 'none';
      }
      this.currentTurn++;
      this.startAnimation(numAnimations);
    }
    else if(this.CURRENTSVG.data.endsWith('nums.svg')) {
      let numAnimations = parseInt(event.target.id[0]);
      this.currentTurn++;
      this.startAnimation(numAnimations);
    }
    else if(this.CURRENTSVG.data.endsWith('opened.svg')) {
      let flapToOpen = parseInt(event.target.id[0]);
      this.openFlap(flapToOpen);
    }
  };
  getDarkerShade(color) {
    let darkFactor = 0.8;
    let r = parseInt(color.substr(1,2), 16);
    let g = parseInt(color.substr(3,2), 16);
    let b = parseInt(color.substr(5,2), 16);
    let darkR = Math.floor(r * darkFactor);
    let darkG = Math.floor(g * darkFactor);
    let darkB = Math.floor(b * darkFactor);
    let newColor = `#${darkR.toString(16).padStart(2, '0')}${darkG.toString(16).padStart(2, '0')}${darkB.toString(16).padStart(2, '0')}`;
    newColor = newColor.toUpperCase();
    return newColor;
  }

  openFlap(flapToOpen) {
    this.generateSVG("./assets/images/origami/" + flapToOpen + "-opened.svg");
    let randomFortune = this.fortunes[Math.floor(Math.random() * 7)];
    console.log(randomFortune);

  }

  startAnimation(numAnimations) {  
    let count = 1;
    const interval = setInterval(() => {
      this.isAnimationRunning = true;
      if(count >= numAnimations){
        clearInterval(interval);
        //if the last animation is horizontal, show vertical w nums
        if(this.isHorizontal() && this.currentTurn < 2) {
          this.generateSVG(this.OPENEDVERTICALNUMS);
        }
        //if last animation is vertical, show horizontal w nums
        else if(this.isVertical() && this.currentTurn < 2){
          this.generateSVG(this.OPENEDHORIZONTALNUMS);
        }
        else {
          this.generateSVG(this.OPENEDALL);
        }
        count = 1;
        this.isAnimationRunning = false;
        return;
      }
      //if file is closed, show vertical opened
      if(this.isClosed()){
        this.generateSVG(this.OPENEDVERTICAL);
      }
      //if file is horizontal, show vertical opened
      else if(this.isHorizontal()){
        if(this.currentTurn === 2) {
          this.generateSVG(this.OPENEDALL);
        }
        this.generateSVG(this.OPENEDVERTICAL);
      }
      //if file is vertical, show horizontal opened
      else if(this.isVertical()){
        this.generateSVG(this.OPENEDHORIZONTAL)
      }
      //if file is horizontal w nums, show horizontal opened
      else if(this.isHorizontalWithNums()){
        this.generateSVG(this.OPENEDVERTICAL);
      }
      //if file is vertical w nums, show vertical opened
      else if(this.isVerticalWithNums()){
        this.generateSVG(this.OPENEDHORIZONTAL)
      }
      count++;

    }, 500);
  }

  isVertical() {
    return this.CURRENTSVG.data.endsWith(svgPaths[4]);
  }

  isVerticalWithNums() {
    return this.CURRENTSVG.data.endsWith(svgPaths[2]);
  }

  isHorizontal() {
    return this.CURRENTSVG.data.endsWith(svgPaths[3]);
  }

  isHorizontalWithNums() {
    return this.CURRENTSVG.data.endsWith(svgPaths[1]);
  }

  isClosed() {
    return this.CURRENTSVG.data.endsWith(svgPaths[0]);
  }
}








  /**
   * Function that converts ID of flap to its color.
   * @param {string} - string that identifies which flap it is on the fortune teller
   * @returns {number} - unknown if invalid input, or a string that represents color of flap
   */
  /*idToColor(flapID) {
    return COLOR_BY_CLICK_REGION[flapID] || 'unknown';
  }*/
    
  /**
   * Function that converts ID of flap to its number specifically for SVGs with numbers.
   * @param {string} - string that identifies which flap it is on the fortune teller
   * @returns {number} - 0 if invalid input, or a number that is associated with the flap
   */
  /*idToNum(flapID) {
    let number;

    if (this.currentSVG.data.includes('horizontally')) {
      number = NUMBER_BY_SHADOW_CLICK_REGION.horizontal[flapID];
    } else if (this.currentSVG.data.includes('vertically')) {
      number = NUMBER_BY_SHADOW_CLICK_REGION.vertical[flapID];
    }

    return (number !== undefined) ? number : 0;
  }*/

  /**
   * Activates and handles click logic for the initial closed fortune teller SVG.
   * @returns {Promise} - Promise object that adds a click event listener to each flap
   */
  /*
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
  }*/

  /**
   * Activates and handles click logic for the open fortune teller SVGs.
   * @returns {Promise} - Promise object that adds a click event listener to each flap
   */
  /*activateNumsHandler() {
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
  }*/

  /**
   * Function that calculates the number of times needed to alternate between horizontally and vertically opened SVGs.
   * @param {string, number} - String of color for closed SVG flap, or number for open SVG flaps with numbers
   * @returns {number} - 0 if invalid input, or a positive number that represents number of times needed to animate
   */
/*  getNumAnimations(flapClicked) {
    if (typeof flapClicked === 'number' && Number.isInteger(flapClicked)) {
      return flapClicked;
    } else if (typeof flapClicked === 'string') {
      return flapClicked.length;
    }

    return 0;
  }

  getCurrentSVG() {
    return this.svgPath;
  }*/

