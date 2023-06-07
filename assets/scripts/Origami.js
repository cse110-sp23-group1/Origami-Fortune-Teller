// Origami.js
import {saveFortunesOnClick} from './SideBar.js';
import { getDarkerShade, getOriginalColor } from './utilities/colors.js';
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
    this.CURRENTSVG.data = this.currentSVGPath;
    this.#addClickListeners();
  }
  /**
   * Activates handler for closed SVG or SVG with nums.
   */
  #addClickListeners() {
    if (this.isClosed() || this.isHorizontalWithNums() || this.isVerticalWithNums() || this.isOpen()) {
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
    const currColor = event.target.getAttribute('fill');
    this.currFlapColor = currColor;
    const darkerShade = getDarkerShade(currColor);
    console.log("Color Pair: " + currColor + ", " + darkerShade);
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
    if (this.currentTurn == 1) { // SVGs with numbers
      const originalColor = NUMBER_TO_DARK_COLOR[event.target.getAttribute('id').substring(0, 1)]; // array element represents number of flap.
      event.target.setAttribute('fill', originalColor);
      return;
    }
    if (this.currentTurn == 2) { // fully opened SVG
      const lightColor = DARK_COLOR_TO_COLOR[event.target.getAttribute('fill')];
      // if getAttribute did not return any of the dark colors, set color to previous color.
      if (lightColor == null) {
        const originalColor = DARK_COLOR_TO_COLOR[NUMBER_TO_DARK_COLOR[event.target.getAttribute('id').substring(0, 1)]];
        // if user hovers out of flap with a dark color, correct the color
        if (getDarkerShade(event.target.getAttribute('fill')) == originalColor) {
          this.currFlapColor = originalColor;
          event.target.setAttribute('fill', getOriginalColor(this.currFlapColor));
          return;
        }
        event.target.setAttribute('fill', this.currFlapColor);
        return;
      }
      // if getAttribute returned a dark color, then lightColor is equal to getDarkerShade(originalColor).
      event.target.setAttribute('fill', getOriginalColor(lightColor));
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
    if (this.isClosed()) {
      this.fortunes = saveFortunesOnClick();
      const numAnimations = COLOR_BY_CLICK_REGION[event.target.getAttribute('fill')].length;
      const sideBar = document.querySelector('.sidebar');
      if (sideBar) {
        sideBar.style.display = 'none';
      }
      this.currentTurn++;
      this.startAnimation(numAnimations);
    } else if (this.isVerticalWithNums() || this.isHorizontalWithNums()) {
      const numAnimations = parseInt(event.target.id[0]);
      this.currentTurn++;
      this.startAnimation(numAnimations);
    } else if (this.isOpen()) {
      const flapToOpen = parseInt(event.target.id[0]);
      this.openFlap(flapToOpen);
    }
  };

  /**
   * Opens the specified flap and displays fortune.
   * @param {number} flapToOpen - The number of the flap to open.
   */
  openFlap(flapToOpen) {
    this.generateSVG('./assets/images/origami/' + flapToOpen + '-Opened.svg');
    const randomFortune = this.fortunes[Math.floor(Math.random() * 7)];
    this.CURRENTSVG.onload = () => {
      this.displayFortune(flapToOpen, randomFortune);
      // const fortuneTextElement = this.CURRENTSVG.contentDocument.querySelector('#fortuneText');
      // fortuneTextElement.textContent = randomFortune;
    };
  }

  /**
   * Display fortune on the correct position of the svg
   * @param {number} flapToOpen - The number of the flap to add the fortune in
   * @param {string} fortune - The fortune to display
   */
  displayFortune(flapToOpen, fortune) {
  // Check which flap is open with switch statement, based on the flapToOpen parameter
  // It would change the css attribute of the content class in style.css.
    const content = document.querySelector('.content');
    switch (flapToOpen) {
      case 1:
        content.style.left = '50%';
        content.style.top = '15%';
        break;

      case 2:
        content.style.left = '57%';
        content.style.top = '20%';
        break;

      case 3:
        content.style.left = '57%';
        content.style.top = '50%';
        break;

      case 4:
        content.style.left = '50%';
        content.style.top = '70%';
        break;

      case 5:
        content.style.left = '41%';
        content.style.top = '65%';
        break;

      case 6:
        content.style.left = '33%';
        content.style.top = '50%';
        break;

      case 7:
        content.style.left = '34%';
        content.style.top = '20%';
        break;

      case 8:
        content.style.left = '41%';
        content.style.top = '15%';
        break;
    }
    const fortuneText = document.createElement('p');
    fortuneText.textContent = fortune;
    fortuneText.style.fontSize = '1.5em';
    content.appendChild(fortuneText);
    return;
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
      if (count >= numAnimations) {
        clearInterval(interval);
        // if the last animation is horizontal, show vertical w nums
        if (this.isHorizontal() && this.currentTurn < 2) {
          // if last animation is vertical, show horizontal w nums
          this.generateSVG(this.OPENEDVERTICALNUMS);
        } else if (this.isVertical() && this.currentTurn < 2) {
          this.generateSVG(this.OPENEDHORIZONTALNUMS);
        } else {
          this.generateSVG(this.OPENEDALL);
        }
        count = 1;
        this.isAnimationRunning = false;
        return;
      }
      // if file is closed, show vertical opened
      if (this.isClosed()) {
        this.generateSVG(this.OPENEDVERTICAL);
      } else if (this.isHorizontal()) {
        // if file is horizontal, show vertical opened
        if (this.currentTurn === 2) {
          this.generateSVG(this.OPENEDALL);
        }
        this.generateSVG(this.OPENEDVERTICAL);
      } else if (this.isVertical()) {
        // if file is vertical, show horizontal opened
        this.generateSVG(this.OPENEDHORIZONTAL);
      } else if (this.isHorizontalWithNums()) {
        // if file is horizontal w nums, show horizontal opened
        this.generateSVG(this.OPENEDVERTICAL);
      } else if (this.isVerticalWithNums()) {
        // if file is vertical w nums, show vertical opened
        this.generateSVG(this.OPENEDHORIZONTAL);
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
