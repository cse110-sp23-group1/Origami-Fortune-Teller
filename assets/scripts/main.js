import {Origami} from './Origami.js';
const svgPaths = [
  './assets/images/origami/closed.svg',
  './assets/images/origami/horizontally-opened-nums.svg',
  './assets/images/origami/vertically-opened-nums.svg',
  './assets/images/origami/horizontally-opened.svg',
  './assets/images/origami/vertically-opened.svg'
];
const closedSVG = new Origami(svgPaths[0]);
const horizontalNumsSVG = new Origami(svgPaths[1]);
const verticalNumsSVG = new Origami(svgPaths[2]);
const horizontalSVG = new Origami(svgPaths[3]);
const verticalSVG = new Origami(svgPaths[4]);
let animationCount = 0;
closedSVG.generateSVG();
let CURRENTSVG = closedSVG;
closedSVG.getFlapColorClicked().then((flapClicked) => {
  const numAnimations = closedSVG.getNumAnimations(flapClicked);
  startAnimation(numAnimations).then(() => {
    if (CURRENTSVG !== closedSVG) {
      CURRENTSVG.getFlapNumClicked().then((flapClicked) => {
        const numAnimations = CURRENTSVG.getNumAnimations(flapClicked);
        startAnimation(numAnimations);
      });
    }
  });
});

/**
 * Handles logic for the front-end animation of the fortune teller.
 * @param {number} - Number of animations needed 
 * @returns {Promise} - Promise object that animates between horizontally and vertically opened SVGs every 500ms, for a total of numAnimations - 1 times.
 * After the animation, show the last Figma mockup.
 */
function startAnimation(numAnimations) {
  return new Promise((resolve) => {
    let animationIndex = 0;
    animationCount++;
    function animate() {
      if (animationIndex < numAnimations - 1) {
        switch (CURRENTSVG) {
          case closedSVG:
            closedSVG.removeCurrentSVG();
            CURRENTSVG = verticalSVG;
            break;
          case verticalSVG:
            verticalSVG.removeCurrentSVG();
            CURRENTSVG = horizontalSVG;
            break;
          case horizontalSVG:
            horizontalSVG.removeCurrentSVG();
            CURRENTSVG = verticalSVG;
            break;
          case verticalNumsSVG:
            verticalNumsSVG.removeCurrentSVG();
            CURRENTSVG = horizontalSVG;
            break;
          case horizontalNumsSVG:
            horizontalNumsSVG.removeCurrentSVG();
            CURRENTSVG = verticalSVG;
            break;
          default:
            // do nothing
            break;
        }
        CURRENTSVG.generateSVG();
        animationIndex++;

        setTimeout(animate, 500);
      } else {
        CURRENTSVG.removeCurrentSVG();
        if (CURRENTSVG === verticalSVG) {
          if (animationCount === 2) {
            // show the last figma mockup
          } else {
            horizontalNumsSVG.generateSVG();
            CURRENTSVG = horizontalNumsSVG;
          }
        } else if (CURRENTSVG === horizontalSVG) {
          if (animationCount === 2) {
            // show the last figma mockup
          } else {
            verticalNumsSVG.generateSVG();
            CURRENTSVG = verticalNumsSVG;
          }
        }
        resolve();
      }
    }
    animate();
  });
}
