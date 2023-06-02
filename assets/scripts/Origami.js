// Origami.js
import { saveFortunesOnClick } from './SideBar.js'
const COLOR_BY_CLICK_REGION = {
  '#0D6E8E': 'blue',
  '#BF3858': 'red',
  '#04AB80': 'green',
  '#CCA751': 'yellow',
};
const NUMBER_TO_DARK_COLOR = {
  '1': '#073E51',
  '2': '#073E51',
  '3': '#917535',
  '4': '#917535',
  '5': '#00664C',
  '6': '#00664C',
  '7': '#962B44',
  '8': '#962B44',
};
const DARK_COLOR_TO_COLOR = {
  '#118AB2': '#0D6E8E', // blue
  '#962B44': '#BF3858', // red
  '#00664C': '#04AB80', // green
  '#FFD166': '#CCA751', // yellow
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
   * Creates object for the current SVG and adds click listeners.
   * @param {string} currentSVGPath - string that represents path of SVG file in our repo
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
  /**
   * Activates handler for closed SVG or SVG with nums.
   */
  #addClickListeners() {
    if(this.isClosed() || this.isHorizontalWithNums() || this.isVerticalWithNums() || this.isOpen()) {
      this.activateHandler();
    }
  }
  /**
   * Adds click and hover functionality event listeners for the current SVG.
   */
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

  /**
  * Handles the mouse over event for a flap element.
  * Updates the fill attribute of the event target to a darker shade of a current flap color.
  * @param {Event} event - The mouse over event object.
  */
  handleFlapMouseOver = (event) => {
    let currColor = event.target.getAttribute('fill');
    this.currFlapColor = currColor;
    let darkerShade = this.getDarkerShade(currColor);
    event.target.setAttribute('fill', darkerShade);
    event.target.style.cursor = 'pointer'; 
  };

  /**
  * Handles the mouse out event for a flap element.
  * Updates the fill attribute of the event target to the current flap color. 
  * Handles logic for consistent colors when cursor hovering over inner flaps.
  * @param {Event} event - The mouse out event object.
  */
  handleFlapMouseOut = (event) => {
    // ensures that original color is kept if cursor hovers over an inner flap in opened SVGs.
    if(this.currentTurn == 1){ // SVGs with numbers
      let originalColor = NUMBER_TO_DARK_COLOR[event.target.getAttribute('id').substring(0, 1)]; // array element represents number of flap.
      event.target.setAttribute('fill', originalColor);
      return;
    }
    if(this.currentTurn == 2) { // fully opened SVG
      let lightColor = DARK_COLOR_TO_COLOR[event.target.getAttribute('fill')];
      // if getAttribute did not return any of the dark colors, set color to previous color.
      if(lightColor == null){
        let originalColor = DARK_COLOR_TO_COLOR[NUMBER_TO_DARK_COLOR[event.target.getAttribute('id').substring(0, 1)]];
        // if user hovers out of flap with a dark color, correct the color
        if(this.getDarkerShade(event.target.getAttribute('fill')) == originalColor){ 
          this.currFlapColor = originalColor;
          event.target.setAttribute('fill', this.getOriginalColor(this.currFlapColor));
          return;
        }
        event.target.setAttribute('fill', this.currFlapColor);
        return;
      }
      // if getAttribute returned a dark color, then lightColor is equal to getDarkerShade(originalColor).
      event.target.setAttribute('fill', this.getOriginalColor(lightColor));
      return;
    }

    // otherwise, just set it to previous color.
    event.target.setAttribute('fill', this.currFlapColor);
  };

  /**
  * Handles the click event for a flap element.
  * Calculates number of animations based on which flap is clicked.
  * Performs different actions based on the state of the flap element.
  * If the current SVG is closed, then remove sidebar after a flap is clicked and start animation
  * If current SVG is opened with numbers, then start animation.
  * If the current SVG is completely opened, then open flap and display fortune.
  * @param {Event} event - The click event object.
  */
  handleFlapClick = (event) => {
    event.target.removeEventListener('click', this.handleFlapClick);
    if(this.isClosed()) {
      this.fortunes = saveFortunesOnClick();
      let numAnimations = COLOR_BY_CLICK_REGION[event.target.getAttribute('fill')].length;
      let sideBar = document.querySelector('.sidebar');
      if(sideBar) {
        sideBar.style.display = 'none';
      }
      this.currentTurn++;
      this.startAnimation(numAnimations);
    }
    else if(this.isVerticalWithNums() || this.isHorizontalWithNums()) {
      let numAnimations = parseInt(event.target.id[0]);
      this.currentTurn++;
      this.startAnimation(numAnimations);
    }
    else if(this.isOpen()) {
      let flapToOpen = parseInt(event.target.id[0]);
      this.openFlap(flapToOpen);
    }
  };
  /**
   * Calculates and returns a darker shade of the given color.
   * @param {string} color - The color in hexadecimal format (#RRGGBB).
   * @returns {string} The darker shade of the color in hexadecimal format (#RRGGBB).
   */
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

  /**
   * Calculates and returns the original color when a darker shade is passed.
   * @param {string} darkerColor - The darker shade color in hexadecimal format (#RRGGBB).
   * @returns {string} The original color in hexadecimal format (#RRGGBB).
   */
  getOriginalColor(darkerColor) {
    let darkFactor = 0.8;
    let darkR = parseInt(darkerColor.substr(1, 2), 16);
    let darkG = parseInt(darkerColor.substr(3, 2), 16);
    let darkB = parseInt(darkerColor.substr(5, 2), 16);
    let r = Math.ceil(darkR / darkFactor);
    let g = Math.ceil(darkG / darkFactor);
    let b = Math.ceil(darkB / darkFactor);
    let originalColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    originalColor = originalColor.toUpperCase();
    return originalColor;
  }

  /**
   * Opens the specified flap and displays fortune.
   * @param {number} flapToOpen - The number of the flap to open.
   */
  openFlap(flapToOpen) {
    this.generateSVG("./assets/images/origami/" + flapToOpen + "-Opened.svg");
    let randomFortune = this.fortunes[Math.floor(Math.random() * 7)];
    this.CURRENTSVG.onload = () => {
      let fortuneTextElement = this.CURRENTSVG.contentDocument.querySelector('#fortuneText');
      fortuneTextElement.textContent = randomFortune;
    };
  }

  /**
   * Starts the animation with the specified number of animations and handles animation logic.
   * Origami animates between horizontally and vertically opened SVGs every 500ms, for a total of numAnimations - 1 times. 
   * Then it generates the next current SVG and displays it on the webpage.
   * @param {number} numAnimations - The number of animations to perform.
   */
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

  isOpen() {
    return this.CURRENTSVG.data.endsWith(svgPaths[5]);
  }
}