import { Origami } from './Origami.js';
const svgPaths = [
  "./assets/images/origami-with-ids/closed-new.svg",
  "./assets/images/origami-with-ids/horizontally-opened-nums.svg",
  "./assets/images/origami-with-ids/vertically-opened-nums.svg",
  "./assets/images/origami-with-ids/horizontally-opened.svg",
  "./assets/images/origami-with-ids/vertically-opened.svg"
]
const closedSVG = new Origami(svgPaths[0]);

closedSVG.getFlapColorClicked().then((flapColorClicked) => {
  let numAnimations = closedSVG.startAnimation(flapColorClicked);
  console.log(numAnimations);
});