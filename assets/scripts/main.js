import { Origami } from './Origami.js';
const svgPaths = [
  "./assets/images/origami-with-ids/closed-new.svg",
  "./assets/images/origami-with-ids/horizontally-opened-nums.svg",
  "./assets/images/origami-with-ids/vertically-opened-nums.svg",
  "./assets/images/origami-with-ids/horizontally-opened.svg",
  "./assets/images/origami-with-ids/vertically-opened.svg"
]
const closedSVG = new Origami(svgPaths[0]);
const horizontalNumsSVG = new Origami(svgPaths[1]);
const verticalNumsSVG = new Origami(svgPaths[2]);
const horizontalSVG = new Origami(svgPaths[3]);
const verticalSVG = new Origami(svgPaths[4]);
const clickableTellers = [closedSVG, horizontalNumsSVG, verticalNumsSVG];
const animatedTellers = [horizontalSVG, verticalSVG];
closedSVG.generateSVG();
let CURRENTSVG = closedSVG;
closedSVG.getFlapColorClicked().then((flapClicked) => {
  let numAnimations = closedSVG.getNumAnimations(flapClicked);
  startAnimation(numAnimations);
});

function startAnimation(numAnimations) {
  let animationIndex = 0;

  function animate() {
    if (animationIndex < numAnimations - 1) {
      if (CURRENTSVG === closedSVG) {
        closedSVG.removeCurrentSVG();
        CURRENTSVG = verticalSVG;
      } 
      else if (CURRENTSVG === verticalSVG) {
        verticalSVG.removeCurrentSVG();
        CURRENTSVG = horizontalSVG;
      } 
      else if (CURRENTSVG === horizontalSVG) {
        horizontalSVG.removeCurrentSVG();
        CURRENTSVG = verticalSVG;
      }

      CURRENTSVG.generateSVG();
      animationIndex++;

      setTimeout(animate, 500);
    } 
    else {
      CURRENTSVG.removeCurrentSVG();
      if (CURRENTSVG === verticalSVG) {
        horizontalNumsSVG.generateSVG();
      } else if (CURRENTSVG === horizontalSVG) {
        verticalNumsSVG.generateSVG();
      }
    }
  }
  animate();
}


